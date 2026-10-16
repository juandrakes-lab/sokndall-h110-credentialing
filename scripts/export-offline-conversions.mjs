// Offline conversions: the template requests of the last 60 days that came
// from an ad, as the two files Google Ads and Microsoft Ads import
// (Conversions › Uploads). Each row is a "Template lead" — the conversion
// goal has to carry exactly that name on both platforms.
//
// usage: node scripts/export-offline-conversions.mjs [out-dir]   (default: current folder)
// Writes google_offline_conversions.csv and microsoft_offline_conversions.csv.
// Reads .env.local for the Supabase URL and secret key. Read-only.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const outDir = process.argv[2] ?? ".";
const NAME = "Template lead";

const since = new Date(Date.now() - 60 * 86400000).toISOString();
const { data, error } = await admin
  .from("template_leads")
  .select("created_at, gclid, msclkid")
  .gte("created_at", since)
  .or("gclid.not.is.null,msclkid.not.is.null")
  .order("created_at");
if (error) throw new Error(error.message);

const pad = (n) => String(n).padStart(2, "0");
// yyyy-MM-dd HH:mm:ss as read on a clock in the given zone.
function inZone(iso, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}
// A fixed -05:00 offset all year: Microsoft's file declares TimeZone=-0500,
// so New York daylight time must not leak into it.
function minusFive(iso) {
  const d = new Date(new Date(iso).getTime() - 5 * 3600000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

const google = data.filter((r) => r.gclid);
const microsoft = data.filter((r) => r.msclkid);

writeFileSync(
  join(outDir, "google_offline_conversions.csv"),
  [
    "Parameters:TimeZone=America/New_York",
    "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
    ...google.map((r) => `${r.gclid},${NAME},${inZone(r.created_at, "America/New_York")},0,USD`),
  ].join("\r\n") + "\r\n"
);
writeFileSync(
  join(outDir, "microsoft_offline_conversions.csv"),
  [
    "Parameters:TimeZone=-0500",
    "Microsoft Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
    ...microsoft.map((r) => `${r.msclkid},${NAME},${minusFive(r.created_at)},0,USD`),
  ].join("\r\n") + "\r\n"
);
console.log(`google: ${google.length} rows, microsoft: ${microsoft.length} rows (since ${since.slice(0, 10)})`);
