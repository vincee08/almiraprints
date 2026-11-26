import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export function supabaseSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && anon && service ? { url, anon, service } : null;
}

export function serviceClient() {
  const settings = supabaseSettings();
  if (!settings) throw new Error("SUPABASE_UNAVAILABLE");
  return createClient(settings.url, settings.service, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function staffClient() {
  const settings = supabaseSettings();
  if (!settings) return null;
  const store = await cookies();
  return createServerClient(settings.url, settings.anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: values => {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Server Components cannot set cookies; middleware refreshes sessions. */ }
      },
    },
  });
}

export async function authorizedStaff() {
  const client = await staffClient();
  if (!client) return null;
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: member, error: memberError } = await client.from("staff_members").select("user_id,last_seen_at").eq("user_id", user.id).maybeSingle();
  return !memberError && member ? { client, user, member } : null;
}
