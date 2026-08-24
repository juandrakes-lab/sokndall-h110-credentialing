// Accepts the date formats people actually paste from Excel: ISO
// (2026-01-31) or US slash notation (1/31/2026, 01/31/2026). Returns
// YYYY-MM-DD for Postgres, or null if it doesn't look like a date.
export function normalizeDate(value) {
  if (!value) return null;
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usMatch) {
    const [, month, day, year] = usMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return null;
}
