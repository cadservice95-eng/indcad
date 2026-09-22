"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Paperclip } from "lucide-react";
import { Field, TextInput, TextArea, SelectInput } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { appendFormMetadata } from "@/lib/attribution";
import { QUOTE_SERVICE_OPTIONS, PROJECT_TYPE_OPTIONS, FILE_ACCEPT, FILE_HINT, validateSelectedFiles } from "@/lib/forms";
import { submitPublicForm } from "@/lib/submit-form";

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [reference, setReference] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const renderedAt = useRef(0);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const fileProblem = validateSelectedFiles(files);
    if (fileProblem) {
      setError(fileProblem);
      setStatus("error");
      return;
    }

    appendFormMetadata(formData, renderedAt.current || Date.now() - 10_000);
    setStatus("submitting");
    const result = await submitPublicForm("/api/forms/quote/", formData);
    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }
    setReference(result.reference ?? null);
    setStatus("success");
    form.reset();
    setFileNames([]);
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-neutral-200 bg-neutral-50 px-8 py-16 text-center" role="status">
        <CheckCircle2 className="h-10 w-10 text-copper-500" aria-hidden />
        <h2 className="text-xl font-semibold text-navy-900">Quote request received</h2>
        <p className="max-w-md text-sm leading-relaxed text-neutral-600">
          Thanks — we&apos;ve received your project details and will be in touch to review requirements and turnaround.
        </p>
        {reference ? (
          <p className="text-sm text-neutral-600">
            Your reference number is <span className="font-mono font-semibold text-navy-900">{reference}</span>
          </p>
        ) : null}
        <Button variant="ghost" onClick={() => setStatus("idle")}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="quote-hp">Leave this field empty</label>
        <input id="quote-hp" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required>
          <TextInput id="name" name="name" type="text" required autoComplete="name" />
        </Field>
        <Field label="Company" htmlFor="company">
          <TextInput id="company" name="company" type="text" autoComplete="organization" />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <TextInput id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
        <Field label="Service" htmlFor="service" required>
          <SelectInput id="service" name="service" required defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {QUOTE_SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Project type" htmlFor="projectType">
          <SelectInput id="projectType" name="projectType" defaultValue="">
            <option value="" disabled>
              Select a project type
            </option>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field label="Project description" htmlFor="description" required>
        <TextArea id="description" name="description" rows={5} required placeholder="What do you need drafted, modelled or converted?" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Preferred deadline" htmlFor="deadline">
          <TextInput id="deadline" name="deadline" type="date" />
        </Field>
        <Field label="Reference files" htmlFor="files">
          <label
            htmlFor="files"
            className="flex w-full cursor-pointer items-center gap-2 border border-dashed border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-500 hover:border-copper-400"
          >
            <Paperclip className="h-4 w-4 shrink-0 text-copper-500" aria-hidden />
            <span className="truncate">{fileNames.length ? fileNames.join(", ") : "Attach drawings, sketches or reference files"}</span>
          </label>
          <input
            id="files"
            name="files"
            type="file"
            multiple
            accept={FILE_ACCEPT}
            className="sr-only"
            onChange={(e) => setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
          <p className="mt-1.5 text-xs text-neutral-500">{FILE_HINT}</p>
        </Field>
      </div>

      <Field label="Additional notes" htmlFor="notes">
        <TextArea id="notes" name="notes" rows={3} />
      </Field>

      {error ? (
        <div className="flex items-start gap-2 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Request a Quote"}
      </Button>
    </form>
  );
}
