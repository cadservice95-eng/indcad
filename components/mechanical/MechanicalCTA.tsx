import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { IsoPart } from "@/components/svg/IsoPart";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function MechanicalCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="mech-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Get a Quote for Mechanical Drafting
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
            Tell us what you need and our team can review the project requirements.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/contact" size="lg" variant="outline-light">Contact Us</Button>
          </div>
        </div>
        <div aria-hidden className="relative mx-auto w-full max-w-xl">
          <svg viewBox="0 0 560 360" fill="none" className="h-auto w-full text-sky-300">
            <path d="M0 24V0h24M536 0h24v24M560 336v24h-24M24 360H0v-24" stroke="#38bdf8" strokeWidth="2" />
            <IsoPart ox={236} oy={150} s={1.7} />
            <g className="fade-in" style={d(2600)}>
              <path d="M380 120l40 -30h100" stroke="#d68a51" strokeWidth="0.9" />
              <text x="424" y="84" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">Ø 42.00 ±0.05</text>
              <circle cx="380" cy="120" r="3" fill="#d68a51" className="rch-pulse" />
            </g>
          </svg>
        </div>
      </Container>
    </InView>
  );
}
