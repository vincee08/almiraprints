"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { similarRequestHref } from "@/lib/portfolio-links";
import type { PortfolioItem } from "@/types/portfolio";

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photo = useRef<HTMLDivElement>(null);
  const active = items[index] || items[0];

  function show(next: number) {
    setIndex((next + items.length) % items.length);
    setZoomed(false);
    photo.current?.scrollTo({ left: 0, top: 0, behavior: "instant" });
  }

  if (!active) return null;
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item, itemIndex) => <article key={item.id} className="min-w-0">
        <button type="button" aria-label={"View photo: " + item.title} onClick={event => {
          opener.current = event.currentTarget; show(itemIndex); setOpen(true);
        }} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[1.4rem] border bg-muted shadow-[0_8px_30px_-22px_hsl(var(--foreground)/0.3)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_20px_45px_-25px_hsl(var(--foreground)/0.35)] motion-safe:hover:-translate-y-1">
          {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" sizes="(max-width: 767px) 94vw, 46vw" />}
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-xs font-semibold text-primary shadow-sm"><Expand className="h-4 w-4" aria-hidden="true" />View photo</span>
        </button>
        <div className="pt-3">
          <p className="text-xs text-muted-foreground">{item.category}</p>
          <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
          <Link href={similarRequestHref(item)} className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Request something similar<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> to {item.title}</span></Link>
        </div>
      </article>)}
    </div>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-foreground/70" />
      <Dialog.Content aria-modal="true" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}
        onKeyDown={event => {
          if (!zoomed && !event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            event.preventDefault(); show(index + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        className="fixed inset-0 z-[80] flex max-h-dvh flex-col overflow-y-auto bg-background p-3 sm:inset-4 sm:rounded-2xl sm:border sm:p-5 xl:left-1/2 xl:right-auto xl:w-[min(1320px,calc(100%_-_2rem))] xl:-translate-x-1/2">
        <header className="sticky top-0 z-10 mb-3 flex shrink-0 items-start justify-between gap-3 bg-background pb-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Project gallery · {index + 1} of {items.length}</p>
            <Dialog.Title className="mt-1 text-lg font-semibold sm:text-2xl">{active.title}</Dialog.Title>
          </div>
          <Dialog.Close asChild><Button type="button" variant="outline" size="icon" aria-label="Close gallery"><X aria-hidden="true" /></Button></Dialog.Close>
        </header>
        <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <div ref={photo} tabIndex={0} role="region" aria-label="Project photo" aria-describedby="gallery-zoom-help" className="h-[46dvh] min-h-40 overflow-auto rounded-xl border bg-muted/40 lg:h-[66dvh]">
              <div className="relative h-full w-full" style={zoomed ? { width: "200%", height: "200%" } : undefined}>
                {active.imageUrl && <Image key={active.id} src={active.imageUrl} alt={active.title + (zoomed ? ", enlarged for inspection" : ", full photo")} fill sizes={zoomed ? "180vw" : "(max-width: 1023px) 95vw, 900px"} className="object-contain p-2" />}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="icon" disabled={items.length < 2} aria-label="Previous photo" onClick={() => show(index - 1)}><ArrowLeft aria-hidden="true" /></Button>
                <Button type="button" variant="outline" size="icon" disabled={items.length < 2} aria-label="Next photo" onClick={() => show(index + 1)}><ArrowRight aria-hidden="true" /></Button>
              </div>
              <Button type="button" variant="outline" aria-pressed={zoomed} onClick={() => {
                setZoomed(!zoomed); photo.current?.scrollTo({ left: 0, top: 0, behavior: "instant" });
              }}>{zoomed ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}{zoomed ? "Zoom out" : "Zoom in"}</Button>
            </div>
            <p id="gallery-zoom-help" className="mt-2 text-xs text-muted-foreground">{zoomed ? "Photo enlarged. Scroll or swipe inside the photo to inspect it." : (items.length > 1 ? "Use the arrows or Left and Right keys to browse. " : "") + "Zoom in for a closer look."}</p>
          </div>
          <div className="min-w-0">
            <p className="eyebrow">{active.category}</p>
            <Dialog.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</Dialog.Description>
            <Button asChild className="mt-4 h-auto w-full whitespace-normal text-center"><Link href={similarRequestHref(active)}>Request Something Similar<ArrowUpRight aria-hidden="true" /></Link></Button>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">This project will be included as a reference in your quote request.</p>
            <div role="group" aria-label="Choose a project photo" className="mt-4 flex flex-wrap gap-2">
              {items.map((item, itemIndex) => <button key={item.id} type="button" aria-label={"Show photo: " + item.title} aria-pressed={index === itemIndex}
                onClick={() => show(itemIndex)} className={"relative h-14 w-16 rounded-lg border-2 bg-card " + (index === itemIndex ? "border-primary" : "border-border hover:border-primary/50")}>
                {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-contain p-1" />}
              </button>)}
            </div>
          </div>
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">Photo {index + 1} of {items.length}: {active.title}</p>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
