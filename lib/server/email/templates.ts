import { eq } from "drizzle-orm";
import { emailTemplates, getDb } from "../db";
import { escapeHtml, sanitizeEmailHtml, singleLine } from "./html";

export const TEMPLATE_KEYS = [
  "quote_received",
  "contact_received",
  "initial_response",
  "quote_follow_up",
  "project_clarification",
  "general_response",
  "password_reset",
  "review_request",
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

export type TemplateDefinition = {
  key: TemplateKey;
  label: string;
  description: string;
  /** Sent automatically by the system (vs. inserted by the admin into a reply). */
  automatic: boolean;
  subject: string;
  bodyHtml: string;
  variables: string[];
};

export const DEFAULT_TEMPLATES: Record<TemplateKey, TemplateDefinition> = {
  quote_received: {
    key: "quote_received",
    label: "Quote received",
    description: "Sent to the customer right after they submit the quote form.",
    automatic: true,
    subject: "Quote Request Received — {{reference_number}}",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>Thank you for your quote request. We have received your project requirements for <strong>{{service}}</strong> and our team is reviewing them.</p>" +
      "<p>Your reference number is <strong>{{reference_number}}</strong>. Please quote it if you contact us about this request.</p>" +
      "<p>You can reply to this email to add more details or attach drawings. If anything is unclear we will get in touch with a few questions before sending your quote.</p>" +
      "<p>Kind regards,<br>{{site_name}}<br>{{support_email}}</p>",
    variables: ["name", "reference_number", "service", "support_email", "site_name"],
  },
  contact_received: {
    key: "contact_received",
    label: "Contact received",
    description: "Sent to the customer right after they submit the contact form.",
    automatic: true,
    subject: "We received your message — {{reference_number}}",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>Thank you for getting in touch. We have received your message and will reply as soon as we can.</p>" +
      "<p>Your reference number is <strong>{{reference_number}}</strong>.</p>" +
      "<p>Kind regards,<br>{{site_name}}<br>{{support_email}}</p>",
    variables: ["name", "reference_number", "support_email", "site_name"],
  },
  initial_response: {
    key: "initial_response",
    label: "Initial response",
    description: "First reply after reviewing a new enquiry.",
    automatic: false,
    subject: "Re: your enquiry {{reference_number}}",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>Thank you for contacting {{site_name}}. We have received your project requirements and our team is reviewing them. We will come back to you shortly.</p>" +
      "<p>Kind regards,<br>{{site_name}}</p>",
    variables: ["name", "reference_number", "service", "site_name", "support_email"],
  },
  quote_follow_up: {
    key: "quote_follow_up",
    label: "Quote follow-up",
    description: "Polite nudge after a quotation has been sent.",
    automatic: false,
    subject: "Following up on your quotation — {{reference_number}}",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>I wanted to follow up on the quotation we sent for your {{service}} project ({{reference_number}}). Have you had a chance to review it?</p>" +
      "<p>Happy to answer any questions or adjust the scope if needed.</p>" +
      "<p>Kind regards,<br>{{site_name}}</p>",
    variables: ["name", "reference_number", "service", "site_name", "support_email"],
  },
  project_clarification: {
    key: "project_clarification",
    label: "Project clarification",
    description: "Ask the customer for missing project information.",
    automatic: false,
    subject: "A few questions about your project — {{reference_number}}",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>To prepare an accurate quote for your {{service}} project we need a little more information:</p>" +
      "<ul><li>The drawings, sketches or files you would like us to work from</li><li>The required output format and drawing standard</li><li>Your preferred timeline</li></ul>" +
      "<p>You can reply directly to this email and attach the files.</p>" +
      "<p>Kind regards,<br>{{site_name}}</p>",
    variables: ["name", "reference_number", "service", "site_name", "support_email"],
  },
  general_response: {
    key: "general_response",
    label: "General response",
    description: "A blank, friendly starting point for any reply.",
    automatic: false,
    subject: "Re: {{reference_number}}",
    bodyHtml: "<p>Hi {{name}},</p><p></p><p>Kind regards,<br>{{site_name}}</p>",
    variables: ["name", "reference_number", "site_name", "support_email"],
  },
  password_reset: {
    key: "password_reset",
    label: "Password reset",
    description: "Sent to the admin when a password reset is requested.",
    automatic: true,
    subject: "Reset your {{site_name}} admin password",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>We received a request to reset the password for your {{site_name}} admin account. Use the button below to choose a new password. The link expires in 60 minutes and can be used once.</p>" +
      "<p>If you did not request this, you can ignore this email — your password will not change.</p>",
    variables: ["name", "site_name", "reset_link"],
  },
  review_request: {
    key: "review_request",
    label: "Request a review",
    description: "Sent to a customer once their project is complete, asking for a Trustpilot review. Sent manually from the enquiry page — never automatically.",
    automatic: false,
    subject: "How did we do? — {{reference_number}}",
    bodyHtml:
      "<p>Hi {{name}},</p>" +
      "<p>Thank you for choosing {{site_name}} for your {{service}} project ({{reference_number}}). We hope you're happy with the result.</p>" +
      "<p>If you have a minute, we'd really appreciate a quick review — it helps other engineers and businesses find us:</p>" +
      '<p><a href="{{review_url}}">Leave us a review on Trustpilot</a></p>' +
      "<p>Kind regards,<br>{{site_name}}<br>{{support_email}}</p>",
    variables: ["name", "reference_number", "service", "site_name", "support_email", "review_url"],
  },
};

export const QUICK_REPLIES = [
  {
    id: "received",
    label: "Received & reviewing",
    html: "<p>Thank you for contacting Render CAD Hub. We have received your project requirements and our team is reviewing them.</p>",
  },
  {
    id: "need-files",
    label: "Request drawings / files",
    html: "<p>Could you please provide the project drawings/files so we can review the scope?</p>",
  },
  {
    id: "thanks-info",
    label: "Thanks for the extra info",
    html: "<p>Thank you for the additional information. We will review the requirements and get back to you.</p>",
  },
  {
    id: "timeline",
    label: "Confirm timeline",
    html: "<p>Could you confirm your preferred timeline and the required drawing standard/output format for this project?</p>",
  },
  {
    id: "quote-soon",
    label: "Quote coming soon",
    html: "<p>We are preparing your quotation and will share it with you shortly.</p>",
  },
] as const;

export type TemplateView = TemplateDefinition & { customised: boolean };

export async function getTemplate(key: TemplateKey): Promise<TemplateView> {
  const base = DEFAULT_TEMPLATES[key];
  const db = await getDb();
  const [row] = await db.select().from(emailTemplates).where(eq(emailTemplates.key, key)).limit(1);
  if (!row) return { ...base, customised: false };
  return { ...base, subject: row.subject, bodyHtml: row.bodyHtml, customised: true };
}

export async function listTemplates(): Promise<TemplateView[]> {
  return Promise.all(TEMPLATE_KEYS.map((key) => getTemplate(key)));
}

export async function saveTemplate(key: TemplateKey, input: { subject: string; bodyHtml: string }) {
  const db = await getDb();
  const values = { key, subject: singleLine(input.subject).slice(0, 200), bodyHtml: sanitizeEmailHtml(input.bodyHtml), updatedAt: new Date() };
  await db.insert(emailTemplates).values(values).onConflictDoUpdate({ target: emailTemplates.key, set: values });
}

export async function resetTemplate(key: TemplateKey) {
  const db = await getDb();
  await db.delete(emailTemplates).where(eq(emailTemplates.key, key));
}

/** Replaces {{placeholders}}. Values are HTML-escaped for bodies and stripped of newlines for subjects. */
export function fillTemplate(source: string, vars: Record<string, string | undefined>, mode: "html" | "text"): string {
  return source.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_match, name: string) => {
    const value = vars[name] ?? "";
    return mode === "html" ? escapeHtml(value) : singleLine(value);
  });
}
