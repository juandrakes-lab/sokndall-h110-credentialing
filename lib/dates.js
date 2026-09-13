// Accepts the date formats people actually paste from Excel: ISO
// (2026-01-31) or US slash notation (1/31/2026, 01/31/2026). Returns
// YYYY-MM-DD for Postgres, or null if it isn't a real calendar date
// (13/45/2020 and 2/30/2026 are rejected, not passed on to fail the insert).
export function normalizeDate(value) {
  if (!value) return null;
  const trimmed = value.trim();

  let parts = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  let year, month, day;
  if (parts) {
    [, year, month, day] = parts.map(Number);
  } else if ((parts = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) {
    [, month, day, year] = parts.map(Number);
  } else {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date.toISOString().slice(0, 10);
}
