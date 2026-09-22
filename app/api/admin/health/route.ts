import { withAdmin } from "@/lib/server/auth/dal";
import { getHealth } from "@/lib/server/health";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";
export const maxDuration = 30;

export const GET = withAdmin(async () => ok({ ...(await getHealth()) }));
