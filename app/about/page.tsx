import { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, Award, Heart, Lightbulb, Shield } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our printing business, our mission, vision, and the values that guide our work.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Quality",
      description: "We never compromise on the quality of our printing output and materials.",
    },
    {
      icon: Lightbulb,
      title: "Creativity",
      description: "We bring innovative solutions to meet unique printing requirements.",
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Consistent delivery and dependable service you can count on.",
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Your satisfaction and success are at the center of everything we do.",
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="About Us"
            description="Dedicated to delivering exceptional printing solutions"
            centered
          />
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your Printing Business is a professional printing and advertising service provider focused on delivering quality print solutions for businesses, organizations, events, and individuals.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                With a commitment to quality, creativity, and customer satisfaction, we provide comprehensive printing services that help our clients communicate their message effectively and make a lasting impression.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                From business cards and brochures to large format printing and custom merchandise, we handle projects of all sizes with the same level of care and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  To deliver exceptional printing solutions that exceed expectations and help our clients succeed in their business, events, and personal endeavors through quality, innovation, and reliable service.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  To be the trusted printing partner known for quality, innovation, and reliable service, recognized for helping clients bring their ideas to life through professional print solutions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and relationships with clients
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Work With Us</h2>
            <p className="text-lg text-muted-foreground">
              Ready to bring your printing project to life? Get in touch with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/quote">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
