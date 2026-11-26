export const quoteStatuses = ["new", "in_progress", "completed", "cancelled"] as const;
export type QuoteStatus = typeof quoteStatuses[number];
export type StaffQuote = {
  id: string; reference: string; customer_name: string; email: string; phone: string;
  service_category: string; specific_service: string; quantity: number; size: string | null;
  material: string | null; deadline: string | null; additional_requirements: string | null;
  tshirt_size: string | null; tshirt_color: string | null; print_location: string | null;
  artwork_name: string | null; artwork_size: number | null; status: QuoteStatus;
  notification_state: "pending" | "sending" | "sent" | "failed" | "uncertain";
  notification_error: string | null; notification_attempts: number;
  submitted_at: string; updated_at: string;
};
export const staffQuoteColumns = "id,reference,customer_name,email,phone,service_category,specific_service,quantity,size,material,deadline,additional_requirements,tshirt_size,tshirt_color,print_location,artwork_name,artwork_size,status,notification_state,notification_error,notification_attempts,submitted_at,updated_at";
export const statusLabel = (status: QuoteStatus) => ({ new: "New", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" })[status];
