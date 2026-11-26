import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { featuredPortfolioItems } from "@/data/portfolio";

export function PortfolioSection() {
  return <section className="border-t py-14 sm:py-16 lg:py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 lg:mb-10">
        <div><p className="eyebrow mb-3">Made by AlmiraPrints</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">See the possibilities.</h2><p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">Real prints, made for real moments. Explore the work and imagine your own version.</p></div>
        <Link href="/portfolio" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">View the portfolio<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
      <PortfolioGallery items={featuredPortfolioItems.slice(0, 2)} />
    </div>
  </section>;
}
