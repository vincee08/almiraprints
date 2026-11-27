"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField, selectClassName } from "./form-field";
import { SubmissionSuccess } from "./submission-feedback";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { SubmissionError, submitInquiry } from "@/lib/submit-inquiry";
import { serviceCategories } from "@/data/services";
import { contactInfo } from "@/data/navigation";

const defaults: ContactFormValues = { fullName: "", email: "", phone: "", serviceType: "", message: "" };

export function ContactForm({ storageAvailable = false }: { storageAvailable?: boolean }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema), defaultValues: defaults, mode: "onBlur",
  });
  const [submissionError, setSubmissionError] = useState("");
  const [reference, setReference] = useState("");
  const [ready, setReady] = useState(false);
  const errorPanel = useRef<HTMLDivElement>(null);
  const website = useRef<HTMLInputElement>(null);
  const submission = useRef<{ signature: string; key: string } | null>(null);
  useEffect(() => {
    if (reference) document.getElementById("submission-success")?.focus();
    else if (submissionError) errorPanel.current?.focus();
  }, [reference, submissionError]);
  useEffect(() => setReady(true), []);
  const field = (name: keyof ContactFormValues) => ({
    id: name, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? name + "-error" : undefined,
  });
  async function onSubmit(data: ContactFormValues) {
    setSubmissionError("");
    if (!storageAvailable) { setSubmissionError("Online messages are unavailable. Please call the shop. Nothing has been saved."); return; }
    const signature = JSON.stringify(data);
    if (!submission.current || submission.current.signature !== signature) submission.current = { signature, key: crypto.randomUUID() };
    try { setReference(await submitInquiry("contact", JSON.stringify({ ...data, submissionKey: submission.current.key, website: website.current?.value || "" }))); }
    catch (error) {
      const failure = error instanceof SubmissionError ? error : new SubmissionError("We could not confirm that your message was saved. Please try again or call the shop.");
      Object.entries(failure.fieldErrors).forEach(([name, message]) => {
        if (name in data) setError(name as keyof ContactFormValues, { type: "server", message });
      });
      setSubmissionError(failure.message + (failure.reference ? " Reference: " + failure.reference : ""));
    }
  }
  if (reference) return <SubmissionSuccess reference={reference} mode="contact" onNewRequest={() => { setReference(""); setSubmissionError(""); reset(defaults); submission.current = null; }} />;
  return (
    <Card id="contact-form" className="scroll-mt-24">
      <CardHeader className="space-y-3">
        <p className="eyebrow">Let’s talk printing</p>
        <h2 id="contact-form-heading" className="text-2xl font-semibold">Send us a message</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">Ask about a product, your artwork or an existing project. Fields marked * are required.</p>
        {!storageAvailable && <p role="status" className="rounded-xl border border-secondary bg-secondary/20 p-4 text-sm">Online messages are temporarily unavailable. Call <a className="font-semibold text-primary underline" href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}>{contactInfo.phone}</a> instead.</p>}
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="contact-form-heading" aria-busy={isSubmitting} className="space-y-5">
          <FormField id="fullName" label="Full name" required error={errors.fullName?.message}>
            <Input {...register("fullName")} {...field("fullName")} autoComplete="name" aria-required="true" placeholder="Your full name" />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="email" label="Email address" required error={errors.email?.message}>
              <Input {...register("email")} {...field("email")} type="email" autoComplete="email" aria-required="true" placeholder="you@example.com" />
            </FormField>
            <FormField id="phone" label="Phone number" required error={errors.phone?.message}>
              <Input {...register("phone")} {...field("phone")} type="tel" autoComplete="tel" aria-required="true" placeholder="09XX XXX XXXX" />
            </FormField>
          </div>
          <FormField id="serviceType" label="What can we help with?" required error={errors.serviceType?.message}>
            <select {...register("serviceType")} {...field("serviceType")} aria-required="true" className={selectClassName}>
              <option value="">Choose a topic</option><option value="General Inquiry">General inquiry</option>
              {serviceCategories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </FormField>
          <FormField id="message" label="Your message" required error={errors.message?.message}>
            <Textarea {...register("message")} {...field("message")} aria-required="true" rows={5} placeholder="Tell us what you need…" />
          </FormField>
          {Object.keys(errors).length > 0 && <p role="alert" className="rounded-xl bg-destructive/5 p-4 text-sm text-destructive">Please check the highlighted fields before continuing.</p>}
          <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="contact-website">Leave this blank</label><input id="contact-website" ref={website} name="website" tabIndex={-1} autoComplete="off" /></div>
          {submissionError && <div ref={errorPanel} tabIndex={-1} role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">{submissionError}</div>}
          <Button type="submit" size="lg" className="w-full" disabled={!ready || isSubmitting || !storageAvailable}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isSubmitting ? "Saving message…" : "Send message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
