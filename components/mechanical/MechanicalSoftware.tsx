import Link from "next/link";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { getSoftwareBySlug } from "@/data/software";

export function MechanicalSoftware({ service }: { service: Service }) {
  const tools = service.software.map(getSoftwareBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <section id="software" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Software"
            heading="Software We Use"
            description="Neutral-format exports (STEP, IGES, DXF, PDF) are available where a supplier or archive needs them."
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <li key={tool.slug}>
              <Reveal delay={i * 70} className="h-full">
                <Link
                  href={`/software/${tool.slug}`}
                  className="group flex h-full flex-col justify-between gap-8 border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-900/50"
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-xl font-semibold tracking-tight text-neutral-500 transition-colors group-hover:text-navy-900">
                      {tool.name}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-neutral-400">{tool.category}</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
