"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, FileImage } from "lucide-react";
import { services } from "@/data/services";
import { serviceImage } from "@/lib/service-images";
import { hasDimensionGuide } from "@/lib/catalog-ui";
import type { QuoteFormValues } from "@/lib/validations";
import type { PortfolioItem } from "@/types/portfolio";

const placements: Record<string, string> = { front: "Front only", back: "Back only", both: "Front and back", sleeve: "Sleeve", custom: "Custom placement" };

export function RequestSummary({ values, filename, fileError, project, onRemoveProject }: { values: QuoteFormValues; filename?: string; fileError?: string; project?: PortfolioItem; onRemoveProject: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const service = services.find(item => item.title === values.specificService && item.category.name === values.serviceCategory);
  const image = project?.imageUrl || (service && serviceImage(service.slug));
  const quantity = /^[1-9]\d*$/.test(values.quantity) && Number(values.quantity) <= 1000000 ? values.quantity : "";
  const hasGuide = service && (hasDimensionGuide(service) || service.category.slug === "tshirt-printing" || service.specifications?.some(spec => spec.label === "Material"));
  const changeDescription = [service?.title || values.serviceCategory || "Choose a print", quantity ? quantity + " requested" : "Quantity to add", filename ? "Artwork: " + filename : "No artwork attached"].join(". ");

  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(changeDescription), 700);
    return () => window.clearTimeout(timer);
  }, [changeDescription]);

  const fields = [
    ["Category", values.serviceCategory || "Choose below"],
    ["Printing service", service?.title || "Choose below"],
    ["Quantity", quantity || (values.quantity ? "Check quantity below" : "Add below")],
    ["Size", values.size || "To discuss"],
    ["Material", values.material || "To discuss"],
    ["Preferred date", values.deadline || "To discuss"],
    ...(values.serviceCategory === "T-Shirt Printing" ? [
      ["Shirt sizes / quantities", values.tshirtSize || "To discuss"],
      ["Shirt colors", values.tshirtColor || "To discuss"],
      ["Print placement", placements[values.printLocation || ""] || "To discuss"],
    ] : []),
    ["Artwork", filename || (fileError ? "Not attached — check the artwork field" : "No file selected")],
  ];
  return <aside tabIndex={0} aria-labelledby="request-summary-heading" className="min-w-0 self-start rounded-2xl border bg-muted/40 p-4 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto">
    <div className="flex items-center justify-between gap-3"><h2 id="request-summary-heading" tabIndex={-1} className="text-lg font-semibold">Your request so far</h2><span className="rounded-full border bg-card px-2.5 py-1 text-xs font-medium">Draft</span></div>
    <p className="mt-2 break-words text-sm font-medium text-primary">{service?.title || values.serviceCategory || "Choose a print to get started"}{quantity ? " · " + quantity + " requested" : ""}</p>
    <button type="button" className="mt-2 flex min-h-11 w-full items-center justify-between gap-2 text-left text-sm font-semibold lg:hidden" aria-expanded={expanded} aria-controls="request-summary-details" onClick={() => setExpanded(!expanded)}>{expanded ? "Hide details" : "Review details"}<ChevronDown className={"h-4 w-4 " + (expanded ? "rotate-180" : "")} aria-hidden="true" /></button>
    <div id="request-summary-details" className={(expanded ? "block" : "hidden") + " lg:block"}>
      {image && <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl border bg-card"><Image src={image} alt={project ? "Reference project: " + project.title : (service?.title || "") + " example"} fill sizes="(max-width: 1023px) 85vw, 360px" className="object-contain p-2" /></div>}
      {project && <div className="mt-4 rounded-xl bg-primary/5 p-3"><div className="flex gap-2"><FileImage className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><p className="text-xs leading-relaxed"><strong className="block">Reference project</strong>{project.title}</p></div><button type="button" onClick={onRemoveProject} className="mt-1 min-h-11 text-xs font-semibold text-primary underline underline-offset-4">Remove reference project</button></div>}
      <dl className="mt-4 divide-y">{fields.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2.5 text-xs leading-relaxed sm:text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="min-w-0 break-words font-medium">{value}</dd></div>)}</dl>
      {values.additionalRequirements && <details className="mt-3 rounded-xl border bg-card p-3"><summary className="cursor-pointer text-sm font-medium">Project notes</summary><p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-muted-foreground">{values.additionalRequirements}</p></details>}
      {hasGuide && <Link href={"/services/" + service.slug + "#size-material-guide"} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold text-primary underline underline-offset-4">View product guide<span className="sr-only"> (opens a new tab)</span></Link>}
      <p className="mt-4 border-t pt-4 text-xs leading-relaxed text-muted-foreground">This is a live draft, not a price estimate or confirmed order. The shop will confirm options, pricing and timing.</p>
      <Link href="/faq" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold text-primary underline underline-offset-4">Artwork & ordering help<span className="sr-only"> (opens a new tab)</span></Link>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </aside>;
}
