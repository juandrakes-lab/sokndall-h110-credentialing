"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { SHARE_DAYS, buildReportSnapshot } from "@/lib/reports";

// Client status reports (pedido 2026-10-19, función 1). Everything runs as
// the signed-in user: the snapshot is read through their RLS-scoped client,
// and cred_reports' own RLS only lets them write reports for a client they
// can reach — the active client, which getAppContext already limits to theirs.

export async function generateReport() {
  const { supabase, client, practice } = await getAppContext();
  if (!client) throw new Error("No client is open.");
  const data = await buildReportSnapshot(supabase, { client, practice });
  const { data: row, error } = await supabase.from("cred_reports").insert({ client_org_id: client.id, data }).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/reports");
  redirect(`/report/${row.id}`);
}

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL ?? "https://sokndall.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// A new read-only link for one report. The token is shown once; only its
// sha256 is stored. Replacing a link makes the old one stop working.
export async function createShareLink(reportId, _prev, formData) {
  const days = Number(formData.get("days"));
  if (!SHARE_DAYS.includes(days)) return { error: "Choose how long the link lasts." };
  const { supabase } = await getAppContext();
  const token = randomBytes(32).toString("base64url");
  const { error } = await supabase
    .from("cred_reports")
    .update({
      share_token_hash: createHash("sha256").update(token).digest("hex"),
      share_expires_at: new Date(Date.now() + days * 86400000).toISOString(),
    })
    .eq("id", reportId)
    .select("id")
    .single();
  if (error) return { error: "That report isn't available to you." };
  revalidatePath("/reports");
  return { url: `${await siteOrigin()}/shared/report/${token}`, days };
}

export async function revokeShareLink(reportId) {
  const { supabase } = await getAppContext();
  const { error } = await supabase.from("cred_reports").update({ share_revoked_at: new Date().toISOString() }).eq("id", reportId);
  if (error) throw new Error(error.message);
  revalidatePath("/reports");
}

export async function deleteReport(reportId) {
  const { supabase } = await getAppContext();
  const { error } = await supabase.from("cred_reports").delete().eq("id", reportId);
  if (error) throw new Error(error.message);
  revalidatePath("/reports");
}

