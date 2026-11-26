import { PortfolioGallery } from "./portfolio-gallery";
import type { PortfolioItem } from "@/types/portfolio";

/** Single-project compatibility wrapper around the shared gallery. */
export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return <PortfolioGallery items={[item]} />;
}
