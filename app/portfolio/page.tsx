import { Metadata } from "next";
import PortfolioPageContent from "./portfolio-content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore our printing projects showcasing custom designs, personalized products, and professional print solutions across different categories.",
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
