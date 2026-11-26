"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { serviceCategories, services } from "@/data/services";
import { categoryLabels, filterServices, servicesHref } from "@/lib/catalog-ui";
import { ServiceCard } from "./service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mobileLabels: Record<string, string> = { "": "All", "party-event": "Party & events", "signage-display": "Signs", "tshirt-printing": "T-shirts", "gifts-souvenirs": "Gifts", "calendar-printing": "Calendars", "personalized-products": "Personalized" };

export function ServiceDiscovery({ categorySlug, initialQuery = "", invalidCategory = false }: { categorySlug?: string; initialQuery?: string; invalidCategory?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  const router = useRouter();
  const selected = serviceCategories.find(category => category.slug === categorySlug);
  const visible = filterServices(selected?.slug, query);
  const filters = [{ slug: "", name: "All printing" }, ...serviceCategories];

  function clearSearch() {
    setQuery("");
    router.replace(servicesHref(selected?.slug), { scroll: false });
    document.getElementById("service-search")?.focus();
  }

  return <section className="py-8 sm:py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <form role="search" aria-label="Search printing services" className="mb-5 max-w-2xl" onSubmit={event => {
        event.preventDefault(); router.push(servicesHref(selected?.slug, query), { scroll: false });
      }}>
        <label htmlFor="service-search" className="mb-2 block text-sm font-semibold">Find a product or printing idea</label>
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <Input id="service-search" type="search" value={query} maxLength={100} onChange={event => setQuery(event.target.value)} placeholder="Try mugs or PVC" className="pl-10 pr-12 [&::-webkit-search-cancel-button]:appearance-none" aria-describedby="service-search-hint" />
            {query && <Button type="button" variant="ghost" size="icon" className="absolute right-0.5 top-0.5" aria-label="Clear search" onClick={clearSearch}><X aria-hidden="true" /></Button>}
          </div>
          <Button type="submit">Search</Button>
        </div>
        <p id="service-search-hint" className="mt-2 text-xs text-muted-foreground">Results update as you type.<span className="hidden sm:inline"> Search matches names, uses and listed materials.</span></p>
      </form>
      <nav aria-label="Filter services by category" className="flex flex-wrap gap-2">
        {filters.map(category => {
          const active = (selected?.slug || "") === category.slug;
          const count = category.slug ? services.filter(service => service.category.slug === category.slug).length : services.length;
          return <Link key={category.slug} href={servicesHref(category.slug, query)} scroll={false} aria-current={active ? "true" : undefined} className={"inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors " + (active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary hover:text-primary")}><span className="sm:hidden">{mobileLabels[category.slug]}</span><span className="hidden sm:inline">{categoryLabels[category.slug] || category.name}</span><span className={"rounded-full px-1.5 text-xs " + (active ? "bg-background/15" : "bg-muted")}>{count}</span></Link>;
        })}
      </nav>
      {invalidCategory && <p role="status" className="mt-5 rounded-xl bg-muted p-4 text-sm">That category was not found. You can browse all printing services below.</p>}
      <div className="mb-6 mt-8 flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-2xl font-semibold">{selected?.name || "All printing services"}</h2>{selected && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{selected.description}</p>}</div>
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">{visible.length} {visible.length === 1 ? "service" : "services"}{query.trim() ? ' matching “' + query.trim() + '”' : ""}</p>
      </div>
      {visible.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map(service => <ServiceCard key={service.id} service={service} />)}</div> :
        <div className="rounded-2xl border border-dashed bg-muted/30 p-6 sm:p-10">
          <h3 className="text-xl font-semibold">No prints match this search.</h3>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">Try a product name or a different category. A custom idea can also start with a conversation.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={clearSearch}>Clear search</Button>{selected && <Button asChild variant="outline"><Link href={servicesHref(undefined, query)}>Search all categories</Link></Button>}<Button asChild variant="ghost"><Link href="/contact">Ask about a custom idea</Link></Button></div>
        </div>}
    </div>
  </section>;
}
