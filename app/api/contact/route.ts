import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitize(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 4000);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = sanitize(formData.get("name"));
  const email = sanitize(formData.get("email"));
  const phone = sanitize(formData.get("phone"));
  const message = sanitize(formData.get("message"));

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Name, email and message are required." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const submission = { name, email, phone, message, submittedAt: new Date().toISOString() };

  // See app/api/quote/route.ts for the same delivery-integration note:
  // point CONTACT_NOTIFY_WEBHOOK_URL at your email/CRM provider's inbound
  // webhook before relying on this in production.
  const webhookUrl = process.env.CONTACT_NOTIFY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch {
      console.error("Contact form webhook delivery failed");
    }
  } else {
    console.warn("CONTACT_NOTIFY_WEBHOOK_URL is not set — message was validated but not delivered anywhere.", submission);
  }

  return NextResponse.json({ ok: true });
}
