export {};

/**
 * Applies database migrations. Run once per deploy, before the app starts:
 *   npm run db:migrate
 * On Vercel, set the build command to `npm run db:migrate && npm run build`.
 */
process.env.AUTO_MIGRATE = "true";

async function main() {
  const { closeDb, dbKind, getDb } = await import("../lib/server/db");
  await getDb();
  console.log(`Migrations applied (${await dbKind()} database).`);
  await closeDb();
}

main().catch((error) => {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
