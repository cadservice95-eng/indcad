"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Pencil, RotateCw } from "lucide-react";
import { defaultFollowUp, timeAgo, toLocalInput } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { api } from "../api";
import { Modal, useAdminFormat, useConfirm, useToast } from "../feedback";
import { Card, EmailStatusBadge, StatusBadge, TypeBadge, btn, inputClass } from "../ui";
import { AttachmentChip } from "./Conversation";
import type { ActivityView, AttachmentView, EmailLogView, EnquiryView, FollowUpView, HistoryView, NoteView } from "./types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-2 py-1.5 text-sm">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="min-w-0 break-words text-navy-900">{children}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact / project details (editable)
// ---------------------------------------------------------------------------

const EDITABLE = [
  ["name", "Name"],
  ["company", "Company"],
  ["phone", "Phone"],
  ["country", "Country"],
  ["city", "City"],
  ["website", "Website"],
  ["service", "Service"],
  ["projectType", "Project type"],
  ["timeline", "Deadline / timeline"],
  ["budget", "Budget"],
  ["currency", "Currency"],
  ["preferredContactMethod", "Preferred contact"],
] as const;

export function DetailsCard({ enquiry, customerSince }: { enquiry: EnquiryView; customerSince: string | null }) {
  const router = useRouter();
  const toast = useToast();
  const fmt = useAdminFormat();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  function open() {
    setForm(Object.fromEntries(EDITABLE.map(([key]) => [key, (enquiry[key] as string | null) ?? ""])));
    setEditing(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const body = Object.fromEntries(EDITABLE.map(([key]) => [key, key === "name" ? form[key].trim() : form[key].trim() || null]));
    const result = await api(`/api/admin/enquiries/${enquiry.id}/`, { method: "PATCH", json: body });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success("Details updated.");
    setEditing(false);
    router.refresh();
  }

  const location = [enquiry.city, enquiry.country].filter(Boolean).join(", ");
  return (
    <Card
      title="Customer & project"
      actions={
        <button type="button" onClick={open} className={btn.small}>
          <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
        </button>
      }
    >
      <dl className="-my-1.5 divide-y divide-neutral-100">
        <Row label="Name">{enquiry.name}</Row>
        <Row label="Company">{enquiry.company}</Row>
        <Row label="Email">
          <a href={`mailto:${enquiry.email}`} className="text-steel-600 hover:underline">
            {enquiry.email}
          </a>
        </Row>
        <Row label="Phone">{enquiry.phone ? <a href={`tel:${enquiry.phone}`} className="text-steel-600 hover:underline">{enquiry.phone}</a> : null}</Row>
        <Row label="Location">{location}</Row>
        <Row label="Website">{enquiry.website}</Row>
        <Row label="Service">{enquiry.service}</Row>
        <Row label="Project type">{enquiry.projectType}</Row>
        <Row label="Deadline">{enquiry.timeline}</Row>
        <Row label="Budget">{[enquiry.currency, enquiry.budget].filter(Boolean).join(" ")}</Row>
        <Row label="Prefers">{enquiry.preferredContactMethod}</Row>
        <Row label="Received">{fmt.dateTime(enquiry.createdAt)}</Row>
        <Row label="Last contacted">{enquiry.lastContactedAt ? fmt.dateTime(enquiry.lastContactedAt) : null}</Row>
        <Row label="Customer reply">{enquiry.lastCustomerReplyAt ? fmt.dateTime(enquiry.lastCustomerReplyAt) : null}</Row>
        <Row label="Customer since">{customerSince ? fmt.date(customerSince) : null}</Row>
      </dl>
      <Link href={`/admin/customers/${enquiry.customerId}/`} className="mt-3 inline-block text-xs font-medium text-copper-600 hover:underline">
        View customer profile →
      </Link>

      {editing ? (
        <Modal title="Edit details" onClose={() => setEditing(false)}>
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
            {EDITABLE.map(([key, label]) => (
              <label key={key} className="text-sm text-neutral-600">
                {label}
                <input value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required={key === "name"} maxLength={key === "name" ? 120 : 160} className={cn(inputClass, "mt-1")} />
              </label>
            ))}
            <p className="text-xs text-neutral-500 sm:col-span-2">The email address can&apos;t be edited — it identifies the customer and their conversation.</p>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" onClick={() => setEditing(false)} className={btn.outline}>
                Cancel
              </button>
              <button type="submit" disabled={busy} className={btn.primary}>
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

export function FollowUpsCard({ enquiryId, followUps }: { enquiryId: string; followUps: FollowUpView[] }) {
  const router = useRouter();
  const toast = useToast();
  const fmt = useAdminFormat();
  const [due, setDue] = useState(() => defaultFollowUp(1, 10, fmt.timezone));
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [newDue, setNewDue] = useState("");
  const [now] = useState(() => Date.now());

  const open = followUps.filter((f) => !f.completedAt);
  const done = followUps.filter((f) => f.completedAt);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await api(`/api/admin/enquiries/${enquiryId}/follow-up/`, { json: { dueAt: due, note: note.trim() || undefined } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    setNote("");
    toast.success("Follow-up scheduled. This is an internal reminder — nothing is sent to the customer.");
    router.refresh();
  }

  async function act(id: string, body: Record<string, unknown>, success: string) {
    const result = await api(`/api/admin/follow-ups/${id}/`, { method: "PATCH", json: body });
    if (!result.ok) return toast.error(result.error);
    toast.success(success);
    setRescheduling(null);
    router.refresh();
  }

  const quick = (days: number, label: string) => (
    <button type="button" key={label} onClick={() => setDue(defaultFollowUp(days, 10, fmt.timezone))} className={btn.small}>
      {label}
    </button>
  );

  return (
    <Card title="Follow-ups">
      <ul className="space-y-2">
        {open.length === 0 ? <li className="text-sm text-neutral-500">No follow-ups scheduled.</li> : null}
        {open.map((f) => {
          const overdue = new Date(f.dueAt).getTime() < now;
          return (
            <li key={f.id} className={cn("border px-3 py-2 text-sm", overdue ? "border-red-200 bg-red-50" : "border-neutral-200 bg-neutral-50")}>
              <p className={cn("font-medium", overdue ? "text-red-700" : "text-navy-900")}>
                {overdue ? "Overdue · " : ""}
                {fmt.dateTime(f.dueAt)}
              </p>
              {f.note ? <p className="mt-0.5 text-neutral-600">{f.note}</p> : null}
              {rescheduling === f.id ? (
                <form
                  className="mt-2 flex flex-wrap items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void act(f.id, { action: "reschedule", dueAt: newDue }, "Follow-up rescheduled.");
                  }}
                >
                  <input type="datetime-local" required value={newDue} onChange={(e) => setNewDue(e.target.value)} className={cn(inputClass, "w-auto py-1")} />
                  <button type="submit" className={btn.small}>
                    Save
                  </button>
                  <button type="button" onClick={() => setRescheduling(null)} className={btn.small}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => act(f.id, { action: "complete" }, "Follow-up completed.")} className={btn.small}>
                    <Check className="h-3.5 w-3.5" aria-hidden /> Mark complete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDue(toLocalInput(new Date(f.dueAt), fmt.timezone));
                      setRescheduling(f.id);
                    }}
                    className={btn.small}
                  >
                    Reschedule
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={add} className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Schedule a follow-up</p>
        <div className="flex flex-wrap gap-1.5">{[quick(1, "Tomorrow"), quick(3, "In 3 days"), quick(7, "In a week")]}</div>
        <input type="datetime-local" required value={due} onChange={(e) => setDue(e.target.value)} aria-label="Follow-up date and time" className={inputClass} />
        <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="Reminder note (optional)" aria-label="Reminder note" className={inputClass} />
        <button type="submit" disabled={busy} className={cn(btn.secondary, "w-full")}>
          {busy ? "Scheduling…" : "Schedule follow-up"}
        </button>
      </form>

      {done.length ? (
        <details className="mt-4 border-t border-neutral-100 pt-3 text-sm">
          <summary className="cursor-pointer text-neutral-500">{done.length} completed</summary>
          <ul className="mt-2 space-y-1 text-neutral-500">
            {done.map((f) => (
              <li key={f.id}>
                {fmt.dateTime(f.dueAt)}
                {f.note ? ` — ${f.note}` : ""}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Internal notes
// ---------------------------------------------------------------------------

export function NotesCard({ enquiryId, notes }: { enquiryId: string; notes: NoteView[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const fmt = useAdminFormat();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await api(`/api/admin/enquiries/${enquiryId}/notes/`, { json: { body } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    setBody("");
    router.refresh();
  }

  async function saveEdit(id: string) {
    const result = await api(`/api/admin/enquiries/${enquiryId}/notes/${id}/`, { method: "PATCH", json: { body: editBody } });
    if (!result.ok) return toast.error(result.error);
    setEditing(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!(await confirm({ title: "Delete this note?", message: "This can't be undone.", confirmLabel: "Delete note", destructive: true }))) return;
    const result = await api(`/api/admin/enquiries/${enquiryId}/notes/${id}/`, { method: "DELETE" });
    if (!result.ok) return toast.error(result.error);
    router.refresh();
  }

  return (
    <Card title="Internal notes">
      <p className="mb-3 text-xs text-neutral-500">Private to you. Notes are never sent to the customer.</p>
      <form onSubmit={add} className="space-y-2">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={5000} placeholder="Add a note about this enquiry…" aria-label="New internal note" className={inputClass} />
        <button type="submit" disabled={busy || !body.trim()} className={btn.secondary}>
          {busy ? "Adding…" : "Add note"}
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm">
            {editing === n.id ? (
              <div className="space-y-2">
                <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3} className={inputClass} aria-label="Edit note" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveEdit(n.id)} disabled={!editBody.trim()} className={btn.small}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className={btn.small}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap break-words text-navy-900">{n.body}</p>
                <p className="mt-1.5 flex items-center gap-3 text-xs text-neutral-500">
                  <span>
                    {fmt.dateTime(n.createdAt)}
                    {n.updatedAt !== n.createdAt ? " (edited)" : ""}
                  </span>
                  <button type="button" onClick={() => (setEditing(n.id), setEditBody(n.body))} className="hover:text-navy-900">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(n.id)} className="hover:text-red-600">
                    Delete
                  </button>
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Attachments
// ---------------------------------------------------------------------------

export function AttachmentsCard({ attachments }: { attachments: AttachmentView[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  async function remove(file: AttachmentView) {
    if (!(await confirm({ title: `Delete ${file.originalFilename}?`, message: "The file is removed permanently.", confirmLabel: "Delete file", destructive: true }))) return;
    const result = await api(`/api/admin/attachments/${file.id}/`, { method: "DELETE" });
    if (!result.ok) return toast.error(result.error);
    toast.success("Attachment deleted.");
    router.refresh();
  }

  return (
    <Card title={`Attachments (${attachments.length})`}>
      {attachments.length === 0 ? (
        <p className="text-sm text-neutral-500">No files on this enquiry.</p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((file) => (
            <li key={file.id} className="flex flex-wrap items-center justify-between gap-2">
              <AttachmentChip file={file} onDelete={() => remove(file)} />
              <span className="text-xs text-neutral-400">{file.uploadedBy === "CUSTOMER" ? "from customer" : "from you"}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Customer history & submission details
// ---------------------------------------------------------------------------

export function HistoryCard({ history }: { history: HistoryView[] }) {
  const fmt = useAdminFormat();
  if (history.length === 0) return null;
  return (
    <Card title={`Other enquiries from this customer (${history.length})`}>
      <ul className="-my-2 divide-y divide-neutral-100">
        {history.map((h) => (
          <li key={h.id}>
            <Link href={`/admin/enquiries/${h.id}/`} className="block py-2 hover:bg-neutral-50">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-navy-900">{h.referenceNumber}</span>
                <TypeBadge type={h.type} />
                <StatusBadge status={h.status} />
              </span>
              <span className="mt-0.5 block truncate text-xs text-neutral-500">
                {h.service ?? h.subject} · {fmt.date(h.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function SubmissionCard({ enquiry }: { enquiry: EnquiryView }) {
  const campaign = [enquiry.utmSource, enquiry.utmMedium, enquiry.utmCampaign].filter(Boolean).join(" / ");
  const rows = [
    ["Landing page", enquiry.landingPage],
    ["Referrer", enquiry.referrer],
    ["Campaign", campaign],
    ["UTM term", enquiry.utmTerm],
    ["UTM content", enquiry.utmContent],
    ["IP address", enquiry.ipAddress],
    ["Browser", enquiry.userAgent],
  ] as const;
  if (rows.every(([, v]) => !v)) return null;
  return (
    <Card title="Submission details">
      <dl className="-my-1.5 divide-y divide-neutral-100">
        {rows.filter(([, value]) => value).map(([label, value]) => (
          <Row key={label} label={label}>
            <span className="text-xs">{value}</span>
          </Row>
        ))}
      </dl>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Email log + timeline
// ---------------------------------------------------------------------------

export function EmailLogsCard({ logs }: { logs: EmailLogView[] }) {
  const router = useRouter();
  const toast = useToast();
  const [retrying, setRetrying] = useState<string | null>(null);
  if (logs.length === 0) return null;

  async function retry(id: string) {
    setRetrying(id);
    const result = await api<{ status: string; error: string | null }>("/api/admin/email/retry/", { json: { logId: id } });
    setRetrying(null);
    if (!result.ok) return toast.error(result.error);
    if (result.data.status === "SENT") toast.success("Email sent.");
    else toast.error(`Still failing: ${result.data.error ?? "unknown error"}`);
    router.refresh();
  }

  return (
    <Card title="Emails sent for this enquiry">
      <ul className="space-y-2.5">
        {logs.map((l) => (
          <li key={l.id} className="text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <EmailStatusBadge status={l.status} />
              <span className="min-w-0 flex-1 truncate text-navy-900" title={l.subject}>
                {l.subject}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">
              To {l.recipient} · {timeAgo(l.createdAt)}
              {l.attemptCount > 1 ? ` · ${l.attemptCount} attempts` : ""}
            </p>
            {l.status === "FAILED" ? (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {l.errorMessage ? <p className="text-xs text-red-600">{l.errorMessage}</p> : null}
                {l.canRetry ? (
                  <button type="button" onClick={() => retry(l.id)} disabled={retrying === l.id} className={btn.small}>
                    <RotateCw className={cn("h-3.5 w-3.5", retrying === l.id && "animate-spin")} aria-hidden /> Retry
                  </button>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

const ACTOR_DOT: Record<string, string> = { ADMIN: "bg-navy-700", CUSTOMER: "bg-copper-500", SYSTEM: "bg-neutral-400" };

export function TimelineCard({ activity }: { activity: ActivityView[] }) {
  const fmt = useAdminFormat();
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? activity : activity.slice(0, 12);
  return (
    <Card title="Activity timeline">
      {activity.length === 0 ? <p className="text-sm text-neutral-500">No activity yet.</p> : null}
      <ol className="relative space-y-3 border-l border-neutral-200 pl-4">
        {shown.map((a) => (
          <li key={a.id} className="relative text-sm">
            <span className={cn("absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full ring-2 ring-white", ACTOR_DOT[a.actor] ?? "bg-neutral-400")} aria-hidden />
            <p className="break-words text-navy-900">{a.description}</p>
            <p className="text-xs text-neutral-500">
              {a.actor === "ADMIN" ? "You" : a.actor === "CUSTOMER" ? "Customer" : "System"} · {fmt.dateTime(a.createdAt)}
            </p>
          </li>
        ))}
      </ol>
      {activity.length > 12 ? (
        <button type="button" onClick={() => setShowAll((v) => !v)} className={cn(btn.small, "mt-3")}>
          {showAll ? "Show less" : `Show all ${activity.length}`}
        </button>
      ) : null}
    </Card>
  );
}
