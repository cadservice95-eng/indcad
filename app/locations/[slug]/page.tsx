import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/FAQ";
import { RelatedServices } from "@/components/RelatedServices";
import { RelatedLocations } from "@/components/RelatedLocations";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { locations, getLocationBySlug } from "@/data/locations";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};
  return buildMetadata({
    title: location.seoTitle,
    description: location.seoDescription,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Locations", href: "/locations" },
          { label: location.name, href: `/locations/${location.slug}` },
        ]}
      />
      <PageHero eyebrow={`${location.state} · Remote service`} heading={location.heroHeading} description={location.heroDescription} />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-10">
          {location.intro.map((section, i) => (
            <div key={i}>
              {section.heading ? (
                <h2 className="text-xl font-semibold text-navy-900">{section.heading}</h2>
              ) : null}
              <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
                {section.paragraphs.map((paragraph, j) => (
                  <p key={j} className="text-base leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Local context" heading={`${location.name}'s Project Landscape`} />
          <div className="mt-6 space-y-8">
            {location.localContext.map((section, i) => (
              <div key={i}>
                {section.heading ? (
                  <h3 className="text-base font-semibold text-navy-900">{section.heading}</h3>
                ) : null}
                <div className={section.heading ? "mt-2 space-y-3" : "space-y-3"}>
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="text-sm leading-relaxed text-neutral-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Project types" heading={`Typical ${location.name} Project Types`} />
          <div className="mt-6">
            <CheckList items={location.localProjectTypes} />
          </div>
        </Container>
      </section>

      <ProcessSection
        steps={location.workflow}
        heading="How Remote Collaboration Works"
        description={`No site visit required — here's how a typical ${location.name} project runs from brief to delivery.`}
      />

      <RelatedServices slugs={location.services} />
      <RelatedLocations slugs={location.relatedLocations} />
      <FAQ items={location.faqs} />
      <CTA
        heading={`Get a Quote for Your ${location.name} Project`}
        description="Tell us what you need and our team can review the project requirements."
      />
    </>
  );
}
