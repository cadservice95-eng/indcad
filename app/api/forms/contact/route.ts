import { handleFormSubmission } from "@/lib/server/forms/submit";

export const runtime = "nodejs";

export function POST(request: Request) {
  return handleFormSubmission(request, "contact");
}
