export class SubmissionError extends Error {
  constructor(message: string, public fieldErrors: Record<string, string> = {}, public reference?: string) { super(message); }
}

export async function submitInquiry(kind: "quote" | "contact", body: FormData | string) {
  let response: Response;
  try {
    response = await fetch(`/api/${kind}`, { method: "POST", body, headers: typeof body === "string" ? { "Content-Type": "application/json" } : undefined });
  } catch {
    throw new SubmissionError("We could not confirm sending your request. Your details are still here. Check your connection, or call or email the shop.");
  }
  const bodyValue: unknown = await response.json().catch(() => null);
  const result = bodyValue && typeof bodyValue === "object" && !Array.isArray(bodyValue) ? bodyValue as Record<string, unknown> : {};
  if (!response.ok || result?.status !== "accepted" || typeof result.reference !== "string" || !/^AP-[A-F0-9]{8}$/.test(result.reference)) {
    const fields = result.fieldErrors && typeof result.fieldErrors === "object" && !Array.isArray(result.fieldErrors)
      ? Object.fromEntries(Object.entries(result.fieldErrors).filter((entry): entry is [string, string] => typeof entry[1] === "string")) : {};
    throw new SubmissionError(typeof result.message === "string" ? result.message : "We could not confirm sending your request. Your details are still here. Please call or email the shop.", fields, typeof result.reference === "string" ? result.reference : undefined);
  }
  return result.reference as string;
}
