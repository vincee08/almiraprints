import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { FileText, CheckCircle2, MessageCircle, Truck } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { QuoteForm } from "@/components/forms/quote-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a customized quotation for your printing project. Provide your requirements and we'll send you a detailed quote.",
};

export default function QuotePage() {
  const steps = [
    {
      icon: FileText,
      title: "Submit Details",
      description: "Fill out the form with your project requirements",
    },
    {
      icon: CheckCircle2,
      title: "Review",
      description: "Our team reviews your specifications",
    },
    {
      icon: MessageCircle,
      title: "Receive Quote",
      description: "Get a detailed quotation via email",
    },
    {
      icon: Truck,
      title: "Production",
      description: "Approve and we'll start your project",
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Request a Quote"
            description="Tell us about your printing project and we'll send you a customized quotation"
            centered
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-3">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Suspense fallback={
                <Card>
                  <CardContent className="py-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </CardContent>
                </Card>
              }>
                <QuoteForm />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>Receive your quote within 24-48 hours</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>No obligation - request is completely free</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>Detailed pricing breakdown included</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>Design assistance available if needed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Requirements</CardTitle>
                  <CardDescription>
                    For best results, please provide:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• High-resolution files (300 DPI minimum)</p>
                  <p>• PDF format preferred</p>
                  <p>• Colors in CMYK mode</p>
                  <p>• Fonts embedded or outlined</p>
                  <p>• Bleed area included if applicable</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Not sure what you need? Contact us and we'll help you determine the best solution.
                  </p>
                  <Link
                    href="/contact"
                    className="text-primary hover:underline font-medium inline-block"
                  >
                    Contact Our Team →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
