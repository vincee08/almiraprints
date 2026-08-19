import { PortfolioItem } from "@/types/portfolio";

export const portfolioItems: PortfolioItem[] = [
  {
    id: "project-01",
    title: "Custom T-Shirt Printing",
    slug: "custom-tshirt-printing",
    category: "T-Shirt Printing",
    description: "High-quality custom t-shirt printing using professional sublimation and DTF techniques for personalized designs.",
    imageUrl: "/projects/tshirt-printing.jpg",
    tags: ["T-Shirt", "Custom Printing", "Apparel"],
  },
  {
    id: "project-02",
    title: "Personalized Mug Printing",
    slug: "personalized-mug-printing",
    category: "Personalized Gifts",
    description: "Custom printed mugs featuring personalized designs, perfect for gifts, events, and promotional use.",
    imageUrl: "/projects/personalized-mugs.jpg",
    tags: ["Mugs", "Personalized", "Gifts"],
  },
  {
    id: "project-03",
    title: "Party Essentials Package",
    slug: "party-essentials-package",
    category: "Party & Event Printing",
    description: "Complete party package including personalized gable boxes, loot bags, and party hats for special occasions.",
    imageUrl: "/projects/gable-box-loot-bag-party-hat.jpg",
    tags: ["Party", "Events", "Giveaways"],
  },
  {
    id: "project-04",
    title: "Personalized Keychains",
    slug: "personalized-keychains",
    category: "Personalized Gifts",
    description: "Custom keychains with personalized designs, ideal for souvenirs, giveaways, and promotional items.",
    imageUrl: "/projects/keychains.jpg",
    tags: ["Keychains", "Souvenirs", "Personalized"],
  },
  {
    id: "project-05",
    title: "Wall & Commercial Calendars",
    slug: "wall-commercial-calendars",
    category: "Calendar Printing",
    description: "Professional wall and commercial calendar printing for businesses, homes, and promotional purposes.",
    imageUrl: "/projects/wall&commercial-calendar.jpg",
    tags: ["Calendars", "Business", "Promotional"],
  },
  {
    id: "project-06",
    title: "Custom Shot Glasses",
    slug: "custom-shot-glasses",
    category: "Personalized Gifts",
    description: "Personalized shot glasses with custom designs, perfect for events, celebrations, and souvenirs.",
    imageUrl: "/projects/shot-glass.jpg",
    tags: ["Shot Glass", "Events", "Souvenirs"],
  },
  {
    id: "project-07",
    title: "Sintra Board Signage",
    slug: "sintra-board-signage",
    category: "Signage & Display",
    description: "Professional sintra board printing for durable indoor and outdoor signage and displays.",
    imageUrl: "/projects/sintra-board.jpg",
    tags: ["Signage", "Display", "Business"],
  },
  {
    id: "project-08",
    title: "Personalized Party Favors Set",
    slug: "personalized-party-favors-set",
    category: "Party & Event Printing",
    description: "Creative party favor set including coloring books, chocolate dome toppers, candles, and custom pin badges.",
    imageUrl: "/projects/coloring-book-choco-dome-candle-pin-badge.jpg",
    tags: ["Party Favors", "Events", "Custom"],
  },
  {
    id: "project-09",
    title: "Refrigerator Magnets",
    slug: "refrigerator-magnets",
    category: "Personalized Products",
    description: "Custom refrigerator magnets with personalized designs for promotional use, souvenirs, and gifts.",
    imageUrl: "/projects/ref-magnets.jpg",
    tags: ["Magnets", "Promotional", "Souvenirs"],
  },
  {
    id: "project-10",
    title: "Tracing & Writing Pads",
    slug: "tracing-writing-pads",
    category: "Personalized Products",
    description: "Custom printed tracing and writing pads for educational, promotional, and creative use.",
    imageUrl: "/projects/tracing&writing-pads.jpg",
    tags: ["Writing Pads", "Educational", "Custom"],
  },
];

// Featured portfolio items for homepage
export const featuredPortfolioItems = portfolioItems.filter((item) =>
  ["project-01", "project-02", "project-03", "project-04", "project-05", "project-07"].includes(item.id)
);

// Portfolio categories for filtering
export const portfolioCategories = [
  "All",
  "T-Shirt Printing",
  "Personalized Gifts",
  "Party & Event Printing",
  "Calendar Printing",
  "Signage & Display",
  "Personalized Products",
];
