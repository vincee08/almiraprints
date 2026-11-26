"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { Button } from "@/components/ui/button";
import { portfolioItems, portfolioCategories } from "@/data/portfolio";

export default function PortfolioPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const items = selectedCategory === "All" ? portfolioItems : portfolioItems.filter(item => item.category === selectedCategory);
  return <MainLayout>
    <section className="page-intro">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader as="h1" title="A closer look at our prints." description="Real projects from AlmiraPrints. Explore a photo and use it as the starting point for your own idea." />
      </div>
    </section>
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {portfolioCategories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} onClick={() => setSelectedCategory(category)} aria-pressed={selectedCategory === category} size="sm">{category === "All" ? "All projects" : category}</Button>)}
        </div>
        <div className="my-6 flex flex-wrap items-end justify-between gap-2"><h2 className="text-xl font-semibold">{selectedCategory === "All" ? "Project photos" : selectedCategory}</h2><p role="status" className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? "project" : "projects"}</p></div>
        <PortfolioGallery key={selectedCategory} items={items} />
      </div>
    </section>
  </MainLayout>;
}
