export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export interface QuoteFormData {
  customerName: string;
  email: string;
  phone: string;
  serviceCategory: string;
  specificService: string;
  quantity: string;
  size?: string;
  material?: string;
  deadline?: string;
  additionalRequirements?: string;
  hasDesignFile: boolean;
  designFile?: File;
}
