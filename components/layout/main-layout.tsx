import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MobileActions } from "./mobile-actions";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pb-24 md:pb-0">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-primary">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
      <Footer />
      <MobileActions />
    </div>
  );
}
