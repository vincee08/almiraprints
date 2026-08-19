import { NavItem, SocialLink } from "@/types/navigation";

export const mainNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
    description: "Explore our printing solutions",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    description: "View our recent projects",
  },
  {
    label: "About",
    href: "/about",
    description: "Learn about our company",
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Frequently asked questions",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with us",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/jeraldine.paquinol",
    icon: "Facebook",
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/jeraldinepaquinol",
    icon: "Instagram",
  },
  {
    platform: "Messenger",
    url: "https://www.facebook.com/jeraldine.paquinol",
    icon: "MessageCircle",
  },
];

export const contactInfo = {
  address: "Purok 2, Quezon, Tagbina, Surigao del Sur",
  phone: "0992-310-2867",
  phoneSecondary: "0951-869-5624",
  email: "almira.ggp@gmail.com",
};
