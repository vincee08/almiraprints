import { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceCategoryCard } from "@/components/services/service-category-card";
import { Separator } from "@/components/ui/separator";
import { services, serviceCategories } from "@/data/services";

export const metadata: Metadata = {
  title: "Printing Services",
  description: "Explore our comprehensive range of printing and advertising services for businesses, events, and personal projects.",
};

export default function ServicesPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Services"
            description="Professional printing solutions designed for businesses, organizations, events, and individuals"
            centered
          />
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Service Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <ServiceCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* All Services by Category */}
      {serviceCategories.map((category) => {
        const categoryServices = services.filter(
          (service) => service.category.id === category.id
        );

        return (
          <section key={category.id} className="section-padding">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {category.name}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </MainLayout>
  );
}
