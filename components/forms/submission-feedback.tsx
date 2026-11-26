"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/navigation";

export function DeliveryNotice({ available }: { available: boolean }) {
  if (available) return null;
  return (
    <div role="status" className="rounded-xl border border-secondary bg-secondary/20 p-4 text-sm leading-relaxed">
      <p className="font-semibold">Online sending is currently unavailable</p>
      <p className="mt-1 text-muted-foreground">You can prepare your details below, then email them to us or call. Nothing has been sent yet.</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        <a className="inline-flex items-center gap-2 font-medium text-primary underline underline-offset-4" href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}><Phone className="h-4 w-4" aria-hidden="true" />{contactInfo.phone}</a>
        <a className="inline-flex items-center gap-2 font-medium text-primary underline underline-offset-4 break-all" href={`mailto:${contactInfo.email}`}><Mail className="h-4 w-4" aria-hidden="true" />Email the shop</a>
      </div>
    </div>
  );
}

export function EmailFallback({ subject, getBody, hasArtwork = false }: { subject: string; getBody: () => string; hasArtwork?: boolean }) {
  const [notice, setNotice] = useState("");
  return (
    <div className="space-y-3 rounded-xl bg-muted/60 p-4">
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => {
          window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getBody())}`;
          setNotice("Your email app was requested. Review the draft and send it there; this website has not sent it.");
        }}><Mail className="h-4 w-4" aria-hidden="true" />Prepare email</Button>
        <Button type="button" variant="ghost" onClick={async () => {
          try { await navigator.clipboard.writeText(getBody()); setNotice("Details copied. Paste them into an email or message to the shop."); }
          catch { setNotice("Copy was unavailable. You can select your details or email the shop directly."); }
        }}><Copy className="h-4 w-4" aria-hidden="true" />Copy details</Button>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">Preparing an email does not send it.{hasArtwork ? " Attach your artwork manually in your email app." : " Review your details before sending."}</p>
      <p className="text-sm" role="status">{notice}</p>
    </div>
  );
}

export function SubmissionSuccess({ reference, onNewRequest, mode = "mail", notification }: { reference: string; onNewRequest: () => void; mode?: "mail" | "saved"; notification?: string }) {
  return (
    <div id="submission-success" role="status" tabIndex={-1} className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center sm:p-10">
      <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-success" aria-hidden="true" />
      <h2 className="text-2xl font-semibold">{mode === "saved" ? "Your quote request was saved" : "Request accepted by our mail service"}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Keep reference <strong className="text-foreground">{reference}</strong>. {mode === "saved" ? "Your request and any uploaded artwork are stored. Our team still needs to confirm pricing and production details." : "This acknowledges mail-server acceptance; your order and production date still need confirmation from our team."}</p>
      {mode === "saved" && notification !== "sent" && <p className="mt-3 rounded-xl border border-secondary bg-secondary/20 p-3 text-sm">The staff email could not be confirmed. Please call the shop and mention your reference.</p>}
      <p className="mt-3 text-sm text-muted-foreground">If you do not hear back, call {contactInfo.phone} and mention your reference.</p>
      <Button type="button" variant="outline" className="mt-6" onClick={onNewRequest}>Start another request</Button>
    </div>
  );
}
