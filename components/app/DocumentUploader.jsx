"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { finalizeUpload, prepareUpload } from "@/lib/document-actions";
import {
  ACCEPT_ATTR,
  ALLOWED_MIME_TYPES,
  BUCKET,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_KEYS,
  MAX_FILE_BYTES,
  formatBytes,
  mimeFor,
} from "@/lib/documents";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";

// Upload one provider document. The file goes from the browser straight to
// private Storage; the server only checks and records it.
//
//   providerId     fixed provider, or omit and pass `providers` to choose one
//   enrollmentId   attach to an enrollment as well (payer contracts, letters)
export default function DocumentUploader({ providerId, providers, enrollmentId, defaultCategory = "license", compact = false }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [category, setCategory] = useState(defaultCategory);
  const [chosenProvider, setChosenProvider] = useState(providerId ?? "");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  function pick(e) {
    setError(null);
    setNotice(null);
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_FILE_BYTES) {
      setError(`That file is ${formatBytes(f.size)}. The limit is 10 MB per file.`);
      e.target.value = "";
      return;
    }
    if (f && !ALLOWED_MIME_TYPES.includes(mimeFor(f))) {
      setError("Upload a PDF, an image (JPG, PNG, HEIC) or a Word document.");
      e.target.value = "";
      return;
    }
    setFile(f);
  }

  async function upload(e) {
    e.preventDefault();
    if (!file || !chosenProvider) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    const meta = { providerId: chosenProvider, enrollmentId, category, fileName: file.name };
    const type = mimeFor(file);
    const prepared = await prepareUpload({ ...meta, size: file.size, type });
    if (prepared.error) {
      setError(prepared.error);
      setBusy(false);
      return;
    }

    const { error: uploadError } = await createClient()
      .storage.from(BUCKET)
      .upload(prepared.path, file, { contentType: type, upsert: false });
    if (uploadError) {
      setError(`The upload failed: ${uploadError.message}`);
      setBusy(false);
      return;
    }

    const result = await finalizeUpload({ ...meta, path: prepared.path });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setNotice(`${file.name} uploaded.`);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <form onSubmit={upload} className="flex flex-col gap-4">
      <FormError message={error} />
      <FormNotice message={notice} />
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        {providers && (
          <Field label="Provider" htmlFor="doc-provider" className={compact ? "" : "sm:col-span-2"}>
            <select id="doc-provider" value={chosenProvider} onChange={(e) => setChosenProvider(e.target.value)} className={inputClass}>
              <option value="">Choose a provider</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name}, {p.first_name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Document" htmlFor={`doc-category-${enrollmentId ?? providerId ?? "any"}`}>
          <select
            id={`doc-category-${enrollmentId ?? providerId ?? "any"}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {DOCUMENT_CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>
                {DOCUMENT_CATEGORIES[key]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="File" htmlFor={`doc-file-${enrollmentId ?? providerId ?? "any"}`} hint="PDF, image or Word, up to 10 MB.">
          <input
            ref={inputRef}
            id={`doc-file-${enrollmentId ?? providerId ?? "any"}`}
            type="file"
            accept={ACCEPT_ATTR}
            onChange={pick}
            className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-lg file:border file:border-ink-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink-900 hover:file:bg-ink-50"
          />
        </Field>
      </div>
      <p className="text-xs text-ink-500">Provider paperwork only. Never upload anything with patient information.</p>
      <div>
        <button type="submit" disabled={!file || !chosenProvider || busy} className={buttonClass("primary")}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
