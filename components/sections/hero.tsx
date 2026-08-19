import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Printer, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
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

            {/* Right Visual - Featured Projects Gallery */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-3xl" />
                
                {/* Featured Images Grid */}
                <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                    {/* Image 1 - T-Shirt Printing */}
                    <div className="relative aspect-square bg-background rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                      <Image
                        src="/featured/tshirt-printing.jpg"
                        alt="Custom T-shirt printing project"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 20vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Image 2 - Personalized Mugs */}
                    <div className="relative aspect-square bg-background rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105 hover:shadow-xl group mt-4 sm:mt-6">
                      <Image
                        src="/featured/personalized-mugs.jpg"
                        alt="Personalized mug printing project"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Image 3 - Keychains */}
                    <div className="relative aspect-square bg-background rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105 hover:shadow-xl group -mt-2">
                      <Image
                        src="/featured/keychains.jpg"
                        alt="Personalized keychain printing project"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Image 4 - Tracing & Writing Pads */}
                    <div className="relative aspect-square bg-background rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transform -rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105 hover:shadow-xl group mt-2 sm:mt-4">
                      <Image
                        src="/featured/tracing&writing-pads.jpg"
                        alt="Custom tracing and writing pads project"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
