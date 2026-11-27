import { authorizedStaff } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const staff = await authorizedStaff();
  if (!staff) return Response.json({ message: "Staff sign-in required." }, { status: 401 });
  const url = new URL(request.url);
  const search = (url.searchParams.get("search") || "").trim().replace(/[^\p{L}\p{N}@._ -]/gu, "").slice(0, 80);
  const page = Math.min(Math.max(Number(url.searchParams.get("page")) || 0, 0), 1000);
  let query = staff.client.from("contact_messages")
    .select("id,reference,full_name,email,phone,service_type,message,created_at", { count: "exact" })
    .order("created_at", { ascending: false }).range(page * 50, page * 50 + 49);
  if (search) query = query.or(`reference.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%,service_type.ilike.%${search}%,message.ilike.%${search}%`);
  const result = await query;
  if (result.error) return Response.json({ message: "Could not load contact messages." }, { status: 503 });
  return Response.json({ messages: result.data, total: result.count || 0 }, { headers: { "Cache-Control": "no-store" } });
}
