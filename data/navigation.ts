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
    url: "#",
    icon: "Facebook",
  },
  {
    platform: "Instagram",
    url: "#",
    icon: "Instagram",
  },
  {
    platform: "Messenger",
    url: "#",
    icon: "MessageCircle",
  },
];

export const contactInfo = {
  address: "Your Business Address",
  phone: "+63 XXX XXX XXXX",
  email: "contact@example.com",
  hours: "Monday - Saturday: 8:00 AM - 6:00 PM",
};
