export {};

/**
 * Creates the one and only admin account.
 *   ADMIN_EMAIL=you@example.com ADMIN_INITIAL_PASSWORD='a-long-passphrase' npm run admin:create
 * Refuses to run if an admin already exists. The password must be changed at first sign-in.
 */
process.env.AUTO_MIGRATE = "true";

async function main() {
  const { closeDb, getDb, admins } = await import("../lib/server/db");
  const { hashPassword, passwordProblem } = await import("../lib/server/auth/password");
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD.");
  const problem = passwordProblem(password, email);
  if (problem) throw new Error(problem);

  const db = await getDb();
  const existing = await db.select({ id: admins.id }).from(admins).limit(1);
  if (existing.length) throw new Error("An admin account already exists. This system supports exactly one admin.");
  await db.insert(admins).values({ email, name: "Admin", passwordHash: await hashPassword(password), mustChangePassword: true });
  console.log(`Admin ${email} created. You will be asked to choose a new password at first sign-in.`);
  await closeDb();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
