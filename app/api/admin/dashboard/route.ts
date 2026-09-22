import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { getDashboard } from "@/lib/server/enquiries/analytics";
import { syncFollowUpNotifications, unreadNotificationCount } from "@/lib/server/enquiries/notifications";
import { ok, parseQuery } from "@/lib/server/http";
import { RANGE_PRESETS } from "@/lib/server/time";

export const runtime = "nodejs";

const querySchema = z.object({
  range: z.enum(RANGE_PRESETS).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const GET = withAdmin(async (request) => {
  const query = parseQuery(request, querySchema);
  await syncFollowUpNotifications();
  const [dashboard, unreadNotifications] = await Promise.all([getDashboard({ preset: query.range, from: query.from, to: query.to }), unreadNotificationCount()]);
  return ok({ dashboard, unreadNotifications });
});
