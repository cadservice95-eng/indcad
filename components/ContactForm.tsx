"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Something went wrong sending your message. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Something went wrong sending your message. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-neutral-200 bg-neutral-50 px-8 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-copper-500" aria-hidden />
        <h2 className="text-xl font-semibold text-navy-900">Message sent</h2>
        <p className="max-w-md text-sm leading-relaxed text-neutral-600">
          Thanks for getting in touch — we&apos;ll get back to you as soon as we can.
        </p>
        <Button variant="ghost" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
        <div className="flex items-start gap-2 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
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
