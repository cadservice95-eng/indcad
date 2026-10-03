import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InView, Reveal } from "@/components/motion/InView";
import { LayerStack } from "@/components/svg/LayerStack";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

const stages = [
  {
    n: "01",
    title: "2D drawing",
    text: "Dimensioned plans, sections and details for fabrication, approval or construction.",
  },
  {
    n: "02",
    title: "3D model",
    text: "Geometry you can view from any angle and check for fit, clearance and interference.",
  },
  {
    n: "03",
    title: "BIM model",
    text: "Building elements that carry data, coordinated across architecture, structure and MEP.",
  },
];

export function CadBimTransformation() {
  return (
    <section className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="stack-grid" className="text-sky-300/[0.06]" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="CAD to BIM"
            heading="From 2D drawings to coordinated digital models"
            description="Many projects begin as 2D drawings. Where the work calls for it, the same information is built into a 3D model, then into a BIM model — so clashes surface on screen rather than on site."
          />
          <ol className="mt-10 space-y-6 border-l border-steel-300/20 pl-6">
            {stages.map((stage) => (
              <li key={stage.n} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border border-sky-300 bg-ink-950"
                />
                <p className="font-mono text-xs tracking-[0.16em] text-sky-300">
                  {stage.n} · {stage.title.toUpperCase()}
                </p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-neutral-300">{stage.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href="/services/bim/bim-services" variant="outline-light" arrow>
              Explore BIM modelling
            </Button>
          </div>
        </Reveal>

        <InView threshold={0.3} className="mx-auto w-full max-w-xl">
          <LayerStack className="h-auto w-full" />
        </InView>
      </Container>
    </section>
  );
}
