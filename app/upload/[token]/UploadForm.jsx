"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACCEPT_ATTR, BUCKET, DOCUMENT_CATEGORIES, MAX_FILE_BYTES, mimeFor } from "@/lib/documents";
import { Field, buttonClass, inputClass } from "@/components/app/ui";
import { finishUpload, startUpload } from "../actions";

// What the provider fills in: which document it is, and the file. Shows a
// step-by-step progress line and, once done, only the name of what they just
// sent — never anything already stored.
const CATEGORIES = Object.entries(DOCUMENT_CATEGORIES).filter(([k]) => !["contract", "approval_letter"].includes(k));

export default function UploadForm({ token }) {
  const [category, setCategory] = useState("license");
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(null);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState([]);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!file) return setError("Choose a file first.");
    if (file.size > MAX_FILE_BYTES) return setError("Files can be up to 10 MB.");
    const type = mimeFor(file);
    try {
      setStep("Checking the link…");
      const start = await startUpload(token, { name: file.name, size: file.size, type });
      if (start.error) throw new Error(start.error);
      setStep("Uploading…");
      const { error: upErr } = await createClient().storage.from(BUCKET).uploadToSignedUrl(start.path, start.uploadToken, file, { contentType: type });
      if (upErr) throw new Error("The upload didn't go through. Try again.");
      setStep("Running the security check…");
      const done = await finishUpload(token, start.path, { name: file.name, type, category });
      if (done.error) throw new Error(done.error);
      setSent((s) => [...s, { name: file.name, label: DOCUMENT_CATEGORIES[category] }]);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setStep(null);
    }
  }

  const busy = Boolean(step);
  return (
    <div className="flex flex-col gap-4">
      {sent.length > 0 && (
        <div className="rounded-xl bg-status-active-bg px-4 py-3 text-sm text-ink-900 ring-1 ring-inset ring-status-active/20" role="status">
          <p className="font-semibold">Received. Thank you.</p>
          <ul className="mt-1 list-disc pl-5 text-ink-700">
            {sent.map((s, i) => (
              <li key={i}>
                {s.label}: {s.name}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-ink-700">You can send another one below.</p>
        </div>
      )}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Which document is this?" htmlFor="up-cat">
          <select id="up-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} disabled={busy}>
            {CATEGORIES.map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="File (PDF, JPG, PNG, HEIC or Word, up to 10 MB)" htmlFor="up-file">
          <input id="up-file" type="file" accept={ACCEPT_ATTR} onChange={(e) => setFile(e.target.files?.[0] ?? null)} disabled={busy} className="text-sm" />
        </Field>
        {error && <p className="text-sm text-status-expired" role="alert">{error}</p>}
        <button type="submit" disabled={busy} aria-busy={busy} className={`${buttonClass("primary")} inline-flex items-center justify-center gap-2 disabled:opacity-60`}>
          {busy && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
          {step ?? "Send document"}
        </button>
      </form>
    </div>
  );
}
