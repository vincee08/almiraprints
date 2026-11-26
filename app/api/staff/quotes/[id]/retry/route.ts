import { authorizedStaff, serviceClient } from "@/lib/supabase/server";
import { notifyQuote, sameOrigin, type QuoteRow } from "@/lib/server/quote-service";
export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await authorizedStaff()) return Response.json({ message: "Staff sign-in required." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ message: "Invalid origin." }, { status: 403 });
  const { id } = await params;
  const supabase = serviceClient();
  const { data, error } = await supabase.from("quote_requests").select("*").eq("id", id).eq("submission_state", "submitted").maybeSingle();
  if (error || !data) return Response.json({ message: "Request not found." }, { status: 404 });
  if (data.notification_state !== "failed") return Response.json({ message: "This notification is not eligible for retry." }, { status: 409 });
  try { await notifyQuote(data as QuoteRow, process.env.APP_BASE_URL || new URL(request.url).origin); }
  catch { return Response.json({ message: "Could not finish the retry. Check its status before trying again." }, { status: 503 }); }
  const result = await supabase.from("quote_requests").select("notification_state,notification_error").eq("id", id).single();
  return Response.json(result.data, { headers: { "Cache-Control": "no-store" } });
}
