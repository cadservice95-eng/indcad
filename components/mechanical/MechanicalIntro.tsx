import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";

const blocks: { n: string; title: string; text: string; icon: MechIconName }[] = [
  { n: "01", title: "Design Intent", text: "Sketches, existing models, redlines or reference material.", icon: "sketch" },
  { n: "02", title: "Drafting Workload", text: "GA drawings, production drawings, BOMs and documentation.", icon: "drawing" },
  { n: "03", title: "Production-Ready Output", text: "Organised files ready for engineering, fabrication or manufacturing workflows.", icon: "folder" },
];

export function MechanicalIntro() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-3xl">
          <SectionHeading eyebrow="Engineering capacity" heading="When drafting workload grows faster than your engineering team" className="max-w-3xl" />
          <p className="mt-6 text-base leading-relaxed text-neutral-600">
            Manufacturing and engineering teams often need drafting capacity without carrying a full-time draftsperson — a
            concept sketch that has to become a manufacturable assembly, a legacy part with no digital model anywhere in
            the business, or a run of fabrication drawings that needs to reach the workshop floor this week.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Internal engineers are usually better used on design decisions, tolerance stack-ups and supplier negotiations
            than on redlining GA drawings or rebuilding a BOM that changed again. That mismatch between engineering time
            and drafting workload is the gap this service is built to close.
          </p>
        </Reveal>

        <InView as="ol" className="group relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[22px] hidden h-px origin-left scale-x-0 bg-gradient-to-r from-copper-500 via-sky-400 to-copper-500 transition-transform duration-[1800ms] ease-out group-data-[in=true]:scale-x-100 md:block"
          />
          {blocks.map((b, i) => (
            <li key={b.n} className="reveal relative md:pt-14" style={{ "--d": `${i * 160}ms` } as React.CSSProperties}>
              <span className="absolute left-0 top-0 hidden h-11 w-11 items-center justify-center border border-neutral-300 bg-white text-steel-600 md:flex">
                <MechIcon name={b.icon} className="h-7 w-7" />
              </span>
              <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{b.n}</p>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-navy-900">{b.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">{b.text}</p>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}
