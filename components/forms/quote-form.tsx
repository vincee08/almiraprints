"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField, selectClassName } from "./form-field";
import { DeliveryNotice, EmailFallback, SubmissionSuccess } from "./submission-feedback";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validations";
import { ARTWORK_ACCEPT, ARTWORK_FORMATS, validateArtwork } from "@/lib/artwork";
import { formatQuote } from "@/lib/inquiry-content";
import { SubmissionError } from "@/lib/submit-inquiry";
import { submitQuote } from "@/lib/submit-quote";
import { serviceCategories, services } from "@/data/services";
import { portfolioItems } from "@/data/portfolio";
import { RequestSummary } from "./request-summary";

export function QuoteForm({ initialServiceSlug, initialCategorySlug, initialProjectSlug, deliveryAvailable = false }: {
  initialServiceSlug?: string; initialCategorySlug?: string; initialProjectSlug?: string; deliveryAvailable?: boolean;
}) {
  const initialService = services.find(service => service.slug === initialServiceSlug);
  const initialCategory = initialService?.category || serviceCategories.find(category => category.slug === initialCategorySlug);
  const initialProject = portfolioItems.find(project => project.slug === initialProjectSlug);
  const [referenceProject, setReferenceProject] = useState(initialProject);
  const defaults: QuoteFormValues = {
    customerName: "", email: "", phone: "", serviceCategory: initialCategory?.name || "",
    specificService: initialService?.title || "", quantity: "", size: "", material: "", deadline: "",
    additionalRequirements: initialProject ? "Reference project: " + initialProject.title + ". I would like something similar." : "", hasDesignFile: false, tshirtSize: "", tshirtColor: "", printLocation: "",
  };
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, setError, clearErrors, watch, reset, getValues } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema), defaultValues: defaults, mode: "onBlur",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState("");
  const [ready, setReady] = useState(false);
  const submission = useRef<{ signature: string; key: string } | null>(null);
  const website = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const errorPanel = useRef<HTMLDivElement>(null);
  const values = watch();
  const category = values.serviceCategory;
  const isTshirt = category === "T-Shirt Printing";
  const filteredServices = services.filter(service => service.category.name === category);

  useEffect(() => {
    if (reference) document.getElementById("submission-success")?.focus();
    else if (submissionError) errorPanel.current?.focus();
  }, [reference, submissionError]);
  useEffect(() => setReady(true), []);

  const field = (name: keyof QuoteFormValues) => ({
    id: name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? name + "-error" : undefined,
  });

  function removeFile() {
    setSelectedFile(null); setFileError(""); setValue("hasDesignFile", false);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(data: QuoteFormValues) {
    setSubmissionError("");
    if (fileError) { fileInput.current?.focus(); return; }
    if (!deliveryAvailable) { setSubmissionError("Online quote requests are unavailable. Please use Prepare email or call the shop. Nothing has been saved."); return; }
    const signature = JSON.stringify({ data, file: selectedFile && [selectedFile.name, selectedFile.size, selectedFile.lastModified] });
    if (!submission.current || submission.current.signature !== signature) submission.current = { signature, key: crypto.randomUUID() };
    try {
      const result = await submitQuote(data, selectedFile, submission.current.key, website.current?.value || "", setStep);
      setReference(result.reference);
    }
    catch (error) {
      const failure = error instanceof SubmissionError ? error : new SubmissionError("We could not confirm that your request was saved. Please try again or call the shop.");
      Object.entries(failure.fieldErrors).forEach(([name, message]) => {
        if (name === "designFile") setFileError(message);
        else if (name in data) setError(name as keyof QuoteFormValues, { type: "server", message });
      });
      setSubmissionError(failure.message + (failure.reference ? " Reference: " + failure.reference : ""));
    } finally { setStep(""); }
  }

  if (reference) return <SubmissionSuccess reference={reference} mode="saved" onNewRequest={() => {
    setReference(""); setSubmissionError(""); setReferenceProject(initialProject); reset(defaults); removeFile(); submission.current = null;
  }} />;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-8">
    <RequestSummary values={values} filename={selectedFile?.name} fileError={fileError} project={referenceProject} onRemoveProject={() => {
      if (referenceProject) {
        const prefix = "Reference project: " + referenceProject.title + ". I would like something similar.";
        const notes = getValues("additionalRequirements") || "";
        if (notes.startsWith(prefix)) setValue("additionalRequirements", notes.slice(prefix.length).trimStart());
      }
      setReferenceProject(undefined);
      document.getElementById("request-summary-heading")?.focus();
    }} />
    <Card id="quote-form" className="min-w-0 scroll-mt-24 lg:order-first">
      <CardHeader className="space-y-3">
        <p className="eyebrow">Made for your project</p>
        <h2 className="text-2xl font-semibold" id="quote-form-heading">Tell us what you have in mind</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">Start with a product and quantity. Add any details you know; we can discuss the rest. Fields marked * are required.</p>
        <DeliveryNotice available={deliveryAvailable} />
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="quote-form-heading" className="space-y-8" aria-busy={isSubmitting}>
          <fieldset className="space-y-5">
            <legend className="mb-4 text-base font-semibold">1. Your contact details</legend>
            <FormField id="customerName" label="Full name" required error={errors.customerName?.message}>
              <Input {...register("customerName")} {...field("customerName")} autoComplete="name" aria-required="true" placeholder="Your full name" />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="email" label="Email address" required error={errors.email?.message}>
                <Input {...register("email")} {...field("email")} type="email" autoComplete="email" aria-required="true" placeholder="you@example.com" />
              </FormField>
              <FormField id="phone" label="Phone number" required error={errors.phone?.message}>
                <Input {...register("phone")} {...field("phone")} type="tel" autoComplete="tel" aria-required="true" placeholder="09XX XXX XXXX" />
              </FormField>
            </div>
          </fieldset>

          <fieldset className="space-y-5 border-t pt-6">
            <legend className="mb-4 pr-3 text-base font-semibold">2. Your printing project</legend>
            <FormField id="serviceCategory" label="Service category" required error={errors.serviceCategory?.message}>
              <select {...register("serviceCategory", { onChange: () => {
                setValue("specificService", ""); setValue("tshirtSize", ""); setValue("tshirtColor", ""); setValue("printLocation", "");
                clearErrors(["specificService", "tshirtSize", "tshirtColor", "printLocation"]);
              } })} {...field("serviceCategory")} aria-required="true" className={selectClassName}>
                <option value="">Choose a category</option>
                {serviceCategories.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
              </select>
            </FormField>
            <FormField id="specificService" label="Printing service" required error={errors.specificService?.message}>
              <select {...register("specificService")} {...field("specificService")} aria-required="true" disabled={!category} className={selectClassName}>
                <option value="">{category ? "Choose a printing service" : "Choose a category first"}</option>
                {filteredServices.map(service => <option key={service.id} value={service.title}>{service.title}</option>)}
              </select>
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="quantity" label="Quantity" required error={errors.quantity?.message}>
                <Input {...register("quantity")} {...field("quantity")} inputMode="numeric" aria-required="true" placeholder="e.g. 24" />
              </FormField>
              <FormField id="size" label="Size (optional)" error={errors.size?.message}>
                <Input {...register("size")} {...field("size")} placeholder="e.g. A4 or 3 × 5 ft" />
              </FormField>
              <FormField id="material" label="Material (optional)" error={errors.material?.message}>
                <Input {...register("material")} {...field("material")} placeholder="Tell us your preference, if any" />
              </FormField>
              <FormField id="deadline" label="Preferred date (optional)" error={errors.deadline?.message}>
                <Input {...register("deadline")} {...field("deadline")} type="date" />
              </FormField>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">We will confirm pricing, availability and production time before an order proceeds.</p>
            {isTshirt && <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <h3 className="text-base font-semibold">T-shirt details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="tshirtSize" label="Sizes and quantities (optional)" error={errors.tshirtSize?.message}>
                  <Input {...register("tshirtSize")} {...field("tshirtSize")} placeholder="e.g. 6 small, 12 medium, 6 large" />
                </FormField>
                <FormField id="tshirtColor" label="Shirt colors (optional)" error={errors.tshirtColor?.message}>
                  <Input {...register("tshirtColor")} {...field("tshirtColor")} placeholder="e.g. white or navy" />
                </FormField>
              </div>
              <FormField id="printLocation" label="Print placement (optional)" error={errors.printLocation?.message}>
                <select {...register("printLocation")} {...field("printLocation")} className={selectClassName}>
                  <option value="">Choose a placement</option><option value="front">Front only</option><option value="back">Back only</option><option value="both">Front and back</option><option value="sleeve">Sleeve</option><option value="custom">Custom placement</option>
                </select>
              </FormField>
            </div>}
          </fieldset>

          <fieldset className="space-y-5 border-t pt-6">
            <legend className="mb-4 pr-3 text-base font-semibold">3. Artwork and finishing touches</legend>
            <FormField id="additionalRequirements" label="Anything else? (optional)" error={errors.additionalRequirements?.message}>
              <Textarea {...register("additionalRequirements")} {...field("additionalRequirements")} rows={4} placeholder="Names, theme, event details, design help or special instructions…" />
            </FormField>
            <FormField id="designFile" label="Artwork or reference (optional)" hint={ARTWORK_FORMATS + ". One file, up to 10 MB (10,485,760 bytes)."} error={fileError}>
              <div className="space-y-4 rounded-xl border border-dashed border-primary/40 bg-muted/40 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">Choose a design or reference from your device.</p>
                </div>
                <input ref={fileInput} id="designFile" type="file" accept={ARTWORK_ACCEPT}
                  aria-invalid={Boolean(fileError)} aria-describedby={"designFile-hint" + (fileError ? " designFile-error" : "")}
                  className="block w-full min-w-0 rounded-lg text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-3 file:font-medium file:text-primary-foreground"
                  onChange={event => {
                    const file = event.currentTarget.files?.[0];
                    if (!file) return;
                    const error = validateArtwork(file);
                    setFileError(error || ""); setSelectedFile(error ? null : file); setValue("hasDesignFile", !error);
                    if (error) event.currentTarget.value = "";
                  }} />
                {fileError && !selectedFile && <Button type="button" variant="outline" size="sm" onClick={removeFile}>Continue without artwork</Button>}
                {selectedFile && <div className="flex min-w-0 items-center gap-3 rounded-lg bg-background p-3" role="status">
                  <FileCheck2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready to attach</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" aria-label="Remove artwork" onClick={removeFile}><X className="h-4 w-4" /></Button>
                </div>}
              </div>
            </FormField>
          </fieldset>

          {Object.keys(errors).length > 0 && <p role="alert" className="rounded-xl bg-destructive/5 p-4 text-sm text-destructive">Please check the highlighted fields before continuing.</p>}
          {submissionError && <div ref={errorPanel} tabIndex={-1} role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">{submissionError}</div>}
          <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="quote-website">Leave this blank</label><input id="quote-website" ref={website} name="website" tabIndex={-1} autoComplete="off" /></div>
          {step && <p role="status" className="text-sm text-muted-foreground">{step}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={!ready || isSubmitting || !deliveryAvailable || Boolean(fileError)}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isSubmitting ? "Saving request…" : "Send quote request"}
          </Button>
          {(!deliveryAvailable || submissionError) && <EmailFallback subject="AlmiraPrints printing quote request" getBody={() => formatQuote(getValues(), selectedFile?.name)} hasArtwork={Boolean(selectedFile)} />}
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
