import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function FormField({ id, label, required, error, hint, children }: {
  id: string; label: string; required?: boolean; error?: string; hint?: string; children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{label}{required && <span aria-hidden="true" className="ml-1 text-destructive">*</span>}</Label>
      {children}
      {hint && <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

export const selectClassName = "flex h-12 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60";
