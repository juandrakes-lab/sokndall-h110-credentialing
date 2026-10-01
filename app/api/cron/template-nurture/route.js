import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { createAdminClient } from "@/lib/supabase/admin";
import { runNurture } from "@/lib/nurture";

// Daily (vercel.json): the follow-up emails after the free template.
export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ?lead=<id> narrows a manual run to one lead (testing); Vercel Cron
    // never passes it.
    const lead = new URL(request.url).searchParams.get("lead");
    const results = await runNurture(createAdminClient(), lead ? { leadIds: [lead] } : {});
    return NextResponse.json({ sent: results.filter((r) => r.status === "sent").length, results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
