import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceCategoryCard } from "@/components/services/service-category-card";
import { serviceCategories, services } from "@/data/services";

export function ServicesSection() {
  return (
    <section id="printing-categories" className="scroll-mt-20 py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3">Start with what you need</p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Find your kind of print.</h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">Explore a category, then choose the details that make it yours.</p>
          </div>
          <Link href="/services" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Browse all {services.length} services <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {serviceCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
