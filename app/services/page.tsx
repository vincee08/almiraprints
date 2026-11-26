import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { ServiceDiscovery } from "@/components/services/service-discovery";
import { serviceCategories } from "@/data/services";

export const metadata: Metadata = { title: "Printing Services", description: "Personalized gifts, party prints, T-shirts, calendars and signage from AlmiraPrints in Tagbina." };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ category?: string | string[]; q?: string | string[] }> }) {
  const query = await searchParams;
  const slug = typeof query.category === "string" ? query.category : undefined;
  const category = serviceCategories.find(item => item.slug === slug);
  const search = typeof query.q === "string" ? query.q.slice(0, 100) : "";
  return <MainLayout>
    <section className="border-b bg-muted/60 py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-3">Made around your idea</p>
        <SectionHeader as="h1" title="Find your next print." description="Browse real examples or search by product, use or material." />
      </div>
    </section>
    <ServiceDiscovery key={category?.slug || "all"} categorySlug={category?.slug} initialQuery={search} invalidCategory={Boolean(slug && !category)} />
  </MainLayout>;
}
