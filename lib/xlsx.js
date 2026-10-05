import { unzipSync, strFromU8 } from "fflate";

// A minimal .xlsx reader for the template importer: every sheet as rows of
// cell values. Server-only. An .xlsx is a zip of XML parts; this reads the
// workbook (sheet names), the shared strings and each sheet's cells. Formula
// cells give their cached value — the one Excel or Sheets last calculated —
// which is what the person saw. Dates are numbers here (Excel serials);
// excelDate() turns one into YYYY-MM-DD.
//
// Not a general-purpose parser: no styles, no rich-text formatting, no merged
// cells. The template doesn't use them, and anything it can't read comes back
// as an empty cell rather than an error.

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");

// All the <t> runs of a shared string or inline string, joined.
const textOf = (xml) => decode([...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(""));

// "AB" → 27 (zero-based column index).
function columnIndex(letters) {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export class XlsxError extends Error {}

export function readWorkbook(buffer) {
  let files;
  try {
    files = unzipSync(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer));
  } catch {
    throw new XlsxError("That file isn't an .xlsx spreadsheet.");
  }
  const part = (path) => (files[path] ? strFromU8(files[path]) : null);

  const workbook = part("xl/workbook.xml");
  const rels = part("xl/_rels/workbook.xml.rels");
  if (!workbook || !rels) throw new XlsxError("That file isn't an .xlsx spreadsheet.");

  const shared = [...(part("xl/sharedStrings.xml") ?? "").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));

  const sheets = {};
  for (const m of workbook.matchAll(/<sheet\b[^>]*?\bname="([^"]*)"[^>]*?\br:id="([^"]*)"/g)) {
    const name = decode(m[1]);
    const rel = rels.match(new RegExp(`<Relationship\\b[^>]*\\bId="${m[2]}"[^>]*\\bTarget="([^"]*)"`));
    if (!rel) continue;
    const target = rel[1].replace(/^\/?xl\//, "").replace(/^\//, "");
    const xml = part(`xl/${target}`);
    if (!xml) continue;

    const rows = [];
    for (const r of xml.matchAll(/<row\b[^>]*\br="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
      const cells = [];
      for (const c of r[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const ref = c[1].match(/\br="([A-Z]+)\d+"/);
        if (!ref) continue;
        const type = c[1].match(/\bt="(\w+)"/)?.[1];
        const body = c[2] ?? "";
        const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
        let value = null;
        if (type === "s" && v !== undefined) value = shared[Number(v)] ?? null;
        else if (type === "inlineStr") value = textOf(body);
        else if (type === "str" && v !== undefined) value = decode(v);
        else if (type === "b" && v !== undefined) value = v === "1";
        else if (v !== undefined) value = Number.isFinite(Number(v)) ? Number(v) : decode(v);
        cells[columnIndex(ref[1])] = value;
      }
      rows[Number(r[1]) - 1] = cells;
    }
    sheets[name] = rows;
  }
  return sheets;
}

// An Excel date serial (days since 1899-12-30) → "YYYY-MM-DD". Strings that
// already look like dates are left to the caller's own date parser.
export function excelDate(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1 || value > 2958465) return null;
  const ms = Math.round((value - 25569) * 86400000);
  return new Date(ms).toISOString().slice(0, 10);
}
