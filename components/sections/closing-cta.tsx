import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ClosingCtaSection() {
  return (
    <section className="bg-primary py-14 text-primary-foreground sm:py-16 lg:py-20">
      <div className="container mx-auto flex flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/80">Ready when you are</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Let’s make your idea real.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/90">Tell us what you have in mind. We’ll help you work through the print, artwork, and details.</p>
        </div>
        <Link href="/quote" className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-base font-semibold text-primary shadow-sm transition-[background-color,transform] hover:bg-secondary motion-safe:hover:-translate-y-0.5">
          Request a quote <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
