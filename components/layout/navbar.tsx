"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNavigation } from "@/data/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0"
            aria-label="AlmiraPrints home"
          >
            <Image
              src="/almiraprints-logo.png"
              alt="AlmiraPrints"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="hidden sm:inline-block font-bold text-xl">
              AlmiraPrints
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild size="sm">
              <Link href="/quote">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Image
                      src="/almiraprints-logo.png"
                      alt="AlmiraPrints"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <span>AlmiraPrints</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary px-4 py-2 rounded-md",
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground"
                      )}
                    >
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full">
                      <Link
                        href="/quote"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get a Quote
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
