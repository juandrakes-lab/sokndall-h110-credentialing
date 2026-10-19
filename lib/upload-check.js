// That a file's bytes are the type its name and declared type say — so a
// program renamed "license.pdf" is refused before it is kept. The same types
// as /documents (lib/documents.js and the bucket's allowed_mime_types).

const SIGNATURES = {
  "application/pdf": (b) => ascii(b, 0, 5) === "%PDF-",
  "image/png": (b) => b[0] === 0x89 && ascii(b, 1, 4) === "PNG",
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/heic": (b) => ascii(b, 4, 8) === "ftyp" && /^(heic|heix|hevc|hevx|mif1|msf1|heim|heis)$/.test(ascii(b, 8, 12)),
  // Legacy Word: an OLE compound file.
  "application/msword": (b) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0,
  // .docx: a ZIP whose entries include word/.
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (b) =>
    b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 && Buffer.from(b.subarray(0, Math.min(b.length, 65536))).includes("word/"),
};

function ascii(bytes, from, to) {
  return String.fromCharCode(...bytes.subarray(from, to));
}

export function bytesMatchType(bytes, mime) {
  const test = SIGNATURES[mime];
  return Boolean(test && bytes.length >= 12 && test(bytes));
}
