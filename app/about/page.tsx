import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { serviceCategories } from "@/data/service-categories";
import { industries } from "@/data/industries";
import { software } from "@/data/software";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us | IndCAD",
  description: "IndCAD provides CAD design, drafting, BIM and engineering design support to Indian engineers, architects, builders and manufacturers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      <PageHero
        eyebrow="About IndCAD"
        heading="About IndCAD"
        description="CAD design, drafting, BIM and engineering design support for Indian engineers, architects, builders, manufacturers and contractors."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-5">
          <p className="text-base leading-relaxed text-neutral-700">
            IndCAD is [COMPANY NAME], a CAD design, drafting, BIM and engineering documentation service working with
            Indian engineers, architects, builders, manufacturers and contractors. [YEARS EXPERIENCE] years of
            combined team experience across mechanical, structural, architectural, civil and electrical disciplines.
          </p>
          <p className="text-base leading-relaxed text-neutral-700">
            We work as flexible, on-demand drafting and design capacity — engaged for a single drawing, a full
            documentation package, or ongoing overflow support alongside an in-house engineering or design team.
          </p>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What we do" heading="Disciplines We Cover" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="border border-neutral-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-navy-900">{category.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{category.shortDescription}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Industries" heading="Industries We Work With" />
          <div className="mt-6 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <span key={industry.slug} className="border border-neutral-300 px-3 py-1.5 text-sm text-navy-800">
                {industry.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Technology" heading="Software We Work In" />
            <div className="mt-6">
              <CheckList items={software.map((s) => s.name)} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Quality" heading="Our Quality Process" />
            <div className="mt-6">
              <CheckList
                items={[
                  "Scope and drawing standard confirmed before work begins",
                  "Internal checking against source material and dimensional accuracy",
                  "Revision-controlled delivery with clear file naming",
                  "Structured markup and revision rounds through to sign-off",
                ]}
                columns={1}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Coverage" heading="India-Wide Capability" />
          <p className="mt-6 text-base leading-relaxed text-neutral-700">
            All work is delivered remotely from the drawings, models or reference material you provide, so we work
            with clients across every Indian state and union territory without requiring a site visit.
          </p>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Team" heading="Our Team" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {["[TEAM MEMBER NAME]", "[TEAM MEMBER NAME]", "[TEAM MEMBER NAME]"].map((placeholder, i) => (
              <div key={i} className="border border-dashed border-neutral-300 bg-white p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-neutral-300 bg-neutral-50 font-mono text-xs text-neutral-400">
                  Photo
                </div>
                <p className="mt-4 text-sm font-semibold text-navy-900">{placeholder}</p>
                <p className="mt-1 text-xs text-neutral-500">[ROLE / TITLE]</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
