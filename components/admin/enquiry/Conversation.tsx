"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Download, Eye, FileText, Image as ImageIcon, Paperclip, RotateCw } from "lucide-react";
import { formatBytes } from "@/lib/enquiry-meta";
import { cn } from "@/lib/utils";
import { api } from "../api";
import { useAdminFormat, useToast } from "../feedback";
import { btn } from "../ui";
import type { AttachmentView, MessageView } from "./types";

const PREVIEWABLE = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export function AttachmentChip({ file, onDelete }: { file: AttachmentView; onDelete?: () => void }) {
  const canPreview = PREVIEWABLE.has(file.mimeType);
  const Icon = file.mimeType.startsWith("image/") ? ImageIcon : FileText;
  return (
    <span className="inline-flex max-w-full items-stretch border border-neutral-300 bg-white text-xs">
      <span className="flex min-w-0 items-center gap-1.5 px-2 py-1">
        <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-500" aria-hidden />
        <span className="truncate font-medium text-navy-900" title={file.originalFilename}>
          {file.originalFilename}
        </span>
        <span className="shrink-0 text-neutral-400">{formatBytes(file.size)}</span>
      </span>
      {canPreview ? (
        <a href={`/api/admin/attachments/${file.id}/download/?inline=1`} target="_blank" rel="noopener noreferrer" className="flex items-center border-l border-neutral-200 px-1.5 text-neutral-500 hover:bg-neutral-50 hover:text-navy-900" title="Preview" aria-label={`Preview ${file.originalFilename}`}>
          <Eye className="h-3.5 w-3.5" />
        </a>
      ) : null}
      <a href={`/api/admin/attachments/${file.id}/download/`} className="flex items-center border-l border-neutral-200 px-1.5 text-neutral-500 hover:bg-neutral-50 hover:text-navy-900" title="Download" aria-label={`Download ${file.originalFilename}`}>
        <Download className="h-3.5 w-3.5" />
      </a>
      {onDelete ? (
        <button type="button" onClick={onDelete} className="border-l border-neutral-200 px-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-red-600" aria-label={`Delete ${file.originalFilename}`} title="Delete">
          ×
        </button>
      ) : null}
    </span>
  );
}

const PROSE =
  "text-sm leading-relaxed text-neutral-800 break-words [&_a]:text-steel-600 [&_a]:underline [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-3 [&_blockquote]:text-neutral-600 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_table]:border-collapse [&_td]:border [&_td]:border-neutral-200 [&_td]:px-2 [&_td]:py-1 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5";

export function Conversation({ messages }: { messages: MessageView[] }) {
  const router = useRouter();
  const toast = useToast();
  const fmt = useAdminFormat();
  const [retrying, setRetrying] = useState<string | null>(null);

  async function retry(logId: string) {
    setRetrying(logId);
    const result = await api<{ status: string; error: string | null }>("/api/admin/email/retry/", { json: { logId } });
    setRetrying(null);
    if (!result.ok) return toast.error(result.error);
    if (result.data.status === "SENT") toast.success("Email sent.");
    else toast.error(`Still failing: ${result.data.error ?? "the mail server rejected it"}`);
    router.refresh();
  }

  if (messages.length === 0) return <p className="border border-dashed border-neutral-300 bg-white px-4 py-8 text-center text-sm text-neutral-500">No messages yet.</p>;

  return (
    <ol className="space-y-3" aria-label="Conversation">
      {messages.map((m) => {
        const mine = m.direction === "OUTBOUND";
        return (
          <li key={m.id} id={`message-${m.id}`} className={cn("border bg-white", mine ? "ml-0 border-steel-200 sm:ml-10" : "mr-0 border-neutral-200 sm:mr-10", m.status === "FAILED" && "border-red-300")}>
            <header className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2.5 text-xs", mine ? "border-steel-100 bg-steel-50" : "border-neutral-100 bg-neutral-50")}>
              <span className="font-semibold text-navy-900">{mine ? "You" : (m.senderName ?? m.senderEmail)}</span>
              <span className="text-neutral-500">
                {mine ? `to ${m.recipientEmail}` : m.senderEmail}
                {m.cc ? ` · cc ${m.cc}` : ""}
              </span>
              <span className="ml-auto flex items-center gap-2 text-neutral-500">
                {m.status === "QUEUED" ? <span className="text-amber-700">Sending…</span> : null}
                {m.status === "FAILED" ? <span className="font-medium text-red-600">Not delivered</span> : null}
                <time dateTime={m.at}>{fmt.dateTime(m.at)}</time>
              </span>
            </header>
            <div className="px-4 py-3">
              {m.subject ? <p className="mb-2 text-xs font-medium text-neutral-500">{m.subject}</p> : null}
              <div className={PROSE} dangerouslySetInnerHTML={{ __html: m.bodyHtml }} />
              {m.attachments.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-neutral-100 pt-3">
                  <Paperclip className="mt-1 h-3.5 w-3.5 text-neutral-400" aria-hidden />
                  {m.attachments.map((file) => (
                    <AttachmentChip key={file.id} file={file} />
                  ))}
                </div>
              ) : null}
              {m.failedLogId ? (
                <div className="mt-3 flex flex-wrap items-center gap-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1">
                    This reply was saved but the email was not delivered{m.failedReason ? `: ${m.failedReason}` : "."}
                  </span>
                  <button type="button" onClick={() => retry(m.failedLogId!)} disabled={retrying === m.failedLogId} className={btn.small}>
                    <RotateCw className={cn("h-3.5 w-3.5", retrying === m.failedLogId && "animate-spin")} aria-hidden /> Retry
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
