"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, ExternalLink, Loader2, LogOut, RefreshCw } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type StaffQuote, quoteStatuses, statusLabel, type QuoteStatus } from "@/lib/staff";

type ListResult = { requests: StaffQuote[]; selected: StaffQuote | null; total: number; unread: number };
const noticeLabel = { pending: "Waiting to notify", sending: "Sending email", sent: "SMTP accepted", failed: "Email failed", uncertain: "Delivery needs review" };
const fileSize = (bytes: number) => bytes < 1024 ? `${bytes} bytes` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

export function StaffDashboard({ email }: { email: string }) {
  const [list, setList] = useState<StaffQuote[]>([]);
  const [extra, setExtra] = useState<StaffQuote | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState<number | null>(null);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [message, setMessage] = useState("");
  const [live, setLive] = useState("Connecting live updates...");
  const listRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);
  const lastAutoScroll = useRef("");

  useEffect(() => { setSelectedId(new URLSearchParams(window.location.search).get("request") || ""); }, []);
  useEffect(() => {
    const client = browserClient();
    let active = true;
    let channel: ReturnType<typeof client.channel> | null = null;
    void (async () => {
      const { data } = await client.auth.getSession();
      if (!active) return;
      if (!data.session) { setLive("Live updates unavailable; use Refresh"); return; }
      await client.realtime.setAuth(data.session.access_token);
      if (!active) return;
      channel = client.channel("staff-quote-updates").on("postgres_changes", { event: "*", schema: "public", table: "quote_requests" }, payload => {
        const next = payload.new as { submission_state?: string } | undefined;
        if (next?.submission_state === "submitted") setVersion(value => value + 1);
      }).subscribe(state => setLive(state === "SUBSCRIBED" ? "Live updates on" : state === "CHANNEL_ERROR" || state === "TIMED_OUT" ? "Live updates unavailable; use Refresh" : "Connecting live updates..."));
    })();
    return () => { active = false; if (channel) void client.removeChannel(channel); };
  }, []);

  const load = useCallback(async (signal?: AbortSignal) => {
    const query = new URLSearchParams({ page: String(page) });
    if (search.trim()) query.set("search", search.trim());
    if (status) query.set("status", status);
    if (selectedId) query.set("request", selectedId);
    try {
      const response = await fetch(`/api/staff/quotes?${query}`, { signal, cache: "no-store" });
      if (response.status === 401) { window.location.assign("/staff/sign-in"); return; }
      if (!response.ok) throw new Error("Requests could not be loaded.");
      const data = await response.json() as ListResult;
      setList(data.requests); setExtra(data.selected); setTotal(data.total); setUnread(data.unread);
      setMessage("");
    } catch (failure) {
      if (!signal?.aborted) setMessage(failure instanceof Error ? failure.message : "Could not load requests.");
    } finally { if (!signal?.aborted) setLoading(false); }
  }, [page, search, status, selectedId]);
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load, version]);
  useEffect(() => { const timer = setInterval(() => setVersion(value => value + 1), 30000); return () => clearInterval(timer); }, []);
  const selected = useMemo(() => list.find(item => item.id === selectedId) || (extra?.id === selectedId ? extra : null), [list, extra, selectedId]);
  useEffect(() => {
    if (!selected || selectedId === lastAutoScroll.current || window.innerWidth >= 1024) return;
    lastAutoScroll.current = selectedId;
    detailsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, [selected, selectedId]);

  function choose(id: string) { setSelectedId(id); const url = new URL(window.location.href); if (id) url.searchParams.set("request", id); else url.searchParams.delete("request"); window.history.replaceState(null, "", url); }
  async function act(path: string, body?: object) {
    setWorking(path); setMessage("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Could not save the change.");
      setVersion(value => value + 1);
    } catch (failure) { setMessage(failure instanceof Error ? failure.message : "Could not save the change."); }
    finally { setWorking(""); }
  }
  async function signOut() { setWorking("signout"); await browserClient().auth.signOut(); window.location.assign("/staff/sign-in"); }

  return <main className="min-h-screen bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
        <div><p className="eyebrow mb-2">AlmiraPrints staff</p><h1 className="text-3xl font-semibold tracking-tight">Quote requests</h1><p className="mt-2 text-sm text-muted-foreground">Signed in as {email}</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <span role="status" className="rounded-full border bg-card px-3 py-2 text-xs">{live}</span>
          <Button variant="outline" onClick={() => setVersion(value => value + 1)}><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button variant="outline" onClick={signOut} disabled={working === "signout"}><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </header>
      <div className="my-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-primary" aria-hidden="true" /><p className="font-medium" aria-live="polite">{unread === null ? "Checking new requests..." : `${unread} unread ${unread === 1 ? "request" : "requests"}`}</p></div>
        <Button size="sm" variant="outline" disabled={!unread || Boolean(working)} onClick={() => void act("/api/staff/seen")}>Mark all as read</Button>
      </div>
      {message && <p role="alert" className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{message}</p>}
      <div className="grid gap-5 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
        <section ref={listRef} aria-label="Request list" className="min-w-0 rounded-2xl border bg-card p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div><label htmlFor="request-search" className="mb-2 block text-sm font-medium">Search requests</label><Input id="request-search" type="search" placeholder="Reference, customer, email or service" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} /></div>
            <div><label htmlFor="status-filter" className="mb-2 block text-sm font-medium">Filter status</label><select id="status-filter" className="h-10 rounded-lg border bg-background px-3 text-sm" value={status} onChange={event => { setStatus(event.target.value); setPage(0); }}><option value="">All statuses</option>{quoteStatuses.map(item => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></div>
          </div>
          <p className="my-4 text-sm text-muted-foreground" role="status">{loading ? "Loading requests..." : `${total} matching ${total === 1 ? "request" : "requests"}`}</p>
          <div className="space-y-2">{list.map(item => <button key={item.id} type="button" onClick={() => choose(item.id)} aria-pressed={selectedId === item.id} className="w-full rounded-xl border p-4 text-left transition-colors hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary aria-pressed:border-primary aria-pressed:bg-primary/5">
            <div className="flex items-start justify-between gap-3"><strong className="text-sm">{item.reference}</strong><span className="rounded-full bg-muted px-2 py-1 text-xs">{statusLabel(item.status)}</span></div>
            <p className="mt-2 font-medium">{item.customer_name}</p><p className="text-sm text-muted-foreground">{item.specific_service} · {item.quantity} requested</p>
            <p className="mt-2 text-xs text-muted-foreground">{new Date(item.submitted_at).toLocaleString()}</p>
            {item.notification_state === "failed" || item.notification_state === "uncertain" ? <p className="mt-2 text-xs font-medium text-destructive">{noticeLabel[item.notification_state]}</p> : null}
          </button>)}</div>
          {!loading && list.length === 0 && <p className="rounded-xl bg-muted p-5 text-sm">No requests match these filters.</p>}
          <div className="mt-5 flex items-center justify-between gap-3"><Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</Button><span className="text-xs text-muted-foreground">Page {page + 1}</span><Button size="sm" variant="outline" disabled={(page + 1) * 50 >= total} onClick={() => setPage(value => value + 1)}>Next</Button></div>
        </section>
        <section ref={detailsRef} aria-label="Request details" className="min-w-0 scroll-mt-4 rounded-2xl border bg-card p-4 sm:p-6">
          {!selected ? <div className="py-16 text-center text-muted-foreground">Select a request to see its details.</div> : <>
            <Button type="button" size="sm" variant="ghost" className="mb-4 lg:hidden" onClick={() => listRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })}>← Back to requests</Button>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5"><div><p className="eyebrow mb-2">{selected.reference}</p><h2 className="text-2xl font-semibold">{selected.specific_service}</h2><p className="mt-1 text-sm text-muted-foreground">Submitted {new Date(selected.submitted_at).toLocaleString()}</p></div><span className="rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary">{statusLabel(selected.status)}</span></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><h3 className="mb-2 font-semibold">Customer</h3><p>{selected.customer_name}</p><p><a href={`mailto:${selected.email}`} className="break-all text-primary underline">{selected.email}</a></p><p><a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`} className="text-primary underline">{selected.phone}</a></p></div>
              <div><h3 className="mb-2 font-semibold">Request</h3><Detail label="Category" value={selected.service_category} /><Detail label="Quantity" value={String(selected.quantity)} /><Detail label="Size" value={selected.size} /><Detail label="Material" value={selected.material} /><Detail label="Preferred date" value={selected.deadline} /></div>
            </div>
            {selected.service_category === "T-Shirt Printing" && <div className="mt-5 rounded-xl bg-muted/60 p-4"><h3 className="font-semibold">T-shirt details</h3><Detail label="Sizes" value={selected.tshirt_size} /><Detail label="Colors" value={selected.tshirt_color} /><Detail label="Placement" value={selected.print_location} /></div>}
            {selected.additional_requirements && <div className="mt-5"><h3 className="font-semibold">Additional requirements</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{selected.additional_requirements}</p></div>}
            <div className="mt-5 rounded-xl border p-4"><h3 className="font-semibold">Artwork</h3>{selected.artwork_name ? <p className="mt-2"><a href={`/api/staff/quotes/${selected.id}/artwork`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 break-all text-sm text-primary underline">{selected.artwork_name} <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></a><span className="mt-1 block text-xs text-muted-foreground">Private download · {fileSize(selected.artwork_size || 0)}</span></p> : <p className="mt-2 text-sm text-muted-foreground">No artwork supplied.</p>}</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label htmlFor="request-status" className="mb-2 block text-sm font-semibold">Update status</label><select id="request-status" className="h-10 w-full rounded-lg border bg-background px-3 text-sm" value={selected.status} disabled={Boolean(working)} onChange={event => void act(`/api/staff/quotes/${selected.id}/status`, { status: event.target.value as QuoteStatus })}>{quoteStatuses.map(item => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></div>
              <div><h3 className="mb-2 text-sm font-semibold">Staff email</h3><p className="text-sm">{noticeLabel[selected.notification_state]}</p>{selected.notification_error && <p className="mt-1 text-xs text-muted-foreground">{selected.notification_error}</p>}{selected.notification_state === "failed" && <Button size="sm" variant="outline" className="mt-2" disabled={Boolean(working)} onClick={() => void act(`/api/staff/quotes/${selected.id}/retry`)}>{working.endsWith("retry") && <Loader2 className="h-4 w-4 animate-spin" />}Retry email</Button>}{selected.notification_state === "uncertain" && <p className="mt-2 text-xs text-muted-foreground">Check the staff inbox before taking further action. An automatic retry could send a duplicate.</p>}</div></div>
          </>}
        </section>
      </div>
    </div>
  </main>;
}

function Detail({ label, value }: { label: string; value: string | null }) { return value ? <p className="mt-1 text-sm"><span className="text-muted-foreground">{label}:</span> {value}</p> : null; }
