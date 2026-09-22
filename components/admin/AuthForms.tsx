"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { api } from "./api";
import { btn, inputClass } from "./ui";

function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function PasswordInput({ id, name, autoComplete, value, onChange }: { id: string; name: string; autoComplete: string; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input id={id} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} required value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} pr-10`} />
      <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 hover:text-navy-900">
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Notice({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  const isError = kind === "error";
  return (
    <div role={isError ? "alert" : "status"} className={`flex items-start gap-2 border px-3.5 py-3 text-sm ${isError ? "border-red-300 bg-red-50 text-red-800" : "border-emerald-300 bg-emerald-50 text-emerald-800"}`}>
      {isError ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
      <span>{children}</span>
    </div>
  );
}

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await api<{ mustChangePassword: boolean }>("/api/admin/auth/login/", { json: { email, password } });
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    router.replace(result.data.mustChangePassword ? "/admin/change-password/" : next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Field label="Email" htmlFor="login-email">
        <input id="login-email" name="email" type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Password" htmlFor="login-password">
        <PasswordInput id="login-password" name="password" autoComplete="current-password" value={password} onChange={setPassword} />
      </Field>
      <button type="submit" disabled={busy || !email || !password} className={`${btn.primary} w-full py-2.5`}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm">
        <Link href="/admin/forgot-password/" className="text-copper-600 hover:underline">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await api<{ message: string }>("/api/admin/auth/forgot-password/", { json: { email } });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setMessage(result.data.message);
  }

  if (message) return <Notice kind="success">{message}</Notice>;
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Field label="Admin email" htmlFor="forgot-email" hint="We'll email a reset link that stays valid for 60 minutes.">
        <input id="forgot-email" type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </Field>
      <button type="submit" disabled={busy || !email} className={`${btn.primary} w-full py-2.5`}>
        {busy ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    const result = await api("/api/admin/auth/reset-password/", { json: { token, password } });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <Notice kind="success">Your password has been updated. All other sessions were signed out.</Notice>
        <Link href="/admin/login/" className={`${btn.primary} w-full py-2.5`}>
          Go to sign in
        </Link>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Field label="New password" htmlFor="reset-password" hint="At least 12 characters, with letters and numbers.">
        <PasswordInput id="reset-password" name="password" autoComplete="new-password" value={password} onChange={setPassword} />
      </Field>
      <Field label="Confirm new password" htmlFor="reset-confirm">
        <PasswordInput id="reset-confirm" name="confirm" autoComplete="new-password" value={confirm} onChange={setConfirm} />
      </Field>
      <button type="submit" disabled={busy || !password || !confirm} className={`${btn.primary} w-full py-2.5`}>
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export function ChangePasswordForm({ forced, onDone }: { forced?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (next !== confirm) return setError("The two new passwords don't match.");
    setBusy(true);
    setError(null);
    setSuccess(false);
    const result = await api("/api/admin/auth/change-password/", { json: { currentPassword: current, newPassword: next } });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setCurrent("");
    setNext("");
    setConfirm("");
    setSuccess(true);
    onDone?.();
    if (forced) {
      router.replace("/admin/dashboard/");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {success && !forced ? <Notice kind="success">Password changed. Your other sessions were signed out.</Notice> : null}
      <Field label={forced ? "Temporary password" : "Current password"} htmlFor="cp-current">
        <PasswordInput id="cp-current" name="current" autoComplete="current-password" value={current} onChange={setCurrent} />
      </Field>
      <Field label="New password" htmlFor="cp-new" hint="At least 12 characters, with letters and numbers.">
        <PasswordInput id="cp-new" name="new" autoComplete="new-password" value={next} onChange={setNext} />
      </Field>
      <Field label="Confirm new password" htmlFor="cp-confirm">
        <PasswordInput id="cp-confirm" name="confirm" autoComplete="new-password" value={confirm} onChange={setConfirm} />
      </Field>
      <button type="submit" disabled={busy || !current || !next || !confirm} className={forced ? `${btn.primary} w-full py-2.5` : btn.primary}>
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
