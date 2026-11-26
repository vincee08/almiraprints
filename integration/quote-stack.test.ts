import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const web = process.env.APP_BASE_URL || "http://localhost:3000";
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
async function mailFor(reference: string) {
  for (let i = 0; i < 20; i++) {
    const list = await fetch("http://127.0.0.1:54324/api/v1/messages").then(response => response.json()) as { messages: { ID: string; Subject: string }[] };
    const message = list.messages.find(item => item.Subject.includes(reference));
    if (message) return fetch(`http://127.0.0.1:54324/api/v1/message/${message.ID}`).then(response => response.json()) as Promise<{ Text: string; Attachments: unknown[] }>;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  assert.fail(`Mailpit did not receive ${reference}`);
}

test("local Supabase quote, artwork, staff RLS, notification, retry and realtime", async context => {
  assert.ok(url.includes("127.0.0.1") || url.includes("localhost"), "Integration tests require local Supabase");
  const ids: string[] = [];
  const files: string[] = [];
  const users: string[] = [];
  context.after(async () => {
    if (files.length) await service.storage.from("quote-artwork").remove(files);
    for (const id of ids) await service.from("quote_requests").delete().eq("id", id);
    for (const id of users) await service.auth.admin.deleteUser(id);
  });

  const first = fixture();
  const noFile = await post("/api/quote", { ...first, artwork: null });
  assert.equal(noFile.status, 200);
  assert.equal(noFile.body.status, "accepted");
  assert.equal(noFile.body.notification, "sent", "SMTP must accept the staff email while staff is logged out");
  const firstRow = await service.from("quote_requests").select("id,reference,submission_state,notification_state").eq("reference", noFile.body.reference).single();
  assert.ifError(firstRow.error);
  ids.push(firstRow.data!.id);
  assert.equal(firstRow.data!.submission_state, "submitted");
  const firstMail = await mailFor(noFile.body.reference);
  assert.match(firstMail.Text, new RegExp(`/staff\\?request=${firstRow.data!.id}`));
  assert.equal(firstMail.Attachments.length, 0);
  const duplicate = await post("/api/quote", { ...first, artwork: null });
  assert.equal(duplicate.body.reference, noFile.body.reference);
  const oversized = await post("/api/quote", { ...fixture(), artwork: { name: "large.pdf", size: 10485761 } });
  assert.equal(oversized.status, 413);
  const contact = await post("/api/contact", { fullName: "Integration Customer", email: "customer@example.test", phone: "09923102867", serviceType: "General Inquiry", message: "Please discuss a personalized print project." });
  assert.equal(contact.body.status, "accepted");
  await mailFor(contact.body.reference);

  const second = fixture();
  const content = new Blob(["%PDF-1.7 fixture artwork"], { type: "application/pdf" });
  const prepared = await post("/api/quote", { ...second, artwork: { name: "design.pdf", size: content.size } });
  assert.equal(prepared.status, 200);
  assert.equal(prepared.body.status, "upload_required");
  ids.push(prepared.body.id);
  files.push(prepared.body.path);
  const anonClient = publicClient();
  const uploaded = await anonClient.storage.from("quote-artwork").uploadToSignedUrl(prepared.body.path, prepared.body.token, content, { contentType: "application/pdf" });
  assert.ifError(uploaded.error);
  const completed = await post("/api/quote/complete", { id: prepared.body.id, submissionKey: second.submissionKey });
  assert.equal(completed.status, 200);
  assert.equal(completed.body.status, "accepted");
  assert.equal(completed.body.notification, "sent");
  const secondMail = await mailFor(completed.body.reference);
  assert.equal(secondMail.Attachments.length, 0);
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
  assert.equal((await service.from("quote_requests").select("artwork_size").eq("id", boundaryPrepared.body.id).single()).data?.artwork_size, 10485760);

  const unauth = await fetch(`${web}/api/staff/quotes`);
  assert.equal(unauth.status, 401);
  assert.equal((await fetch(`${web}/api/staff/quotes/${prepared.body.id}/artwork`, { redirect: "manual" })).status, 401);
  assert.notEqual((await fetch(`${url}/storage/v1/object/public/quote-artwork/${prepared.body.path}`)).status, 200);
  const anonRows = await anonClient.from("quote_requests").select("id");
  assert.ok(anonRows.error || anonRows.data?.length === 0);
  const anonFile = await anonClient.storage.from("quote-artwork").download(prepared.body.path);
  assert.ok(anonFile.error);

  const password = `Test-${randomUUID()}!`;
  const outsider = await service.auth.admin.createUser({ email: `outside-${randomUUID()}@example.test`, password, email_confirm: true });
  assert.ifError(outsider.error); users.push(outsider.data.user!.id);
  const outsiderClient = publicClient();
  assert.ifError((await outsiderClient.auth.signInWithPassword({ email: outsider.data.user!.email!, password })).error);
  assert.equal((await outsiderClient.from("quote_requests").select("id")).data?.length, 0);

  const staffAccount = await service.auth.admin.createUser({ email: `staff-${randomUUID()}@example.test`, password, email_confirm: true });
  assert.ifError(staffAccount.error); users.push(staffAccount.data.user!.id);
  assert.ifError((await service.from("staff_members").insert({ user_id: staffAccount.data.user!.id })).error);
  const staff = publicClient();
  const signIn = await staff.auth.signInWithPassword({ email: staffAccount.data.user!.email!, password });
  assert.ifError(signIn.error);
  await staff.realtime.setAuth(signIn.data.session!.access_token);
  assert.ok((await staff.from("quote_requests").select("id")).data?.length);
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
    const timer = setTimeout(() => reject(new Error("Realtime subscription timed out")), 15000);
    channel.subscribe(state => { if (state === "SUBSCRIBED") { clearTimeout(timer); resolve(); } });
  });
  try {
    const third = await post("/api/quote", { ...fixture(), artwork: null });
    assert.equal(third.body.status, "accepted");
    const thirdRow = await service.from("quote_requests").select("id").eq("reference", third.body.reference).single();
    ids.push(thirdRow.data!.id);
    await Promise.race([event, new Promise((_, reject) => setTimeout(() => reject(new Error("Realtime event did not arrive")), 15000))]);
  } finally {
    await staff.removeChannel(channel);
    staff.realtime.disconnect();
    await staff.auth.signOut();
    await outsiderClient.auth.signOut();
  }

  const { notifyQuote } = await import("../lib/server/quote-service");
  const failedInput = fixture();
  const failedId = randomUUID(); ids.push(failedId);
  const rpc = await service.rpc("create_quote_request", { p_id: failedId, p_submission_key: failedInput.submissionKey, p_fingerprint: randomUUID(), p_ip_hash: randomUUID(), p_data: failedInput });
  assert.ifError(rpc.error);
  const previousHost = process.env.SMTP_HOST;
  delete process.env.SMTP_HOST;
  try { assert.equal(await notifyQuote(rpc.data, web), false); }
  finally { process.env.SMTP_HOST = previousHost; }
  assert.equal((await service.from("quote_requests").select("notification_state").eq("id", failedId).single()).data?.notification_state, "failed");
  const retry = await Promise.all([notifyQuote(rpc.data, web), notifyQuote(rpc.data, web)]);
  assert.deepEqual(retry.sort(), [false, true]);
  assert.equal((await service.from("quote_requests").select("notification_state,notification_attempts").eq("id", failedId).single()).data?.notification_attempts, 2);
  await mailFor(rpc.data.reference);
});
