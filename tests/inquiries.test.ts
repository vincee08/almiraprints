import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import nodemailer from "nodemailer";
import { MAX_ARTWORK_BYTES, validateArtwork } from "../lib/artwork";
import { quoteFormSchema } from "../lib/validations";
import { createContactHandler } from "../lib/server/inquiry-handler";
import { deliverInquiry, getDeliveryConfig, type InquiryMessage } from "../lib/server/inquiry-delivery";
import { SubmissionError, submitInquiry } from "../lib/submit-inquiry";

const quote = {
  customerName: "Test Customer", email: "customer@example.test", phone: "09923102867",
  serviceCategory: "T-Shirt Printing", specificService: "T-Shirt Printing — Sublimation / DTF",
  quantity: "24", hasDesignFile: false, tshirtSize: "6 S, 12 M, 6 L", tshirtColor: "White", printLocation: "front",
};
const contact = { fullName: "Test Customer", email: "customer@example.test", phone: "09923102867", serviceType: "General Inquiry", message: "Please discuss a printing project with me." };

function contactRequest(data: unknown = contact) {
  return new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(data), headers: { "content-type": "application/json" } });
}

test("artwork: accept the exact 10 MB boundary and reject empty, oversized or unsupported files", () => {
  assert.equal(validateArtwork({ name: "artwork.PDF", size: MAX_ARTWORK_BYTES }), null);
  assert.match(validateArtwork({ name: "artwork.pdf", size: MAX_ARTWORK_BYTES + 1 })!, /10 MB/);
  assert.match(validateArtwork({ name: "empty.pdf", size: 0 })!, /empty/);
  assert.match(validateArtwork({ name: "run.exe", size: 10 })!, /Choose a/);
});

test("quote schema: quantities must be positive whole numbers and services must match their category", () => {
  assert.equal(quoteFormSchema.safeParse(quote).success, true);
  for (const quantity of ["0", "-2", "1.5", "many", "1000001"]) assert.equal(quoteFormSchema.safeParse({ ...quote, quantity }).success, false);
  assert.equal(quoteFormSchema.safeParse({ ...quote, serviceCategory: "Calendar Printing" }).success, false);
});

test("delivery configuration is unavailable until actual required settings exist", () => {
  assert.equal(getDeliveryConfig({}), null);
  assert.equal(getDeliveryConfig({ SMTP_HOST: "smtp.example.test", SMTP_USER: "test-only" }), null);
  const config = getDeliveryConfig({ SMTP_HOST: "smtp.example.test", SMTP_USER: "test-only", SMTP_PASS: "test-only", SMTP_FROM: "sender@example.test" });
  assert.equal(config?.to, "almira.ggp@gmail.com");
  assert.equal(config?.port, 587);
});

test("contact returns 503 and never delivers when mail is unconfigured", async () => {
  let deliveries = 0;
  const dependencies = { configured: () => false, deliver: async () => { deliveries++; } };
  const response = await createContactHandler(dependencies)(contactRequest());
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, "DELIVERY_UNAVAILABLE");
  assert.equal(body.status, undefined);
  assert.equal(deliveries, 0);
});

test("invalid contact fields are rejected before delivery", async () => {
  let delivered = false;
  const handler = createContactHandler({ configured: () => true, deliver: async () => { delivered = true; } });
  const response = await handler(contactRequest({ ...contact, email: "invalid" }));
  assert.equal(response.status, 400);
  assert.ok((await response.json()).fieldErrors.email);
  assert.equal(delivered, false);
});

test("chunked oversized bodies are bounded without trusting Content-Length", async () => {
  const request = new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "x".repeat(17000) });
  const response = await createContactHandler()(request);
  assert.equal(response.status, 413);
});

test("malformed requests and cross-origin posts cannot reach delivery", async () => {
  const handler = createContactHandler({ configured: () => true, deliver: async () => { assert.fail("Must not deliver"); } });
  assert.equal((await handler(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await handler(new Request("http://localhost/api/contact", { method: "POST", body: "text" }))).status, 415);
  assert.equal((await handler(new Request("http://localhost/api/contact", { method: "POST", headers: { origin: "https://another.example" }, body: "text" }))).status, 403);
});

test("SMTP failures produce an unconfirmed result with a reference, never success", async () => {
  const handler = createContactHandler({ configured: () => true, deliver: async () => { throw new Error("SMTP rejected"); } });
  const response = await handler(contactRequest());
  assert.equal(response.status, 502);
  const result = await response.json();
  assert.equal(result.status, undefined);
  assert.match(result.reference, /^AP-[A-F0-9]{8}$/);
  assert.match(result.message, /could not confirm/);
});

test("no response acknowledges acceptance before the transport has completed", async () => {
  let release!: () => void;
  let finished = false;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const handler = createContactHandler({ configured: () => true, deliver: () => pending });
  const response = handler(contactRequest()).then(value => { finished = true; return value; });
  await setImmediate();
  assert.equal(finished, false);
  release();
  const result = await response;
  assert.equal(result.status, 200);
  assert.equal((await result.json()).status, "accepted");
});

test("contact delivery retains the customer's message and reply address", async () => {
  let received: InquiryMessage | undefined;
  const handler = createContactHandler({ configured: () => true, deliver: async message => { received = message; } });
  assert.equal((await handler(contactRequest())).status, 200);
  assert.match(received!.text, /Please discuss a printing project/);
  assert.equal(received?.replyTo, contact.email);
});

test("SMTP adapter requires acceptance of the shop inbox and a message receipt", async context => {
  const settings = { SMTP_HOST: "smtp.example.test", SMTP_USER: "fixture", SMTP_PASS: "fixture", SMTP_FROM: "sender@example.test", SMTP_TO: "shop@example.test" };
  const old = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  Object.assign(process.env, settings);
  context.after(() => { for (const [key, value] of Object.entries(old)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
  let receipt = { accepted: ["shop@example.test"], rejected: [] as string[], messageId: "fixture-message" };
  let closed = 0;
  const factory = (() => ({ sendMail: async () => receipt, close: () => { closed++; } })) as unknown as typeof nodemailer.createTransport;
  context.mock.method(nodemailer, "createTransport", factory);
  const message: InquiryMessage = { reference: "AP-12345678", kind: "contact", replyTo: "customer@example.test", text: "Fixture" };
  await deliverInquiry(message);
  receipt = { accepted: [], rejected: ["shop@example.test"], messageId: "" };
  await assert.rejects(deliverInquiry(message), /RECIPIENT_REJECTED/);
  receipt = { accepted: ["shop@example.test"], rejected: [], messageId: "" };
  await assert.rejects(deliverInquiry(message), /MISSING_DELIVERY_RECEIPT/);
  assert.equal(closed, 3);
});

test("client rejects network failures, error responses and ambiguous 200 responses", async context => {
  const fetchMock = context.mock.method(globalThis, "fetch");
  fetchMock.mock.mockImplementation(async () => { throw new TypeError("offline"); });
  await assert.rejects(submitInquiry("contact", "{}"), SubmissionError);
  fetchMock.mock.mockImplementation(async () => Response.json({ message: "Not sent" }, { status: 503 }));
  await assert.rejects(submitInquiry("contact", "{}"), /Not sent/);
  fetchMock.mock.mockImplementation(async () => Response.json({ success: true }));
  await assert.rejects(submitInquiry("contact", "{}"), /could not confirm/);
  fetchMock.mock.mockImplementation(async () => Response.json({ fieldErrors: null, message: {} }, { status: 502 }));
  await assert.rejects(submitInquiry("contact", "{}"), SubmissionError);
  fetchMock.mock.mockImplementation(async () => Response.json({ status: "accepted", reference: "AP-1234ABCD" }));
  assert.equal(await submitInquiry("contact", "{}"), "AP-1234ABCD");
});
