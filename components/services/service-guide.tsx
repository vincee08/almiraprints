import { MoveHorizontal, MoveVertical, Layers, Square, Sparkles, Shirt } from "lucide-react";
import { services } from "@/data/services";
import { hasDimensionGuide } from "@/lib/catalog-ui";
import type { Service } from "@/types/service";

export function ServiceGuide({ service }: { service: Service }) {
  const material = service.specifications?.find(spec => spec.label === "Material");
  const finish = service.specifications?.find(spec => spec.label === "Finish");
  const dimensions = hasDimensionGuide(service);
  const methods = service.category.slug === "tshirt-printing" ? services.filter(item => item.category.slug === service.category.slug) : [];
  if (!material && !dimensions && !methods.length) return null;
  return <section id="size-material-guide" className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-7" aria-labelledby="product-guide-heading">
    <p className="eyebrow mb-2">A little help choosing</p>
    <h2 id="product-guide-heading" className="text-2xl font-semibold">{dimensions ? "Size & material guide" : "Printing method guide"}</h2>
    {dimensions && <div className="mt-5 grid gap-6 sm:grid-cols-2">
      <figure className="rounded-xl border bg-muted/30 p-4">
        <div className="mx-auto grid max-w-56 grid-cols-[1fr_24px] gap-2" aria-hidden="true">
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-primary/60 bg-background p-3 text-center text-sm font-semibold text-primary">Your design</div>
          <div className="flex flex-col items-center justify-center gap-2 text-primary"><MoveVertical className="h-6 w-6" /><span className="text-xs">H</span></div>
          <div className="flex items-center justify-center gap-2 text-primary"><MoveHorizontal className="h-5 w-5" /><span className="text-xs">W</span></div>
        </div>
        <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">W = width · H = height. Illustration only; not to scale.</figcaption>
      </figure>
      <div className="self-center"><h3 className="text-base font-semibold">Tell us the size you need</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Include your width, height and measurement unit, plus the orientation you prefer. Confirm available sizes and thickness with the shop before ordering.</p></div>
    </div>}
    {material && <div className="mt-5 rounded-xl bg-muted/40 p-4">
      <div className="flex items-start gap-3"><Layers className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="text-base font-semibold">{material.value}</h3><p className="mt-1 text-sm text-muted-foreground">{service.specifications?.find(spec => spec.label === "Usage")?.value}</p></div></div>
      {finish && <div className="mt-4 grid grid-cols-2 gap-3">{finish.value.split(" or ").map((value, index) => <div key={value} className="flex items-center gap-2 rounded-xl border bg-card p-3">{index ? <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" /> : <Square className="h-5 w-5 text-primary" aria-hidden="true" />}<span className="text-sm font-medium">{value}</span></div>)}</div>}
      <p className="mt-3 text-xs text-muted-foreground">Listed material and finishes from this product’s specifications. Ask the shop which option suits your project.</p>
    </div>}
    {methods.length > 0 && <div className="mt-5 grid gap-4 sm:grid-cols-2">{methods.map(method => <div key={method.id} className={"rounded-xl border p-4 " + (method.id === service.id ? "border-primary/40 bg-primary/5" : "bg-muted/30")}>
      <Shirt className="mb-3 h-8 w-8 text-primary" aria-hidden="true" />
      <h3 className="text-base font-semibold">{method.specifications?.find(spec => spec.label === "Printing Method")?.value}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{method.specifications?.filter(spec => ["Color Range", "Design Complexity", "Design Type"].includes(spec.label)).map(spec => spec.value).join(" · ")}</p>
      <p className="mt-3 text-xs text-muted-foreground">{method.customizationOptions?.slice(0, 3).join(", ")}</p>
    </div>)}</div>}
    {methods.length > 0 && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Discuss the artwork, shirt and print method with the shop. Share sizes and quantities in your request; exact garment measurements need confirmation.</p>}
  </section>;
}
