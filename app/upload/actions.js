"use server";

import { createHash, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET, storageSafeName } from "@/lib/documents";
import { bytesMatchType } from "@/lib/upload-check";
import { scanFile, scannerConfigured } from "@/lib/malware";

// The provider-facing side of an upload link (pedido 2026-10-19, función 2).
// No one is signed in: the token is the only permission, so these run with
// the service role — the same exception as the cron routes — and every step
// goes through a database function that re-checks the token. They can only
// put a file in; nothing here reads, lists or returns anything stored.
//
// 1. startUpload: token, hourly limit, size, type, quota → a one-time signed
//    URL to a quarantine path that no signed-in user can reach.
// 2. The browser uploads the file there directly (Vercel caps request bodies
//    at 4.5 MB; documents go up to 10 MB).
// 3. finishUpload: the bytes must be the declared type and pass the malware
//    scan; then the file moves under the provider and is recorded as a
//    submission waiting for the team's review. Anything else is deleted.

const MESSAGES = {
  UPLOAD_LINK_INVALID: "This link is no longer valid. Ask for a new one.",
  UPLOAD_RATE_LIMITED: "Too many uploads in the last hour. Try again later.",
  UPLOAD_TOO_LARGE: "Files can be up to 10 MB.",
  UPLOAD_TYPE: "Upload a PDF, JPG, PNG, HEIC or Word file.",
  UPLOAD_NAME: "The file needs a name.",
  STORAGE_LIMIT_REACHED: "The upload couldn't be stored. Let the office that sent you this link know.",
};
const friendly = (error) => MESSAGES[String(error?.message ?? "").split(":")[0]] ?? "The upload didn't go through. Try again.";

export async function startUpload(token, file) {
  if (!scannerConfigured()) return { error: "Uploads through links aren't switched on yet." };
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("cred_upload_authorize", {
    p_token: String(token ?? ""),
    p_file_name: String(file?.name ?? "").slice(0, 255),
    p_size: Number(file?.size) || 0,
    p_mime: String(file?.type ?? ""),
  });
  if (error) return { error: friendly(error) };
  const path = data?.[0]?.quarantine_path;
  const { data: signed, error: signErr } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (signErr) return { error: friendly(signErr) };
  return { path, uploadToken: signed.token };
}

export async function finishUpload(token, path, { name, type, category }) {
  const admin = createAdminClient();
  const remove = () => admin.storage.from(BUCKET).remove([path]);
  if (!/^quarantine\/[0-9a-f-]{36}\/[0-9a-f-]{36}$/.test(String(path))) return { error: "The upload didn't go through. Try again." };

  const linkId = path.split("/")[1];
  const { data: link } = await admin.from("cred_upload_links").select("id, org_id, client_org_id, provider_id, token_hash").eq("id", linkId).maybeSingle();
  // The quarantine path must belong to this very token's link.
  if (!link || link.token_hash !== createHash("sha256").update(String(token ?? "")).digest("hex")) {
    await remove();
    return { error: MESSAGES.UPLOAD_LINK_INVALID };
  }

  const { data: blob, error: dlErr } = await admin.storage.from(BUCKET).download(path);
  if (dlErr || !blob) return { error: "The upload didn't go through. Try again." };
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (!bytesMatchType(bytes, type)) {
    await remove();
    return { error: "That file isn't the type its name says. Upload the original PDF, image or Word file." };
  }

  let scan;
  try {
    scan = await scanFile(bytes, name);
  } catch (err) {
    console.error(`upload scan failed: ${err.message}`);
    await remove();
    return { error: "The file couldn't be checked right now. Try again in a few minutes." };
  }
  if (!scan.clean) {
    console.error(`upload rejected by malware scan (${scan.reason}) for link ${link.id}`);
    await remove();
    return { error: "This file was flagged by our security check and wasn't kept." };
  }

  const finalPath = `${link.org_id}/${link.client_org_id}/${link.provider_id}/submitted-${randomUUID()}-${storageSafeName(String(name ?? ""))}`;
  const { error: mvErr } = await admin.storage.from(BUCKET).move(path, finalPath);
  if (mvErr) {
    await remove();
    return { error: "The upload didn't go through. Try again." };
  }
  const { error: recErr } = await admin.rpc("cred_upload_record", {
    p_token: String(token ?? ""),
    p_storage_path: finalPath,
    p_category: String(category ?? "other"),
    p_file_name: String(name ?? "document").slice(0, 255),
  });
  if (recErr) {
    await admin.storage.from(BUCKET).remove([finalPath]);
    return { error: friendly(recErr) };
  }
  return { ok: true, name };
}
