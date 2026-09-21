import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Render CAD Hub",
  description: "Privacy policy for Render CAD Hub.",
  path: "/privacy-policy",
  noIndex: true,
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />
      <PageHero
        eyebrow="Legal"
        heading="Privacy Policy"
        description="Placeholder content — replace with policy prepared or reviewed by a qualified legal professional before publishing."
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-8 text-sm leading-relaxed text-neutral-700">
          <div className="border border-copper-400 bg-copper-50 px-5 py-4 text-copper-700">
            This page is a clearly-marked placeholder. It is not legal advice and must be reviewed and completed by a
            qualified legal professional, using [COMPANY LEGAL NAME]&apos;s actual data-handling practices, before this
            site goes live.
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-900">1. Information we collect</h2>
            <p className="mt-2">
              [PLACEHOLDER — describe the personal information collected via the quote form, contact form, file
              uploads, analytics tools and any other data collection points on this site.]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">2. How we use information</h2>
            <p className="mt-2">
              [PLACEHOLDER — describe how submitted information is used, e.g. to respond to quote requests and
              enquiries, and confirm it is not sold to third parties, if applicable.]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">3. Data storage and security</h2>
            <p className="mt-2">[PLACEHOLDER — describe how and where data is stored, and security measures in place.]</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">4. Third-party services</h2>
            <p className="mt-2">
              [PLACEHOLDER — list any analytics, email delivery, hosting or CRM providers that process visitor or
              client data on your behalf.]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">5. Your rights</h2>
            <p className="mt-2">
              [PLACEHOLDER — describe how a visitor can request access to, correction of, or deletion of their
              personal information, consistent with the Digital Personal Data Protection Act, 2023 (DPDP Act) and
              applicable Information Technology Act, 2000 rules, where applicable to [COMPANY LEGAL NAME].]
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">6. Contact</h2>
            <p className="mt-2">Questions about this policy can be sent to {SITE.email}.</p>
          </div>
          <p className="text-xs text-neutral-400">Last updated: [DATE]</p>
        </Container>
      </section>
    </>
  );
}
