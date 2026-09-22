"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bell, CalendarClock, Mail, MessageSquare, Reply } from "lucide-react";
import { timeAgo } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { api } from "./api";

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  enquiryId: string | null;
  isRead: boolean;
  createdAt: string;
};

const ICONS: Record<string, React.ReactNode> = {
  NEW_ENQUIRY: <Mail className="h-4 w-4 text-copper-500" aria-hidden />,
  NEW_CONTACT: <MessageSquare className="h-4 w-4 text-steel-500" aria-hidden />,
  CUSTOMER_REPLIED: <Reply className="h-4 w-4 text-emerald-600" aria-hidden />,
  EMAIL_FAILED: <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden />,
  FOLLOW_UP_DUE: <CalendarClock className="h-4 w-4 text-amber-600" aria-hidden />,
  FOLLOW_UP_OVERDUE: <CalendarClock className="h-4 w-4 text-red-600" aria-hidden />,
};

export function NotificationBell({ initialUnread }: { initialUnread: number }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnread);
  const [rows, setRows] = useState<NotificationRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const result = await api<{ rows: NotificationRow[]; unread: number }>("/api/admin/notifications/?limit=15");
    if (result.ok) {
      setRows(result.data.rows);
      setUnread(result.data.unread);
      setFailed(false);
    } else setFailed(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) void load();
    setOpen((v) => !v);
  }

  async function markRead(id: string) {
    setRows((list) => list?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? null);
    setUnread((n) => Math.max(0, n - 1));
    await api("/api/admin/notifications/", { json: { id } });
  }

  async function markAll() {
    setRows((list) => list?.map((n) => ({ ...n, isRead: true })) ?? null);
    setUnread(0);
    await api("/api/admin/notifications/", { json: { all: true } });
  }

  return (
    <div className="relative" ref={wrapper}>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center border border-neutral-200 bg-white text-navy-900 hover:border-navy-900"
      >
        <Bell className="h-4.5 w-4.5" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-copper-500 px-1 text-[10px] font-semibold text-white">{unread > 99 ? "99+" : unread}</span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] border border-neutral-300 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
            <p className="text-sm font-semibold text-navy-900">Notifications</p>
            <button type="button" onClick={markAll} disabled={unread === 0} className="text-xs font-medium text-copper-600 hover:underline disabled:text-neutral-400 disabled:no-underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {failed ? <p className="px-4 py-6 text-center text-sm text-red-600">Couldn&apos;t load notifications.</p> : null}
            {!failed && rows === null ? <p className="px-4 py-6 text-center text-sm text-neutral-500">Loading…</p> : null}
            {!failed && rows?.length === 0 ? <p className="px-4 py-8 text-center text-sm text-neutral-500">You&apos;re all caught up.</p> : null}
            {rows?.map((n) => {
              const content = (
                <div className={cn("flex gap-3 border-b border-neutral-100 px-4 py-3 text-left hover:bg-neutral-50", !n.isRead && "bg-copper-50/50")}>
                  <span className="mt-0.5 shrink-0">{ICONS[n.type] ?? <Bell className="h-4 w-4 text-neutral-400" aria-hidden />}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm", n.isRead ? "text-neutral-700" : "font-semibold text-navy-900")}>{n.title}</span>
                    {n.body ? <span className="block truncate text-xs text-neutral-500">{n.body}</span> : null}
                    <span className="block text-xs text-neutral-400">{timeAgo(n.createdAt)}</span>
                  </span>
                  {!n.isRead ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-copper-500" aria-label="Unread" /> : null}
                </div>
              );
              return n.enquiryId ? (
                <Link key={n.id} href={`/admin/enquiries/${n.enquiryId}/`} onClick={() => { void markRead(n.id); setOpen(false); }}>
                  {content}
                </Link>
              ) : (
                <button key={n.id} type="button" className="block w-full" onClick={() => void markRead(n.id)}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
