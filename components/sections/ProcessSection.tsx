import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProcessStep } from "@/lib/types";

export function ProcessSection({
  steps,
  heading = "How It Works",
  description,
}: {
  steps: ProcessStep[];
  heading?: string;
  description?: string;
}) {
  return (
    <section className="border-t border-neutral-200 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Process" heading={heading} description={description} />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border border-neutral-200 p-5">
              <span className="font-mono text-2xl font-semibold text-copper-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-navy-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
