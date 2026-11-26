import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/data/services";
import { serviceImage } from "@/lib/service-images";
import { ServiceGuide } from "@/components/services/service-guide";

interface ServicePageProps { params: Promise<{ slug: string }> }
export async function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find(item => item.slug === slug);
  return { title: service?.title || "Service not found", description: service?.description };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find(item => item.slug === slug);
  if (!service) notFound();
  const image = serviceImage(slug);
  const quoteHref = "/quote?service=" + service.slug;
  const related = services.filter(item => item.category.id === service.category.id && item.id !== service.id).slice(0, 3);
  return (
    <MainLayout>
      <section className="border-b bg-muted/50">
        <div className="container mx-auto px-4 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8">
          <Link href={"/services?category=" + service.category.slug} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to {service.category.name}</Link>
          <div className={"grid items-center gap-8 " + (image ? "lg:grid-cols-2 lg:gap-12" : "max-w-3xl")}>
            <div className="min-w-0">
              <Badge variant="outline" className="mb-4 bg-card">{service.category.name}</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{service.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{service.description}</p>
              {service.priceStarting && <p className="mt-4 font-semibold text-primary">{service.priceStarting}</p>}
              <div className="mt-6 flex flex-wrap gap-3"><Button asChild size="lg"><Link href={quoteHref}>Get a quote<ArrowUpRight aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/contact">Ask a question</Link></Button></div>
              <p className="mt-3 text-xs text-muted-foreground">Pricing and production time confirmed for your project.</p>
            </div>
            {image && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card p-3 shadow-sm"><Image src={image} alt={service.title + " printing examples"} fill priority sizes="(max-width: 1023px) 90vw, 45vw" className="object-contain p-3" /></div>}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto grid items-start gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] lg:px-8">
          <div className="min-w-0 space-y-8">
            <ServiceGuide service={service} />
            {service.details && <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-2xl font-semibold">About this print</h2><p className="mt-4 leading-relaxed text-muted-foreground">{service.details}</p></section>}
            {Boolean(service.customizationOptions?.length) && <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-2xl font-semibold">Make it yours</h2><p className="mt-2 text-sm text-muted-foreground">Tell us which details you would like to personalize.</p><div className="mt-5 flex flex-wrap gap-2">{service.customizationOptions?.map(option => <Badge key={option} variant="secondary" className="px-3 py-2 text-sm font-normal">{option}</Badge>)}</div></section>}
            {Boolean(service.specifications?.length) && <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-2xl font-semibold">Specifications</h2><dl className="mt-4 divide-y">{service.specifications?.map(spec => <div key={spec.label} className="grid grid-cols-2 gap-4 py-3 text-sm"><dt className="font-medium">{spec.label}</dt><dd className="break-words text-muted-foreground">{spec.value}</dd></div>)}</dl></section>}
            {Boolean(service.benefits?.length) && <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="text-2xl font-semibold">Print details</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{service.benefits?.map(benefit => <li key={benefit} className="flex gap-3 text-sm leading-relaxed"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{benefit}</li>)}</ul></section>}
            {Boolean(service.applications?.length) && <section><h2 className="text-2xl font-semibold">Ideas for your next occasion</h2><div className="mt-4 flex flex-wrap gap-2">{service.applications?.map(application => <Badge key={application} variant="outline" className="px-3 py-2 text-sm font-normal">{application}</Badge>)}</div></section>}
          </div>
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-2xl border bg-primary/5 p-6">
              <h2 className="text-xl font-semibold">Let’s plan your project</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A few details help us put together your quote:</p>
              <ul className="my-5 space-y-3 text-sm">{["Quantity and size", "Names, theme or artwork", "Your preferred date"].map(text => <li key={text} className="flex gap-2"><Check className="h-4 w-4 text-primary" aria-hidden="true" />{text}</li>)}</ul>
              <Button asChild className="w-full"><Link href={quoteHref}>Prepare my quote</Link></Button>
            </div>
            <div className="rounded-2xl border bg-card p-6"><h2 className="text-xl font-semibold">From idea to print</h2><ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground"><li>1. Share your requirements.</li><li>2. Confirm options, pricing and artwork.</li><li>3. Agree on production timing.</li><li>4. Confirm collection or delivery.</li></ol></div>
          </aside>
        </div>
      </section>
      {related.length > 0 && <section className="section-padding border-t bg-muted/40"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><h2 className="mb-6 text-3xl font-semibold">More in this category</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map(item => <ServiceCard key={item.id} service={item} />)}</div></div></section>}
    </MainLayout>
  );
}
