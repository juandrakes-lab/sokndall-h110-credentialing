import { NextResponse } from "next/server";
import { getAppContext } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
import { BUCKET } from "@/lib/documents";
import { VIEWS } from "@/lib/export-views";

// Everything about one client, for the owner — offered before a client is
// deleted for good. Returns the CSVs and a short-lived download link per
// document; the browser assembles the ZIP (lib/zip.js), so the export's size
// never meets Vercel's response limit. Works for an archived client: naming
// it as the active client is the one way its data can still be read (RLS).

const LISTS = ["providers", "credentials", "enrollments", "history", "communications", "documents"];
const safe = (s) => String(s ?? "").replace(/[\\/:*?"<>|]+/g, "-").trim() || "unnamed";
const bom = (csv) => String.fromCharCode(0xfeff) + csv;

export async function GET(_request, { params }) {
  const { id } = await params;
  const { user, role, clients, archivedClients } = await getAppContext();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (role !== "owner") return NextResponse.json({ error: "Only the account owner can export a client" }, { status: 403 });
  const client = [...clients, ...archivedClients].find((c) => c.id === id);
  if (!client) return NextResponse.json({ error: "No such client" }, { status: 404 });

  const supabase = await createClient({ clientOrgId: id });
  const { data: practice } = await supabase.from("cred_practices").select("*").eq("client_org_id", id).maybeSingle();

  const files = [];
  if (practice) {
    const cols = ["legal_name", "group_npi", "tin", "service_address_line1", "service_address_line2", "service_city", "service_state",
      "service_zip", "billing_address_line1", "billing_address_line2", "billing_city", "billing_state", "billing_zip"];
    files.push({ name: "practice.csv", text: bom(toCsv(cols, [cols.map((c) => practice[c])])) });
  }
  for (const list of LISTS) {
    const [headers, rows] = await VIEWS[list]({ supabase, practice, sp: new URLSearchParams() });
    files.push({ name: `${list}.csv`, text: bom(toCsv(headers, rows)) });
  }

  const { data: docs } = await supabase
    .from("cred_documents")
    .select("file_name, storage_path, created_at, cred_providers(first_name, last_name)")
    .order("created_at", { ascending: true });
  const documents = [];
  if (docs?.length) {
    const { data: signed, error } = await supabase.storage.from(BUCKET).createSignedUrls(docs.map((d) => d.storage_path), 600);
    if (error) return NextResponse.json({ error: `Couldn't prepare the documents: ${error.message}` }, { status: 500 });
    const taken = new Set();
    docs.forEach((d, i) => {
      const folder = safe(d.cred_providers ? `${d.cred_providers.last_name}, ${d.cred_providers.first_name}` : "Unassigned");
      let name = `documents/${folder}/${safe(d.file_name)}`;
      for (let n = 2; taken.has(name); n++) name = `documents/${folder}/${n}-${safe(d.file_name)}`;
      taken.add(name);
      if (signed[i]?.signedUrl) documents.push({ name, url: signed[i].signedUrl });
    });
  }

  return NextResponse.json(
    { client: client.name, fileName: `sokndall-${safe(client.name)}-export.zip`, files, documents },
    { headers: { "Cache-Control": "no-store" } }
  );
}
