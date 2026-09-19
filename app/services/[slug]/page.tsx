import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/FAQ";
import { RelatedServices } from "@/components/RelatedServices";
import { RelatedProjects } from "@/components/RelatedProjects";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { services, getServiceBySlug } from "@/data/services";
import { getIndustryBySlug } from "@/data/industries";
import { getSoftwareBySlug } from "@/data/software";
import { serviceCategories } from "@/data/service-categories";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const category = serviceCategories.find((c) => c.slug === service.category);
  const industries = service.industries.map(getIndustryBySlug).filter((i): i is NonNullable<typeof i> => Boolean(i));
  const softwareUsed = service.software.map(getSoftwareBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.shortDescription,
          path: `/services/${service.slug}`,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: service.name, href: `/services/${service.slug}` },
        ]}
      />
      <PageHero eyebrow={category?.name ?? "Services"} heading={service.heroHeading} description={service.heroDescription} />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="border-l-2 border-copper-500 pl-5 text-lg leading-relaxed text-neutral-700">
            {service.problemStatement}
          </p>
          <div className="mt-8 space-y-10">
            {service.overview.map((section, i) => (
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
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Deliverables" heading="What You Get" />
            <div className="mt-6">
              <CheckList items={service.deliverables} columns={1} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Applications" heading="Where This Is Used" />
            <div className="mt-6">
              <CheckList items={service.applications} columns={1} />
            </div>
          </div>
        </Container>
      </section>

      <ProcessSection steps={service.process} />

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container className="grid gap-12 sm:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Software" heading="Software We Use" />
            <ul className="mt-6 space-y-2">
              {softwareUsed.map((item) => (
                <li key={item.slug}>
                  <Link href={`/software/${item.slug}`} className="text-sm font-medium text-navy-800 hover:text-copper-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Industries" heading="Industries We Support" />
            <ul className="mt-6 space-y-2">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link href={`/industries/${industry.slug}`} className="text-sm font-medium text-navy-800 hover:text-copper-600">
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <RelatedProjects disciplines={service.relatedProjectCategories} />
      <RelatedServices slugs={service.relatedServices} />
      <FAQ items={service.faqs} />
      <CTA
        heading={`Get a Quote for ${service.name}`}
        description="Tell us what you need and our team can review the project requirements."
      />
    </>
  );
}
