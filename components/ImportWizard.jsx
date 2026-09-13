"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { parseCsv } from "@/lib/csv";
import { Card, FormError, buttonClass, inputClass } from "@/components/app/ui";

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Excel's "CSV UTF-8" starts the file with a byte-order mark.
const stripBom = (text) => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

// CSV import in three steps: pick a file → check the column mapping against a
// preview → import, with a per-row report of anything skipped (alcance §3.14).
//
//   targetFields  [{ key, label, required?, aliases? }] — aliases are other
//                 header spellings recognised automatically ("Last Name", "Surname")
//   onImport      server action receiving the mapped rows; returns
//                 { inserted, errors: [string], notice? }
export default function ImportWizard({ targetFields, onImport, doneHref, doneLabel, templateHref }) {
  const [step, setStep] = useState("upload"); // upload | map | result
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setFileName(file.name);
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      const { headers: parsedHeaders, rows } = parseCsv(stripBom(String(reader.result)));
      if (parsedHeaders.length === 0 || rows.length === 0) {
        setError("That file has no rows to import. The first row must be the column names.");
        return;
      }

      const guessed = {};
      const taken = new Set();
      for (const header of parsedHeaders) {
        const h = norm(header);
        const match = targetFields.find(
          (f) => !taken.has(f.key) && (norm(f.key) === h || norm(f.label) === h || (f.aliases ?? []).some((a) => norm(a) === h))
        );
        if (match) {
          guessed[header] = match.key;
          taken.add(match.key);
        }
      }

      setHeaders(parsedHeaders);
      setDataRows(rows);
      setMapping(guessed);
      setStep("map");
    };
    reader.readAsText(file);
  }

  function mappedRows() {
    return dataRows.map((row) => {
      const obj = {};
      headers.forEach((header, i) => {
        const key = mapping[header];
        if (key) {
          const value = row[i]?.trim();
          obj[key] = value ? value : null;
        }
      });
      return obj;
    });
  }

  function handleImport() {
    const rows = mappedRows();
    startTransition(async () => {
      try {
        setResult(await onImport(rows));
        setStep("result");
      } catch (err) {
        setError(err.message);
      }
    });
  }

  const mappedKeys = new Set(Object.values(mapping).filter(Boolean));
  const missingRequired = targetFields.filter((f) => f.required && !mappedKeys.has(f.key));
  const preview = step === "map" ? mappedRows().slice(0, 5) : [];
  const shownFields = targetFields.filter((f) => mappedKeys.has(f.key));

  return (
    <div className="flex flex-col gap-6">
      <FormError message={error} />

      {step === "upload" && (
        <Card className="px-6 py-10 text-center">
          <label className="mx-auto flex max-w-md cursor-pointer flex-col items-center gap-3">
            <span className={buttonClass("primary")}>Choose a CSV file</span>
            <input type="file" accept=".csv,text/csv" onChange={handleFile} className="sr-only" />
            <span className="text-sm text-ink-500">
              Save your spreadsheet as CSV first (in Excel: File → Save As → CSV). The first row must be the column names.
            </span>
          </label>
          {templateHref && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
            <a href={templateHref} className={`${buttonClass("link")} mt-4 inline-block text-sm`}>
              Download an example file
            </a>
          )}
        </Card>
      )}

      {step === "map" && (
        <>
          <Card className="px-5 py-5">
            <h2 className="text-sm font-semibold text-ink-900">
              {fileName} · {dataRows.length} row{dataRows.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-1 text-sm text-ink-500">Match each of your columns to a Sokndall field. We guessed where we could.</p>
            <div className="mt-4 flex flex-col divide-y divide-ink-100">
              {headers.map((header) => (
                <div key={header} className="grid items-center gap-3 py-2 sm:grid-cols-2">
                  <span className="truncate text-sm text-ink-700">{header}</span>
                  <select
                    value={mapping[header] ?? ""}
                    onChange={(e) => setMapping({ ...mapping, [header]: e.target.value })}
                    className={inputClass}
                    aria-label={`Field for column ${header}`}
                  >
                    <option value="">Don&apos;t import this column</option>
                    {targetFields.map((f) => (
                      <option key={f.key} value={f.key} disabled={mappedKeys.has(f.key) && mapping[header] !== f.key}>
                        {f.label}
                        {f.required ? " (required)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {missingRequired.length > 0 && (
              <p className="mt-3 text-sm text-status-expired">
                Still to match: {missingRequired.map((f) => f.label).join(", ")}.
              </p>
            )}
          </Card>

          {shownFields.length > 0 && (
            <Card className="overflow-hidden">
              <div className="border-b border-ink-100 px-5 py-3 text-sm font-semibold text-ink-900">
                Preview{dataRows.length > 5 ? ` — first 5 of ${dataRows.length}` : ""}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ink-50 text-ink-500">
                    <tr>
                      {shownFields.map((f) => (
                        <th key={f.key} className="whitespace-nowrap px-3 py-2 font-medium">
                          {f.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {preview.map((row, i) => (
                      <tr key={i}>
                        {shownFields.map((f) => (
                          <td key={f.key} className="whitespace-nowrap px-3 py-2 text-ink-700">
                            {row[f.key] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleImport} disabled={isPending || missingRequired.length > 0} className={buttonClass("primary")}>
              {isPending ? "Importing…" : `Import ${dataRows.length} row${dataRows.length === 1 ? "" : "s"}`}
            </button>
            <button type="button" onClick={() => setStep("upload")} className={buttonClass("secondary")}>
              Choose a different file
            </button>
          </div>
        </>
      )}

      {step === "result" && result && (
        <Card className="px-5 py-5">
          <p className="text-base font-semibold text-ink-900">
            Imported {result.inserted} row{result.inserted === 1 ? "" : "s"}.
          </p>
          {result.notice && <p className="mt-1 text-sm text-ink-700">{result.notice}</p>}
          {result.errors?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-status-expired">
                {result.errors.length} row{result.errors.length === 1 ? " was" : "s were"} skipped:
              </p>
              <ul className="mt-2 max-h-72 list-inside list-disc overflow-y-auto text-sm text-ink-700">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-5 flex gap-3">
            <Link href={doneHref} className={buttonClass("primary")}>
              {doneLabel}
            </Link>
            <button type="button" onClick={() => setStep("upload")} className={buttonClass("secondary")}>
              Import another file
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
