import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

export function FinalCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-24 sm:py-32">
      <TechnicalGrid id="cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <svg
        aria-hidden
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full text-sky-300"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="1" opacity="0.5">
          <path d="M0 300H380L470 210H1200" className="draw" pathLength={1} style={{ "--t": "2.4s" } as React.CSSProperties} />
          <path d="M0 130H260L330 60H820L880 120H1200" className="draw" pathLength={1} style={{ "--t": "2.8s", "--d": "300ms" } as React.CSSProperties} opacity="0.6" />
          <path d="M0 300H380L470 210H1200" className="rch-flow" opacity="0.5" />
        </g>
        <g stroke="#d68a51" strokeWidth="1" opacity="0.6">
          <circle cx="1010" cy="210" r="46" strokeDasharray="3 6" className="rch-spin-slow" />
          <path d="M984 210h52M1010 184v52" />
          <circle cx="470" cy="210" r="3" fill="#d68a51" className="rch-pulse" />
          <circle cx="330" cy="60" r="3" fill="#d68a51" className="rch-pulse" style={{ "--d": "900ms" } as React.CSSProperties} />
        </g>
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />

      <Container className="relative">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Have a Drawing, Model or Engineering Project in Mind?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Share your requirements with our team and discuss the right CAD, BIM or engineering workflow for your
            project.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>
              Request a Quote
            </Button>
            <Button href="/contact" size="lg" variant="outline-light">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </InView>
  );
}
