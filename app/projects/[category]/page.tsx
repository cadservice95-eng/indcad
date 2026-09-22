import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/sections/CTA";
import { ProjectCard } from "@/components/ProjectCard";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";
import { getProjectsByDiscipline } from "@/data/projects";
import { projectCategories, getProjectCategory } from "@/data/project-categories";

export function generateStaticParams() {
  return projectCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getProjectCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} Project Examples | Render CAD Hub`,
    description: category.description,
    path: `/projects/${category.slug}`,
  });
}

export default async function ProjectCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getProjectCategory(slug);
  if (!category) notFound();

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
