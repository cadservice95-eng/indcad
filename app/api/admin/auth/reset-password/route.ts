import { z } from "zod";
import { resetPassword } from "@/lib/server/auth/flows";
import { assertSameOrigin, clientIp, guard, ok, parseJson, userAgent } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(1).max(200),
});

export function POST(request: Request) {
  return guard(async () => {
    assertSameOrigin(request);
    const body = await parseJson(request, schema);
    await resetPassword(body.token, body.password, { ip: clientIp(request.headers), userAgent: userAgent(request.headers) });
    return ok({ message: "Password updated. You can sign in now." });
  });
}
