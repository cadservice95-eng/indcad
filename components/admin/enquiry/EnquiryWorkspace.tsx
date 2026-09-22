"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowLeft, EyeOff, RotateCcw, Trash2 } from "lucide-react";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/enquiry-meta";
import { cn } from "@/lib/utils";
import { api } from "../api";
import { useAdminFormat, useConfirm, useToast } from "../feedback";
import { PriorityBadge, StatusBadge, TypeBadge, btn, inputClass } from "../ui";
import { Conversation } from "./Conversation";
import { ReplyComposer } from "./ReplyComposer";
import { AttachmentsCard, DetailsCard, EmailLogsCard, FollowUpsCard, HistoryCard, NotesCard, SubmissionCard, TimelineCard } from "./SidePanels";
import type { ActivityView, AttachmentView, DraftView, EmailLogView, EnquiryView, FollowUpView, HistoryView, MessageView, NoteView, QuickReply, TemplateOption } from "./types";

type Props = {
  enquiry: EnquiryView;
  customerSince: string | null;
  messages: MessageView[];
  attachments: AttachmentView[];
  notes: NoteView[];
  followUps: FollowUpView[];
  activity: ActivityView[];
  drafts: DraftView[];
  emailLogs: EmailLogView[];
  history: HistoryView[];
  defaultSubject: string;
  templates: TemplateOption[];
  quickReplies: QuickReply[];
  uploadLimitBytes: number;
};

export function EnquiryWorkspace(props: Props) {
  const { enquiry } = props;
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const fmt = useAdminFormat();
  const [busy, setBusy] = useState(false);

  const trashed = Boolean(enquiry.deletedAt);
  const archived = Boolean(enquiry.archivedAt);

  async function post(path: string, json: unknown, success?: string) {
    setBusy(true);
    const result = await api(`/api/admin/enquiries/${enquiry.id}/${path}`, { json });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return false;
    }
    if (success) toast.success(success);
    router.refresh();
    return true;
  }

  async function trash() {
    if (!(await confirm({ title: "Move to trash?", message: "The enquiry leaves the active list. You can restore it from the Trash view at any time.", confirmLabel: "Move to trash", destructive: true }))) return;
    setBusy(true);
    const result = await api(`/api/admin/enquiries/${enquiry.id}/`, { method: "DELETE", json: {} });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success("Moved to trash.");
    router.push("/admin/enquiries/");
    router.refresh();
  }

  async function purge() {
    if (!(await confirm({ title: `Permanently delete ${enquiry.referenceNumber}?`, message: "The enquiry, its messages, notes and attachments are erased forever. This cannot be undone.", confirmLabel: "Delete permanently", destructive: true }))) return;
    setBusy(true);
    const result = await api(`/api/admin/enquiries/${enquiry.id}/`, { method: "DELETE", json: { permanent: true, confirm: true } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success("Deleted permanently.");
    router.push("/admin/enquiries/?view=trash");
    router.refresh();
  }

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/enquiries/" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy-900">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All enquiries
        </Link>
      </div>

      {trashed ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          <span>This enquiry is in the trash (since {fmt.dateTime(enquiry.deletedAt)}).</span>
          <span className="flex gap-2">
            <button type="button" disabled={busy} className={btn.outline} onClick={async () => (await post("restore/", {}, "Restored from trash."))}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Restore
            </button>
            <button type="button" disabled={busy} className={btn.danger} onClick={purge}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete permanently
            </button>
          </span>
        </div>
      ) : null}

      <header className="mb-5 border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-navy-900">{enquiry.referenceNumber}</span>
              <TypeBadge type={enquiry.type} />
              <StatusBadge status={enquiry.status} />
              <PriorityBadge priority={enquiry.priority} />
              {archived ? <span className="rounded-sm bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200">Archived</span> : null}
            </div>
            <h1 className="mt-2 break-words text-xl font-semibold tracking-tight text-navy-900">{enquiry.name}</h1>
            <p className="mt-0.5 break-words text-sm text-neutral-600">{enquiry.subject}</p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-neutral-500">
              Status
              <select
                value={enquiry.status}
                disabled={busy || trashed}
                onChange={(e) => post("status/", { status: e.target.value }, `Status set to ${STATUS_LABELS[e.target.value]}.`)}
                className={cn(inputClass, "mt-0.5 block w-auto py-1.5")}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-neutral-500">
              Priority
              <select
                value={enquiry.priority}
                disabled={busy || trashed}
                onChange={(e) => post("priority/", { priority: e.target.value }, `Priority set to ${PRIORITY_LABELS[e.target.value]}.`)}
                className={cn(inputClass, "mt-0.5 block w-auto py-1.5")}
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {!trashed ? (
              <div className="flex gap-2">
                <button type="button" disabled={busy} className={btn.outline} onClick={() => post("read/", { read: false }, "Marked as unread.").then((ok) => ok && router.push("/admin/enquiries/"))} title="Mark as unread and go back to the list">
                  <EyeOff className="h-4 w-4" aria-hidden /> Unread
                </button>
                <button type="button" disabled={busy} className={btn.outline} onClick={() => post("archive/", { archived: !archived }, archived ? "Moved back to active." : "Archived.")}>
                  {archived ? <RotateCcw className="h-4 w-4" aria-hidden /> : <Archive className="h-4 w-4" aria-hidden />} {archived ? "Unarchive" : "Archive"}
                </button>
                <button type="button" disabled={busy} className={cn(btn.outline, "text-red-700")} onClick={trash}>
                  <Trash2 className="h-4 w-4" aria-hidden /> Trash
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="min-w-0 space-y-5">
          <Conversation messages={props.messages} />
          <ReplyComposer
            enquiryId={enquiry.id}
            customerEmail={enquiry.email}
            defaultSubject={props.defaultSubject}
            drafts={props.drafts}
            templates={props.templates}
            quickReplies={props.quickReplies}
            uploadLimitBytes={props.uploadLimitBytes}
            disabled={trashed}
          />
        </div>

        <aside className="min-w-0 space-y-5" aria-label="Enquiry details">
          <DetailsCard enquiry={enquiry} customerSince={props.customerSince} />
          <FollowUpsCard enquiryId={enquiry.id} followUps={props.followUps} />
          <NotesCard enquiryId={enquiry.id} notes={props.notes} />
          <AttachmentsCard attachments={props.attachments} />
          <HistoryCard history={props.history} />
          <EmailLogsCard logs={props.emailLogs} />
          <SubmissionCard enquiry={enquiry} />
          <TimelineCard activity={props.activity} />
        </aside>
      </div>
    </>
  );
}
