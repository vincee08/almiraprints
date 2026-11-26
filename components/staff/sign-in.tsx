"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StaffSignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const client = browserClient();
      const result = await client.auth.signInWithPassword({ email: String(data.get("email")), password: String(data.get("password")) });
      if (result.error || !result.data.user) throw new Error("Email or password was not accepted.");
      const staff = await client.from("staff_members").select("user_id").eq("user_id", result.data.user.id).maybeSingle();
      if (staff.error || !staff.data) { await client.auth.signOut(); throw new Error("This account does not have staff access."); }
      window.location.assign("/staff");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Sign in failed. Please try again."); setBusy(false); }
  }
  return <form onSubmit={signIn} className="mt-8 space-y-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-7" aria-busy={busy}>
    <div><label htmlFor="staff-email" className="mb-2 block text-sm font-medium">Email address</label><Input id="staff-email" name="email" type="email" autoComplete="username" required /></div>
    <div><label htmlFor="staff-password" className="mb-2 block text-sm font-medium">Password</label><Input id="staff-password" name="password" type="password" autoComplete="current-password" required /></div>
    {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    <Button type="submit" disabled={busy} className="w-full">{busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{busy ? "Signing in..." : "Sign in"}</Button>
  </form>;
}
