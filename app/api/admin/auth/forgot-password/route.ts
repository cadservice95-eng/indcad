import { after } from "next/server";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/server/auth/flows";
import { assertSameOrigin, clientIp, guard, ok, parseJson, userAgent } from "@/lib/server/http";
import { errorMessage, log } from "@/lib/server/log";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().trim().max(254).pipe(z.email()) });

export function POST(request: Request) {
  return guard(async () => {
    assertSameOrigin(request);
    const { email } = await parseJson(request, schema);
    const meta = { ip: clientIp(request.headers), userAgent: userAgent(request.headers) };
    // Work happens after the response so timing never reveals whether the address is the admin's.
    after(() => requestPasswordReset(email, meta).catch((error) => log.error("auth.forgot_password_failed", { error: errorMessage(error) })));
    return ok({ message: "If that address belongs to the admin account, a reset link has been sent." });
  });
}
