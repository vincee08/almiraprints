"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const quoteHref = pathname.startsWith("/services/") ? "/quote?service=" + pathname.split("/")[2] : "/quote";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="AlmiraPrints home">
            <Image src="/almiraprints-logo.png" alt="" width={40} height={40} className="object-contain" priority />
            <span className="text-lg font-bold tracking-tight">AlmiraPrints<span className="text-primary">.</span></span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 md:flex lg:gap-1">
            {mainNavigation.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={cn("inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary", active(item.href) ? "bg-accent text-primary" : "text-muted-foreground")}>{item.label}</Link>)}
          </nav>
          <div className="hidden md:block"><Button asChild size="sm"><Link href={quoteHref}>Get a quote</Link></Button></div>
          <div className="flex md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open navigation menu"><Menu aria-hidden="true" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-[min(360px,100vw)] overflow-y-auto pb-10">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-xl">AlmiraPrints</SheetTitle>
                  <SheetDescription>Find your next printing project.</SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile navigation" className="mt-6 flex flex-col gap-2">
                  {mainNavigation.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? "page" : undefined} className={cn("rounded-xl px-4 py-3 text-base font-medium", active(item.href) ? "bg-primary/5 text-primary" : "text-foreground hover:bg-muted")}>{item.label}</Link>)}
                  <Button asChild className="mt-4"><Link href={quoteHref} onClick={() => setOpen(false)}>Get a quote</Link></Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
