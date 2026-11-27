import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/navigation";
import { contactIsConfigured } from "@/lib/server/inquiry-handler";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact AlmiraPrints", description: "Contact AlmiraPrints in Tagbina, Surigao del Sur to discuss printing, gifts, artwork and project details." };

export default function ContactPage() {
  const address = encodeURIComponent(contactInfo.address + ", Philippines");
  return (
    <MainLayout>
      <section className="page-intro">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-3 text-center">A good print starts with a conversation</p>
          <SectionHeader as="h1" title="Let’s talk about your idea" description="A question, a custom request or a project to discuss. Here is how to reach AlmiraPrints." centered />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={"tel:" + contactInfo.phone.replace(/\D/g, "")}><Phone aria-hidden="true" />Call the shop</a></Button>
            <Button asChild variant="outline"><a href={"mailto:" + contactInfo.email}><Mail aria-hidden="true" />Email us</a></Button>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto grid items-start gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] lg:px-8">
          <ContactForm storageAvailable={contactIsConfigured()} />
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-xl font-semibold">Find us in Tagbina</h2>
              <div className="mt-5 flex gap-3 text-sm leading-relaxed"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><p>{contactInfo.address}</p></div>
              <a href={"https://www.google.com/maps/search/?api=1&query=" + address} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4">Open directions<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span></a>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Contact us before visiting to confirm availability and collection arrangements.</p>
            </div>
            <div className="rounded-2xl border bg-muted/50 p-6">
              <h2 className="text-xl font-semibold">Keep in touch</h2>
              <div className="mt-4 space-y-1">
                {[contactInfo.phone, contactInfo.phoneSecondary].map(phone => <a key={phone} className="flex min-h-11 items-center gap-3 text-sm font-medium text-primary" href={"tel:" + phone.replace(/\D/g, "")}><Phone className="h-4 w-4" aria-hidden="true" />{phone}</a>)}
                <a href={"mailto:" + contactInfo.email} className="flex min-h-11 items-center gap-3 break-all text-sm font-medium text-primary"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{contactInfo.email}</a>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-6"><h2 className="text-xl font-semibold">Planning a print?</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Use the quote form for product, quantity and artwork details.</p><Link href="/quote" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">Prepare a quote request</Link></div>
          </aside>
        </div>
      </section>
      <section className="container mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <details className="rounded-2xl border bg-muted/40 p-5">
          <summary className="cursor-pointer font-semibold text-primary">Show location map</summary>
          <p className="mb-4 mt-3 text-sm text-muted-foreground">Map search for {contactInfo.address}. Use Open directions above for your map app.</p>
          <iframe src={"https://maps.google.com/maps?q=" + address + "&t=&z=15&ie=UTF8&iwloc=&output=embed"} title="Map search for the AlmiraPrints address in Tagbina" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full rounded-xl border-0 sm:h-96" />
        </details>
      </section>
    </MainLayout>
  );
}
