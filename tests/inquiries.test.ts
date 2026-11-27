import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setImmediate } from "node:timers/promises";
import { MAX_ARTWORK_BYTES, validateArtwork } from "../lib/artwork";
import { contactFormSchema, quoteFormSchema } from "../lib/validations";
import { createContactHandler } from "../lib/server/inquiry-handler";
import { SubmissionError, submitInquiry } from "../lib/submit-inquiry";

const quote = {
  customerName: "Test Customer", email: "customer@example.test", phone: "09923102867",
  serviceCategory: "T-Shirt Printing", specificService: "T-Shirt Printing — Sublimation / DTF",
  quantity: "24", hasDesignFile: false, tshirtSize: "6 S, 12 M, 6 L", tshirtColor: "White", printLocation: "front",
};
const contact = { fullName: "Test Customer", email: "customer@example.test", phone: "09923102867", serviceType: "General Inquiry", message: "Please discuss a printing project with me.", submissionKey: randomUUID(), website: "" };
const saved = { reference: "AP-1234ABCD", fingerprint: "" };
function contactRequest(data: unknown = contact, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(data), headers: { "content-type": "application/json", ...headers } });
}
const save = async (args: { p_fingerprint: string }) => ({ ...saved, fingerprint: args.p_fingerprint });

test("artwork keeps the exact 10 MB boundary", () => {
  assert.equal(validateArtwork({ name: "artwork.PDF", size: MAX_ARTWORK_BYTES }), null);
  assert.match(validateArtwork({ name: "artwork.pdf", size: MAX_ARTWORK_BYTES + 1 })!, /10 MB/);
  assert.match(validateArtwork({ name: "empty.pdf", size: 0 })!, /empty/);
  assert.match(validateArtwork({ name: "run.exe", size: 10 })!, /Choose a/);
});

test("quote validation still requires valid quantities and catalog services", () => {
  assert.equal(quoteFormSchema.safeParse(quote).success, true);
  for (const quantity of ["0", "-2", "1.5", "many", "1000001"]) assert.equal(quoteFormSchema.safeParse({ ...quote, quantity }).success, false);
  assert.equal(quoteFormSchema.safeParse({ ...quote, serviceCategory: "Calendar Printing" }).success, false);
});

test("contact validation requires customer details and a useful message", () => {
  assert.equal(contactFormSchema.safeParse(contact).success, true);
  assert.equal(contactFormSchema.safeParse({ ...contact, email: "invalid" }).success, false);
  assert.equal(contactFormSchema.safeParse({ ...contact, message: "short" }).success, false);
});

test("storage unavailable returns 503 without success or a save attempt", async () => {
  const handler = createContactHandler({ configured: () => false, save: async () => assert.fail("Must not save") });
  const response = await handler(contactRequest());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { code: "STORAGE_UNAVAILABLE", message: "Online messages are currently unavailable. Nothing has been saved; please call the shop." });
});

test("invalid, malformed, spam and cross-origin posts cannot save", async () => {
  const handler = createContactHandler({ configured: () => true, save: async () => assert.fail("Must not save") });
  assert.equal((await handler(contactRequest({ ...contact, email: "invalid" }))).status, 400);
  assert.equal((await handler(contactRequest({ ...contact, submissionKey: "bad" }))).status, 400);
  assert.equal((await handler(contactRequest({ ...contact, website: "spam.example" }))).status, 400);
  assert.equal((await handler(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await handler(new Request("http://localhost/api/contact", { method: "POST", body: "text" }))).status, 415);
  assert.equal((await handler(contactRequest(contact, { origin: "https://another.example" }))).status, 403);
  assert.equal((await handler(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "x".repeat(17000) }))).status, 413);
});

test("success waits for the saved row and returns only its reference", async () => {
  let release!: () => void;
  let finished = false;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const handler = createContactHandler({ configured: () => true, save: async args => { await pending; return save(args); } });
  const response = handler(contactRequest()).then(value => { finished = true; return value; });
  await setImmediate();
  assert.equal(finished, false);
  release();
  const result = await response;
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { status: "accepted", reference: "AP-1234ABCD" });
});

test("failed storage, rate limits and changed retries never show success", async () => {
  const failed = createContactHandler({ configured: () => true, save: async () => { throw new Error("database down"); } });
  assert.equal((await failed(contactRequest())).status, 503);
  const rate = createContactHandler({ configured: () => true, save: async () => { throw new Error("CONTACT_RATE_LIMIT"); } });
  assert.equal((await rate(contactRequest())).status, 429);
  const changed = createContactHandler({ configured: () => true, save: async () => ({ reference: "AP-1234ABCD", fingerprint: "other" }) });
  assert.equal((await changed(contactRequest())).status, 409);
});

test("client rejects network failures, error responses and ambiguous 200 responses", async context => {
  const fetchMock = context.mock.method(globalThis, "fetch");
  fetchMock.mock.mockImplementation(async () => { throw new TypeError("offline"); });
  await assert.rejects(submitInquiry("contact", "{}"), SubmissionError);
  fetchMock.mock.mockImplementation(async () => Response.json({ message: "Not saved" }, { status: 503 }));
  await assert.rejects(submitInquiry("contact", "{}"), /Not saved/);
  fetchMock.mock.mockImplementation(async () => Response.json({ success: true }));
  await assert.rejects(submitInquiry("contact", "{}"), /could not confirm/);
  fetchMock.mock.mockImplementation(async () => Response.json({ fieldErrors: null, message: {} }, { status: 502 }));
  await assert.rejects(submitInquiry("contact", "{}"), SubmissionError);
  fetchMock.mock.mockImplementation(async () => Response.json({ status: "accepted", reference: "AP-1234ABCD" }));
  assert.equal(await submitInquiry("contact", "{}"), "AP-1234ABCD");
});
