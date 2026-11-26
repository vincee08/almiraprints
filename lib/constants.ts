import { serviceCategories, services } from "@/data/services";

export const SITE_CONFIG = {
  name: "AlmiraPrints",
  tagline: "Made personal. Printed with care.",
  description: "Personalized gifts, party prints, custom shirts, calendars and signage from AlmiraPrints in Tagbina, Surigao del Sur.",
  url: "https://almiraprints.com",
  ogImage: "/almiraprints-logo.png",
  links: {
    facebook: "https://www.facebook.com/jeraldine.paquinol",
    instagram: "https://www.instagram.com/jeraldinepaquinol",
  },
};

export const COMPANY_INFO = {
  legalName: "AlmiraPrints",
  address: "Purok 2, Quezon, Tagbina, Surigao del Sur",
  city: "Tagbina",
  state: "Surigao del Sur",
  zipCode: "",
  country: "Philippines",
  phone: "0992-310-2867",
  phoneSecondary: "0951-869-5624",
  email: "almira.ggp@gmail.com",
};

export const STATS = [
  {
    label: "Service Categories",
    value: String(serviceCategories.length),
  },
  {
    label: "Printing Services",
    value: String(services.length),
  },
  {
    label: "Based in Surigao del Sur",
    value: "Tagbina",
  },
  {
    label: "Made Around Your Idea",
    value: "Custom",
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "High-Quality Output",
    description: "Professional printing solutions designed for clear, vibrant, and consistent results.",
    icon: "CheckCircle2",
  },
  {
    title: "Project Planning",
    description: "Discuss your preferred date and confirm the production schedule before ordering.",
    icon: "Clock",
  },
  {
    title: "Custom Solutions",
    description: "Printing options that can be adapted to different business and personal requirements.",
    icon: "Settings",
  },
  {
    title: "Professional Support",
    description: "Assistance from project inquiry through final production.",
    icon: "Headphones",
  },
  {
    title: "Flexible Options",
    description: "Solutions suitable for businesses, events, organizations, and personal projects.",
    icon: "Sliders",
  },
  {
    title: "Reliable Service",
    description: "Clear communication and dependable project handling.",
    icon: "Shield",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Submit Your Request",
    description: "Tell us what you need through our online form or contact us directly.",
  },
  {
    step: "02",
    title: "Discuss Your Project",
    description: "Review specifications, quantity, size, materials, and requirements with our team.",
  },
  {
    step: "03",
    title: "Production",
    description: "Your project moves into the printing and production process with quality checks.",
  },
  {
    step: "04",
    title: "Collection / Delivery",
    description: "Confirm collection or delivery arrangements, timing and any fees with the shop.",
  },
];
