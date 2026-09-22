import { z } from "zod";
import { ApiError, assertUuid, cleanText } from "../http";
import { parseLocalDateTime } from "../time";
import { env } from "../env";
import { validateUpload, type ValidatedFile } from "../uploads/validate";

export const idParam = (value: string, label = "Enquiry") => assertUuid(value, label);

/** Accepts an ISO timestamp or a `datetime-local` value (interpreted in the admin timezone). */
export function parseDue(value: string): Date {
  const local = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}$/.test(value) ? parseLocalDateTime(value) : new Date(value);
  if (!local || Number.isNaN(local.getTime())) throw new ApiError(400, "Enter a valid date and time.", "VALIDATION");
  const now = Date.now();
  if (local.getTime() < now - 366 * 86_400_000 || local.getTime() > now + 5 * 366 * 86_400_000) {
    throw new ApiError(400, "Choose a date within the next five years.", "VALIDATION");
  }
  return local;
}

export const dueSchema = z.string().trim().min(8).max(40);

const MAX_ADMIN_FILES = 8;

/** Reads and validates files posted by the admin (reply composer, drafts). */
export async function readAdminFiles(form: FormData, fieldName = "files"): Promise<ValidatedFile[]> {
  const raw = form.getAll(fieldName).filter((v): v is File => typeof v !== "string" && v.size > 0);
  if (raw.length > MAX_ADMIN_FILES) throw new ApiError(400, `Attach at most ${MAX_ADMIN_FILES} files at a time.`, "TOO_MANY_FILES");
  const files: ValidatedFile[] = [];
  for (const file of raw) {
    const result = validateUpload({ name: file.name, data: Buffer.from(await file.arrayBuffer()), declaredType: file.type }, { maxBytes: env.maxInternalFileBytes });
    if (!result.ok) throw new ApiError(400, `“${cleanText(file.name, 80)}” was not accepted: ${result.reason}`, "FILE_REJECTED");
    files.push(result.file);
  }
  return files;
}

export const emailSchema = z.string().trim().max(254).pipe(z.email());
