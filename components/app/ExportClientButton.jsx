"use client";

import { useState } from "react";
import { zip } from "@/lib/zip";
import { buttonClass } from "@/components/app/ui";

// Downloads one client's data — CSVs plus every document — as a single ZIP,
// assembled here in the browser (see app/(app)/clients/[id]/export).
export default function ExportClientButton({ clientId, onDone, size = "sm" }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  async function run() {
    setError(null);
    setProgress("Preparing the export…");
    try {
      const res = await fetch(`/clients/${clientId}/export`, { cache: "no-store" });
      const manifest = await res.json();
      if (!res.ok) throw new Error(manifest.error ?? "The export couldn't be prepared.");

      const entries = manifest.files.map((f) => ({ name: f.name, data: f.text }));
      for (const [i, doc] of manifest.documents.entries()) {
        setProgress(`Downloading documents ${i + 1} of ${manifest.documents.length}…`);
        const file = await fetch(doc.url);
        if (!file.ok) throw new Error(`Couldn't download ${doc.name}.`);
        entries.push({ name: doc.name, data: new Uint8Array(await file.arrayBuffer()) });
      }

      const url = URL.createObjectURL(zip(entries));
      const a = document.createElement("a");
      a.href = url;
      a.download = manifest.fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setProgress(null);
      onDone?.();
    } catch (err) {
      setProgress(null);
      setError(err.message);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={run} disabled={Boolean(progress)} className={`${buttonClass("secondary", size)} disabled:opacity-60`}>
        {progress && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
        {progress ?? "Export all data (ZIP)"}
      </button>
      {error && <span className="text-xs text-status-expired">{error}</span>}
    </span>
  );
}
