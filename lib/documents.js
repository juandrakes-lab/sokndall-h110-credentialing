// Provider documents (alcance §3.8). Provider paperwork only — licenses,
// certificates, tax forms, contracts, payer letters. Never patient records.

export const DOCUMENT_CATEGORIES = {
  license: "State license",
  dea: "DEA registration",
  malpractice: "Malpractice certificate",
  board_cert: "Board certification",
  w9: "W-9",
  cv: "CV / work history",
  contract: "Signed contract",
  approval_letter: "Payer approval letter",
  other: "Other",
};

export const DOCUMENT_CATEGORY_KEYS = Object.keys(DOCUMENT_CATEGORIES);

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

// Must match the bucket's allowed_mime_types (Fase 3 migration).
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx";

const MIME_BY_EXTENSION = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  heic: "image/heic",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// Some browsers report no type for .heic (and the odd .doc); fall back to the extension.
export function mimeFor(file) {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return MIME_BY_EXTENSION[ext] ?? "";
}

export const BUCKET = "cred-documents";

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// Storage keys: ASCII only, no slashes. The original name is kept on the row.
export function storageSafeName(name) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(-120);
  return cleaned || "document";
}
