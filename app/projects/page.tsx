import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { ProjectCard } from "@/components/ProjectCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";
import { projectCategories } from "@/data/project-categories";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CAD & Engineering Project Examples | IndCAD",
  description:
    "Illustrative CAD, drafting, BIM and engineering design project examples across mechanical, structural, civil, architectural, electrical and BIM disciplines.",
  path: "/projects",
});

export default function ProjectsIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Projects", href: "/projects" }]} />
      <PageHero
        eyebrow="Projects"
        heading="Project Examples"
        description="A cross-section of the drafting, BIM and engineering design work we take on. Placeholder examples are clearly marked and will be replaced with verified case studies over time."
      />

      <section className="border-b border-neutral-200 py-8">
        <Container>
          <div className="flex flex-wrap gap-2">
            {projectCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/projects/${category.slug}`}
                className="border border-neutral-300 px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:border-copper-400 hover:text-copper-600"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="All examples" heading="Every Project Example" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <CTA variant="light" />
    </>
  );
}
