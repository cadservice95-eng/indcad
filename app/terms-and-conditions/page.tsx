import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions | IndCAD",
  description: "Terms and conditions for IndCAD.",
  path: "/terms-and-conditions",
  noIndex: true,
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Terms & Conditions", href: "/terms-and-conditions" }]} />
      <PageHero
        eyebrow="Legal"
        heading="Terms & Conditions"
        description="Placeholder content — replace with terms prepared or reviewed by a qualified legal professional before publishing."
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-8 text-sm leading-relaxed text-neutral-700">
          <div className="border border-copper-400 bg-copper-50 px-5 py-4 text-copper-700">
            This page is a clearly-marked placeholder. It is not legal advice and must be reviewed and completed by a
            qualified legal professional before this site goes live.
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-900">1. Services</h2>
            <p className="mt-2">
              [PLACEHOLDER — describe the CAD drafting, BIM and engineering design services provided by [COMPANY
              LEGAL NAME], and confirm that scope and price are agreed per project before work begins.]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">2. Quotes and payment</h2>
            <p className="mt-2">[PLACEHOLDER — describe quoting, payment terms, invoicing and any deposit requirements.]</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">3. Intellectual property</h2>
            <p className="mt-2">
              [PLACEHOLDER — describe ownership of drawings, models and deliverables once a project is paid in full,
              and any rights retained.]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">4. Revisions</h2>
            <p className="mt-2">[PLACEHOLDER — describe how many revision rounds are included and how additional revisions are handled.]</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">5. Liability</h2>
            <p className="mt-2">
              [PLACEHOLDER — describe liability limitations, and that engineering sign-off/certification remains the
              responsibility of the client&apos;s registered engineer, architect or certifier where applicable.]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">6. Contact</h2>
            <p className="mt-2">Questions about these terms can be sent to {SITE.email}.</p>
          </div>
          <p className="text-xs text-neutral-400">Last updated: [DATE]</p>
        </Container>
      </section>
    </>
  );
}
