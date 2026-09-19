import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/FAQ";
import { RelatedServices } from "@/components/RelatedServices";
import { RelatedProjects } from "@/components/RelatedProjects";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { industries, getIndustryBySlug } from "@/data/industries";
import { getSoftwareBySlug } from "@/data/software";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};
  return buildMetadata({
    title: industry.seoTitle,
    description: industry.seoDescription,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const softwareUsed = industry.software.map(getSoftwareBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Industries", href: "/industries" },
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
      />
      <PageHero eyebrow="Industry" heading={industry.heroHeading} description={industry.heroDescription} />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-10">
          {industry.description.map((section, i) => (
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
            <SectionHeading eyebrow="Use cases" heading="Typical Project Types" />
            <div className="mt-6">
              <CheckList items={industry.useCases} columns={1} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Deliverables" heading="Typical Deliverables" />
            <div className="mt-6">
              <CheckList items={industry.deliverables} columns={1} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Documentation" heading="Documentation Requirements" />
          <div className="mt-6 space-y-4">
            {industry.documentationRequirements.map((item, i) => (
              <p key={i} className="text-sm leading-relaxed text-neutral-700">
                {item}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Software" heading="Software Used in This Industry" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {softwareUsed.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/software/${item.slug}`}
                  className="inline-flex items-center border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-800 hover:border-copper-400 hover:text-copper-600"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <RelatedProjects disciplines={industry.projectCategories} />
      <RelatedServices slugs={industry.services} />
      <FAQ items={industry.faqs} />
      <CTA
        heading={`Get a Quote for Your ${industry.name} Project`}
        description="Tell us what you need and our team can review the project requirements."
      />
    </>
  );
}
