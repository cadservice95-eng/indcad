"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { PRIORITY_LABELS, SOURCE_LABELS, STATUS_LABELS } from "@/lib/enquiry-meta";
import { cn } from "@/lib/utils";
import { toQuery } from "./api";
import { btn, inputClass } from "./ui";

const RANGES = [
  ["", "All time"],
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["last7", "Last 7 days"],
  ["last30", "Last 30 days"],
  ["month", "This month"],
  ["custom", "Custom range"],
] as const;

/** Builds the export URL from the chosen filters; the download is a normal browser GET so cookies authenticate it. */
export function ExportForm() {
  const [v, setV] = useState({ type: "", status: "", priority: "", source: "", range: "", from: "", to: "", view: "", q: "" });
  const set = (key: keyof typeof v, value: string) => setV((prev) => ({ ...prev, [key]: value }));

  const customIncomplete = v.range === "custom" && (!v.from || !v.to);
  const qs = toQuery({ ...v, from: v.range === "custom" ? v.from : "", to: v.range === "custom" ? v.to : "" });
  const href = `/api/admin/export/enquiries/${qs ? `?${qs}` : ""}`;
  const field = "text-sm text-neutral-600";

  return (
    <div className="border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className={field}>
          Type
          <select value={v.type} onChange={(e) => set("type", e.target.value)} className={cn(inputClass, "mt-1")}>
            <option value="">Quotes and contact messages</option>
            <option value="QUOTE_REQUEST">Quote requests only</option>
            <option value="CONTACT_MESSAGE">Contact messages only</option>
          </select>
        </label>
        <label className={field}>
          Status
          <select value={v.status} onChange={(e) => set("status", e.target.value)} className={cn(inputClass, "mt-1")}>
            <option value="">Any status</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={field}>
          Priority
          <select value={v.priority} onChange={(e) => set("priority", e.target.value)} className={cn(inputClass, "mt-1")}>
            <option value="">Any priority</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={field}>
          Source
          <select value={v.source} onChange={(e) => set("source", e.target.value)} className={cn(inputClass, "mt-1")}>
            <option value="">Any source</option>
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={field}>
          Received
          <select value={v.range} onChange={(e) => set("range", e.target.value)} className={cn(inputClass, "mt-1")}>
            {RANGES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={field}>
          Include
          <select value={v.view} onChange={(e) => set("view", e.target.value)} className={cn(inputClass, "mt-1")}>
            <option value="">Active enquiries</option>
            <option value="archived">Archived enquiries</option>
            <option value="trash">Trashed enquiries</option>
          </select>
        </label>
        {v.range === "custom" ? (
          <>
            <label className={field}>
              From
              <input type="date" value={v.from} onChange={(e) => set("from", e.target.value)} className={cn(inputClass, "mt-1")} />
            </label>
            <label className={field}>
              To
              <input type="date" value={v.to} onChange={(e) => set("to", e.target.value)} className={cn(inputClass, "mt-1")} />
            </label>
          </>
        ) : null}
        <label className={cn(field, "sm:col-span-2 lg:col-span-3")}>
          Search text (optional)
          <input type="search" value={v.q} onChange={(e) => set("q", e.target.value)} maxLength={200} placeholder="Reference, name, email, company…" className={cn(inputClass, "mt-1")} />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
        <a href={customIncomplete ? undefined : href} aria-disabled={customIncomplete} download className={cn(btn.primary, customIncomplete && "pointer-events-none opacity-50")}>
          <Download className="h-4 w-4" aria-hidden /> Download CSV
        </a>
        <p className="text-xs text-neutral-500">The file contains enquiry and customer details only — never passwords, sessions or settings. Up to 20,000 rows per export.</p>
      </div>
    </div>
  );
}
