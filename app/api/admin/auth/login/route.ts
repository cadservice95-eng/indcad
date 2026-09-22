import { z } from "zod";
import { login } from "@/lib/server/auth/flows";
import { assertSameOrigin, clientIp, guard, ok, parseJson, userAgent } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  password: z.string().min(1).max(200),
});

export function POST(request: Request) {
  return guard(async () => {
    assertSameOrigin(request);
    const body = await parseJson(request, schema);
    const result = await login(body.email, body.password, { ip: clientIp(request.headers), userAgent: userAgent(request.headers) });
    return ok({ mustChangePassword: result.mustChangePassword });
  });
}
