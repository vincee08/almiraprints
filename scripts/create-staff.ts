import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.STAFF_EMAIL?.trim();
const password = process.env.STAFF_PASSWORD;
if (!url || !key || !email || !password || password.length < 12) {
  throw new Error("Set Supabase server settings, STAFF_EMAIL and a STAFF_PASSWORD of at least 12 characters.");
}
async function main() {
  const client = createClient(url!, key!, { auth: { persistSession: false, autoRefreshToken: false } });
  const created = await client.auth.admin.createUser({ email: email!, password: password!, email_confirm: true });
  if (created.error || !created.data.user) throw created.error || new Error("Could not create user.");
  const result = await client.from("staff_members").insert({ user_id: created.data.user.id });
  if (result.error) {
    await client.auth.admin.deleteUser(created.data.user.id);
    throw result.error;
  }
  console.log(`Staff account created: ${email}`);
}
void main().catch(error => { console.error(error instanceof Error ? error.message : "Staff creation failed."); process.exitCode = 1; });
