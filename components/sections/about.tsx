import Link from "next/link";
import { ArrowRight, Target, Eye, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section className="section-padding bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                About Your Printing Business
              </h2>
              <p className="text-lg text-muted-foreground">
                Your Printing Business is a professional printing and advertising service provider focused on delivering quality print solutions for businesses, organizations, events, and individuals.
              </p>
            </div>

            <p className="text-muted-foreground">
              With a commitment to quality, creativity, and customer satisfaction, we provide comprehensive printing services that help our clients communicate their message effectively and make a lasting impression.
            </p>

            <Button asChild size="lg">
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Right Content - Values */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>
                  Delivering exceptional printing solutions that exceed expectations and help our clients succeed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Our Vision</CardTitle>
                <CardDescription>
                  To be the trusted printing partner known for quality, innovation, and reliable service.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Values</CardTitle>
                <CardDescription>
                  Quality, Creativity, Reliability, Customer Focus, and Innovation guide everything we do.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
