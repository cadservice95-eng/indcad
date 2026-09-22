export type SubmitResult = { ok: true; reference?: string } | { ok: false; error: string };

const GENERIC = "Something went wrong sending your request. Please try again, or email us directly.";

/** Posts a public form and turns every failure (validation, rate limit, size, network) into a readable message. */
export async function submitPublicForm(url: string, formData: FormData): Promise<SubmitResult> {
  try {
    const response = await fetch(url, { method: "POST", body: formData });
    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (!isJson) {
      // e.g. the hosting platform rejecting an oversized body before it reaches the app.
      if (response.status === 413) return { ok: false, error: "Your attachments are too large. Attachments are limited to 4MB in total — you can send larger files by replying to our confirmation email." };
      return { ok: false, error: GENERIC };
    }
    const data = (await response.json()) as { ok?: boolean; error?: string; reference?: string };
    if (!response.ok || !data.ok) return { ok: false, error: data.error ?? GENERIC };
    return { ok: true, reference: data.reference };
  } catch {
    return { ok: false, error: "We couldn't reach the server. Check your connection and try again." };
  }
}
