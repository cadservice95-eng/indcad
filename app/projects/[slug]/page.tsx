import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import { RelatedServices } from "@/components/RelatedServices";
import { CTA } from "@/components/sections/CTA";
import { ProjectCard } from "@/components/ProjectCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import { creativeWorkJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { projects, getProjectBySlug, getProjectsByDiscipline } from "@/data/projects";
import { projectCategories, getProjectCategory } from "@/data/project-categories";
import { getIndustryBySlug } from "@/data/industries";
import { getSoftwareBySlug } from "@/data/software";
import { getLocationBySlug } from "@/data/locations";

export function generateStaticParams() {
  return [
    ...projectCategories.map((category) => ({ slug: category.slug })),
    ...projects.map((project) => ({ slug: project.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = getProjectCategory(slug);
  if (category) {
    return buildMetadata({
      title: `${category.name} Project Examples | Render CAD Hub`,
      description: category.description,
      path: `/projects/${category.slug}`,
    });
  }

  const project = getProjectBySlug(slug);
  if (project) {
    return buildMetadata({
      title: project.seoTitle,
      description: project.seoDescription,
      path: `/projects/${project.slug}`,
    });
  }

  return {};
}

export default async function ProjectOrCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = getProjectCategory(slug);
  if (category) {
    const items = getProjectsByDiscipline(category.slug);
    return (
      <>
        <Breadcrumbs items={[{ label: "Projects", href: "/projects" }, { label: category.name, href: `/projects/${category.slug}` }]} />
        <PageHero eyebrow="Project category" heading={`${category.name} Project Examples`} description={category.description} />
        <section className="py-16 sm:py-20">
          <Container className="max-w-3xl space-y-10">
            {category.intro.map((section, i) => (
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
          <Container>
            {items.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">More {category.name.toLowerCase()} project examples are on the way.</p>
            )}
          </Container>
        </section>
        <FAQ items={category.faqs} />
        <CTA variant="light" />
      </>
    );
  }

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const categoryInfo = getProjectCategory(project.discipline);
  const industry = getIndustryBySlug(project.industry);
  const location = project.location ? getLocationBySlug(project.location) : undefined;
  const softwareUsed = project.software.map(getSoftwareBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd
        data={creativeWorkJsonLd({
          title: project.title,
          description: project.summary,
          path: `/projects/${project.slug}`,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: categoryInfo?.name ?? project.discipline, href: `/projects/${project.discipline}` },
          { label: project.title, href: `/projects/${project.slug}` },
        ]}
      />
      <PageHero eyebrow={`${categoryInfo?.name ?? project.discipline} project`} heading={project.title} description={project.summary} />

      <section className="py-10">
        <Container>
          {project.isPlaceholder ? <PlaceholderBanner /> : null}
          <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-neutral-200 py-6 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-neutral-500">Discipline</dt>
              <dd className="mt-1 text-sm font-medium text-navy-900">{categoryInfo?.name ?? project.discipline}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-neutral-500">Industry</dt>
              <dd className="mt-1 text-sm font-medium text-navy-900">{industry?.name ?? project.industry}</dd>
            </div>
            {location ? (
              <div>
                <dt className="font-mono text-xs uppercase tracking-wide text-neutral-500">Location</dt>
                <dd className="mt-1 text-sm font-medium text-navy-900">{location.name}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-neutral-500">Software</dt>
              <dd className="mt-1 text-sm font-medium text-navy-900">{softwareUsed.map((s) => s.name).join(", ")}</dd>
            </div>
          </dl>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery.map((image, i) => (
              <ImagePlaceholder key={i} alt={image.alt} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <SectionHeading eyebrow="Challenge" heading="Project Challenge" />
              <div className="mt-4 space-y-4">
                {project.challenge.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Scope" heading="Scope of Work" />
              <div className="mt-4">
                <CheckList items={project.scope} columns={1} />
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Process" heading="How It Was Delivered" />
              <div className="mt-4 space-y-4">
                {project.process.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <SectionHeading eyebrow="Deliverables" heading="What Was Delivered" />
              <div className="mt-4">
                <CheckList items={project.deliverables} columns={1} />
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Considerations" heading="Design & Engineering Considerations" />
              <div className="mt-4">
                <CheckList items={project.considerations} columns={1} />
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Outcome" heading="Outcome" />
              <div className="mt-4 space-y-4">
                {project.outcome.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <RelatedServices slugs={project.relatedServices} />
      <FAQ items={project.faqs} heading="Frequently Asked Questions About This Project" />
      <CTA
        heading="Start a Similar Project"
        description="Tell us what you need and our team can review the project requirements."
      />
    </>
  );
}
