"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { Button } from "@/components/ui/button";
import { portfolioItems, portfolioCategories } from "@/data/portfolio";

export default function PortfolioPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-muted to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Portfolio"
            description="Explore our printing projects showcasing custom designs, personalized products, and professional print solutions"
            centered
          />
        </div>
      </section>

      {/* Category Filter */}
      <section className="pt-12 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {portfolioCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No projects found in this category.
              </p>
              <Button variant="outline" onClick={() => setSelectedCategory("All")}>
                View All Projects
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-muted-foreground">
              Let's bring your ideas to life with our professional printing services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="/quote">Request a Quote</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
