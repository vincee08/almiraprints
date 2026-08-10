import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/sections/hero";
import { StatsSection } from "@/components/sections/stats";
import { ServicesSection } from "@/components/sections/services";
import { FeaturedServicesSection } from "@/components/sections/featured-services";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { ProcessSection } from "@/components/sections/process";
import { PortfolioSection } from "@/components/sections/portfolio";
import { AboutSection } from "@/components/sections/about";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedServicesSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <PortfolioSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </MainLayout>
  );
}
