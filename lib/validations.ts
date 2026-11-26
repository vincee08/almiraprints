import { z } from "zod";
import { serviceCategories, services } from "@/data/services";

const name = z.string().trim().min(2, "Enter at least 2 characters.").max(100, "Use 100 characters or fewer.");
const email = z.string().trim().email("Enter a valid email address.").max(254);
const phone = z.string().trim().max(30).refine(
  value => /^[+\d\s()-]+$/.test(value) && value.replace(/\D/g, "").length >= 10 && value.replace(/\D/g, "").length <= 15,
  "Enter a valid phone number with 10–15 digits."
);
const category = z.string().refine(value => serviceCategories.some(item => item.name === value), "Choose a service category.");
const optionalText = (max = 200) => z.string().trim().max(max, `Use ${max} characters or fewer.`).optional();

export const contactFormSchema = z.object({
  fullName: name,
  email,
  phone,
  serviceType: z.string().refine(value => value === "General Inquiry" || serviceCategories.some(item => item.name === value), "Choose a service type."),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters).").max(2000, "Use 2,000 characters or fewer."),
});

export const quoteFormSchema = z.object({
  customerName: name,
  email,
  phone,
  serviceCategory: category,
  specificService: z.string().min(1, "Choose a printing service."),
  quantity: z.string().trim().regex(/^[1-9]\d*$/, "Enter a whole number greater than zero.").refine(value => Number(value) <= 1000000, "For more than 1,000,000 items, please contact us directly."),
  size: optionalText(),
  material: optionalText(),
  deadline: z.string().optional().refine(value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)), "Choose a valid date."),
  additionalRequirements: optionalText(2000),
  hasDesignFile: z.boolean(),
  tshirtSize: optionalText(),
  tshirtColor: optionalText(),
  printLocation: z.enum(["", "front", "back", "both", "sleeve", "custom"]).optional(),
}).superRefine((value, context) => {
  const service = services.find(item => item.title === value.specificService);
  if (!service || service.category.name !== value.serviceCategory) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["specificService"], message: "Choose a service in the selected category." });
  }
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
