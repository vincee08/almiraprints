export interface Testimonial {
  /** Only publish statements explicitly approved by their customer. */
  approved?: boolean;
  id: string;
  name: string;
  service: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
}
