export interface Service {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  icon: string;
  featured?: boolean;
  details?: string;
  benefits?: string[];
  specifications?: ServiceSpecification[];
  priceStarting?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface ServiceSpecification {
  label: string;
  value: string;
}
