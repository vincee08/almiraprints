import { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { portfolioItems } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore our recent printing projects and see the quality of our work across different categories.",
};

export default function PortfolioPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Portfolio"
            description="Explore examples of our printing projects across different categories"
            centered
          />
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>

          {/* Note about placeholder content */}
          <div className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Portfolio images are placeholders. Real project images can be added later to showcase actual work.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
