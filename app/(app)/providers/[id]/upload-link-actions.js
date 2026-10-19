"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { BUCKET } from "@/lib/documents";

// The team's side of upload links (pedido 2026-10-19, función 2): create one
// for a provider, revoke it, and review what came in. All as the signed-in
// user, through RLS and cred_review_submission().

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL ?? "https://sokndall.com";
  return `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
}

export async function createUploadLink(providerId, _prev, formData) {
  const days = Number(formData.get("days"));
  if (![3, 7, 14].includes(days)) return { error: "Choose how long the link lasts." };
  const { supabase } = await getAppContext();
  const token = randomBytes(32).toString("base64url");
  const { error } = await supabase.from("cred_upload_links").insert({
    provider_id: providerId,
    token_hash: createHash("sha256").update(token).digest("hex"),
    expires_at: new Date(Date.now() + days * 86400000).toISOString(),
  });
  if (error) return { error: "The link couldn't be created for this provider." };
  revalidatePath(`/providers/${providerId}`);
  return { url: `${await siteOrigin()}/upload/${token}`, days };
}

export async function revokeUploadLink(providerId, linkId) {
  const { supabase } = await getAppContext();
  const { error } = await supabase.from("cred_upload_links").update({ revoked_at: new Date().toISOString() }).eq("id", linkId);
  if (error) throw new Error(error.message);
  revalidatePath(`/providers/${providerId}`);
}

export async function reviewSubmission(providerId, submissionId, accept, formData) {
  const { supabase } = await getAppContext();
  const { data: sub } = await supabase.from("cred_document_submissions").select("storage_path").eq("id", submissionId).maybeSingle();
  const { error } = await supabase.rpc("cred_review_submission", {
    p_id: submissionId,
    p_accept: accept,
    p_category: formData?.get?.("category")?.toString() ?? null,
  });
  if (error) throw new Error(error.message.split(":").slice(1).join(":").trim() || error.message);
  if (!accept && sub?.storage_path) await supabase.storage.from(BUCKET).remove([sub.storage_path]);
  revalidatePath(`/providers/${providerId}`);
}

export async function previewSubmission(submissionId) {
  const { supabase } = await getAppContext();
  const { data: sub } = await supabase.from("cred_document_submissions").select("storage_path, status").eq("id", submissionId).maybeSingle();
  if (!sub || sub.status !== "pending") return { error: "Not available." };
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(sub.storage_path, 60, { download: true });
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}
