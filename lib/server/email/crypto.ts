import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { env } from "../env";

/** AES-256-GCM for secrets stored in the database (the SMTP password). Key derives from APP_SECRET. */
function key(): Buffer {
  const secret = env.appSecret;
  if (!secret || secret.length < 16) {
    throw new Error("APP_SECRET (at least 16 characters) is required to store secrets in the database.");
  }
  return createHash("sha256").update(`rch-settings:${secret}`).digest();
}

export function canEncrypt(): boolean {
  return Boolean(env.appSecret && env.appSecret.length >= 16);
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptSecret(payload: string): string | null {
  try {
    const [version, iv, tag, data] = payload.split(".");
    if (version !== "v1") return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
