import { authorizedStaff } from "@/lib/supabase/server";
import { quoteStatuses } from "@/lib/staff";
import { sameOrigin, smallJson } from "@/lib/server/quote-service";
export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await authorizedStaff();
  if (!staff) return Response.json({ message: "Staff sign-in required." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ message: "Invalid origin." }, { status: 403 });
  let body: Record<string, unknown>;
  try { body = await smallJson(request); } catch { return Response.json({ message: "Invalid request." }, { status: 400 }); }
  if (typeof body.status !== "string" || !quoteStatuses.includes(body.status as typeof quoteStatuses[number])) return Response.json({ message: "Choose a valid status." }, { status: 400 });
  const { id } = await params;
  const { data, error } = await staff.client.from("quote_requests").update({ status: body.status }).eq("id", id).eq("submission_state", "submitted").select("id,status").maybeSingle();
  if (error || !data) return Response.json({ message: "Could not update this request." }, { status: 404 });
  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
