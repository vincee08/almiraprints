"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StaffContact } from "@/lib/staff";

type ListResult = { messages: StaffContact[]; total: number };

export function StaffContactMessages() {
  const [messages, setMessages] = useState<StaffContact[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);
  const selected = useMemo(() => messages.find(message => message.id === selectedId) || null, [messages, selectedId]);

  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    const query = new URLSearchParams({ page: String(page) });
    if (search.trim()) query.set("search", search.trim());
    try {
      const response = await fetch(`/api/staff/contacts?${query}`, { signal, cache: "no-store" });
      if (response.status === 401) { window.location.assign("/staff/sign-in"); return; }
      if (!response.ok) throw new Error("Contact messages could not be loaded.");
      const data = await response.json() as ListResult;
      setMessages(data.messages); setTotal(data.total); setError("");
    } catch (failure) {
      if (!signal.aborted) setError(failure instanceof Error ? failure.message : "Could not load messages.");
    } finally { if (!signal.aborted) setLoading(false); }
  }, [page, search]);
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load, version]);

  function choose(id: string) {
    setSelectedId(id);
    if (window.innerWidth < 1024) detailsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Messages submitted through the contact form are stored privately for staff.</p><Button variant="outline" onClick={() => setVersion(value => value + 1)}><RefreshCw className="h-4 w-4" />Refresh messages</Button></div>
    {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
    <div className="grid gap-5 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
      <section ref={listRef} aria-label="Contact message list" className="min-w-0 rounded-2xl border bg-card p-4 sm:p-5">
        <label htmlFor="contact-search" className="mb-2 block text-sm font-medium">Search messages</label>
        <Input id="contact-search" type="search" placeholder="Reference, name, email, topic or message" value={search} onChange={event => { setSearch(event.target.value); setPage(0); setSelectedId(""); }} />
        <p className="my-4 text-sm text-muted-foreground" role="status">{loading ? "Loading messages..." : `${total} matching ${total === 1 ? "message" : "messages"}`}</p>
        <div className="space-y-2">{messages.map(item => <button key={item.id} type="button" onClick={() => choose(item.id)} aria-pressed={selectedId === item.id} className="w-full rounded-xl border p-4 text-left transition-colors hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary aria-pressed:border-primary aria-pressed:bg-primary/5">
          <strong className="text-sm">{item.reference}</strong><p className="mt-2 font-medium">{item.full_name}</p><p className="text-sm text-muted-foreground">{item.service_type}</p><p className="mt-2 line-clamp-2 text-sm">{item.message}</p><p className="mt-2 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
        </button>)}</div>
        {!loading && messages.length === 0 && <p className="rounded-xl bg-muted p-5 text-sm">No messages match this search.</p>}
        <div className="mt-5 flex items-center justify-between gap-3"><Button size="sm" variant="outline" disabled={page === 0} onClick={() => { setPage(value => value - 1); setSelectedId(""); }}>Previous</Button><span className="text-xs text-muted-foreground">Page {page + 1}</span><Button size="sm" variant="outline" disabled={(page + 1) * 50 >= total} onClick={() => { setPage(value => value + 1); setSelectedId(""); }}>Next</Button></div>
      </section>
      <section ref={detailsRef} aria-label="Contact message details" className="min-w-0 scroll-mt-4 rounded-2xl border bg-card p-4 sm:p-6">
        {!selected ? <div className="py-16 text-center text-muted-foreground">Select a message to read its details.</div> : <>
          <Button type="button" size="sm" variant="ghost" className="mb-4 lg:hidden" onClick={() => listRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })}>← Back to messages</Button>
          <div className="border-b pb-5"><p className="eyebrow mb-2">{selected.reference}</p><h2 className="text-2xl font-semibold">{selected.service_type}</h2><p className="mt-1 text-sm text-muted-foreground">Received {new Date(selected.created_at).toLocaleString()}</p></div>
          <div className="mt-5"><h3 className="font-semibold">Customer</h3><p className="mt-2">{selected.full_name}</p><p><a href={`mailto:${selected.email}`} className="break-all text-primary underline">{selected.email}</a></p><p><a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`} className="text-primary underline">{selected.phone}</a></p></div>
          <div className="mt-5"><h3 className="font-semibold">Message</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{selected.message}</p></div>
        </>}
      </section>
    </div>
  </div>;
}
