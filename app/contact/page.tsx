import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactInfo } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for inquiries, quotations, or support. We're here to help with your printing needs.",
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
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.hours}
                      </p>
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
                    <a href="/services" className="text-primary hover:underline font-medium">
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

      {/* Map Placeholder */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden bg-muted h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Map integration can be added here
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
