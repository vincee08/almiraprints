import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/data/services";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const IconComponent = (Icons[service.icon as keyof typeof Icons] || Icons.FileText) as LucideIcon;
  
  // Get related services from the same category
  const relatedServices = services
    .filter((s) => s.category.id === service.category.id && s.id !== service.id)
    .slice(0, 3);

  return (
    <MainLayout>
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>

      {/* Service Header */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary text-primary-foreground">
                <IconComponent className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-2">
                  {service.category.name}
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  {service.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>

            {service.priceStarting && (
              <p className="text-lg font-semibold text-primary">
                {service.priceStarting}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {service.details && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.details}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {service.benefits && service.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {service.specifications && service.specifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        {service.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between py-2 border-b last:border-0">
                            <dt className="font-medium">{spec.label}</dt>
                            <dd className="text-muted-foreground">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>
                      Request a quote for this service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/quote">Request Quote</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Our team is ready to assist you with your printing needs. Contact us for:
                    </p>
                    <ul className="space-y-2 ml-4 list-disc">
                      <li>Custom requirements</li>
                      <li>Bulk order pricing</li>
                      <li>Design assistance</li>
                      <li>Technical specifications</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <>
          <Separator />
          <section className="section-padding">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                Related Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((relatedService) => (
                  <ServiceCard key={relatedService.id} service={relatedService} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </MainLayout>
  );
}
