import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { listNotifications, markAllNotificationsRead, markNotificationRead, unreadNotificationCount, syncFollowUpNotifications } from "@/lib/server/enquiries/notifications";
import { ok, parseJson, parseQuery } from "@/lib/server/http";

export const runtime = "nodejs";

const querySchema = z.object({
  unread: z.enum(["1", "0"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).max(10_000).default(0),
});

export const GET = withAdmin(async (request) => {
  const query = parseQuery(request, querySchema);
  await syncFollowUpNotifications();
  const [list, unread] = await Promise.all([listNotifications({ unreadOnly: query.unread === "1", limit: query.limit, offset: query.offset }), unreadNotificationCount()]);
  return ok({ rows: list.rows, total: list.total, unread });
});

const markSchema = z.union([z.object({ id: z.uuid() }), z.object({ all: z.literal(true) })]);

export const POST = withAdmin(async (request) => {
  const body = await parseJson(request, markSchema);
  if ("id" in body) await markNotificationRead(body.id);
  else await markAllNotificationsRead();
  return ok({ unread: await unreadNotificationCount() });
});
