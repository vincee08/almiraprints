import { authorizedStaff } from "@/lib/supabase/server";
import { ARTWORK_BUCKET } from "@/lib/server/quote-service";
export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await authorizedStaff();
  if (!staff) return Response.json({ message: "Staff sign-in required." }, { status: 401 });
  const { id } = await params;
  const { data: row, error } = await staff.client.from("quote_requests").select("artwork_path,artwork_name").eq("id", id).eq("submission_state", "submitted").maybeSingle();
  if (error || !row?.artwork_path) return Response.json({ message: "Artwork not found." }, { status: 404 });
  const safeName = (row.artwork_name || "artwork").replace(/[\r\n/\\]/g, "_");
  const result = await staff.client.storage.from(ARTWORK_BUCKET).createSignedUrl(row.artwork_path, 60, { download: safeName });
  if (result.error || !result.data) return Response.json({ message: "Could not open artwork." }, { status: 503 });
  return new Response(null, { status: 302, headers: { Location: result.data.signedUrl, "Cache-Control": "no-store" } });
}
