import type { Industry } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

const labels = ["Dimensioning & tolerancing", "Native CAD", "Reconciliation", "Drawing standard setup"];

/** Control-panel style list of the documentation requirements we work to. Workflow settings, not certifications. */
export function DocRequirements({ industry }: { industry: Industry }) {
  return (
    <section id="requirements" className="relative overflow-hidden border-t border-navy-800 bg-ink-900 py-20 sm:py-28">
      <TechnicalGrid id="mfg-req-grid" className="text-sky-300/[0.06]" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Workflow fit"
            heading="Documentation That Fits Your Existing Workflow"
            description="Each setting below is configured to your standard rather than assumed."
          />
        </Reveal>
        <InView threshold={0.25} className="group border border-steel-300/25 bg-ink-950">
          <div className="flex items-center justify-between border-b border-steel-300/20 px-5 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Drawing standard</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Configurable</p>
          </div>
          <ul>
            {industry.documentationRequirements.map((text, i) => (
              <li key={text} className="reveal flex gap-4 border-b border-steel-300/10 px-5 py-5 last:border-b-0" style={{ "--d": `${i * 160}ms` } as React.CSSProperties}>
                <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-emerald-400/50 bg-emerald-400/10 text-emerald-400">
                  <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.5l2.5 2.5L10 3.5" pathLength={1} className="draw" style={{ "--d": `${300 + i * 160}ms`, "--t": "0.6s" } as React.CSSProperties} />
                  </svg>
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sky-300">{labels[i] ?? `Requirement ${i + 1}`}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </InView>
      </Container>
    </section>
  );
}
