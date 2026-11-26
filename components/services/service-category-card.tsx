import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { categoryLabels } from "@/lib/catalog-ui";
import { serviceImage } from "@/lib/service-images";
import type { ServiceCategory } from "@/types/service";

export function ServiceCategoryCard({ category }: { category: ServiceCategory }) {
  const products = services.filter(service => service.category.id === category.id);
  const image = products.map(service => serviceImage(service.slug)).find(Boolean);
  return (
    <Link
      href={`/services?category=${category.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.4rem] border bg-card shadow-[0_8px_30px_-22px_hsl(var(--foreground)/0.28)] transition-[transform,box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-[0_20px_45px_-24px_hsl(var(--foreground)/0.32)] motion-safe:hover:-translate-y-1"
    >
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 31vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold leading-snug sm:text-xl">{categoryLabels[category.slug] || category.name}</h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.description}.</p>
        <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {products.length} {products.length === 1 ? "service" : "services"} to explore
        </p>
      </div>
    </Link>
  );
}
