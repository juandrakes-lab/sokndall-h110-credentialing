import { NextResponse } from "next/server";
import { getAppContext } from "@/lib/org";
import { gatherOrgData } from "@/lib/notifications/data";
import { computeAlerts, computeDigest } from "@/lib/notifications/compute";
import { renderAlertEmail, renderDigestEmail } from "@/lib/notifications/email";

// Shows the owner exactly what the alert or digest email looks like with
// today's data (through their own session — RLS applies). Nothing is sent.
export async function GET(_request, { params }) {
  const { kind } = await params;
  const { supabase, org, role } = await getAppContext();
  if (!org || role !== "owner") return new NextResponse("Only the account owner can preview emails.", { status: 403 });

  const data = await gatherOrgData(supabase, org.id);
  let html;

  if (kind === "alert") {
    const items = computeAlerts(data, org.alert_days);
    html = items.length
      ? renderAlertEmail(org.name, items).html
      : "<p style='font-family:sans-serif;padding:24px'>Nothing is at an alert point today, so no alert email would go out.</p>";
  } else if (kind === "digest") {
    const digest = computeDigest(data);
    html =
      digest.queue.length || digest.stalled.length || digest.expirations.length
        ? renderDigestEmail(org.name, digest).html
        : "<p style='font-family:sans-serif;padding:24px'>Nothing to report this week, so no digest would go out.</p>";
  } else {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
