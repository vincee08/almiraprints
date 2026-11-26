import { createHash, createHmac, randomUUID } from "node:crypto";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validations";
import { MAX_ARTWORK_BYTES, validateArtwork } from "@/lib/artwork";
import { formatQuote } from "@/lib/inquiry-content";
import { deliverInquiry, isDeliveryConfigured } from "./inquiry-delivery";
import { serviceClient, supabaseSettings } from "@/lib/supabase/server";

export const ARTWORK_BUCKET = "quote-artwork";
const mimeTypes: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", ai: "application/postscript", psd: "image/vnd.adobe.photoshop" };
export const artworkMime = (name: string) => mimeTypes[name.split(".").pop()?.toLowerCase() || ""] || null;
export const quoteIsConfigured = () => Boolean(supabaseSettings());
export const quoteJson = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || origin === new URL(request.url).origin; }
export async function smallJson(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json") || Number(request.headers.get("content-length")) > 16384) throw new Error("INVALID_BODY");
  const reader = request.body?.getReader();
  if (!reader) return {};
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) { await reader.cancel(); throw new Error("INVALID_BODY"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(new TextDecoder().decode(Buffer.concat(chunks)));
}
export const isUuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export type QuoteRow = {
  id: string; reference: string; submission_key: string; fingerprint: string; submission_state: string; notification_state: string;
  notification_claim: string | null; artwork_path: string | null; artwork_name: string | null;
  artwork_size: number | null; artwork_mime: string | null; customer_name: string; email: string;
  phone: string; service_category: string; specific_service: string; quantity: number;
  size: string | null; material: string | null; deadline: string | null;
  additional_requirements: string | null; tshirt_size: string | null; tshirt_color: string | null; print_location: string | null;
};

export async function storedArtwork(row: QuoteRow) {
  if (!row.artwork_path || !row.artwork_size || !row.artwork_mime) return false;
  const parts = row.artwork_path.split("/");
  const name = parts.pop()!;
  const { data, error } = await serviceClient().storage.from(ARTWORK_BUCKET).list(parts.join("/"), { search: name, limit: 2 });
  if (error) throw error;
  const file = data?.find(item => item.name === name);
  return Boolean(file && Number(file.metadata?.size) === row.artwork_size && file.metadata?.mimetype === row.artwork_mime && row.artwork_size <= MAX_ARTWORK_BYTES);
}

function rowToQuote(row: QuoteRow): QuoteFormValues {
  return {
    customerName: row.customer_name, email: row.email, phone: row.phone,
    serviceCategory: row.service_category, specificService: row.specific_service, quantity: String(row.quantity),
    size: row.size || "", material: row.material || "", deadline: row.deadline || "",
    additionalRequirements: row.additional_requirements || "", hasDesignFile: Boolean(row.artwork_path),
    tshirtSize: row.tshirt_size || "", tshirtColor: row.tshirt_color || "",
    printLocation: (row.print_location || "") as QuoteFormValues["printLocation"],
  };
}

export async function notifyQuote(row: QuoteRow, baseUrl: string) {
  const supabase = serviceClient();
  const { data, error } = await supabase.rpc("claim_quote_notification", { p_id: row.id });
  if (error) throw error;
  const claimed = data as QuoteRow | null;
  if (!claimed?.notification_claim) return false;
  let state: "sent" | "failed" | "uncertain" = "sent";
  let reason: string | null = null;
  if (!isDeliveryConfigured()) { state = "failed"; reason = "SMTP is not configured"; }
  else {
    try {
      await deliverInquiry({ reference: row.reference, kind: "quote", replyTo: row.email,
        text: `${formatQuote(rowToQuote(row), row.artwork_name || undefined)}\n\nStaff dashboard: ${baseUrl.replace(/\/$/, "")}/staff?request=${row.id}` });
    } catch (error) {
      reason = error instanceof Error && error.message === "RECIPIENT_REJECTED" ? "Recipient rejected the message" : "SMTP delivery could not be confirmed; check the inbox before any manual action";
      state = reason.startsWith("Recipient") ? "failed" : "uncertain";
    }
  }
  const result = await supabase.rpc("finish_quote_notification", { p_id: row.id, p_claim: claimed.notification_claim, p_state: state, p_error: reason });
  if (result.error || !result.data) throw result.error || new Error("NOTIFICATION_STATE_FAILED");
  return state === "sent";
}

async function acceptedResult(row: QuoteRow) {
  const { data } = await serviceClient().from("quote_requests").select("notification_state").eq("id", row.id).single();
  return quoteJson({ status: "accepted", reference: row.reference, notification: data?.notification_state || "uncertain" });
}

export async function submitQuote(request: Request) {
  if (!sameOrigin(request)) return quoteJson({ message: "Please use the AlmiraPrints website." }, 403);
  if (!quoteIsConfigured()) return quoteJson({ message: "Online quote requests are currently unavailable." }, 503);
  let input: Record<string, unknown>;
  try { input = await smallJson(request); } catch { return quoteJson({ message: "We could not read this request." }, 400); }
  if (typeof input.website === "string" && input.website.trim()) return quoteJson({ message: "We could not accept this request." }, 400);
  if (!isUuid(input.submissionKey)) return quoteJson({ message: "Please reload the form and try again." }, 400);
  const file = input.artwork;
  let name: string | null = null;
  let size: number | null = null;
  let mime: string | null = null;
  if (file !== null && file !== undefined) {
    if (!file || typeof file !== "object" || Array.isArray(file)) return quoteJson({ message: "Choose a valid artwork file." }, 400);
    const meta = file as Record<string, unknown>;
    if (typeof meta.name !== "string" || typeof meta.size !== "number" || !Number.isInteger(meta.size)) return quoteJson({ message: "Choose a valid artwork file." }, 400);
    const issue = validateArtwork({ name: meta.name, size: meta.size });
    if (issue) return quoteJson({ message: issue, fieldErrors: { designFile: issue } }, meta.size > MAX_ARTWORK_BYTES ? 413 : 400);
    name = meta.name; size = meta.size; mime = artworkMime(name);
  }
  const parsed = quoteFormSchema.safeParse({ ...input, hasDesignFile: Boolean(name) });
  if (!parsed.success) return quoteJson({ message: "Check the highlighted fields.", fieldErrors: Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message])) }, 400);
  const id = randomUUID();
  const path = name ? `${id}/${randomUUID()}.${name.split(".").pop()!.toLowerCase()}` : null;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] || "local").trim().slice(0, 100);
  const ipHash = createHmac("sha256", secret).update(ip).digest("hex");
  const fingerprint = createHash("sha256").update(JSON.stringify({ ...parsed.data, email: parsed.data.email.toLowerCase(), name })).digest("hex");
  const supabase = serviceClient();
  const { data, error } = await supabase.rpc("create_quote_request", {
    p_id: id, p_submission_key: input.submissionKey, p_fingerprint: fingerprint, p_ip_hash: ipHash, p_data: parsed.data,
    p_artwork_path: path, p_artwork_name: name, p_artwork_size: size, p_artwork_mime: mime,
  });
  if (error) return quoteJson({ message: error.message.includes("QUOTE_RATE_LIMIT") ? "Too many requests. Please try again later or call the shop." : "We could not save your request. Please try again." }, error.message.includes("QUOTE_RATE_LIMIT") ? 429 : 503);
  const row = data as QuoteRow;
  if (row.fingerprint !== fingerprint) return quoteJson({ message: "This request changed while it was being saved. Please reload and try again." }, 409);
  if (row.submission_state === "submitted") {
    if (row.notification_state === "pending") await notifyQuote(row, process.env.APP_BASE_URL || new URL(request.url).origin).catch(() => {});
    return acceptedResult(row);
  }
  if (await storedArtwork(row)) {
    const finished = await supabase.rpc("finish_quote_upload", { p_id: row.id, p_submission_key: row.submission_key });
    if (finished.error || !finished.data) return quoteJson({ message: "We could not finish saving your artwork. Please try again." }, 503);
    await notifyQuote(finished.data as QuoteRow, process.env.APP_BASE_URL || new URL(request.url).origin).catch(() => {});
    return acceptedResult(row);
  }
  const signed = await supabase.storage.from(ARTWORK_BUCKET).createSignedUploadUrl(row.artwork_path!);
  if (signed.error || !signed.data) return quoteJson({ message: "We could not prepare artwork storage. Please try again." }, 503);
  return quoteJson({ status: "upload_required", id: row.id, reference: row.reference, path: row.artwork_path, token: signed.data.token, mime: row.artwork_mime, submissionKey: row.submission_key });
}

export async function completeQuote(request: Request) {
  if (!sameOrigin(request)) return quoteJson({ message: "Please use the AlmiraPrints website." }, 403);
  if (!quoteIsConfigured()) return quoteJson({ message: "Online quote requests are currently unavailable." }, 503);
  let input: Record<string, unknown>;
  try { input = await smallJson(request); } catch { return quoteJson({ message: "We could not read this request." }, 400); }
  if (!isUuid(input.id) || !isUuid(input.submissionKey)) return quoteJson({ message: "Invalid request reference." }, 400);
  const supabase = serviceClient();
  const { data, error } = await supabase.from("quote_requests").select("*").eq("id", input.id).eq("submission_key", input.submissionKey).maybeSingle();
  if (error || !data) return quoteJson({ message: "Request not found." }, 404);
  const row = data as QuoteRow;
  if (row.submission_state === "pending_artwork") {
    if (!await storedArtwork(row)) return quoteJson({ message: "Artwork has not finished uploading or does not match the selected file. Please try again." }, 409);
    const finished = await supabase.rpc("finish_quote_upload", { p_id: row.id, p_submission_key: row.submission_key });
    if (finished.error || !finished.data) return quoteJson({ message: "We could not finish saving your request. Please try again." }, 503);
    await notifyQuote(finished.data as QuoteRow, process.env.APP_BASE_URL || new URL(request.url).origin).catch(() => {});
  } else if (row.notification_state === "pending") await notifyQuote(row, process.env.APP_BASE_URL || new URL(request.url).origin).catch(() => {});
  return acceptedResult(row);
}
