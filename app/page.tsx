import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { ProcessSection } from "@/components/sections/process";
import { PortfolioSection } from "@/components/sections/portfolio";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ClosingCtaSection } from "@/components/sections/closing-cta";

export default function HomePage() {
  return <MainLayout>
    <HeroSection />
    <ServicesSection />
    <PortfolioSection />
    <ProcessSection />
    <TestimonialsSection />
    <ClosingCtaSection />
  </MainLayout>;
}
