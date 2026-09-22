import { withAdmin } from "@/lib/server/auth/dal";
import { logout } from "@/lib/server/auth/flows";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const POST = withAdmin(
  async (_request, { admin }) => {
    await logout(admin.id);
    return ok();
  },
  { allowPasswordChangeRequired: true },
);
