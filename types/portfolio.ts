export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
}
