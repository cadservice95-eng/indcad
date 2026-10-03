import Link from "next/link";
import type { Industry } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { getSoftwareBySlug } from "@/data/software";

export function ManufacturingSoftware({ industry }: { industry: Industry }) {
  const tools = industry.software.map(getSoftwareBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <section id="software" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Software" heading="Software Used in Manufacturing Projects" />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <li key={tool.slug}>
              <Reveal delay={i * 70} className="h-full">
                <Link
                  href={`/software/${tool.slug}`}
                  className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-900/50"
                >
                  <span aria-hidden className="bg-blueprint-grid-light pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative font-mono text-[10px] tracking-[0.16em] text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative">
                    <span className="block origin-left text-xl font-semibold tracking-tight text-neutral-500 transition-all duration-300 group-hover:scale-105 group-hover:text-navy-900">
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

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function ManufacturingCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="mfg-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Get a Quote for Your Manufacturing Project
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
            Tell us what you need and our team can review the project requirements.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services" size="lg" variant="outline-light">Explore Services</Button>
          </div>
        </div>
        <div aria-hidden className="mx-auto w-full max-w-xl">
          <svg viewBox="0 0 560 300" fill="none" className="h-auto w-full text-sky-300">
            <path d="M0 24V0h24M536 0h24v24M560 276v24h-24M24 300H0v-24" stroke="#38bdf8" strokeWidth="2" />
            {/* factory outline */}
            <path d="M40 200V110l60 -34v34l60 -34v34l60 -34v34l60 -34v34l60 -34v124z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} className="draw" style={{ "--t": "2.2s" } as React.CSSProperties} />
            <path d="M40 200H520" stroke="currentColor" strokeWidth="1.5" />
            {/* wireframe overlay */}
            <g stroke="#d68a51" strokeWidth="0.9" strokeDasharray="5 4" className="fade-in" style={d(1600)}>
              <path d="M52 192V118l48 -27v27l48 -27v27l48 -27v27l48 -27v27l48 -27v100z" />
            </g>
            {/* conveyor + crates */}
            <g className="fade-in" style={d(1900)} stroke="currentColor" strokeWidth="1.3">
              <path d="M60 236h440v10H60z" />
              <path d="M90 236v-26h30v26M210 236v-34h34v34M340 236v-22h30v22M440 236v-30h30v30" />
            </g>
            {/* dimension */}
            <g className="fade-in text-copper-400" style={d(2300)}>
              <path d="M40 270H520M40 262v16M520 262v16" stroke="currentColor" strokeWidth="0.9" className="rch-flow" />
              <text x="280" y="288" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">PRODUCTION LINE · CAD OVERLAY</text>
              <circle cx="100" cy="91" r="3" fill="currentColor" className="rch-pulse" />
              <circle cx="400" cy="91" r="3" fill="currentColor" className="rch-pulse" style={d(800)} />
            </g>
          </svg>
        </div>
      </Container>
    </InView>
  );
}
