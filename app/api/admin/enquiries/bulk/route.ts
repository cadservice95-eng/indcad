import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { dueSchema, parseDue } from "@/lib/server/api/shared";
import { ENQUIRY_PRIORITIES, ENQUIRY_STATUSES } from "@/lib/server/db";
import { bulkApply, type BulkAction } from "@/lib/server/enquiries/mutate";
import { ApiError, ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  ids: z.array(z.uuid()).min(1).max(200),
  action: z.enum(["mark_read", "mark_unread", "status", "priority", "follow_up", "archive", "unarchive", "trash", "restore", "delete_permanent"]),
  status: z.enum(ENQUIRY_STATUSES).optional(),
  priority: z.enum(ENQUIRY_PRIORITIES).optional(),
  dueAt: dueSchema.optional(),
  note: z.string().trim().max(500).optional(),
  /** Destructive actions must be explicitly confirmed by the client. */
  confirm: z.boolean().optional(),
});

export const POST = withAdmin(async (request) => {
  const body = await parseJson(request, schema);
  let op: BulkAction;
  switch (body.action) {
    case "status":
      if (!body.status) throw new ApiError(400, "Choose a status.", "VALIDATION");
      op = { action: "status", status: body.status };
      break;
    case "priority":
      if (!body.priority) throw new ApiError(400, "Choose a priority.", "VALIDATION");
      op = { action: "priority", priority: body.priority };
      break;
    case "follow_up":
      if (!body.dueAt) throw new ApiError(400, "Choose a follow-up date.", "VALIDATION");
      op = { action: "follow_up", dueAt: parseDue(body.dueAt), note: body.note };
      break;
    case "delete_permanent":
      if (!body.confirm) throw new ApiError(400, "Permanent deletion must be confirmed.", "CONFIRM_REQUIRED");
      op = { action: "delete_permanent" };
      break;
    default:
      op = { action: body.action };
  }
  return ok(await bulkApply([...new Set(body.ids)], op));
});
