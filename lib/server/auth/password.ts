import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// scrypt (memory-hard) from Node's standard library: no native module to build on Vercel.
const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 128 * N * R * 2;

function derive(password: string, salt: Buffer, n: number, r: number, p: number, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, keyLength, { N: n, r, p, maxmem: Math.max(MAX_MEM, 128 * n * r * 2) }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P, KEY_LENGTH);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nRaw, rRaw, pRaw, saltB64, keyB64] = parts;
  const n = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (![n, r, p].every(Number.isInteger) || n < 2 ** 12 || n > 2 ** 20) return false;
  const expected = Buffer.from(keyB64, "base64");
  const actual = await derive(password, Buffer.from(saltB64, "base64"), n, r, p, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

let dummyHash: Promise<string> | undefined;

/** Burn the same CPU as a real check so unknown emails are indistinguishable by timing. */
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hashPassword(randomBytes(12).toString("hex"));
  await verifyPassword(password, await dummyHash);
  return false;
}

const COMMON = new Set(["password1234", "123456789012", "qwertyuiop12", "administrator1", "letmein12345"]);

export function passwordProblem(password: string, email?: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters long.";
  if (password.length > 200) return "Password is too long.";
  if (COMMON.has(password.toLowerCase())) return "That password is too common.";
  if (email && password.toLowerCase().includes(email.split("@")[0].toLowerCase()) && email.split("@")[0].length >= 4) {
    return "Password must not contain your email name.";
  }
  if (!/[a-z]/i.test(password) || !/[0-9]/.test(password)) return "Use both letters and numbers.";
  return null;
}
