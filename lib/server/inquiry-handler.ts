import { createHash, createHmac, randomUUID } from "node:crypto";
import { contactFormSchema } from "@/lib/validations";
import { serviceClient, supabaseSettings } from "@/lib/supabase/server";

type ContactRow = { reference: string; fingerprint: string };
type SaveArgs = { p_id: string; p_submission_key: string; p_fingerprint: string; p_ip_hash: string; p_data: object };
type Dependencies = { configured: () => boolean; save: (args: SaveArgs) => Promise<ContactRow> };
export const contactIsConfigured = () => Boolean(supabaseSettings());
const isUuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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

export function createContactHandler(dependencies: Dependencies = {
  configured: contactIsConfigured,
  save: async args => {
    const { data, error } = await serviceClient().rpc("create_contact_message", args);
    if (error || !data) throw error || new Error("CONTACT_SAVE_FAILED");
    return data as ContactRow;
  },
}) {
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return json({ message: "Please submit this form from the AlmiraPrints website." }, 403);
    let input: unknown;
    try {
      if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ message: "Use the contact form to submit your message." }, 415);
      input = JSON.parse(new TextDecoder().decode(await readBody(request, 16 * 1024)));
    } catch (error) {
      return json({ message: error instanceof BodyTooLarge ? "The message is too large." : "We could not read this request. Please check the form and try again." }, error instanceof BodyTooLarge ? 413 : 400);
    }
    if (!input || typeof input !== "object" || Array.isArray(input)) return json({ message: "We could not read this request." }, 400);
    const body = input as Record<string, unknown>;
    if (typeof body.website === "string" && body.website.trim()) return json({ message: "We could not accept this message." }, 400);
    if (!isUuid(body.submissionKey)) return json({ message: "Please reload the form and try again." }, 400);
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message]));
      return json({ message: "Check the highlighted fields. Your message has not been saved.", fieldErrors }, 400);
    }
    if (!dependencies.configured()) return json({ code: "STORAGE_UNAVAILABLE", message: "Online messages are currently unavailable. Nothing has been saved; please call the shop." }, 503);
    const fingerprint = createHash("sha256").update(JSON.stringify({ ...parsed.data, email: parsed.data.email.toLowerCase() })).digest("hex");
    const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] || "local").trim().slice(0, 100);
    const ipHash = createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY || "test-only").update(ip).digest("hex");
    try {
      const saved = await dependencies.save({
        p_id: randomUUID(), p_submission_key: body.submissionKey,
        p_fingerprint: fingerprint, p_ip_hash: ipHash, p_data: parsed.data,
      });
      if (saved.fingerprint !== fingerprint) return json({ message: "This message changed while it was being saved. Please reload and try again." }, 409);
      return json({ status: "accepted", reference: saved.reference }, 200);
    } catch (error) {
      if (error instanceof Error && error.message.includes("CONTACT_RATE_LIMIT")) return json({ message: "Too many messages. Please try again later or call the shop." }, 429);
      return json({ code: "SAVE_FAILED", message: "We could not save your message. Please try again." }, 503);
    }
  };
}
