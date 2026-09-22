"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { appendFormMetadata } from "@/lib/attribution";
import { submitPublicForm } from "@/lib/submit-form";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const renderedAt = useRef(0);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    appendFormMetadata(formData, renderedAt.current || Date.now() - 10_000);

    const result = await submitPublicForm("/api/forms/contact/", formData);
    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }
    setReference(result.reference ?? null);
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-neutral-200 bg-neutral-50 px-8 py-16 text-center" role="status">
        <CheckCircle2 className="h-10 w-10 text-copper-500" aria-hidden />
        <h2 className="text-xl font-semibold text-navy-900">Message sent</h2>
        <p className="max-w-md text-sm leading-relaxed text-neutral-600">
          Thanks for getting in touch — we&apos;ll get back to you as soon as we can.
        </p>
        {reference ? (
          <p className="text-sm text-neutral-600">
            Your reference number is <span className="font-mono font-semibold text-navy-900">{reference}</span>
          </p>
        ) : null}
        <Button variant="ghost" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-hp">Leave this field empty</label>
        <input id="contact-hp" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="contact-name" required>
          <TextInput id="contact-name" name="name" type="text" required autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="contact-email" required>
          <TextInput id="contact-email" name="email" type="email" required autoComplete="email" />
        </Field>
      </div>
      <Field label="Phone" htmlFor="contact-phone">
        <TextInput id="contact-phone" name="phone" type="tel" autoComplete="tel" />
      </Field>
      <Field label="Message" htmlFor="contact-message" required>
        <TextArea id="contact-message" name="message" rows={5} required />
      </Field>

      {error ? (
        <div className="flex items-start gap-2 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
