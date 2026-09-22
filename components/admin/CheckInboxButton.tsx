"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { api } from "./api";
import { useToast } from "./feedback";
import { btn } from "./ui";

type Summary = { configured: boolean; checked: number; matched: number; created: number; duplicates: number; ignored: number; failed: number; skipped?: string; error?: string };

/** Pulls new customer replies from the IMAP mailbox on demand. */
export function CheckInboxButton({ imapConfigured }: { imapConfigured: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true);
    const result = await api<{ summary: Summary }>("/api/admin/email/inbox/", { method: "POST" });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    const s = result.data.summary;
    if (!s.configured) return toast.info("No IMAP mailbox is configured. Replies arrive through the inbound webhook instead — see Settings → Inbound email.");
    if (s.error) return toast.error(s.error);
    if (s.skipped) return toast.info(s.skipped);
    if (s.checked === 0) toast.success("Inbox checked — no new mail.");
    else toast.success(`${s.matched} repl${s.matched === 1 ? "y" : "ies"} added, ${s.created} new enquir${s.created === 1 ? "y" : "ies"}${s.failed ? `, ${s.failed} failed` : ""}.`);
    router.refresh();
  }

  return (
    <button type="button" onClick={check} disabled={busy} className={btn.outline} title={imapConfigured ? "Read new mail from the support mailbox" : "IMAP is not configured"}>
      <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden /> {busy ? "Checking…" : "Check inbox now"}
    </button>
  );
}
