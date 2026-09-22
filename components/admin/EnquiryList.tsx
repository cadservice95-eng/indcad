"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowDownLeft, ArrowUpRight, CalendarClock, Download, Inbox, Paperclip, RotateCcw, Trash2 } from "lucide-react";
import { defaultFollowUp, timeAgo } from "@/lib/admin-format";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/enquiry-meta";
import { cn } from "@/lib/utils";
import { api } from "./api";
import { useAdminFormat, useConfirm, useToast } from "./feedback";
import { EmptyState, PriorityBadge, StatusBadge, TypeBadge, btn, inputClass } from "./ui";

export type ListRow = {
  id: string;
  referenceNumber: string;
  type: string;
  name: string;
  company: string | null;
  email: string;
  service: string | null;
  subject: string;
  status: string;
  priority: string;
  isRead: boolean;
  createdAt: string | Date;
  lastMessageAt: string | Date | null;
  lastMessageDirection: string | null;
  nextFollowUpAt: string | Date | null;
  messageCount: number;
  attachmentCount: number;
  preview: string;
  lastPreview: string | null;
};

type BulkBody = { action: string; status?: string; priority?: string; dueAt?: string; confirm?: boolean };

export function EnquiryList({ rows, view, exportQuery, preview = "description", emptyTitle = "No enquiries match", emptyHint }: { rows: ListRow[]; view: "active" | "archived" | "trash"; exportQuery: string; preview?: "description" | "last"; emptyTitle?: string; emptyHint?: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const fmt = useAdminFormat();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [now] = useState(() => Date.now());
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpAt, setFollowUpAt] = useState(() => defaultFollowUp(1, 10, fmt.timezone));

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const ids = useMemo(() => [...selected], [selected]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  async function run(body: BulkBody, success: string) {
    setBusy(true);
    const result = await api<{ done: number; skipped: number }>("/api/admin/enquiries/bulk/", { json: { ids, ...body } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    const { done, skipped } = result.data;
    toast.success(skipped ? `${success} (${done} updated, ${skipped} skipped)` : `${success} (${done})`);
    setSelected(new Set());
    setFollowUpOpen(false);
    router.refresh();
  }

  async function destructive(body: BulkBody, title: string, message: string, label: string, success: string) {
    if (await confirm({ title, message, confirmLabel: label, destructive: true })) await run(body, success);
  }

  const exportHref = ids.length ? `/api/admin/export/enquiries/?ids=${ids.join(",")}` : `/api/admin/export/enquiries/${exportQuery ? `?${exportQuery}` : ""}`;

  if (rows.length === 0) {
    return (
      <div className="border border-neutral-200 bg-white">
        <EmptyState
          title={emptyTitle}
          description={emptyHint ?? "Try changing or clearing the filters. New submissions from the website appear here automatically."}
          icon={<Inbox className="h-8 w-8" />}
        />
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white">
      <div className={cn("sticky top-14 z-10 flex flex-wrap items-center gap-2 border-b border-neutral-200 px-3 py-2", selected.size ? "bg-copper-50" : "bg-neutral-50")}>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))} className="h-4 w-4 accent-copper-500" aria-label="Select all on this page" />
          {selected.size ? <span className="font-medium">{selected.size} selected</span> : <span className="text-neutral-500">Select all</span>}
        </label>

        {selected.size ? (
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <button type="button" disabled={busy} className={btn.small} onClick={() => run({ action: "mark_read" }, "Marked as read")}>
              Mark read
            </button>
            <button type="button" disabled={busy} className={btn.small} onClick={() => run({ action: "mark_unread" }, "Marked as unread")}>
              Mark unread
            </button>
            <select aria-label="Change status" disabled={busy} value="" onChange={(e) => e.target.value && run({ action: "status", status: e.target.value }, `Status set to ${STATUS_LABELS[e.target.value]}`)} className={cn(inputClass, "w-auto py-1 text-xs")}>
              <option value="">Set status…</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select aria-label="Change priority" disabled={busy} value="" onChange={(e) => e.target.value && run({ action: "priority", priority: e.target.value }, `Priority set to ${PRIORITY_LABELS[e.target.value]}`)} className={cn(inputClass, "w-auto py-1 text-xs")}>
              <option value="">Set priority…</option>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button type="button" disabled={busy} className={btn.small} onClick={() => setFollowUpOpen((v) => !v)} aria-expanded={followUpOpen}>
              <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Follow-up
            </button>
            {view === "active" ? (
              <button type="button" disabled={busy} className={btn.small} onClick={() => run({ action: "archive" }, "Archived")}>
                <Archive className="h-3.5 w-3.5" aria-hidden /> Archive
              </button>
            ) : null}
            {view === "archived" ? (
              <button type="button" disabled={busy} className={btn.small} onClick={() => run({ action: "unarchive" }, "Moved back to active")}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Unarchive
              </button>
            ) : null}
            {view !== "trash" ? (
              <button type="button" disabled={busy} className={cn(btn.small, "text-red-700")} onClick={() => destructive({ action: "trash" }, `Move ${selected.size} to trash?`, "They leave the active list but can be restored from the Trash view.", "Move to trash", "Moved to trash")}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Trash
              </button>
            ) : (
              <>
                <button type="button" disabled={busy} className={btn.small} onClick={() => run({ action: "restore" }, "Restored")}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Restore
                </button>
                <button type="button" disabled={busy} className={cn(btn.small, "text-red-700")} onClick={() => destructive({ action: "delete_permanent", confirm: true }, `Permanently delete ${selected.size} enquir${selected.size === 1 ? "y" : "ies"}?`, "This removes the enquiries, their messages and attachments forever. It cannot be undone.", "Delete permanently", "Deleted permanently")}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete forever
                </button>
              </>
            )}
          </div>
        ) : (
          <span className="flex-1" />
        )}

        <a href={exportHref} className={btn.small} download>
          <Download className="h-3.5 w-3.5" aria-hidden /> {selected.size ? "Export selected" : "Export all matching"}
        </a>
      </div>

      {followUpOpen && selected.size ? (
        <form
          className="flex flex-wrap items-end gap-2 border-b border-neutral-200 bg-copper-50/60 px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            void run({ action: "follow_up", dueAt: followUpAt }, "Follow-up scheduled");
          }}
        >
          <label className="text-xs text-neutral-600">
            Follow-up on
            <input type="datetime-local" required value={followUpAt} onChange={(e) => setFollowUpAt(e.target.value)} className={cn(inputClass, "mt-0.5 block w-auto py-1")} />
          </label>
          <button type="submit" disabled={busy} className={btn.primary}>
            Schedule for {selected.size}
          </button>
        </form>
      ) : null}

      <ul className="divide-y divide-neutral-100">
        {rows.map((row) => {
          const overdue = row.nextFollowUpAt && new Date(row.nextFollowUpAt).getTime() < now;
          const snippet = preview === "last" ? (row.lastPreview ?? row.preview) : row.preview;
          return (
            <li key={row.id} className={cn("flex items-start gap-3 px-3 py-3 hover:bg-neutral-50", selected.has(row.id) && "bg-copper-50/40")}>
              <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} className="mt-1 h-4 w-4 shrink-0 accent-copper-500" aria-label={`Select ${row.referenceNumber}`} />
              <Link href={`/admin/enquiries/${row.id}/`} className="grid min-w-0 flex-1 gap-x-4 gap-y-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto] md:items-center">
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {!row.isRead ? <span className="h-2 w-2 shrink-0 rounded-full bg-copper-500" aria-label="Unread" /> : null}
                    <span className={cn("truncate text-sm", row.isRead ? "text-neutral-800" : "font-semibold text-navy-900")}>{row.name}</span>
                    {row.company ? <span className="truncate text-xs text-neutral-500">· {row.company}</span> : null}
                    <TypeBadge type={row.type} />
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-neutral-500">
                    <span className="font-mono">{row.referenceNumber}</span>
                    {row.service ? ` · ${row.service}` : ""}
                  </span>
                  <span className="mt-1 block truncate text-sm text-neutral-600">{snippet}</span>
                </span>

                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 md:flex-col md:items-start md:gap-1">
                  <span className="flex items-center gap-1" title={`Last activity ${fmt.dateTime(row.lastMessageAt ?? row.createdAt)}`}>
                    {row.lastMessageDirection === "OUTBOUND" ? <ArrowUpRight className="h-3.5 w-3.5 text-steel-500" aria-label="We replied last" /> : <ArrowDownLeft className="h-3.5 w-3.5 text-copper-500" aria-label="Customer wrote last" />}
                    {timeAgo(row.lastMessageAt ?? row.createdAt)}
                    {row.messageCount > 1 ? ` · ${row.messageCount} msgs` : ""}
                  </span>
                  {row.nextFollowUpAt ? (
                    <span className={cn("flex items-center gap-1", overdue ? "font-medium text-red-600" : "text-amber-700")}>
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden /> {fmt.dateTime(row.nextFollowUpAt)}
                    </span>
                  ) : null}
                  {row.attachmentCount > 0 ? (
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5" aria-hidden /> {row.attachmentCount}
                    </span>
                  ) : null}
                </span>

                <span className="flex items-center gap-1.5 md:justify-end">
                  <PriorityBadge priority={row.priority} />
                  <StatusBadge status={row.status} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
