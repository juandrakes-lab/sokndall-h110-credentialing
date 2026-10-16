// Offline conversions by hand: the same two files Google Ads and Microsoft
// Ads fetch every day from /api/conversions/*.csv (lib/offline-conversions.js),
// written to disk — for a manual upload or to check what the feed holds.
//
// usage: node scripts/export-offline-conversions.mjs [out-dir]   (default: current folder)
// Reads .env.local for the Supabase URL and secret key. Read-only.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { clickedLeads, googleCsv, microsoftCsv } from "../lib/offline-conversions.js";

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

const leads = await clickedLeads(admin);
writeFileSync(join(outDir, "google_offline_conversions.csv"), googleCsv(leads));
writeFileSync(join(outDir, "microsoft_offline_conversions.csv"), microsoftCsv(leads));
console.log(`google: ${leads.filter((r) => r.gclid).length} rows, microsoft: ${leads.filter((r) => r.msclkid).length} rows`);
