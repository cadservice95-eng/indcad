import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { RelatedServices } from "@/components/RelatedServices";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { FAQ } from "@/components/FAQ";
import { software, getSoftwareBySlug } from "@/data/software";
import { getIndustryBySlug } from "@/data/industries";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return software.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getSoftwareBySlug(slug);
  if (!item) return {};
  return buildMetadata({ title: item.seoTitle, description: item.seoDescription, path: `/software/${item.slug}` });
}

export default async function SoftwarePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSoftwareBySlug(slug);
  if (!item) notFound();

  const relatedIndustries = item.relatedIndustries.map(getIndustryBySlug).filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <>
      <Breadcrumbs items={[{ label: "Software", href: "/software" }, { label: item.name, href: `/software/${item.slug}` }]} />
      <PageHero eyebrow={item.category} heading={item.name} description={item.summary} />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-10">
          {item.overview.map((section, i) => (
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
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Used for" heading="What It's Used For" />
            <div className="mt-6">
              <CheckList items={item.usedFor} columns={1} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Deliverables" heading="Typical Deliverables" />
            <div className="mt-6">
              <CheckList items={item.deliverables} columns={1} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Industries" heading="Related Industries" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {relatedIndustries.map((industry) => (
              <li key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="inline-flex items-center border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-800 hover:border-copper-400 hover:text-copper-600"
                >
                  {industry.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <RelatedServices slugs={item.relatedServices} />
      <FAQ items={item.faqs} />
      <CTA
        heading={`Get a Quote for ${item.name} Work`}
        description="Tell us what you need and our team can review the project requirements."
      />
    </>
  );
}
