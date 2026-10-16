import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clickedLeads, googleCsv, microsoftCsv } from "@/lib/offline-conversions";

// The scheduled uploads: Google Ads and Microsoft Ads fetch these once a day
// (Conversions › Uploads › Schedules) and count each row as a "Template lead".
// /api/conversions/google-leads.csv (and google.csv) and /api/conversions/microsoft.csv.
//
// HTTP Basic auth with CONVERSIONS_FEED_USER / CONVERSIONS_FEED_PASSWORD —
// the scheme both platforms' scheduled uploads speak. Like the cron routes,
// no end user is behind the request, which is why the service-role client
// is allowed here. Only click ids and timestamps leave; never an email.
export const dynamic = "force-dynamic";

// google-leads.csv is what Google's Data Manager is pointed at: it keeps the
// columns it first read from a URL, and google.csv was first read in the
// older layout with a "Parameters" line on top.
const FILES = { "google.csv": googleCsv, "google-leads.csv": googleCsv, "microsoft.csv": microsoftCsv };

function authorized(request) {
  const user = process.env.CONVERSIONS_FEED_USER;
  const password = process.env.CONVERSIONS_FEED_PASSWORD;
  if (!user || !password) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request, { params }) {
  const build = FILES[(await params).platform];
  if (!build) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!authorized(request)) {
    return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="conversions"' } });
  }
  try {
    const body = build(await clickedLeads(createAdminClient()));
    return new NextResponse(body, { headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
