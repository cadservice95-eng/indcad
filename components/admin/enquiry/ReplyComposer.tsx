"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Link2, List, ListOrdered, Paperclip, Save, Send, Trash2, Underline, X } from "lucide-react";
import { formatBytes, STATUS_LABELS } from "@/lib/enquiry-meta";
import { cn } from "@/lib/utils";
import { api } from "../api";
import { useConfirm, useToast } from "../feedback";
import { btn, inputClass } from "../ui";
import { AttachmentChip } from "./Conversation";
import type { DraftView, QuickReply, TemplateOption } from "./types";

const FILE_ACCEPT = ".pdf,.dwg,.dxf,.dgn,.step,.stp,.iges,.igs,.stl,.rvt,.skp,.zip,.png,.jpg,.jpeg,.webp,.docx,.xlsx,.txt,.csv";
const STATUS_AFTER = ["AWAITING_CUSTOMER", "CONTACTED", "QUOTED", "FOLLOW_UP", "IN_REVIEW", "WON", "LOST", "CLOSED"] as const;

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-navy-900">
      {children}
    </button>
  );
}

export function ReplyComposer({
  enquiryId,
  customerEmail,
  defaultSubject,
  drafts,
  templates,
  quickReplies,
  uploadLimitBytes,
  disabled,
}: {
  enquiryId: string;
  customerEmail: string;
  defaultSubject: string;
  drafts: DraftView[];
  templates: TemplateOption[];
  quickReplies: QuickReply[];
  uploadLimitBytes: number;
  disabled?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const editor = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const draft = drafts[0];

  const [to, setTo] = useState(draft?.toEmail || customerEmail);
  const [cc, setCc] = useState(draft?.cc ?? "");
  const [showCc, setShowCc] = useState(Boolean(draft?.cc));
  const [subject, setSubject] = useState(draft?.subject || defaultSubject);
  const [draftId, setDraftId] = useState<string | null>(draft?.id ?? null);
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [statusAfter, setStatusAfter] = useState("");
  const [template, setTemplate] = useState<string | undefined>();
  const [busy, setBusy] = useState<"send" | "draft" | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");

  // Load the saved draft body once.
  useEffect(() => {
    if (editor.current && draft?.bodyHtml) editor.current.innerHTML = draft.bodyHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Files saved with the current draft come straight from the server props, minus any just removed.
  const draftFiles = (drafts.find((d) => d.id === draftId)?.attachments ?? []).filter((f) => !removedFileIds.includes(f.id));

  const exec = (command: string, value?: string) => {
    editor.current?.focus();
    document.execCommand(command, false, value);
  };

  const editorText = () => (editor.current?.innerText ?? "").trim();
  const isEmpty = () => editorText().length === 0;

  function insertHtml(html: string) {
    const el = editor.current;
    if (!el) return;
    if (isEmpty()) el.innerHTML = html;
    else el.insertAdjacentHTML("beforeend", html);
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function openLink() {
    const selection = window.getSelection();
    savedRange.current = selection && selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    setLinkOpen(true);
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (!/^(https?:\/\/|mailto:)/i.test(url)) return toast.error("Enter a full link starting with https://");
    editor.current?.focus();
    const selection = window.getSelection();
    if (savedRange.current) {
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    }
    document.execCommand("createLink", false, url);
    setLinkOpen(false);
    setLinkUrl("https://");
  }

  async function applyTemplate(key: string) {
    if (!key) return;
    if (!isEmpty() && !(await confirm({ title: "Replace your message?", message: "Inserting a template replaces what you've written so far.", confirmLabel: "Replace" }))) return;
    const result = await api<{ subject: string; bodyHtml: string }>(`/api/admin/enquiries/${enquiryId}/template/?key=${encodeURIComponent(key)}`);
    if (!result.ok) return toast.error(result.error);
    setSubject(result.data.subject);
    if (editor.current) editor.current.innerHTML = result.data.bodyHtml;
    setTemplate(key);
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files, ...Array.from(list)];
    const total = next.reduce((sum, f) => sum + f.size, 0);
    if (total > uploadLimitBytes) {
      toast.error(`Attachments are limited to ${formatBytes(uploadLimitBytes)} in total on this server.`);
    } else setFiles(next);
    if (fileInput.current) fileInput.current.value = "";
  }

  function buildForm(includeStatus: boolean) {
    const form = new FormData();
    form.set("to", to.trim());
    if (cc.trim()) form.set("cc", cc.trim());
    form.set("subject", subject.trim());
    form.set("bodyHtml", editor.current?.innerHTML ?? "");
    if (draftId) form.set("draftId", draftId);
    if (includeStatus && statusAfter) form.set("statusAfter", statusAfter);
    if (includeStatus && template) form.set("template", template);
    for (const file of files) form.append("files", file);
    return form;
  }

  function reset() {
    if (editor.current) editor.current.innerHTML = "";
    setFiles([]);
    setRemovedFileIds([]);
    setDraftId(null);
    setStatusAfter("");
    setTemplate(undefined);
    setSubject(defaultSubject);
    setTo(customerEmail);
    setCc("");
    setShowCc(false);
  }

  async function send() {
    if (!to.trim()) return toast.error("Add a recipient.");
    if (!subject.trim()) return toast.error("Add a subject.");
    if (isEmpty()) return toast.error("Write a message before sending.");
    setBusy("send");
    const result = await api<{ delivery: string; deliveryError: string | null }>(`/api/admin/enquiries/${enquiryId}/reply/`, { form: buildForm(true) });
    setBusy(null);
    if (!result.ok) return toast.error(result.error);
    reset();
    if (result.data.delivery === "SENT") toast.success("Reply sent.");
    else toast.error(`The reply was saved to the conversation, but the email failed${result.data.deliveryError ? `: ${result.data.deliveryError}` : "."} Use Retry once it's fixed.`);
    router.refresh();
  }

  async function saveDraft() {
    if (isEmpty() && files.length === 0 && !draftFiles.length) return toast.error("Write something to save.");
    setBusy("draft");
    const result = await api<{ draftId: string }>(`/api/admin/enquiries/${enquiryId}/drafts/`, { form: buildForm(false) });
    setBusy(null);
    if (!result.ok) return toast.error(result.error);
    setDraftId(result.data.draftId);
    setFiles([]);
    toast.success("Draft saved. It is private and has not been sent.");
    router.refresh();
  }

  async function discard() {
    if (isEmpty() && files.length === 0 && !draftId) return reset();
    if (!(await confirm({ title: "Discard this reply?", message: draftId ? "The saved draft and its attachments will be deleted." : "What you've written will be lost.", confirmLabel: "Discard", destructive: true }))) return;
    if (draftId) {
      const result = await api(`/api/admin/enquiries/${enquiryId}/drafts/${draftId}/`, { method: "DELETE" });
      if (!result.ok) return toast.error(result.error);
    }
    reset();
    router.refresh();
  }

  async function removeDraftFile(id: string) {
    const result = await api(`/api/admin/attachments/${id}/`, { method: "DELETE" });
    if (!result.ok) return toast.error(result.error);
    setRemovedFileIds((list) => [...list, id]);
    router.refresh();
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <section className="border border-neutral-200 bg-white" aria-label="Reply to customer">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-navy-900">Reply to customer</h2>
        {draftId ? <span className="text-xs font-medium text-amber-700">Editing a saved draft</span> : null}
      </header>

      <div className="space-y-3 p-4">
        {disabled ? <p className="border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">This enquiry is in the trash. Restore it to reply.</p> : null}

        <div className="grid gap-3 sm:grid-cols-[4rem_1fr] sm:items-center">
          <label htmlFor="reply-to" className="text-sm text-neutral-600">
            To
          </label>
          <div className="flex gap-2">
            <input id="reply-to" type="email" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} disabled={disabled} />
            {!showCc ? (
              <button type="button" onClick={() => setShowCc(true)} className={btn.small}>
                Cc
              </button>
            ) : null}
          </div>
          {showCc ? (
            <>
              <label htmlFor="reply-cc" className="text-sm text-neutral-600">
                Cc
              </label>
              <input id="reply-cc" type="text" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="name@example.com, other@example.com" className={inputClass} disabled={disabled} />
            </>
          ) : null}
          <label htmlFor="reply-subject" className="text-sm text-neutral-600">
            Subject
          </label>
          <input id="reply-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={300} className={inputClass} disabled={disabled} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Insert a template" value="" onChange={(e) => void applyTemplate(e.target.value)} disabled={disabled} className={cn(inputClass, "w-auto py-1.5")}>
            <option value="">Insert template…</option>
            {templates.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-neutral-400">Quick replies:</span>
          {quickReplies.map((q) => (
            <button key={q.id} type="button" disabled={disabled} onClick={() => insertHtml(q.html)} className={btn.small}>
              {q.label}
            </button>
          ))}
        </div>

        <div className="border border-neutral-300 focus-within:border-copper-500 focus-within:ring-1 focus-within:ring-copper-500">
          <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-1">
            <ToolButton label="Bold" onClick={() => exec("bold")}>
              <Bold className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="Italic" onClick={() => exec("italic")}>
              <Italic className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="Underline" onClick={() => exec("underline")}>
              <Underline className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="Bulleted list" onClick={() => exec("insertUnorderedList")}>
              <List className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="Numbered list" onClick={() => exec("insertOrderedList")}>
              <ListOrdered className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="Insert link" onClick={openLink}>
              <Link2 className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="Clear formatting" onClick={() => exec("removeFormat")}>
              <X className="h-4 w-4" />
            </ToolButton>
          </div>
          {linkOpen ? (
            <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-2 py-1.5">
              <input autoFocus type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyLink())} aria-label="Link address" className={cn(inputClass, "py-1")} />
              <button type="button" onClick={applyLink} className={btn.small}>
                Add link
              </button>
              <button type="button" onClick={() => setLinkOpen(false)} className={btn.small}>
                Cancel
              </button>
            </div>
          ) : null}
          <div
            ref={editor}
            contentEditable={!disabled}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Message"
            onPaste={(e) => {
              // Paste as plain text so formatting from other apps never leaks into the email.
              e.preventDefault();
              document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
            }}
            className="min-h-44 max-h-96 overflow-y-auto px-3 py-2.5 text-sm leading-relaxed text-navy-900 outline-none [&_a]:text-steel-600 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input ref={fileInput} type="file" multiple accept={FILE_ACCEPT} className="sr-only" id="reply-files" onChange={(e) => addFiles(e.target.files)} disabled={disabled} />
            <label htmlFor="reply-files" className={cn(btn.outline, "cursor-pointer", disabled && "pointer-events-none opacity-50")}>
              <Paperclip className="h-4 w-4" aria-hidden /> Attach files
            </label>
            <span className="text-xs text-neutral-500">
              Up to {formatBytes(uploadLimitBytes)} in total{files.length ? ` · ${formatBytes(totalSize)} added` : ""}
            </span>
          </div>
          {draftFiles.length || files.length ? (
            <div className="flex flex-wrap gap-1.5">
              {draftFiles.map((f) => (
                <AttachmentChip key={f.id} file={f} onDelete={() => removeDraftFile(f.id)} />
              ))}
              {files.map((f, index) => (
                <span key={`${f.name}-${index}`} className="inline-flex items-center gap-1.5 border border-copper-200 bg-copper-50 px-2 py-1 text-xs">
                  <Paperclip className="h-3.5 w-3.5 text-copper-600" aria-hidden />
                  <span className="max-w-48 truncate font-medium text-navy-900">{f.name}</span>
                  <span className="text-neutral-500">{formatBytes(f.size)}</span>
                  <button type="button" onClick={() => setFiles((list) => list.filter((_, i) => i !== index))} aria-label={`Remove ${f.name}`} className="text-neutral-400 hover:text-red-600">
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            After sending
            <select value={statusAfter} onChange={(e) => setStatusAfter(e.target.value)} disabled={disabled} className={cn(inputClass, "w-auto py-1.5")}>
              <option value="">Keep / mark as contacted</option>
              {STATUS_AFTER.map((s) => (
                <option key={s} value={s}>
                  Set to {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={discard} disabled={disabled || busy !== null} className={cn(btn.outline, "text-neutral-600")}>
              <Trash2 className="h-4 w-4" aria-hidden /> Discard
            </button>
            <button type="button" onClick={saveDraft} disabled={disabled || busy !== null} className={btn.outline}>
              <Save className="h-4 w-4" aria-hidden /> {busy === "draft" ? "Saving…" : "Save draft"}
            </button>
            <button type="button" onClick={send} disabled={disabled || busy !== null} className={btn.primary}>
              <Send className="h-4 w-4" aria-hidden /> {busy === "send" ? "Sending…" : "Send reply"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
