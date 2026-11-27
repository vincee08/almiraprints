import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const web = process.env.TEST_BASE_URL || "http://localhost:3000";
const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const publicClient = () => createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
const fixture = (key = randomUUID(), suffix = randomUUID()) => ({
  customerName: "Integration Customer", email: "customer@example.test", phone: "09923102867",
  serviceCategory: "Personalized Gifts & Souvenirs", specificService: "Personalized Mug", quantity: "2",
  additionalRequirements: `Test fixture ${suffix}`, submissionKey: key, hasDesignFile: false,
});
const post = async (path: string, body: object) => {
  const response = await fetch(web + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: response.status, body: await response.json() };
};
async function hasMail(reference: string) {
  const list = await fetch("http://127.0.0.1:54324/api/v1/messages").then(response => response.json()) as { messages: { Subject: string }[] };
  return list.messages.some(item => item.Subject.includes(reference));
}

test("local Supabase keeps quote and contact saves private, deduplicated and staff accessible", async context => {
  assert.ok(url.includes("127.0.0.1") || url.includes("localhost"), "Integration tests require local Supabase");
  const ids: string[] = [];
  const contactIds: string[] = [];
  const files: string[] = [];
  const users: string[] = [];
  context.after(async () => {
    if (files.length) await service.storage.from("quote-artwork").remove(files);
    for (const id of ids) await service.from("quote_requests").delete().eq("id", id);
    for (const id of contactIds) await service.from("contact_messages").delete().eq("id", id);
    for (const id of users) await service.auth.admin.deleteUser(id);
  });

  const first = fixture();
  const noFile = await post("/api/quote", { ...first, artwork: null });
  assert.equal(noFile.status, 200);
  assert.deepEqual(Object.keys(noFile.body).sort(), ["reference", "status"]);
  assert.equal(noFile.body.status, "accepted");
  const firstRow = await service.from("quote_requests").select("id,reference,submission_state").eq("reference", noFile.body.reference).single();
  assert.ifError(firstRow.error);
  ids.push(firstRow.data!.id);
  assert.equal(firstRow.data!.submission_state, "submitted");
  assert.equal(await hasMail(noFile.body.reference), false, "Quote must not send email");
  const duplicate = await post("/api/quote", { ...first, artwork: null });
  assert.equal(duplicate.body.reference, noFile.body.reference);
  const oversized = await post("/api/quote", { ...fixture(), artwork: { name: "large.pdf", size: 10485761 } });
  assert.equal(oversized.status, 413);
  const contactInput = { fullName: "Integration Customer", email: "customer@example.test", phone: "09923102867", serviceType: "General Inquiry", message: `Please discuss a personalized print project ${randomUUID()}.`, submissionKey: randomUUID(), website: "" };
  const contact = await post("/api/contact", contactInput);
  assert.equal(contact.status, 200);
  assert.deepEqual(Object.keys(contact.body).sort(), ["reference", "status"]);
  assert.equal(contact.body.status, "accepted");
  const contactRow = await service.from("contact_messages").select("id,reference,message").eq("reference", contact.body.reference).single();
  assert.ifError(contactRow.error); contactIds.push(contactRow.data!.id);
  assert.equal(contactRow.data?.message, contactInput.message);
  assert.equal((await post("/api/contact", contactInput)).body.reference, contact.body.reference);
  assert.equal((await post("/api/contact", { ...contactInput, submissionKey: randomUUID() })).body.reference, contact.body.reference);
  assert.equal((await post("/api/contact", { ...contactInput, message: "Changed message with the same submission key." })).status, 409);
  assert.equal((await post("/api/contact", { ...contactInput, submissionKey: randomUUID(), website: "spam.example" })).status, 400);
  assert.equal(await hasMail(contact.body.reference), false, "Contact save must not send email");

  const second = fixture();
  const content = new Blob(["%PDF-1.7 fixture artwork"], { type: "application/pdf" });
  const prepared = await post("/api/quote", { ...second, artwork: { name: "design.pdf", size: content.size } });
  assert.equal(prepared.status, 200);
  assert.equal(prepared.body.status, "upload_required");
  assert.equal(await hasMail(prepared.body.reference), false);
  ids.push(prepared.body.id);
  files.push(prepared.body.path);
  const anonClient = publicClient();
  const incomplete = await post("/api/quote/complete", { id: prepared.body.id, submissionKey: second.submissionKey });
  assert.equal(incomplete.status, 409, "A missing artwork upload must not be acknowledged as saved");
  const uploaded = await anonClient.storage.from("quote-artwork").uploadToSignedUrl(prepared.body.path, prepared.body.token, content, { contentType: "application/pdf" });
  assert.ifError(uploaded.error);
  const completed = await post("/api/quote/complete", { id: prepared.body.id, submissionKey: second.submissionKey });
  assert.equal(completed.status, 200);
  assert.deepEqual(Object.keys(completed.body).sort(), ["reference", "status"]);
  assert.equal(completed.body.status, "accepted");
  assert.equal(await hasMail(completed.body.reference), false, "Artwork quote must not send email");
  const secondRow = await service.from("quote_requests").select("submission_state,artwork_path,artwork_size").eq("id", prepared.body.id).single();
  assert.equal(secondRow.data?.submission_state, "submitted");
  assert.equal(secondRow.data?.artwork_size, content.size);

  const boundary = fixture();
  const exactTenMb = new Blob([new Uint8Array(10485760)], { type: "application/pdf" });
  const boundaryPrepared = await post("/api/quote", { ...boundary, artwork: { name: "boundary.pdf", size: exactTenMb.size } });
  assert.equal(boundaryPrepared.body.status, "upload_required");
  ids.push(boundaryPrepared.body.id); files.push(boundaryPrepared.body.path);
  assert.ifError((await anonClient.storage.from("quote-artwork").uploadToSignedUrl(boundaryPrepared.body.path, boundaryPrepared.body.token, exactTenMb, { contentType: "application/pdf" })).error);
  const boundaryCompleted = await post("/api/quote/complete", { id: boundaryPrepared.body.id, submissionKey: boundary.submissionKey });
  assert.equal(boundaryCompleted.body.status, "accepted");
  assert.equal(await hasMail(boundaryCompleted.body.reference), false);
  assert.equal((await service.from("quote_requests").select("artwork_size").eq("id", boundaryPrepared.body.id).single()).data?.artwork_size, 10485760);

  const unauth = await fetch(`${web}/api/staff/quotes`);
  assert.equal(unauth.status, 401);
  assert.equal((await fetch(`${web}/api/staff/contacts`)).status, 401);
  assert.equal((await fetch(`${web}/api/staff/quotes/${prepared.body.id}/artwork`, { redirect: "manual" })).status, 401);
  assert.notEqual((await fetch(`${url}/storage/v1/object/public/quote-artwork/${prepared.body.path}`)).status, 200);
  const anonRows = await anonClient.from("quote_requests").select("id");
  assert.ok(anonRows.error || anonRows.data?.length === 0);
  const anonContacts = await anonClient.from("contact_messages").select("id");
  assert.ok(anonContacts.error || anonContacts.data?.length === 0);
  const anonFile = await anonClient.storage.from("quote-artwork").download(prepared.body.path);
  assert.ok(anonFile.error);

  const password = `Test-${randomUUID()}!`;
  const outsider = await service.auth.admin.createUser({ email: `outside-${randomUUID()}@example.test`, password, email_confirm: true });
  assert.ifError(outsider.error); users.push(outsider.data.user!.id);
  const outsiderClient = publicClient();
  assert.ifError((await outsiderClient.auth.signInWithPassword({ email: outsider.data.user!.email!, password })).error);
  assert.equal((await outsiderClient.from("quote_requests").select("id")).data?.length, 0);
  assert.equal((await outsiderClient.from("contact_messages").select("id")).data?.length, 0);

  const staffAccount = await service.auth.admin.createUser({ email: `staff-${randomUUID()}@example.test`, password, email_confirm: true });
  assert.ifError(staffAccount.error); users.push(staffAccount.data.user!.id);
  assert.ifError((await service.from("staff_members").insert({ user_id: staffAccount.data.user!.id })).error);
  const staff = publicClient();
  const signIn = await staff.auth.signInWithPassword({ email: staffAccount.data.user!.email!, password });
  assert.ifError(signIn.error);
  await staff.realtime.setAuth(signIn.data.session!.access_token);
  assert.ok((await staff.from("quote_requests").select("id")).data?.length);
  assert.equal((await staff.from("contact_messages").select("reference").eq("reference", contact.body.reference).single()).data?.reference, contact.body.reference);
  const deniedContactUpdate = await staff.from("contact_messages").update({ message: "Not allowed" }).eq("id", contactRow.data!.id).select("id");
  assert.ok(deniedContactUpdate.error || deniedContactUpdate.data?.length === 0);
  assert.equal((await staff.from("quote_requests").update({ status: "in_progress" }).eq("id", firstRow.data!.id).select("status").single()).data?.status, "in_progress");
  assert.ok((await outsiderClient.from("quote_requests").update({ status: "completed" }).eq("id", firstRow.data!.id).select("id")).data?.length === 0);
  const staffFile = await staff.storage.from("quote-artwork").createSignedUrl(prepared.body.path, 60);
  assert.ifError(staffFile.error);

  let received!: (value: unknown) => void;
  const event = new Promise(resolve => { received = resolve; });
  const channel = staff.channel(`integration-${randomUUID()}`).on("postgres_changes", { event: "*", schema: "public", table: "quote_requests" }, payload => {
    if ((payload.new as { reference?: string }).reference) received(payload);
  });
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Realtime subscription timed out")), 30000);
    channel.subscribe(state => { if (state === "SUBSCRIBED") { clearTimeout(timer); resolve(); } });
  });
  // The local Realtime server may acknowledge a channel before its WAL subscription is ready.
  await new Promise(resolve => setTimeout(resolve, 500));
  let eventTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    const third = await post("/api/quote", { ...fixture(), artwork: null });
    assert.equal(third.body.status, "accepted");
    const thirdRow = await service.from("quote_requests").select("id").eq("reference", third.body.reference).single();
    ids.push(thirdRow.data!.id);
    await Promise.race([event, new Promise((_, reject) => { eventTimer = setTimeout(() => reject(new Error("Realtime event did not arrive")), 30000); })]);
  } finally {
    if (eventTimer) clearTimeout(eventTimer);
    await staff.removeChannel(channel);
    staff.realtime.disconnect();
    await staff.auth.signOut();
    await outsiderClient.auth.signOut();
  }

  assert.equal(await hasMail(noFile.body.reference), false);
  assert.equal(await hasMail(completed.body.reference), false);
});
