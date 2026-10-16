// Offline conversions: template requests that arrived from an ad, as the files
// Google Ads and Microsoft Ads import. Each row is a "Template lead" — the
// conversion action carries exactly that name on both platforms. Read by the
// scheduled-upload routes (app/api/conversions/*) and by
// scripts/export-offline-conversions.mjs. No tag or pixel on the site.

export const CONVERSION_NAME = "Template lead";
const WINDOW_DAYS = 60;

const pad = (n) => String(n).padStart(2, "0");

// yyyy-MM-dd HH:mm:ss+00:00, in UTC with the offset written out.
function utc(iso) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+00:00`;
}

// A fixed -05:00 all year: Microsoft's file declares TimeZone=-0500, so New
// York daylight time must not leak into it.
function minusFive(iso) {
  const d = new Date(new Date(iso).getTime() - 5 * 3600000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

// The last 60 days of template requests that carry a click id.
export async function clickedLeads(admin) {
  const since = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString();
  const { data, error } = await admin
    .from("template_leads")
    .select("created_at, gclid, msclkid")
    .gte("created_at", since)
    .or("gclid.not.is.null,msclkid.not.is.null")
    .order("created_at");
  if (error) throw new Error(error.message);
  return data;
}

const csv = (lines) => lines.join("\r\n") + "\r\n";

// Google's Data Manager (the scheduled HTTPS source) reads the first line as
// the header, so there is no "Parameters:TimeZone" line: each time carries
// its own offset instead, which the manual upload accepts too.
export function googleCsv(leads) {
  return csv([
    "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
    ...leads.filter((r) => r.gclid).map((r) => `${r.gclid},${CONVERSION_NAME},${utc(r.created_at)},0,USD`),
  ]);
}

export function microsoftCsv(leads) {
  return csv([
    "Parameters:TimeZone=-0500",
    "Microsoft Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
    ...leads.filter((r) => r.msclkid).map((r) => `${r.msclkid},${CONVERSION_NAME},${minusFive(r.created_at)},0,USD`),
  ]);
}
