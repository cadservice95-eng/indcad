import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { DrawingViewer } from "./ArchClient";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Hero: a floor plan drafted in sequence, then re-drawn as elevation, section and 3D from the same building. */
export function ArchHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#F8F7F4]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-slate-900/[0.05]">
        <defs>
          <pattern id="ah-m" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth="0.6" /></pattern>
          <pattern id="ah-M" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="url(#ah-m)" /><path d="M120 0H0V120" fill="none" stroke="currentColor" strokeWidth="1" /></pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ah-M)" />
      </svg>
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-slate-600">
              Plan <span className="text-copper-500">•</span> Elevation <span className="text-copper-500">•</span> Section <span className="text-copper-500">•</span> Detail <span className="text-copper-500">•</span> Schedule
            </p>
            <h1 style={d(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={d(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
            <div style={d(340)} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#workflow" size="lg" variant="ghost" arrow>Explore Documentation Workflow</Button>
            </div>
            <p style={d(460)} className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {["Floor plans", "Construction documentation", "Renovation drawings", "Fit-out joinery"].map((t, i) => (
                <span key={t} className="flex items-center gap-3">{i > 0 ? <span aria-hidden className="text-copper-500">•</span> : null}{t}</span>
              ))}
            </p>
          </div>
          <div style={d(300)} className="reveal relative min-w-0">
            <DrawingViewer tour animate />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">One building · every drawing view · illustrative</p>
          </div>
        </Container>
      </InView>
    </section>
  );
}
