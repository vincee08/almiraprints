import nodemailer from "nodemailer";
import { z } from "zod";
import { COMPANY_INFO } from "@/lib/constants";

const configSchema = z.object({
  host: z.string().trim().min(1), port: z.coerce.number().int().min(1).max(65535),
  user: z.string().optional(), password: z.string().optional(),
  from: z.string().email(), to: z.string().email(), secure: z.boolean(),
});

export function getDeliveryConfig(env: Record<string, string | undefined> = process.env) {
  const port = env.SMTP_PORT || "587";
  const parsed = configSchema.safeParse({
    host: env.SMTP_HOST, port, user: env.SMTP_USER, password: env.SMTP_PASS,
    from: env.SMTP_FROM, to: env.SMTP_TO || COMPANY_INFO.email,
    secure: env.SMTP_SECURE === "true" || (env.SMTP_SECURE === undefined && port === "465"),
  });
  if (!parsed.success) return null;
  const local = parsed.data.host === "127.0.0.1" || parsed.data.host === "localhost";
  if (!local && (!parsed.data.user || !parsed.data.password)) return null;
  if (Boolean(parsed.data.user) !== Boolean(parsed.data.password)) return null;
  return parsed.data;
}

export function isDeliveryConfigured() { return getDeliveryConfig() !== null; }

export interface InquiryMessage {
  reference: string;
  kind: "quote" | "contact";
  replyTo: string;
  text: string;
  artwork?: { filename: string; content: Buffer };
}

/** Integration boundary: resolve only when the configured shop recipient is accepted. */
export async function deliverInquiry(message: InquiryMessage) {
  const config = getDeliveryConfig();
  if (!config) throw new Error("DELIVERY_UNAVAILABLE");
  const transport = nodemailer.createTransport({
    host: config.host, port: config.port, secure: config.secure, requireTLS: !config.secure && config.host !== "127.0.0.1" && config.host !== "localhost",
    auth: config.user && config.password ? { user: config.user, pass: config.password } : undefined,
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const receipt = await transport.sendMail({
      from: { name: COMPANY_INFO.legalName, address: config.from }, to: config.to, replyTo: message.replyTo,
      subject: `[${message.reference}] ${message.kind === "quote" ? "Printing quote request" : "Customer inquiry"}`,
      text: `Reference: ${message.reference}\n\n${message.text}`,
      attachments: message.artwork ? [{
        filename: message.artwork.filename.replace(/[\r\n/\\]/g, "_"),
        content: message.artwork.content, contentDisposition: "attachment",
      }] : [],
    });
    if (!receipt.accepted.some(address => address.toLowerCase() === config.to.toLowerCase()) || receipt.rejected.length) throw new Error("RECIPIENT_REJECTED");
    if (!receipt.messageId) throw new Error("MISSING_DELIVERY_RECEIPT");
  } finally { transport.close(); }
}
