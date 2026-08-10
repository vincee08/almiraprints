import { SectionHeader } from "@/components/ui/section-header";
import { ServiceCard } from "@/components/services/service-card";
import { featuredServices } from "@/data/services";

export function FeaturedServicesSection() {
  return (
    <section className="section-padding bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Popular Printing Solutions"
          description="Our most requested services designed to meet diverse printing needs"
          centered
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
