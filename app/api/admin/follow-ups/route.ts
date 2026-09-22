import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { followUpCounts, listFollowUps } from "@/lib/server/enquiries/queries";
import { ok, parseQuery } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ bucket: z.enum(["overdue", "today", "upcoming", "completed"]).default("today") });

export const GET = withAdmin(async (request) => {
  const { bucket } = parseQuery(request, schema);
  const [rows, counts] = await Promise.all([listFollowUps(bucket), followUpCounts()]);
  return ok({ rows, counts });
});
