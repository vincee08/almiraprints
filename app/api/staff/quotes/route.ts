import { authorizedStaff } from "@/lib/supabase/server";
import { quoteStatuses, staffQuoteColumns } from "@/lib/staff";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const staff = await authorizedStaff();
  if (!staff) return Response.json({ message: "Staff sign-in required." }, { status: 401 });
  const url = new URL(request.url);
  const search = (url.searchParams.get("search") || "").trim().replace(/[^\p{L}\p{N}@._ -]/gu, "").slice(0, 80);
  const status = url.searchParams.get("status") || "";
  const page = Math.min(Math.max(Number(url.searchParams.get("page")) || 0, 0), 1000);
  let query = staff.client.from("quote_requests").select(staffQuoteColumns, { count: "exact" }).eq("submission_state", "submitted").order("submitted_at", { ascending: false }).range(page * 50, page * 50 + 49);
  if (quoteStatuses.includes(status as typeof quoteStatuses[number])) query = query.eq("status", status);
  if (search) query = query.or(`reference.ilike.%${search}%,customer_name.ilike.%${search}%,email.ilike.%${search}%,specific_service.ilike.%${search}%`);
  const [list, unread] = await Promise.all([
    query,
    staff.client.from("quote_requests").select("id", { count: "exact", head: true }).eq("submission_state", "submitted").gt("submitted_at", staff.member.last_seen_at),
  ]);
  if (list.error || unread.error) return Response.json({ message: "Could not load requests." }, { status: 503 });
  const selectedId = url.searchParams.get("request");
  let selected = null;
  if (selectedId && /^[0-9a-f-]{36}$/i.test(selectedId) && !list.data?.some(row => row.id === selectedId)) {
    const result = await staff.client.from("quote_requests").select(staffQuoteColumns).eq("id", selectedId).eq("submission_state", "submitted").maybeSingle();
    selected = result.data;
  }
  return Response.json({ requests: list.data, selected, total: list.count || 0, unread: unread.count || 0 }, { headers: { "Cache-Control": "no-store" } });
}
