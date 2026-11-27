import { randomUUID } from "node:crypto";
import { contactFormSchema } from "@/lib/validations";
import { formatContact } from "@/lib/inquiry-content";
import { deliverInquiry, isDeliveryConfigured, type InquiryMessage } from "./inquiry-delivery";

type Dependencies = { configured: () => boolean; deliver: (message: InquiryMessage) => Promise<void> };
class BodyTooLarge extends Error {}

async function readBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new BodyTooLarge();
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new BodyTooLarge(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return body;
}

const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export function createContactHandler(dependencies: Dependencies = { configured: isDeliveryConfigured, deliver: deliverInquiry }) {
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return json({ message: "Please submit this form from the AlmiraPrints website." }, 403);
    let input: unknown;
    try {
      if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ message: "Use the contact form to submit your message." }, 415);
      input = JSON.parse(new TextDecoder().decode(await readBody(request, 16 * 1024)));
    } catch (error) {
      return json({ message: error instanceof BodyTooLarge ? "The request is too large. Artwork must be 10 MB or smaller." : "We could not read this request. Please check the form and try again." }, error instanceof BodyTooLarge ? 413 : 400);
    }
    const parsed = contactFormSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message]));
      return json({ message: "Check the highlighted fields. Your request has not been sent.", fieldErrors }, 400);
    }
    if (!dependencies.configured()) return json({ code: "DELIVERY_UNAVAILABLE", message: "Online sending is currently unavailable. Your request has not been sent. Please call or email us instead." }, 503);
    const reference = `AP-${randomUUID().slice(0, 8).toUpperCase()}`;
    try {
      await dependencies.deliver({
        reference, kind: "contact", replyTo: parsed.data.email,
        text: formatContact(parsed.data),
      });
      // SMTP acceptance is not a promise of inbox delivery or a confirmed order.
      return json({ status: "accepted", reference }, 200);
    } catch {
      return json({ code: "DELIVERY_FAILED", message: "We could not confirm that your request was sent. Your details are still here. Please call or email us and mention this reference.", reference }, 502);
    }
  };
}
