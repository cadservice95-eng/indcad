import { withAdmin } from "@/lib/server/auth/dal";
import { listTemplates } from "@/lib/server/email/templates";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const GET = withAdmin(async () => ok({ templates: await listTemplates() }));
