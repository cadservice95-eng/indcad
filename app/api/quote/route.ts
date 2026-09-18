import { NextResponse } from "next/server";
import { ACCEPTED_FILE_EXTENSIONS, MAX_FILE_SIZE_BYTES } from "@/lib/forms";

export const runtime = "nodejs";

function sanitize(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 4000);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = sanitize(formData.get("name"));
  const email = sanitize(formData.get("email"));
  const company = sanitize(formData.get("company"));
  const phone = sanitize(formData.get("phone"));
  const service = sanitize(formData.get("service"));
  const projectType = sanitize(formData.get("projectType"));
  const description = sanitize(formData.get("description"));
  const deadline = sanitize(formData.get("deadline"));
  const notes = sanitize(formData.get("notes"));
  const file = formData.get("file");

  if (!name || !email || !service || !description) {
    return NextResponse.json(
      { ok: false, error: "Name, email, service and project description are required." },
      { status: 400 },
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  let fileMeta: { name: string; size: number } | null = null;
  if (file instanceof File && file.size > 0) {
    const nameLower = file.name.toLowerCase();
    const extensionOk = ACCEPTED_FILE_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
    if (!extensionOk) {
      return NextResponse.json({ ok: false, error: "Unsupported file type." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ ok: false, error: "File exceeds the 25MB limit." }, { status: 400 });
    }
    fileMeta = { name: file.name, size: file.size };
  }

  const submission = {
    name,
    email,
    company,
    phone,
    service,
    projectType,
    description,
    deadline,
    notes,
    file: fileMeta,
    submittedAt: new Date().toISOString(),
  };

  // Delivery integration: point QUOTE_NOTIFY_WEBHOOK_URL at your email/CRM
  // provider's inbound webhook (e.g. a transactional email API or a Slack/
  // Zapier webhook) to forward submissions. Until that's configured this
  // route validates the request and returns success without persisting or
  // sending the data anywhere — wire it up before relying on this in
  // production. Uploaded files are validated but not yet stored; add
  // object-storage (e.g. S3) upload here once available.
  const webhookUrl = process.env.QUOTE_NOTIFY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch {
      // Non-fatal: the visitor still gets a success response; check server
      // logs / webhook provider if submissions aren't arriving.
      console.error("Quote form webhook delivery failed");
    }
  } else {
    console.warn("QUOTE_NOTIFY_WEBHOOK_URL is not set — quote submission was validated but not delivered anywhere.", submission);
  }

  return NextResponse.json({ ok: true });
}
