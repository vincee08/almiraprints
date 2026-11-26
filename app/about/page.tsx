import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Palette, MapPin, MessageCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = { title: "About AlmiraPrints", description: "Meet AlmiraPrints, your personalized printing shop in Tagbina, Surigao del Sur." };

export default function AboutPage() {
  const values = [
    { icon: Palette, title: "Personal touches", text: "Names, themes, colors and artwork that make a print feel like yours." },
    { icon: MessageCircle, title: "A conversation first", text: "Discuss the details, available options and timing before your project goes into production." },
    { icon: Heart, title: "Care in the details", text: "From a thoughtful gift to an event full of matching pieces, the little details matter." },
  ];
  return (
    <MainLayout>
      <section className="page-intro">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-3 text-center">A little about us</p>
          <SectionHeader as="h1" title="Personal ideas. Local printing." description="AlmiraPrints creates personalized prints for gifts, celebrations, schools, organizations and businesses." centered />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold">Made around your idea</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">Based in Tagbina, Surigao del Sur, AlmiraPrints offers party and event prints, custom shirts, gifts and souvenirs, calendars, personalized products and signage.</p>
            <p className="leading-relaxed text-muted-foreground">Start with a product or a reference. Share the names, theme, quantity and date you have in mind, and we can discuss the options for your project.</p>
            <div className="flex flex-wrap gap-3"><Button asChild><Link href="/services">Explore our printing</Link></Button><Button asChild variant="outline"><Link href="/contact">Talk to the shop</Link></Button></div>
          </div>
          <div className="space-y-4">{values.map(value => <div key={value.title} className="flex gap-4 rounded-2xl border bg-card p-5">
            <value.icon className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="text-lg font-semibold">{value.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p></div>
          </div>)}</div>
        </div>
      </section>
      <section className="section-padding border-t bg-muted/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <MapPin className="mx-auto mb-4 h-6 w-6 text-primary" aria-hidden="true" /><h2 className="text-3xl font-semibold">Find us in Tagbina</h2>
            <p className="mt-3 text-muted-foreground">{COMPANY_INFO.address}</p>
            <p className="mt-2 text-sm text-muted-foreground">Contact us before visiting to confirm availability and arrangements for your project.</p>
            <Button asChild variant="outline" className="mt-6"><Link href="/contact">Contact and directions</Link></Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
