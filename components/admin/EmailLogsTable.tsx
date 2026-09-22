"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "./api";
import { Modal, useAdminFormat, useToast } from "./feedback";
import { EmailStatusBadge, btn } from "./ui";

export type EmailLogRow = {
  id: string;
  recipient: string;
  subject: string;
  template: string | null;
  status: string;
  attemptCount: number;
  errorMessage: string | null;
  lastAttemptAt: string | null;
  sentAt: string | null;
  createdAt: string;
  enquiryId: string | null;
  referenceNumber: string | null;
  canRetry: boolean;
};

type Detail = {
  id: string;
  recipient: string;
  cc: string | null;
  sender: string;
  subject: string;
  template: string | null;
  messageId: string | null;
  status: string;
  providerResponse: string | null;
  errorMessage: string | null;
  attemptCount: number;
  lastAttemptAt: string | null;
  sentAt: string | null;
  createdAt: string;
  referenceNumber: string | null;
  enquiryId: string | null;
  bodyText: string | null;
  canRetry: boolean;
};

const TEMPLATE_LABELS: Record<string, string> = {
  quote_received: "Quote received (customer)",
  contact_received: "Contact received (customer)",
  admin_new_enquiry: "New enquiry (admin)",
  admin_new_contact: "New contact (admin)",
  password_reset: "Password reset",
  smtp_test: "SMTP test",
  reply: "Reply",
  quote_follow_up: "Quote follow-up",
};

export function EmailLogsTable({ rows, failedCount }: { rows: EmailLogRow[]; failedCount: number }) {
  const router = useRouter();
  const toast = useToast();
  const fmt = useAdminFormat();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [retryingAll, setRetryingAll] = useState(false);

  async function open(id: string) {
    setLoading(id);
    const result = await api<{ entry: Detail }>(`/api/admin/email/logs/${id}/`);
    setLoading(null);
    if (!result.ok) return toast.error(result.error);
    setDetail(result.data.entry);
  }

  async function retry(id: string) {
    setRetrying(id);
    const result = await api<{ status: string; error: string | null }>("/api/admin/email/retry/", { json: { logId: id } });
    setRetrying(null);
    if (!result.ok) return toast.error(result.error);
    if (result.data.status === "SENT") toast.success("Email sent.");
    else toast.error(`Still failing: ${result.data.error ?? "unknown error"}`);
    setDetail(null);
    router.refresh();
  }

  async function retryAll() {
    setRetryingAll(true);
    const result = await api<{ attempted: number; sent: number; stillFailing: number }>("/api/admin/email/retry/", { json: { allFailed: true } });
    setRetryingAll(false);
    if (!result.ok) return toast.error(result.error);
    const { attempted, sent, stillFailing } = result.data;
    if (attempted === 0) toast.info("There are no failed emails to retry.");
    else if (stillFailing === 0) toast.success(`All ${sent} email${sent === 1 ? "" : "s"} sent.`);
    else toast.error(`${sent} sent, ${stillFailing} still failing. Check the SMTP settings.`);
    router.refresh();
  }

  return (
    <>
      {failedCount > 0 ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
          <span>
            {failedCount} email{failedCount === 1 ? "" : "s"} failed to send. Fix the cause (usually SMTP settings), then retry.
          </span>
          <button type="button" onClick={retryAll} disabled={retryingAll} className={btn.outline}>
            <RotateCw className={cn("h-4 w-4", retryingAll && "animate-spin")} aria-hidden /> {retryingAll ? "Retrying…" : "Retry all failed"}
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto border border-neutral-200 bg-white">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Enquiry</th>
              <th className="px-4 py-2.5 font-medium">Attempts</th>
              <th className="px-4 py-2.5 font-medium">When</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.id} className="align-top hover:bg-neutral-50">
                <td className="px-4 py-2.5">
                  <EmailStatusBadge status={row.status} />
                </td>
                <td className="max-w-[22rem] px-4 py-2.5">
                  <button type="button" onClick={() => open(row.id)} className="block w-full truncate text-left font-medium text-navy-900 hover:underline" title={row.subject}>
                    {row.subject}
                  </button>
                  <p className="truncate text-xs text-neutral-500">
                    To {row.recipient}
                    {row.template ? ` · ${TEMPLATE_LABELS[row.template] ?? row.template}` : ""}
                  </p>
                  {row.status === "FAILED" && row.errorMessage ? <p className="mt-0.5 line-clamp-2 text-xs text-red-600">{row.errorMessage}</p> : null}
                </td>
                <td className="px-4 py-2.5">
                  {row.enquiryId ? (
                    <Link href={`/admin/enquiries/${row.enquiryId}/`} className="font-mono text-xs text-steel-600 hover:underline">
                      {row.referenceNumber}
                    </Link>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-neutral-600">{row.attemptCount}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-xs text-neutral-600">{fmt.dateTime(row.sentAt ?? row.lastAttemptAt ?? row.createdAt)}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => open(row.id)} disabled={loading === row.id} className={btn.small}>
                      Details
                    </button>
                    {row.status === "FAILED" && row.canRetry ? (
                      <button type="button" onClick={() => retry(row.id)} disabled={retrying === row.id} className={btn.small}>
                        <RotateCw className={cn("h-3.5 w-3.5", retrying === row.id && "animate-spin")} aria-hidden /> Retry
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail ? (
        <Modal title="Email details" onClose={() => setDetail(null)} size="lg">
          <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[9rem_1fr]">
            {(
              [
                ["Status", <EmailStatusBadge key="s" status={detail.status} />],
                ["Subject", detail.subject],
                ["To", detail.recipient],
                ["Cc", detail.cc],
                ["From", detail.sender],
                ["Type", detail.template ? (TEMPLATE_LABELS[detail.template] ?? detail.template) : null],
                ["Enquiry", detail.enquiryId ? <Link key="e" href={`/admin/enquiries/${detail.enquiryId}/`} className="font-mono text-steel-600 hover:underline">{detail.referenceNumber}</Link> : null],
                ["Attempts", String(detail.attemptCount)],
                ["Created", fmt.dateTime(detail.createdAt)],
                ["Last attempt", detail.lastAttemptAt ? fmt.dateTime(detail.lastAttemptAt) : null],
                ["Delivered", detail.sentAt ? fmt.dateTime(detail.sentAt) : null],
                ["Message-ID", detail.messageId ? <span key="m" className="break-all font-mono text-xs">{detail.messageId}</span> : null],
                ["Server response", detail.providerResponse],
                ["Error", detail.errorMessage ? <span key="err" className="text-red-700">{detail.errorMessage}</span> : null],
              ] as [string, React.ReactNode][]
            ).map(([label, value]) =>
              value ? (
                <div key={label} className="contents">
                  <dt className="text-neutral-500">{label}</dt>
                  <dd className="min-w-0 break-words text-navy-900">{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
          <div className="mt-4 border-t border-neutral-200 pt-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">Message</p>
            {detail.bodyText ? <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words bg-neutral-50 p-3 text-sm text-neutral-800">{detail.bodyText}</pre> : <p className="text-sm text-neutral-500">The content of this email is intentionally not stored (for example, password reset links).</p>}
          </div>
          {detail.status === "FAILED" && detail.canRetry ? (
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => retry(detail.id)} disabled={retrying === detail.id} className={btn.primary}>
                <RotateCw className={cn("h-4 w-4", retrying === detail.id && "animate-spin")} aria-hidden /> Retry sending
              </button>
            </div>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}
