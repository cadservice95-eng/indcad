import { promises as fs } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { attachmentBlobs, getDb, type DbOrTx } from "../db";
import { env } from "../env";

/**
 * Attachment storage. `database` (default) keeps files in Postgres so the app
 * works on serverless hosts with no extra service. `local` writes to disk
 * (self-hosted / VPS). The rest of the app only sees put/get/remove.
 */
export type PutResult = { key: string };

function localRoot() {
  // The upload directory is configuration, not a project file: keep it out of the file trace.
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), env.uploadDir);
}

function resolveLocal(key: string): string {
  const root = localRoot();
  const target = path.resolve(/*turbopackIgnore: true*/ root, key);
  // Path-traversal guard: the resolved path must stay inside the upload root.
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Invalid storage key.");
  return target;
}

export async function putFile(db: DbOrTx, attachmentId: string, data: Buffer): Promise<PutResult> {
  if (env.storageDriver === "local") {
    const key = `${new Date().getUTCFullYear()}/${attachmentId}`;
    const target = resolveLocal(key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, data, { mode: 0o600 });
    return { key: `local:${key}` };
  }
  await db.insert(attachmentBlobs).values({ attachmentId, data });
  return { key: `db:${attachmentId}` };
}

export async function getFile(storageKey: string): Promise<Buffer | null> {
  if (storageKey.startsWith("local:")) {
    try {
      return await fs.readFile(resolveLocal(storageKey.slice("local:".length)));
    } catch {
      return null;
    }
  }
  if (storageKey.startsWith("db:")) {
    const db = await getDb();
    const [row] = await db
      .select({ data: attachmentBlobs.data })
      .from(attachmentBlobs)
      .where(eq(attachmentBlobs.attachmentId, storageKey.slice("db:".length)))
      .limit(1);
    return row?.data ?? null;
  }
  return null;
}

/** Removes a stored file. Database-backed blobs are removed by cascade with their attachment row. */
export async function removeFile(storageKey: string): Promise<void> {
  if (storageKey.startsWith("local:")) {
    await fs.rm(resolveLocal(storageKey.slice("local:".length)), { force: true });
  }
}

export async function storageHealth(): Promise<{ ok: boolean; driver: string; detail?: string }> {
  try {
    if (env.storageDriver === "local") {
      const root = localRoot();
      await fs.mkdir(root, { recursive: true });
      const probe = path.join(root, `.probe-${process.pid}`);
      await fs.writeFile(probe, "ok");
      await fs.rm(probe, { force: true });
      return { ok: true, driver: "local" };
    }
    const db = await getDb();
    await db.select({ id: attachmentBlobs.attachmentId }).from(attachmentBlobs).limit(1);
    return { ok: true, driver: "database" };
  } catch (error) {
    return { ok: false, driver: env.storageDriver, detail: error instanceof Error ? error.message.slice(0, 120) : "error" };
  }
}
