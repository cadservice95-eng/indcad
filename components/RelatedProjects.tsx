import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectsByDiscipline } from "@/data/projects";

export function RelatedProjects({ disciplines }: { disciplines: string[] }) {
  const relatedProjects = disciplines.flatMap((d) => getProjectsByDiscipline(d)).slice(0, 3);
  if (relatedProjects.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Portfolio" heading="Related Projects" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
