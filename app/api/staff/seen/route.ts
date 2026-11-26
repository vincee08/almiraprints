import { authorizedStaff } from "@/lib/supabase/server";
import { sameOrigin } from "@/lib/server/quote-service";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const staff = await authorizedStaff();
  if (!staff) return Response.json({ message: "Staff sign-in required." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ message: "Invalid origin." }, { status: 403 });
  const seen = new Date().toISOString();
  const { error } = await staff.client.from("staff_members").update({ last_seen_at: seen }).eq("user_id", staff.user.id);
  if (error) return Response.json({ message: "Could not mark requests as read." }, { status: 503 });
  return Response.json({ seen }, { headers: { "Cache-Control": "no-store" } });
}
