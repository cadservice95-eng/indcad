import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { IndustryArt } from "@/components/svg/IndustryArt";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { projects } from "@/data/projects";

export function MechanicalProjects() {
  const items = projects.filter((p) => p.discipline === "mechanical");
  if (items.length === 0) return null;
  return (
    <section id="projects" className="border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="Portfolio"
            heading="Related Mechanical Projects"
            description="Illustrative examples of mechanical work. They are marked as examples and will give way to verified case studies as client work is cleared for publication."
          />
          <Link href="/projects/mechanical" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">
            All mechanical projects →
          </Link>
        </Reveal>
        <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((project, i) => (
            <li key={project.slug}>
              <Reveal delay={i * 90} className="h-full">
                <Link
                  href={`/projects/${project.discipline}/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-steel-300/20 bg-ink-900 transition-colors duration-300 hover:border-sky-300/50"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-ink-950 text-sky-300">
                    <TechnicalGrid id={`mp-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                    <div className="art-zoom relative h-full w-full p-5">
                      <IndustryArt name={i % 2 === 0 ? "manufacturing" : "automotive"} />
                    </div>
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">Mechanical · {project.industry}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{project.discipline}</span>
                      {project.isPlaceholder ? (
                        <span className="border border-steel-300/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutral-400">Illustrative example</span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{project.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-400">{project.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">
                      View project
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}
