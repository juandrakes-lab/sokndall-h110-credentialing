"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { PLANS, nextPlan } from "@/lib/plans";
import {
  ALLOWED_MIME_TYPES,
  BUCKET,
  DOCUMENT_CATEGORIES,
  MAX_FILE_BYTES,
  formatBytes,
  storageSafeName,
} from "@/lib/documents";

function refresh(providerId) {
  revalidatePath("/documents");
  revalidatePath("/enrollments");
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
  if (providerId) revalidatePath(`/providers/${providerId}`);
}

function quotaMessage(org) {
  const next = nextPlan(org.plan);
  return `Your ${PLANS[org.plan].label} plan stores up to ${PLANS[org.plan].storageLabel} of documents, and it's full.${
    next ? ` ${next.label} stores ${next.storageLabel}.` : ""
  } Delete documents you no longer need to make room.`;
}

// Step 1 of an upload: check the file and the quota, and hand back where to
// put it. The browser then uploads straight to Storage (files never pass
// through our server), and step 2 registers it. Storage and the database
// enforce the same rules again, so skipping this step gains nothing.
export async function prepareUpload({ providerId, enrollmentId, category, fileName, size, type }) {
  if (!DOCUMENT_CATEGORIES[category]) return { error: "Choose what kind of document this is." };
  if (!fileName || !size) return { error: "Choose a file." };
  if (size > MAX_FILE_BYTES) return { error: `That file is ${formatBytes(size)}. The limit is 10 MB per file.` };
  if (!ALLOWED_MIME_TYPES.includes(type)) return { error: "Upload a PDF, an image (JPG, PNG, HEIC) or a Word document." };

  const { supabase, org } = await getAppContext();
  const { data: provider } = await supabase
    .from("cred_providers")
    .select("id, org_id, client_org_id")
    .eq("id", providerId)
    .maybeSingle();
  if (!provider) return { error: "This provider no longer exists." };

  if (enrollmentId) {
    const { data: enrollment } = await supabase
      .from("cred_enrollments")
      .select("id")
      .eq("id", enrollmentId)
      .eq("provider_id", providerId)
      .maybeSingle();
    if (!enrollment) return { error: "This enrollment no longer exists." };
  }

  const { data: used } = await supabase.rpc("cred_storage_used_bytes", { p_org_id: org.id });
  if ((used ?? 0) + size > org.storage_limit_mb * 1024 * 1024) return { error: quotaMessage(org) };

  const path = `${provider.org_id}/${provider.client_org_id}/${provider.id}/${randomUUID()}-${storageSafeName(fileName)}`;
  return { path };
}

// Step 2: record the uploaded file against the provider (and enrollment). If
// the database refuses, the stored file is removed so nothing is orphaned.
export async function finalizeUpload({ providerId, enrollmentId, category, fileName, path }) {
  const { supabase, org } = await getAppContext();

  const { error } = await supabase.from("cred_documents").insert({
    provider_id: providerId,
    enrollment_id: enrollmentId || null,
    category,
    file_name: fileName.slice(0, 255),
    storage_path: path,
    size_bytes: 1, // replaced by the real size from Storage
  });

  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    if (error.message.includes("STORAGE_LIMIT_REACHED")) return { error: quotaMessage(org) };
    return { error: `Couldn't save the document: ${error.message}` };
  }

  refresh(providerId);
  return { saved: Date.now() };
}

export async function deleteDocument(documentId) {
  const { supabase } = await getAppContext();
  const { data: doc } = await supabase
    .from("cred_documents")
    .select("id, provider_id, storage_path")
    .eq("id", documentId)
    .maybeSingle();
  if (!doc) return;

  const { error: storageError } = await supabase.storage.from(BUCKET).remove([doc.storage_path]);
  if (storageError) throw new Error(storageError.message);
  const { error } = await supabase.from("cred_documents").delete().eq("id", doc.id);
  if (error) throw new Error(error.message);

  refresh(doc.provider_id);
}
