"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_TIMEZONE, formatDate, formatDateTime } from "@/lib/admin-format";

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; message: string };
type ToastApi = { success: (message: string) => void; error: (message: string) => void; info: (message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside AdminProviders");
  return ctx;
}

// ---------------------------------------------------------------------------
// Confirm dialog
// ---------------------------------------------------------------------------

export type ConfirmOptions = { title: string; message?: string; confirmLabel?: string; destructive?: boolean };
type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside AdminProviders");
  return ctx;
}

// ---------------------------------------------------------------------------
// Admin config (timezone) so client-formatted dates match the server
// ---------------------------------------------------------------------------

const ConfigContext = createContext({ timezone: DEFAULT_TIMEZONE });

export function useAdminFormat() {
  const { timezone } = useContext(ConfigContext);
  return useMemo(
    () => ({
      timezone,
      dateTime: (value: Parameters<typeof formatDateTime>[0]) => formatDateTime(value, timezone),
      date: (value: Parameters<typeof formatDate>[0]) => formatDate(value, timezone),
    }),
    [timezone],
  );
}

// ---------------------------------------------------------------------------

const TOAST_STYLES: Record<ToastKind, { box: string; icon: React.ReactNode }> = {
  success: { box: "border-emerald-300 bg-emerald-50 text-emerald-900", icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> },
  error: { box: "border-red-300 bg-red-50 text-red-900", icon: <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden /> },
  info: { box: "border-steel-300 bg-steel-50 text-steel-700", icon: <Info className="h-4 w-4 shrink-0 text-steel-500" aria-hidden /> },
};

export function AdminProviders({ timezone, children }: { timezone: string; children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextId.current++;
    setToasts((list) => [...list.slice(-3), { id, kind, message }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === "error" ? 8000 : 4500);
  }, []);

  const toastApi = useMemo<ToastApi>(() => ({ success: (m) => push("success", m), error: (m) => push("error", m), info: (m) => push("info", m) }), [push]);

  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (value: boolean) => void }) | null>(null);
  const confirm = useCallback<ConfirmFn>((options) => new Promise<boolean>((resolve) => setDialog({ ...options, resolve })), []);

  const close = (value: boolean) => {
    dialog?.resolve(value);
    setDialog(null);
  };

  return (
    <ConfigContext.Provider value={{ timezone }}>
      <ToastContext.Provider value={toastApi}>
        <ConfirmContext.Provider value={confirm}>
          {children}

          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end" aria-live="polite">
            {toasts.map((t) => (
              <div key={t.id} role={t.kind === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex w-full max-w-sm items-start gap-2.5 border px-3.5 py-3 text-sm shadow-lg", TOAST_STYLES[t.kind].box)}>
                {TOAST_STYLES[t.kind].icon}
                <span className="flex-1">{t.message}</span>
                <button type="button" aria-label="Dismiss" onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))} className="text-current opacity-60 hover:opacity-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {dialog ? (
            <Modal title={dialog.title} onClose={() => close(false)} size="sm">
              {dialog.message ? <p className="text-sm leading-relaxed text-neutral-600">{dialog.message}</p> : null}
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" autoFocus onClick={() => close(false)} className="border border-neutral-300 px-4 py-2 text-sm font-medium text-navy-900 hover:border-navy-900">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => close(true)}
                  className={cn("px-4 py-2 text-sm font-medium text-white", dialog.destructive ? "bg-red-600 hover:bg-red-700" : "bg-copper-500 hover:bg-copper-600")}
                >
                  {dialog.confirmLabel ?? "Confirm"}
                </button>
              </div>
            </Modal>
          ) : null}
        </ConfirmContext.Provider>
      </ToastContext.Provider>
    </ConfigContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Modal (native <dialog>: focus trap, Escape and backdrop come for free)
// ---------------------------------------------------------------------------

export function Modal({ title, onClose, children, size = "md" }: { title: string; onClose: () => void; children: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn("m-auto w-[calc(100%-2rem)] border border-neutral-300 bg-white p-0 text-navy-900 shadow-2xl backdrop:bg-navy-950/50", size === "sm" && "max-w-md", size === "md" && "max-w-xl", size === "lg" && "max-w-3xl")}
      aria-label={title}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5">
        <h2 className="text-base font-semibold">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-navy-900">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
    </dialog>
  );
}
