import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  serviceType: z.string().min(1, "Please select a service type"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

export const quoteFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  serviceCategory: z.string().min(1, "Please select a service category"),
  specificService: z.string().min(1, "Please specify the service"),
  quantity: z.string().min(1, "Please specify the quantity"),
  size: z.string().optional(),
  material: z.string().optional(),
  deadline: z.string().optional(),
  additionalRequirements: z.string().max(1000).optional(),
  hasDesignFile: z.boolean(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
