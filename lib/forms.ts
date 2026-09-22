export const QUOTE_SERVICE_OPTIONS = [
  "Mechanical",
  "Structural",
  "Architectural",
  "Civil",
  "Electrical",
  "BIM",
  "CAD Conversion",
  "Engineering Design",
  "Other",
] as const;

export const PROJECT_TYPE_OPTIONS = [
  "New design / new build",
  "Existing project update or revision",
  "Legacy drawing conversion / digitisation",
  "Ongoing / overflow drafting capacity",
  "Other",
] as const;

/**
 * Attachment limits for the public forms. The 4MB total matches the server default
 * (MAX_UPLOAD_TOTAL_MB) and stays under the ~4.5MB request-body limit of serverless
 * hosting. Larger files can be sent by replying to the confirmation email.
 */
export const FILE_ACCEPT =
  ".pdf,.dwg,.dxf,.dgn,.step,.stp,.iges,.igs,.stl,.rvt,.skp,.zip,.png,.jpg,.jpeg,.webp,.docx,.xlsx,.txt,.csv";
export const MAX_TOTAL_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_FILES = 5;
export const ACCEPTED_FILE_EXTENSIONS = FILE_ACCEPT.split(",");
export const FILE_HINT = "PDF, DWG, DXF, DGN, STEP, IGES, STL, RVT, SKP, ZIP, images, DOCX or XLSX — up to 4MB in total.";

/** Returns a user-facing message when the selection can't be uploaded, otherwise null. */
export function validateSelectedFiles(files: File[]): string | null {
  if (files.length > MAX_UPLOAD_FILES) return `Attach up to ${MAX_UPLOAD_FILES} files.`;
  for (const file of files) {
    const name = file.name.toLowerCase();
    if (!ACCEPTED_FILE_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      return `${file.name} isn't a supported file type. ${FILE_HINT}`;
    }
  }
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_UPLOAD_BYTES) {
    return "Attachments are limited to 4MB in total. Send larger files by replying to our confirmation email.";
  }
  return null;
}
