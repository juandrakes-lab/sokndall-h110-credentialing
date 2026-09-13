import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { createAdminClient } from "@/lib/supabase/admin";
import { runDigest } from "@/lib/notifications/send";

// Mondays (vercel.json): the weekly digest for everyone on each account.
export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ?org=<id> narrows a manual run to one organization (verification
    // scripts); Vercel Cron never passes it.
    const org = new URL(request.url).searchParams.get("org");
    const results = await runDigest(createAdminClient(), org ? { orgIds: [org] } : {});
    return NextResponse.json({ sent: results.filter((r) => r.status === "sent").length, results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
