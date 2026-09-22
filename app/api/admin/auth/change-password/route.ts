import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { changePassword } from "@/lib/server/auth/flows";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(1).max(200),
});

export const POST = withAdmin(
  async (request, { admin, sessionId }) => {
    const body = await parseJson(request, schema);
    await changePassword(admin.id, sessionId, body.currentPassword, body.newPassword);
    return ok({ message: "Password changed." });
  },
  { allowPasswordChangeRequired: true },
);
