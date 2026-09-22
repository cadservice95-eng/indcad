/**
 * Upload validation. Never trusts the filename extension or the browser-declared
 * MIME type on its own: the extension must be allow-listed AND the file content
 * must match its format signature. Executable/script content is always rejected.
 */

export type ValidatedFile = {
  originalName: string;
  safeName: string;
  extension: string;
  mimeType: string;
  size: number;
  data: Buffer;
};

export type ValidationResult = { ok: true; file: ValidatedFile } | { ok: false; reason: string };

type Rule = { mime: string; check: (data: Buffer) => boolean | "zip" | "ooxml" };

const startsWith = (data: Buffer, ascii: string, offset = 0) => data.subarray(offset, offset + ascii.length).toString("latin1") === ascii;
const startsWithBytes = (data: Buffer, bytes: number[]) => bytes.every((b, i) => data[i] === b);
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

function looksLikeText(data: Buffer): boolean {
  const sample = data.subarray(0, 8192);
  if (sample.length === 0) return false;
  let suspicious = 0;
  for (const byte of sample) {
    if (byte === 0) return false;
    if (byte < 9 || (byte > 13 && byte < 32)) suspicious += 1;
  }
  return suspicious / sample.length < 0.02;
}

const RULES: Record<string, Rule> = {
  pdf: { mime: "application/pdf", check: (d) => d.subarray(0, 1024).includes("%PDF-") },
  png: { mime: "image/png", check: (d) => startsWithBytes(d, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  jpg: { mime: "image/jpeg", check: (d) => startsWithBytes(d, [0xff, 0xd8, 0xff]) },
  jpeg: { mime: "image/jpeg", check: (d) => startsWithBytes(d, [0xff, 0xd8, 0xff]) },
  webp: { mime: "image/webp", check: (d) => startsWith(d, "RIFF") && startsWith(d, "WEBP", 8) },
  dwg: { mime: "image/vnd.dwg", check: (d) => /^AC\d/.test(d.subarray(0, 6).toString("latin1")) },
  dxf: {
    mime: "image/vnd.dxf",
    check: (d) => startsWith(d, "AutoCAD Binary DXF") || (looksLikeText(d) && d.subarray(0, 2048).toString("latin1").includes("SECTION")),
  },
  // DGN v7/v8 have no single reliable signature; content is still screened for executables above.
  dgn: { mime: "application/octet-stream", check: () => true },
  step: { mime: "model/step", check: (d) => d.subarray(0, 512).toString("latin1").includes("ISO-10303-21") },
  stp: { mime: "model/step", check: (d) => d.subarray(0, 512).toString("latin1").includes("ISO-10303-21") },
  iges: { mime: "model/iges", check: looksLikeText },
  igs: { mime: "model/iges", check: looksLikeText },
  stl: { mime: "model/stl", check: (d) => d.length > 84 || looksLikeText(d) },
  rvt: { mime: "application/octet-stream", check: (d) => startsWithBytes(d, OLE) },
  skp: { mime: "application/vnd.sketchup.skp", check: (d) => d.subarray(0, 120).includes(Buffer.from("SketchUp Model", "utf16le")) },
  zip: { mime: "application/zip", check: () => "zip" },
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", check: () => "ooxml" },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", check: () => "ooxml" },
  txt: { mime: "text/plain", check: looksLikeText },
  csv: { mime: "text/csv", check: looksLikeText },
};

export const SERVER_ALLOWED_EXTENSIONS = Object.keys(RULES);

/** Extensions that are never accepted, wherever they appear in a filename or inside an archive. */
const DANGEROUS = new Set(
  (
    "exe dll bat cmd com scr pif msi msp js mjs cjs jse vbs vbe wsf wsh ps1 psm1 sh bash zsh php php3 php4 php5 php7 phtml phar " +
    "jsp asp aspx cgi pl py rb jar war apk app hta cpl lnk reg html htm xhtml svg swf iso img dmg vhd docm xlsm pptm dotm xltm " +
    "chm inf gadget appx msix jnlp command workflow ws scf url"
  ).split(" "),
);

const DANGEROUS_DECLARED = /^(application\/(x-msdownload|x-msdos-program|x-sh|x-csh|javascript|x-javascript|x-httpd-php|java-archive|x-executable)|text\/(html|javascript|x-shellscript)|image\/svg\+xml)/i;

function hasExecutableSignature(data: Buffer): boolean {
  const head = data.subarray(0, 64).toString("latin1").trimStart().toLowerCase();
  if (data[0] === 0x4d && data[1] === 0x5a) return true; // MZ (Windows PE)
  if (startsWithBytes(data, [0x7f, 0x45, 0x4c, 0x46])) return true; // ELF
  if (startsWithBytes(data, [0xfe, 0xed, 0xfa, 0xce]) || startsWithBytes(data, [0xfe, 0xed, 0xfa, 0xcf])) return true; // Mach-O
  if (startsWithBytes(data, [0xce, 0xfa, 0xed, 0xfe]) || startsWithBytes(data, [0xcf, 0xfa, 0xed, 0xfe])) return true;
  if (startsWithBytes(data, [0xca, 0xfe, 0xba, 0xbe])) return true; // Java class / fat Mach-O
  return (
    head.startsWith("#!") ||
    head.startsWith("<?php") ||
    head.startsWith("<%") ||
    head.startsWith("<script") ||
    head.startsWith("<html") ||
    head.startsWith("<!doctype html") ||
    head.startsWith("<svg")
  );
}

/** Lists entry names from a ZIP central directory without decompressing anything. */
export function listZipEntries(data: Buffer): string[] | null {
  const minEocd = 22;
  if (data.length < minEocd) return null;
  let eocd = -1;
  for (let i = data.length - minEocd; i >= Math.max(0, data.length - minEocd - 65535); i -= 1) {
    if (data.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;
  const total = data.readUInt16LE(eocd + 10);
  let offset = data.readUInt32LE(eocd + 16);
  if (total === 0xffff || offset === 0xffffffff) return []; // ZIP64: cannot inspect cheaply
  const names: string[] = [];
  for (let n = 0; n < Math.min(total, 5000); n += 1) {
    if (offset + 46 > data.length || data.readUInt32LE(offset) !== 0x02014b50) return null;
    const flags = data.readUInt16LE(offset + 8);
    const nameLength = data.readUInt16LE(offset + 28);
    const extraLength = data.readUInt16LE(offset + 30);
    const commentLength = data.readUInt16LE(offset + 32);
    const nameEnd = offset + 46 + nameLength;
    if (nameEnd > data.length) return null;
    names.push(data.subarray(offset + 46, nameEnd).toString(flags & 0x800 ? "utf8" : "latin1"));
    offset = nameEnd + extraLength + commentLength;
  }
  return names;
}

function extensionsOf(filename: string): string[] {
  const parts = filename.toLowerCase().split(".");
  return parts.length > 1 ? parts.slice(1) : [];
}

export function sanitizeFilename(input: string): { display: string; safe: string; extension: string } {
  const stripped = input.replace(/[\u0000-\u001F\u007F]/g, "").normalize("NFKC");
  const base = stripped.split(/[\\/]/).pop()?.trim() ?? "";
  const cleaned = base.replace(/[^A-Za-z0-9._ ()-]/g, "_").replace(/\s+/g, " ").replace(/^\.+/, "").slice(-120) || "file";
  const dot = cleaned.lastIndexOf(".");
  const extension = dot > 0 ? cleaned.slice(dot + 1).toLowerCase() : "";
  return { display: (base || "file").slice(0, 255), safe: cleaned, extension };
}

export function validateUpload(
  input: { name: string; data: Buffer; declaredType?: string | null },
  options?: { maxBytes?: number },
): ValidationResult {
  const { display, safe, extension } = sanitizeFilename(input.name);
  const size = input.data.length;
  const fail = (reason: string): ValidationResult => ({ ok: false, reason: `${display}: ${reason}` });

  if (size === 0) return fail("the file is empty.");
  if (options?.maxBytes && size > options.maxBytes) {
    return fail(`the file is larger than ${Math.floor(options.maxBytes / 1024 / 1024)}MB.`);
  }
  if (extensionsOf(safe).some((ext) => DANGEROUS.has(ext))) return fail("this file type is not allowed.");
  if (input.declaredType && DANGEROUS_DECLARED.test(input.declaredType)) return fail("this file type is not allowed.");
  const rule = RULES[extension];
  if (!rule) return fail("this file type is not supported.");
  if (hasExecutableSignature(input.data)) return fail("this file type is not allowed.");

  const verdict = rule.check(input.data);
  if (verdict === false) return fail("the file content does not match its file type.");
  if (verdict === "zip" || verdict === "ooxml") {
    if (!startsWithBytes(input.data, [0x50, 0x4b, 0x03, 0x04]) && !startsWithBytes(input.data, [0x50, 0x4b, 0x05, 0x06])) {
      return fail("the file content does not match its file type.");
    }
    const entries = listZipEntries(input.data);
    if (entries === null) return fail("the archive could not be read.");
    if (entries.some((entry) => extensionsOf(entry.split("/").pop() ?? "").some((ext) => DANGEROUS.has(ext)))) {
      return fail("the archive contains a file type that is not allowed.");
    }
    if (verdict === "ooxml" && !entries.includes("[Content_Types].xml")) return fail("the file content does not match its file type.");
  }

  return { ok: true, file: { originalName: display, safeName: safe, extension, mimeType: rule.mime, size, data: input.data } };
}
