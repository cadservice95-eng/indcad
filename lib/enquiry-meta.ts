/**
 * Display metadata for enquiry enums. Safe to import from client components
 * (no server dependencies).
 */

export const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  IN_REVIEW: "In review",
  CONTACTED: "Contacted",
  AWAITING_CUSTOMER: "Awaiting customer",
  QUOTED: "Quoted",
  FOLLOW_UP: "Follow-up",
  WON: "Won",
  LOST: "Lost",
  CLOSED: "Closed",
};

export const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-copper-50 text-copper-700 ring-copper-200",
  IN_REVIEW: "bg-steel-50 text-steel-700 ring-steel-100",
  CONTACTED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  AWAITING_CUSTOMER: "bg-amber-50 text-amber-800 ring-amber-200",
  QUOTED: "bg-violet-50 text-violet-700 ring-violet-200",
  FOLLOW_UP: "bg-orange-50 text-orange-700 ring-orange-200",
  WON: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  LOST: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  CLOSED: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

export const STATUS_CHART_COLORS: Record<string, string> = {
  NEW: "#c16a2f",
  IN_REVIEW: "#2b699f",
  CONTACTED: "#4f46e5",
  AWAITING_CUSTOMER: "#d97706",
  QUOTED: "#7c3aed",
  FOLLOW_UP: "#ea580c",
  WON: "#059669",
  LOST: "#737373",
  CLOSED: "#a3a3a3",
};

export const PRIORITY_LABELS: Record<string, string> = { LOW: "Low", NORMAL: "Normal", HIGH: "High", URGENT: "Urgent" };

export const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  NORMAL: "bg-steel-50 text-steel-700 ring-steel-100",
  HIGH: "bg-orange-50 text-orange-700 ring-orange-200",
  URGENT: "bg-red-50 text-red-700 ring-red-200",
};

export const PRIORITY_DOTS: Record<string, string> = {
  LOW: "bg-neutral-400",
  NORMAL: "bg-steel-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-600",
};

export const SOURCE_LABELS: Record<string, string> = {
  QUOTE_FORM: "Quote form",
  CONTACT_FORM: "Contact form",
  WEBSITE: "Website",
  DIRECT: "Direct email",
};

export const TYPE_LABELS: Record<string, string> = { QUOTE_REQUEST: "Quote request", CONTACT_MESSAGE: "Contact message" };

export const EMAIL_STATUS_STYLES: Record<string, string> = {
  QUEUED: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  SENDING: "bg-steel-50 text-steel-700 ring-steel-100",
  SENT: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
};

export const CLOSED_STATUSES = ["WON", "LOST", "CLOSED"] as const;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
