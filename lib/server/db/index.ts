import path from "node:path";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { env } from "../env";
import { log } from "../log";
import { schema } from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export type DbOrTx = Db | Tx;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "DatabaseNotConfiguredError";
  }
}

type Connection = { db: Db; close: () => Promise<void>; kind: "postgres" | "embedded" };

const globalStore = globalThis as unknown as { __rchDb?: Promise<Connection> };

const migrationsFolder = () => path.join(process.cwd(), "drizzle");

async function connect(): Promise<Connection> {
  const url = env.databaseUrl;

  if (url) {
    const pool = new Pool({
      connectionString: url,
      max: env.databasePoolMax,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ...(env.databaseSsl === "disable" ? { ssl: false } : {}),
    });
    pool.on("error", (error) => log.error("db.pool_error", { error }));
    const db = drizzlePg(pool, { schema });
    if (env.autoMigrate) await migratePg(db, { migrationsFolder: migrationsFolder() });
    return { db, close: () => pool.end(), kind: "postgres" };
  }

  // The embedded database exists so the project runs and is testable with no
  // infrastructure. It is refused in production unless explicitly allowed.
  if (env.isProduction && !env.allowEmbeddedDb) throw new DatabaseNotConfiguredError();

  // Computed specifiers keep the bundler (and Vercel file tracing) from pulling
  // the ~20MB WASM database into production builds.
  const pgliteName = "@electric-sql/" + "pglite";
  const adapterName = "drizzle-orm/" + "pglite";
  const migratorName = "drizzle-orm/pglite/" + "migrator";
  const { PGlite } = (await import(pgliteName)) as typeof import("@electric-sql/pglite");
  const { drizzle } = (await import(adapterName)) as typeof import("drizzle-orm/pglite");
  const { migrate } = (await import(migratorName)) as typeof import("drizzle-orm/pglite/migrator");

  // PGlite's Node filesystem bundle does a plain (non-recursive) mkdir, so a
  // fresh checkout without a .data/ directory yet fails with ENOENT.
  if (env.embeddedDbDir !== "memory://") {
    const { mkdir } = await import("node:fs/promises");
    await mkdir(env.embeddedDbDir, { recursive: true });
  }

  const client = new PGlite(env.embeddedDbDir);
  await client.waitReady;
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: migrationsFolder() });
  log.warn("db.embedded_in_use", { note: "Using embedded PGlite database. Set DATABASE_URL for production." });
  return { db: db as unknown as Db, close: () => client.close(), kind: "embedded" };
}

async function connection(): Promise<Connection> {
  if (!globalStore.__rchDb) {
    globalStore.__rchDb = connect().catch((error) => {
      globalStore.__rchDb = undefined;
      throw error;
    });
  }
  return globalStore.__rchDb;
}

export async function getDb(): Promise<Db> {
  return (await connection()).db;
}

export async function dbKind() {
  return (await connection()).kind;
}

export async function closeDb(): Promise<void> {
  const pending = globalStore.__rchDb;
  globalStore.__rchDb = undefined;
  if (pending) await (await pending).close();
}

export function isDatabaseConfigured() {
  return Boolean(env.databaseUrl) || !env.isProduction || env.allowEmbeddedDb;
}

export * from "./schema";
