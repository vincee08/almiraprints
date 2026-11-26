import { services } from "@/data/services";
import type { Service } from "@/types/service";

/** Short navigation labels; the catalog remains the source of product information. */
export const categoryLabels: Record<string, string> = {
  "party-event": "Party & events", "signage-display": "Signs & displays",
  "tshirt-printing": "T-shirts", "gifts-souvenirs": "Gifts & souvenirs",
  "calendar-printing": "Calendars", "personalized-products": "Personalized products",
};

const normalize = (text: string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[–—/-]/g, " ");

export function filterServices(categorySlug: string | undefined, query: string) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return services.filter(service => {
    if (categorySlug && service.category.slug !== categorySlug) return false;
    const text = normalize([
      service.title, service.slug, service.category.name, service.category.slug,
      service.description, ...(service.applications || []), ...(service.customizationOptions || []),
      ...(service.specifications?.map(spec => spec.value) || []),
    ].join(" "));
    return words.every(word => text.includes(word));
  });
}

export function servicesHref(category?: string, query = "") {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query.trim()) params.set("q", query.trim());
  return "/services" + (params.size ? "?" + params.toString() : "");
}

export function hasDimensionGuide(service: Service) {
  return service.customizationOptions?.includes("Size") && service.customizationOptions.includes("Orientation");
}
