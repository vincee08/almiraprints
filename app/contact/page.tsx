import { Metadata } from "next";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with AlmiraPrints in Tagbina, Surigao del Sur for inquiries, quotations, or support. We're here to help with your printing needs.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Contact Us"
            description="We'd love to hear from you. Get in touch with our team."
            centered
          />
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Address</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address + ", Philippines")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contactInfo.address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Phone</p>
                      <div className="space-y-1">
                        <a
                          href={`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {contactInfo.phone}
                        </a>
                        <a
                          href={`tel:${contactInfo.phoneSecondary.replace(/[^0-9]/g, '')}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {contactInfo.phoneSecondary}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Email Almira Prints"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Need a quote? Use our{" "}
                    <a href="/quote" className="text-primary hover:underline font-medium">
                      quote request form
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Have questions? Check our{" "}
                    <a href="/faq" className="text-primary hover:underline font-medium">
                      FAQ page
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Browse our{" "}
                    <a href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                      services
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Our Location</h2>
            <p className="text-muted-foreground mb-4">
              Visit us at {contactInfo.address}
            </p>
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address + ", Philippines")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </a>
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border bg-background">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address + ", Philippines")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map showing the location of Almira Prints in Purok 2, Quezon, Tagbina, Surigao del Sur"
              className="w-full h-[300px] sm:h-[400px] lg:h-[450px]"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
