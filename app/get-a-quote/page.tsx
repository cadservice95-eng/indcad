import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { Container } from "@/components/ui/Container";
import { SITE, SERVICE_AREAS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Get a Free Quote | IndCAD",
  description: "Request a CAD drafting, BIM or engineering design quote. Tell us what you need and our team will review the project requirements.",
  path: "/get-a-quote",
});

export default function GetAQuotePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Get a Quote", href: "/get-a-quote" }]} />
      <PageHero
        eyebrow="Get a quote"
        heading="Get a Free Quote"
        description="Tell us what you need and our team can review the project requirements."
        primaryHref="#quote-form"
        primaryLabel="Jump to form"
      />

      <section id="quote-form" className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <QuoteForm />
          <aside className="space-y-8">
            <div className="border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-sm font-semibold text-navy-900">What happens next</h2>
              <ol className="mt-4 space-y-3 text-sm text-neutral-600">
                <li>1. We review your brief and any files you&apos;ve attached.</li>
                <li>2. We confirm scope, format and turnaround.</li>
                <li>3. You receive a fixed-price quote before any work starts.</li>
              </ol>
            </div>
            <div className="border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-navy-900">Service areas</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{SERVICE_AREAS.join(", ")}.</p>
            </div>
            <div className="border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-navy-900">Prefer email or phone?</h2>
              <p className="mt-3 text-sm text-neutral-600">Email: {SITE.email}</p>
              <p className="mt-1 text-sm text-neutral-600">Phone: {SITE.phone}</p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
