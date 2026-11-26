import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="hero-surface overflow-hidden border-b">
      <div className="container mx-auto grid items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Your local print studio in Tagbina
          </p>
          <h1 className="mt-6 max-w-2xl text-[clamp(3rem,7vw,5.75rem)] font-bold leading-[1.02] tracking-[-0.055em]">
            Your idea,{" "}<br />
            <span className="text-primary">beautifully printed.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            From party favors and custom shirts to gifts, calendars, and signs, we make the details feel like yours.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="#printing-categories">Explore printing services <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/quote">Request a custom quote <ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Have a reference photo or a rough idea? That is enough to get started.
          </p>
        </div>

        <Link href="/portfolio" className="group relative block min-w-0 rounded-[1.75rem] border border-border/80 bg-card p-2 shadow-[0_24px_70px_-35px_hsl(var(--foreground)/0.35)] transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-muted">
            <Image
              src="/projects/gable-box-loot-bag-party-hat.jpg"
              alt="Examples of AlmiraPrints personalized party boxes, loot bags, and party hats"
              fill
              priority
              sizes="(max-width: 1023px) 94vw, 44vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
            <div>
              <p className="eyebrow text-[0.65rem]">Real work, real celebrations</p>
              <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">See what we can make together</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
