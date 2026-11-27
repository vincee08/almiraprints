import type { QuoteFormValues } from "@/lib/validations";

export function formatQuote(data: QuoteFormValues, filename?: string) {
  const fields = [
    ["Name", data.customerName], ["Email", data.email], ["Phone", data.phone],
    ["Category", data.serviceCategory], ["Service", data.specificService], ["Quantity", data.quantity],
    ["Size", data.size], ["Material", data.material], ["Preferred deadline", data.deadline],
    ...(data.serviceCategory === "T-Shirt Printing" ? [
      ["Shirt sizes / quantities", data.tshirtSize], ["Shirt colors", data.tshirtColor], ["Print location", data.printLocation],
    ] : []),
    ["Artwork", filename || "No file supplied"], ["Additional requirements", data.additionalRequirements],
  ];
  return fields.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join("\n");
}
