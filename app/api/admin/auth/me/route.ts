import { withAdmin } from "@/lib/server/auth/dal";
import { getAdminProfile } from "@/lib/server/auth/flows";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const GET = withAdmin(
  async (_request, { admin }) => {
    const profile = await getAdminProfile(admin.id);
    return ok({ admin: { ...profile, mustChangePassword: admin.mustChangePassword } });
  },
  { allowPasswordChangeRequired: true },
);
