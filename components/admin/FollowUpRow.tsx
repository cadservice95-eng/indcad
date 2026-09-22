"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { toLocalInput } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { api } from "./api";
import { useAdminFormat, useToast } from "./feedback";
import { PriorityBadge, StatusBadge, btn, inputClass } from "./ui";

export type FollowUpRowData = {
  id: string;
  enquiryId: string;
  referenceNumber: string;
  name: string;
  email: string;
  status: string;
  priority: string;
  dueAt: string;
  note: string | null;
  completedAt: string | null;
};

export function FollowUpRow({ item, overdue }: { item: FollowUpRowData; overdue: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const fmt = useAdminFormat();
  const [rescheduling, setRescheduling] = useState(false);
  const [due, setDue] = useState(() => toLocalInput(new Date(item.dueAt), fmt.timezone));
  const [busy, setBusy] = useState(false);

  async function act(body: Record<string, unknown>, success: string) {
    setBusy(true);
    const result = await api(`/api/admin/follow-ups/${item.id}/`, { method: "PATCH", json: body });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success(success);
    setRescheduling(false);
    router.refresh();
  }

  return (
    <li className={cn("flex flex-wrap items-start justify-between gap-3 px-4 py-3", overdue && "bg-red-50/50")}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/enquiries/${item.enquiryId}/`} className="text-sm font-semibold text-navy-900 hover:underline">
            {item.name}
          </Link>
          <span className="font-mono text-xs text-neutral-500">{item.referenceNumber}</span>
          <StatusBadge status={item.status} />
          <PriorityBadge priority={item.priority} />
        </div>
        <p className={cn("mt-1 text-sm", overdue ? "font-medium text-red-700" : "text-neutral-700")}>
          {item.completedAt ? `Completed ${fmt.dateTime(item.completedAt)} · was due ${fmt.dateTime(item.dueAt)}` : `${overdue ? "Overdue since " : "Due "}${fmt.dateTime(item.dueAt)}`}
        </p>
        {item.note ? <p className="mt-0.5 text-sm text-neutral-600">{item.note}</p> : null}
        {rescheduling ? (
          <form
            className="mt-2 flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void act({ action: "reschedule", dueAt: due }, "Follow-up rescheduled.");
            }}
          >
            <input type="datetime-local" required value={due} onChange={(e) => setDue(e.target.value)} aria-label="New date and time" className={cn(inputClass, "w-auto py-1")} />
            <button type="submit" disabled={busy} className={btn.small}>
              Save
            </button>
            <button type="button" onClick={() => setRescheduling(false)} className={btn.small}>
              Cancel
            </button>
          </form>
        ) : null}
      </div>
      {!item.completedAt ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => act({ action: "complete" }, "Follow-up completed.")} className={btn.small}>
            <Check className="h-3.5 w-3.5" aria-hidden /> Mark complete
          </button>
          <button type="button" disabled={busy} onClick={() => setRescheduling((v) => !v)} className={btn.small}>
            Reschedule
          </button>
          <Link href={`/admin/enquiries/${item.enquiryId}/`} className={btn.small}>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open enquiry
          </Link>
        </div>
      ) : (
        <Link href={`/admin/enquiries/${item.enquiryId}/`} className={btn.small}>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open enquiry
        </Link>
      )}
    </li>
  );
}
