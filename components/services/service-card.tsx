import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/service";
import { serviceImage } from "@/lib/service-images";
import { categoryLabels } from "@/lib/catalog-ui";

export function ServiceCard({ service, featured }: { service: Service; featured?: boolean }) {
  const image = serviceImage(service.slug);
  return <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border bg-card shadow-[0_8px_30px_-22px_hsl(var(--foreground)/0.28)] transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-[0_20px_45px_-25px_hsl(var(--foreground)/0.32)]">
    <Link href={"/services/" + service.slug} className="group flex min-w-0 flex-1 flex-col sm:block">
      <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted sm:aspect-[4/3]">
        {image ? <Image src={image} alt={service.title + " examples"} fill className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 30vw" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"><FileImage className="h-8 w-8" aria-hidden="true" /><span className="text-xs">No product photo available</span></div>}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{featured ? "Featured · " : ""}{categoryLabels[service.category.slug] || service.category.name}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-primary">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
        {service.specifications?.length ? <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium">{service.specifications.slice(0, 2).map(spec => spec.value).join(" · ")}</p> : null}
      </div>
    </Link>
    <div className="mt-auto flex flex-wrap gap-2 border-t p-3">
      <Button asChild variant="ghost" className="flex-1"><Link href={"/services/" + service.slug}>Details<ArrowUpRight aria-hidden="true" /></Link></Button>
      <Button asChild variant="outline" className="flex-1"><Link href={"/quote?service=" + service.slug}>Get a quote</Link></Button>
    </div>
  </article>;
}
