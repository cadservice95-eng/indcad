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

export const FILE_ACCEPT = ".pdf,.dwg,.dxf,.dgn,.step,.stp,.iges,.igs,.rvt,.skp,.zip";
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const ACCEPTED_FILE_EXTENSIONS = FILE_ACCEPT.split(",");

export function isFileAccepted(file: File) {
  const name = file.name.toLowerCase();
  const extensionOk = ACCEPTED_FILE_EXTENSIONS.some((ext) => name.endsWith(ext));
  return extensionOk && file.size <= MAX_FILE_SIZE_BYTES;
}
