import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { IndustryArt, type IndustryArtName } from "@/components/svg/IndustryArt";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { projects } from "@/data/projects";
import { getServiceBySlug } from "@/data/services";
import { industries } from "@/data/industries";

const artFor: Record<string, IndustryArtName> = {
  mechanical: "manufacturing",
  structural: "structural",
  architectural: "construction",
  bim: "bim",
  civil: "infrastructure",
  electrical: "energy",
};

// One example per discipline; the rest live on /projects.
const featured = ["mechanical", "structural", "architectural", "bim"]
  .map((d) => projects.find((p) => p.discipline === d))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

export function ProjectsSection() {
  return (
    <section className="border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="Portfolio"
            heading="Selected Project Work"
            description="Illustrative examples across our core disciplines. They are marked as examples and will be replaced with verified case studies as client work is cleared for publication."
          />
          <Link
            href="/projects"
            className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline"
          >
            View all projects →
          </Link>
        </Reveal>

        <ul className="mt-12 grid gap-5 lg:grid-cols-2">
          {featured.map((project, i) => {
            const industry = industries.find((x) => x.slug === project.industry)?.name ?? project.industry;
            const services = project.relatedServices
              .map((slug) => getServiceBySlug(slug)?.name)
              .filter(Boolean)
              .slice(0, 2);
            return (
              <li key={project.slug}>
                <Reveal delay={(i % 2) * 90} className="h-full">
                  <Link
                    href={`/projects/${project.discipline}/${project.slug}`}
                    className="group flex h-full flex-col overflow-hidden border border-steel-300/20 bg-ink-900 transition-colors duration-300 hover:border-sky-300/50 sm:flex-row"
                  >
                    <div className="relative aspect-[8/5] shrink-0 overflow-hidden bg-ink-950 text-sky-300 sm:aspect-auto sm:w-[44%]">
                      <TechnicalGrid id={`prj-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                      <div className="art-zoom relative h-full w-full p-4 sm:p-5">
                        <IndustryArt name={artFor[project.discipline] ?? "construction"} />
                      </div>
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <dl className="font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-sky-200">
                          <div className="flex gap-2"><dt className="text-neutral-400">Discipline</dt><dd>{project.discipline}</dd></div>
                          <div className="flex gap-2"><dt className="text-neutral-400">Industry</dt><dd>{industry}</dd></div>
                        </dl>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">
                          {project.discipline}
                        </span>
                        {project.isPlaceholder ? (
                          <span className="border border-steel-300/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutral-400">
                            Illustrative example
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-400">
                        {project.summary}
                      </p>
                      {services.length ? (
                        <p className="mt-4 text-xs text-neutral-500">Services: {services.join(" · ")}</p>
                      ) : null}
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">
                        View project
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
