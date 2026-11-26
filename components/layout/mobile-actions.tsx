"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/navigation";

export function MobileActions() {
  const pathname = usePathname();
  if (pathname === "/quote" || pathname === "/contact") return null;
  const slug = pathname.startsWith("/services/") ? pathname.split("/")[2] : undefined;
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
        <Button asChild variant="outline"><a href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}><Phone aria-hidden="true" />Call the shop</a></Button>
        <Button asChild><Link href={slug ? `/quote?service=${slug}` : "/quote"}>Get a quote<ArrowUpRight aria-hidden="true" /></Link></Button>
      </div>
    </nav>
  );
}
