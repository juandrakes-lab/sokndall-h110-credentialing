"use client";

import { useState, useTransition } from "react";
import { parseCsv } from "@/lib/csv";

export default function ImportWizard({ title, description, targetFields, onImport, doneHref, doneLabel }) {
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

    const reader = new FileReader();
    reader.onload = () => {
      const { headers: parsedHeaders, rows } = parseCsv(String(reader.result));
      if (parsedHeaders.length === 0) {
        setError("Couldn't find any columns in that file.");
        return;
      }

      const guessedMapping = {};
      for (const header of parsedHeaders) {
        const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, "_");
        const match = targetFields.find((f) => f.key === normalized);
        if (match) guessedMapping[header] = match.key;
      }

      setHeaders(parsedHeaders);
      setDataRows(rows);
      setMapping(guessedMapping);
      setStep("map");
    };
    reader.readAsText(file);
  }

  function buildMappedRows() {
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
    const mappedRows = buildMappedRows();
    startTransition(async () => {
      try {
        const outcome = await onImport(mappedRows);
        setResult(outcome);
        setStep("result");
      } catch (err) {
        setError(err.message);
      }
    });
  }

  const mappedPreview = step === "map" ? buildMappedRows().slice(0, 5) : [];
  const requiredFields = targetFields.filter((f) => f.required);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
      </div>

      {error && <p className="text-sm text-status-expired">{error}</p>}

      {step === "upload" && (
        <div className="rounded-lg border border-dashed border-ink-200 bg-white p-8 text-center">
          <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
          <p className="mt-2 text-xs text-ink-500">CSV files only. First row must be column headers.</p>
        </div>
      )}

      {step === "map" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-ink-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">
              Map columns from {fileName} ({dataRows.length} rows)
            </h2>
            <div className="flex flex-col gap-2">
              {headers.map((header) => (
                <div key={header} className="grid grid-cols-2 items-center gap-3">
                  <span className="truncate text-sm text-ink-700">{header}</span>
                  <select
                    value={mapping[header] ?? ""}
                    onChange={(e) => setMapping({ ...mapping, [header]: e.target.value })}
                    className="rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-brand-600"
                  >
                    <option value="">Don&apos;t import</option>
                    {targetFields.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                        {f.required ? " *" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {requiredFields.length > 0 && (
              <p className="mt-3 text-xs text-ink-500">
                * Required: {requiredFields.map((f) => f.label).join(", ")}. Rows missing a required
                value are skipped and reported after import.
              </p>
            )}
          </div>

          <div className="overflow-auto rounded-lg border border-ink-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink-100 text-ink-500">
                <tr>
                  {targetFields.map((f) => (
                    <th key={f.key} className="px-3 py-2 font-medium">
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {mappedPreview.map((row, i) => (
                  <tr key={i}>
                    {targetFields.map((f) => (
                      <td key={f.key} className="px-3 py-2 text-ink-700">
                        {row[f.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {dataRows.length > 5 && (
              <p className="px-3 py-2 text-xs text-ink-500">
                Showing first 5 of {dataRows.length} rows.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={isPending}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {isPending ? "Importing..." : `Import ${dataRows.length} rows`}
            </button>
            <button
              type="button"
              onClick={() => setStep("upload")}
              className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              Choose a different file
            </button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="rounded-lg border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-900">
            Imported <strong>{result.inserted}</strong> row{result.inserted === 1 ? "" : "s"}.
          </p>
          {result.errors?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-status-expired">{result.errors.length} row(s) skipped:</p>
              <ul className="mt-1 list-inside list-disc text-xs text-ink-500">
                {result.errors.slice(0, 20).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          <a
            href={doneHref}
            className="mt-4 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {doneLabel}
          </a>
        </div>
      )}
    </div>
  );
}
