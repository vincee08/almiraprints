import type { QuoteFormValues } from "@/lib/validations";
import { browserClient } from "@/lib/supabase/browser";
import { SubmissionError } from "@/lib/submit-inquiry";

type Result = { status?: string; reference?: string; notification?: string; id?: string; path?: string; token?: string; mime?: string; submissionKey?: string; message?: string; fieldErrors?: Record<string, string> };

async function post(url: string, body: object): Promise<Result> {
  let response: Response;
  try { response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); }
  catch { throw new SubmissionError("We could not confirm your request. Your details are still here; please check your connection and try again."); }
  const result = await response.json().catch(() => ({})) as Result;
  if (!response.ok) throw new SubmissionError(result.message || "We could not save your request. Please try again.", result.fieldErrors || {}, result.reference);
  return result;
}

export async function submitQuote(data: QuoteFormValues, file: File | null, submissionKey: string, website: string, onStep: (step: string) => void) {
  onStep("Saving your request...");
  const result = await post("/api/quote", { ...data, submissionKey, website, artwork: file ? { name: file.name, size: file.size } : null });
  let final = result;
  if (result.status === "upload_required") {
    if (!file || !result.id || !result.path || !result.token || !result.mime) throw new SubmissionError("Artwork storage could not be prepared. Please try again.");
    onStep("Uploading artwork directly to secure storage...");
    const uploaded = await browserClient().storage.from("quote-artwork").uploadToSignedUrl(result.path, result.token, file, { contentType: result.mime });
    if (uploaded.error) throw new SubmissionError("Your artwork did not finish uploading. Your request has not been submitted. Please try again.");
    onStep("Confirming your request and artwork...");
    final = await post("/api/quote/complete", { id: result.id, submissionKey: result.submissionKey || submissionKey });
  }
  if (final.status !== "accepted" || !/^AP-[A-F0-9]{8}$/.test(final.reference || "")) throw new SubmissionError("We could not confirm that your request was saved. Please try again.");
  return { reference: final.reference!, notification: final.notification || "pending" };
}
