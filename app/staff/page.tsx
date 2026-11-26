import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authorizedStaff } from "@/lib/supabase/server";
import { StaffDashboard } from "@/components/staff/dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff requests", robots: { index: false, follow: false } };
export default async function StaffPage() {
  const staff = await authorizedStaff();
  if (!staff) redirect("/staff/sign-in");
  return <StaffDashboard email={staff.user.email || "Staff"} />;
}
