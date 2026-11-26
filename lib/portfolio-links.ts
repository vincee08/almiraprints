import type { PortfolioItem } from "@/types/portfolio";
import { portfolioCategorySlugs } from "@/lib/service-images";

/** Match only projects that identify a single existing catalog product. */
const projectServices: Record<string, string> = {
  "custom-tshirt-printing": "tshirt-printing-sublimation-dtf",
  "personalized-mug-printing": "personalized-mug",
  "personalized-keychains": "personalized-keychains",
  "custom-shot-glasses": "personalized-shot-glass",
  "sintra-board-signage": "sintra-board",
  "refrigerator-magnets": "personalized-ref-magnet",
  "tracing-writing-pads": "personalized-tracing-writing-pad",
};

export function similarRequestHref(item: PortfolioItem) {
  const params = new URLSearchParams();
  const service = projectServices[item.slug];
  if (service) params.set("service", service);
  else if (portfolioCategorySlugs[item.category]) params.set("category", portfolioCategorySlugs[item.category]);
  params.set("project", item.slug);
  return "/quote?" + params.toString();
}
