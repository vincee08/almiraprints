import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { QuoteForm } from "@/components/forms/quote-form";
import { quoteIsConfigured } from "@/lib/server/quote-service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Request a Quote", description: "Tell AlmiraPrints about your personalized printing project, quantity, artwork and preferred date." };

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ service?: string | string[]; category?: string | string[]; project?: string | string[] }> }) {
  const query = await searchParams;
  const service = typeof query.service === "string" ? query.service : undefined;
  const category = typeof query.category === "string" ? query.category : undefined;
  const project = typeof query.project === "string" ? query.project : undefined;
  return <MainLayout>
    <section className="page-intro">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-3">Let’s bring it to life</p>
        <SectionHeader as="h1" title="A quote, made for you" description="Choose your print and add the details you know. Your request summary updates as you go." />
      </div>
    </section>
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <QuoteForm key={[service, category, project].join(":")} initialServiceSlug={service} initialCategorySlug={category} initialProjectSlug={project} deliveryAvailable={quoteIsConfigured()} />
      </div>
    </section>
  </MainLayout>;
}
