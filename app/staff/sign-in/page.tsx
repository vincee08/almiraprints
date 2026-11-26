import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { StaffSignIn } from "@/components/staff/sign-in";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false, follow: false } };
export default function SignInPage() {
  return <MainLayout><section className="container mx-auto max-w-lg px-4 py-12 sm:py-20">
    <p className="eyebrow mb-3">AlmiraPrints staff</p>
    <h1 className="text-3xl font-semibold tracking-tight">Sign in to requests</h1>
    <p className="mt-3 text-muted-foreground">Use the staff account created for you by an administrator.</p>
    <StaffSignIn />
  </section></MainLayout>;
}
