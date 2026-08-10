import Link from "next/link";
import { ArrowRight, Printer, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  {SITE_CONFIG.tagline}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  {SITE_CONFIG.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-base">
                  <Link href="/services">
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                  <Link href="/quote">Request a Quote</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Printer className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Professional Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Fast Turnaround</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Palette className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Custom Solutions</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary rounded-3xl" />
                
                {/* Floating cards effect */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Card 1 */}
                    <div className="bg-background rounded-xl shadow-lg p-6 transform -rotate-6 hover:rotate-0 transition-transform">
                      <div className="h-20 bg-gradient-to-br from-primary to-primary/60 rounded-lg mb-3" />
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                    
                    {/* Card 2 */}
                    <div className="bg-background rounded-xl shadow-lg p-6 transform rotate-6 hover:rotate-0 transition-transform mt-8">
                      <div className="h-20 bg-gradient-to-br from-accent to-accent/60 rounded-lg mb-3" />
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-2/3" />
                        <div className="h-2 bg-muted rounded w-3/4" />
                      </div>
                    </div>
                    
                    {/* Card 3 */}
                    <div className="bg-background rounded-xl shadow-lg p-6 transform rotate-3 hover:rotate-0 transition-transform">
                      <div className="h-20 bg-gradient-to-br from-secondary to-muted rounded-lg mb-3" />
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-1/2" />
                        <div className="h-2 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                    
                    {/* Card 4 */}
                    <div className="bg-background rounded-xl shadow-lg p-6 transform -rotate-3 hover:rotate-0 transition-transform mt-4">
                      <div className="h-20 bg-gradient-to-br from-primary/40 to-accent/40 rounded-lg mb-3" />
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
