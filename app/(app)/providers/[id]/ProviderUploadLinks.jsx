import { getAppContext } from "@/lib/org";
import { DOCUMENT_CATEGORIES, formatBytes } from "@/lib/documents";
import { formatGeneratedAt } from "@/lib/reports";
import { scannerConfigured } from "@/lib/malware";
import { Badge, ICONS, ListSection, buttonClass, inputClass } from "@/components/app/ui";
import AutoRefresh from "@/components/app/AutoRefresh";
import SubmitButton from "@/components/app/SubmitButton";
import { createUploadLink, previewSubmission, revokeUploadLink, reviewSubmission } from "./upload-link-actions";
import { PreviewButton, UploadLinkForm } from "./UploadLinkForm";

// On a provider's Documents tab (pedido 2026-10-19, función 2): a link the
// provider can use to upload their own documents without an account, the
// links that are live, and what arrived through them waiting for review.
// Nothing uploaded this way reaches the provider's documents until someone
// here accepts it.
export default async function ProviderUploadLinks({ provider, readOnly }) {
  const { supabase } = await getAppContext();
  const [{ data: links }, { data: pending }] = await Promise.all([
    supabase.from("cred_upload_links").select("id, created_at, expires_at, revoked_at").eq("provider_id", provider.id).order("created_at", { ascending: false }),
    supabase.from("cred_document_submissions").select("id, category, file_name, size_bytes, submitted_at").eq("provider_id", provider.id).eq("status", "pending").order("submitted_at"),
  ]);
  const live = (links ?? []).filter((l) => !l.revoked_at && new Date(l.expires_at) > new Date());
  // No malware scanner configured: no new links (lib/malware.js fails closed).
  const enabled = scannerConfigured();
  if (!enabled && !(pending ?? []).length && !live.length) return null;

  return (
    <>
      {(pending ?? []).length > 0 && (
        <ListSection
          title={`Uploaded by ${provider.first_name}, waiting for review`}
          icon={ICONS.upload}
          tone="amber"
          count={pending.length}
          note="Check each file, then add it to the documents or discard it."
        >
          <ul className="divide-y divide-ink-100">
            {pending.map((s) => (
              <li key={s.id} className="flex flex-col gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="break-all text-sm font-semibold text-ink-900">{s.file_name}</p>
                  <p className="text-xs text-ink-500">
                    {DOCUMENT_CATEGORIES[s.category]} · {formatBytes(s.size_bytes)} · {formatGeneratedAt(s.submitted_at)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PreviewButton action={previewSubmission.bind(null, s.id)} />
                  {!readOnly && (
                    <>
                      <form action={reviewSubmission.bind(null, provider.id, s.id, true)} className="flex items-center gap-2">
                        <select name="category" defaultValue={s.category} className={`${inputClass.replace("w-full ", "")} w-auto py-1.5 text-sm`} aria-label="Document type">
                          {Object.entries(DOCUMENT_CATEGORIES).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <SubmitButton className={buttonClass("primary", "sm")} pendingLabel="Adding…">
                          Add to documents
                        </SubmitButton>
                      </form>
                      <form action={reviewSubmission.bind(null, provider.id, s.id, false)}>
                        <SubmitButton className={buttonClass("ghost", "sm")} pendingLabel="Discarding…">
                          Discard
                        </SubmitButton>
                      </form>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ListSection>
      )}

      {live.length > 0 && <AutoRefresh />}
      <ListSection
        title="Upload links"
        icon={ICONS.shield}
        count={live.length}
        note={`Let ${provider.first_name} upload their own files: upload only, expires, revocable, checked for malware.`}
      >
        <div className="flex flex-col gap-4 px-5 py-4">
          {!readOnly && enabled && <UploadLinkForm action={createUploadLink.bind(null, provider.id)} firstName={provider.first_name} />}
          {live.length > 0 && (
            <ul className="flex flex-col divide-y divide-ink-100 border-t border-ink-100 pt-1">
              {live.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-1 text-sm">
                  <span>
                    <Badge tone="green">Active</Badge>
                    <span className="ml-2 text-ink-700">
                      Created {formatGeneratedAt(l.created_at)} · expires {formatGeneratedAt(l.expires_at)}
                    </span>
                  </span>
                  <form action={revokeUploadLink.bind(null, provider.id, l.id)}>
                    <SubmitButton className={buttonClass("secondary", "sm")} pendingLabel="Revoking…">
                      Revoke
                    </SubmitButton>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ListSection>
    </>
  );
}
