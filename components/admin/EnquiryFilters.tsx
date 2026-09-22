"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Search, X } from "lucide-react";
import { PRIORITY_LABELS, SOURCE_LABELS, STATUS_LABELS } from "@/lib/enquiry-meta";
import { cn } from "@/lib/utils";
import { api, toQuery } from "./api";
import { useConfirm, useToast } from "./feedback";
import { btn, inputClass } from "./ui";

export type SavedFilter = { id: string; name: string; query: string };
type Values = Record<string, string>;

const FOLLOW_UP_OPTIONS = [
  ["", "Any follow-up"],
  ["due", "Due now"],
  ["overdue", "Overdue"],
  ["today", "Due today"],
  ["upcoming", "Upcoming"],
  ["any", "Has a follow-up"],
] as const;

const RANGE_OPTIONS = [
  ["", "Any date"],
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["last7", "Last 7 days"],
  ["last30", "Last 30 days"],
  ["month", "This month"],
  ["custom", "Custom range…"],
] as const;

const SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["activity", "Latest activity"],
  ["priority", "Priority"],
  ["follow_up", "Follow-up date"],
] as const;

const select = cn(inputClass, "py-1.5");

export function EnquiryFilters({ basePath, initial, savedFilters, lockedType, showSaved = true, showView = true }: { basePath: string; initial: Values; savedFilters: SavedFilter[]; lockedType?: string; showSaved?: boolean; showView?: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [values, setValues] = useState<Values>(initial);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");
  const firstRender = useRef(true);

  const current = (v: Values) => toQuery({ ...v, page: undefined });
  const go = (v: Values) => {
    const qs = current(v);
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  // Free-text search applies shortly after typing stops.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      if ((values.q ?? "") !== (initial.q ?? "")) go(values);
    }, 450);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.q]);

  const set = (key: string, value: string, apply = true) => {
    const next = { ...values, [key]: value };
    if (key === "range" && value !== "custom") {
      delete next.from;
      delete next.to;
    }
    setValues(next);
    if (apply) go(next);
  };

  const view = values.view || "active";
  const hasFilters = Object.entries(values).some(([k, v]) => v && k !== "view" && k !== "sort");

  async function saveFilter() {
    const query = current({ ...values, view: "" });
    if (!query) return toast.error("Choose at least one filter before saving.");
    const result = await api("/api/admin/saved-filters/", { json: { name: saveName, query } });
    if (!result.ok) return toast.error(result.error);
    toast.success("Filter saved.");
    setSaving(false);
    setSaveName("");
    router.refresh();
  }

  async function removeFilter(filter: SavedFilter) {
    const ok = await confirm({ title: `Delete “${filter.name}”?`, message: "This removes the saved filter. Enquiries are not affected.", confirmLabel: "Delete filter", destructive: true });
    if (!ok) return;
    const result = await api(`/api/admin/saved-filters/${filter.id}/`, { method: "DELETE" });
    if (!result.ok) return toast.error(result.error);
    router.refresh();
  }

  return (
    <div className="mb-4 space-y-3">
      {showSaved ? (
        <div className="flex flex-wrap items-center gap-2" aria-label="Saved filters">
          <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
            <Bookmark className="h-3.5 w-3.5" aria-hidden /> Saved
          </span>
          {savedFilters.map((f) => (
            <span key={f.id} className="inline-flex items-stretch border border-neutral-300 bg-white text-sm">
              <Link href={`${basePath}?${f.query}`} className="px-2.5 py-1 text-navy-900 hover:bg-neutral-50">
                {f.name}
              </Link>
              <button type="button" onClick={() => removeFilter(f)} aria-label={`Delete saved filter ${f.name}`} className="border-l border-neutral-200 px-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-red-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          {saving ? (
            <form
              className="inline-flex gap-1"
              onSubmit={(e) => {
                e.preventDefault();
                void saveFilter();
              }}
            >
              <input autoFocus value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Filter name" maxLength={80} className={cn(inputClass, "w-40 py-1")} aria-label="Saved filter name" />
              <button type="submit" disabled={!saveName.trim()} className={btn.small}>
                Save
              </button>
              <button type="button" onClick={() => setSaving(false)} className={btn.small}>
                Cancel
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => setSaving(true)} disabled={!hasFilters} title={hasFilters ? "Save the current filters" : "Apply a filter first"} className={btn.small}>
              + Save current filters
            </button>
          )}
        </div>
      ) : null}

      <div className="border border-neutral-200 bg-white p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <label className="relative sm:col-span-2">
            <span className="sr-only">Search enquiries</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input
              type="search"
              value={values.q ?? ""}
              onChange={(e) => set("q", e.target.value, false)}
              onKeyDown={(e) => e.key === "Enter" && go(values)}
              placeholder="Search reference, name, email, phone…"
              maxLength={200}
              className={cn(inputClass, "py-1.5 pl-8")}
            />
          </label>
          <select aria-label="Status" value={values.status ?? ""} onChange={(e) => set("status", e.target.value)} className={select}>
            <option value="">Any status</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select aria-label="Priority" value={values.priority ?? ""} onChange={(e) => set("priority", e.target.value)} className={select}>
            <option value="">Any priority</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {!lockedType ? (
            <select aria-label="Type" value={values.type ?? ""} onChange={(e) => set("type", e.target.value)} className={select}>
              <option value="">Quotes &amp; contacts</option>
              <option value="QUOTE_REQUEST">Quote requests</option>
              <option value="CONTACT_MESSAGE">Contact messages</option>
            </select>
          ) : null}
          <select aria-label="Source" value={values.source ?? ""} onChange={(e) => set("source", e.target.value)} className={select}>
            <option value="">Any source</option>
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select aria-label="Follow-up" value={values.followUp ?? ""} onChange={(e) => set("followUp", e.target.value)} className={select}>
            {FOLLOW_UP_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select aria-label="Created" value={values.range ?? ""} onChange={(e) => set("range", e.target.value, e.target.value !== "custom")} className={select}>
            {RANGE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select aria-label="Sort" value={values.sort ?? "newest"} onChange={(e) => set("sort", e.target.value)} className={select}>
            {SORT_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {values.range === "custom" ? (
          <form
            className="mt-2 flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              go(values);
            }}
          >
            <label className="text-xs text-neutral-500">
              From
              <input type="date" required value={values.from ?? ""} onChange={(e) => set("from", e.target.value, false)} className={cn(inputClass, "mt-0.5 block w-auto py-1")} />
            </label>
            <label className="text-xs text-neutral-500">
              To
              <input type="date" required value={values.to ?? ""} onChange={(e) => set("to", e.target.value, false)} className={cn(inputClass, "mt-0.5 block w-auto py-1")} />
            </label>
            <button type="submit" className={btn.outline}>
              Apply dates
            </button>
          </form>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <label className="flex items-center gap-1.5 text-neutral-700">
              <input type="checkbox" checked={values.unread === "1"} onChange={(e) => set("unread", e.target.checked ? "1" : "")} className="h-4 w-4 accent-copper-500" /> Unread only
            </label>
            <label className="flex items-center gap-1.5 text-neutral-700">
              <input type="checkbox" checked={values.emailFailed === "1"} onChange={(e) => set("emailFailed", e.target.checked ? "1" : "")} className="h-4 w-4 accent-copper-500" /> Has failed email
            </label>
            <select aria-label="Conversation" value={values.awaiting ?? ""} onChange={(e) => set("awaiting", e.target.value)} className={cn(select, "w-auto")}>
              <option value="">Any conversation state</option>
              <option value="reply">Waiting for our reply</option>
              <option value="customer">Waiting for the customer</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {showView ? (
              <div role="group" aria-label="View" className="flex border border-neutral-300 text-sm">
                {(["active", "archived", "trash"] as const).map((v) => (
                  <button key={v} type="button" onClick={() => set("view", v === "active" ? "" : v)} aria-pressed={view === v} className={cn("px-3 py-1.5 capitalize", view === v ? "bg-navy-900 font-medium text-white" : "bg-white text-neutral-700 hover:bg-neutral-50")}>
                    {v}
                  </button>
                ))}
              </div>
            ) : null}
            {hasFilters ? (
              <button type="button" onClick={() => go({ view: values.view ?? "" })} className={btn.small}>
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
