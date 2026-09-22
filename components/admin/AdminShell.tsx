"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, CalendarClock, Download, HeartPulse, Inbox, LayoutDashboard, LogOut, Mail, MailWarning, Menu, MessageSquare, Paperclip, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "./api";
import { NotificationBell } from "./NotificationBell";

export type NavCounts = { unread: number; followUpsDue: number; failedEmails: number; awaitingReply: number };

type NavItem = { href: string; label: string; icon: React.ReactNode; badge?: (counts: NavCounts) => { value: number; tone: "copper" | "red" } | null };

const ICON = "h-4.5 w-4.5 shrink-0";

const NAV: NavItem[] = [
  { href: "/admin/dashboard/", label: "Dashboard", icon: <LayoutDashboard className={ICON} aria-hidden /> },
  { href: "/admin/enquiries/", label: "Enquiries", icon: <Mail className={ICON} aria-hidden />, badge: (c) => (c.unread ? { value: c.unread, tone: "copper" } : null) },
  { href: "/admin/contacts/", label: "Contact Messages", icon: <MessageSquare className={ICON} aria-hidden /> },
  { href: "/admin/follow-ups/", label: "Follow-ups", icon: <CalendarClock className={ICON} aria-hidden />, badge: (c) => (c.followUpsDue ? { value: c.followUpsDue, tone: "red" } : null) },
  { href: "/admin/inbox/", label: "Email Inbox", icon: <Inbox className={ICON} aria-hidden />, badge: (c) => (c.awaitingReply ? { value: c.awaitingReply, tone: "copper" } : null) },
  { href: "/admin/attachments/", label: "Attachments", icon: <Paperclip className={ICON} aria-hidden /> },
  { href: "/admin/email-logs/", label: "Email Logs", icon: <MailWarning className={ICON} aria-hidden />, badge: (c) => (c.failedEmails ? { value: c.failedEmails, tone: "red" } : null) },
  { href: "/admin/activity/", label: "Activity", icon: <Activity className={ICON} aria-hidden /> },
  { href: "/admin/export/", label: "Export", icon: <Download className={ICON} aria-hidden /> },
  { href: "/admin/settings/", label: "Settings", icon: <Settings className={ICON} aria-hidden /> },
  { href: "/admin/health/", label: "Health", icon: <HeartPulse className={ICON} aria-hidden /> },
];

export function AdminShell({ counts, adminEmail, unreadNotifications, children }: { counts: NavCounts; adminEmail: string; unreadNotifications: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);

  async function signOut() {
    setSigningOut(true);
    await api("/api/admin/auth/logout/", { method: "POST" });
    router.replace("/admin/login/");
    router.refresh();
  }

  const isActive = (href: string) => pathname.startsWith(href.replace(/\/$/, ""));

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col bg-navy-900 text-neutral-300">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <Link href="/admin/dashboard/" className="flex items-center gap-2.5 text-white">
          <span className="flex h-7 w-7 items-center justify-center bg-copper-500 text-xs font-bold lowercase">rc</span>
          <span className="text-sm font-semibold leading-tight">
            Render CAD Hub
            <span className="block text-[10px] font-normal uppercase tracking-wider text-neutral-400">Admin</span>
          </span>
        </Link>
        <button type="button" className="text-neutral-400 hover:text-white lg:hidden" onClick={() => setDrawer(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV.map((item) => {
          const badge = item.badge?.(counts) ?? null;
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setDrawer(false)}
                className={cn("flex items-center gap-3 px-3 py-2 text-sm transition-colors", active ? "bg-white/10 font-medium text-white" : "hover:bg-white/5 hover:text-white")}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {badge ? (
                  <span className={cn("min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold text-white", badge.tone === "red" ? "bg-red-600" : "bg-copper-500")}>{badge.value > 99 ? "99+" : badge.value}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-white/10 p-3">
        <p className="truncate px-1 pb-2 text-xs text-neutral-400" title={adminEmail}>
          {adminEmail}
        </p>
        <button type="button" onClick={signOut} disabled={signingOut} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white disabled:opacity-60">
          <LogOut className={ICON} aria-hidden />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-navy-900">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:bg-copper-500 focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">{sidebar}</aside>

      {drawer ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-navy-950/60" aria-label="Close menu" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-64 max-w-[85%] shadow-2xl">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 sm:px-6">
          <button type="button" onClick={() => setDrawer(true)} className="flex h-9 w-9 items-center justify-center border border-neutral-200 text-navy-900 lg:hidden" aria-label="Open menu" aria-expanded={drawer}>
            <Menu className="h-5 w-5" />
          </button>
          <p className="hidden text-sm text-neutral-500 lg:block">Leads &amp; customer communication</p>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell initialUnread={unreadNotifications} />
          </div>
        </header>
        <main id="admin-main" className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
