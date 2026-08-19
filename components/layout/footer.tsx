import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG, COMPANY_INFO } from "@/lib/constants";
import { mainNavigation, socialLinks, contactInfo } from "@/data/navigation";
import { serviceCategories } from "@/data/services";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
      case "messenger":
        return <MessageCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/almiraprints-logo.png"
                  alt="AlmiraPrints"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="font-bold text-lg">AlmiraPrints</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {SITE_CONFIG.description}
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Visit Almira Prints on ${link.platform}`}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Services</h3>
              <ul className="space-y-3">
                {serviceCategories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/services?category=${category.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address + ", Philippines")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {contactInfo.address}
                  </a>
                </li>
                <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <a
                      href={`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                      className="hover:text-primary transition-colors block"
                    >
                      {contactInfo.phone}
                    </a>
                    <a
                      href={`tel:${contactInfo.phoneSecondary.replace(/[^0-9]/g, '')}`}
                      className="hover:text-primary transition-colors block"
                    >
                      {contactInfo.phoneSecondary}
                    </a>
                  </div>
                </li>
                <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} AlmiraPrints. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/quote"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
