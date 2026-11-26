import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProcessSection() {
  return <section className="border-t bg-muted/70 py-14 sm:py-16 lg:py-20">
    <div className="container mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16 lg:px-8">
      <div>
        <p className="eyebrow mb-3">Simple from the first idea</p>
        <h2 className="max-w-md text-3xl font-bold tracking-tight sm:text-4xl">An idea is enough to start.</h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">Share your product, quantity, and a reference if you have one. We’ll discuss the options, artwork, and pricing before you order.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4"><Button asChild><Link href="/quote">Plan your print<ArrowUpRight aria-hidden="true" /></Link></Button><Link className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 hover:underline" href="/faq">Artwork & ordering help</Link></div>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {[["01", "Choose a print", "Browse the catalog or start with a project photo."], ["02", "Share your details", "Add quantity, personalization, and your preferred date."], ["03", "Confirm together", "Agree on options, pricing, and arrangements with the shop."]].map(([number, title, text]) => <li key={number} className="rounded-2xl border bg-card p-5 shadow-[0_10px_30px_-25px_hsl(var(--foreground)/0.25)] sm:min-h-48 sm:p-6"><span className="text-sm font-bold tracking-[0.15em] text-primary">{number}</span><h3 className="mt-5 text-lg font-bold leading-snug">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></li>)}
      </ol>
    </div>
  </section>;
}
