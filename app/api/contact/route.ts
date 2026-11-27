import { createContactHandler } from "@/lib/server/inquiry-handler";
export const runtime = "nodejs";
export const POST = createContactHandler();
