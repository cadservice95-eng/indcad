import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { cn } from "@/lib/utils";

const cards = [
  {
    code: "DEMAND",
    title: "Uneven Documentation Demand",
    text: "Documentation demand can increase during new product introductions, equipment changes and legacy part requalification.",
    bars: [30, 34, 90, 40, 76, 28],
  },
  {
    code: "LEGACY",
    title: "Legacy Equipment",
    text: "Existing parts may have changed over years of undocumented shop-floor modifications.",
    bars: [88, 74, 60, 52, 44, 38],
  },
  {
    code: "PLATFORMS",
    title: "Mixed CAD Platforms",
    text: "Manufacturers may operate equipment and documentation across multiple CAD platforms and drawing standards.",
    bars: [50, 70, 36, 82, 44, 62],
  },
  {
    code: "HANDOVER",
    title: "Supplier Handover",
    text: "Contract manufacturing requires documentation that another organisation can understand without relying on undocumented tribal knowledge.",
    bars: [24, 40, 56, 70, 84, 92],
  },
];

export function ManufacturingChallenges() {
  return (
    <section id="challenges" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Challenges" heading="Where Manufacturing Documentation Gets Complicated" />
        </Reveal>
        <InView as="ul" className="mt-12 grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <li key={c.code}>
              <Reveal delay={(i % 2) * 90} className="group h-full">
                <div className="h-full border border-navy-800 bg-ink-950 p-6 transition-colors duration-300 hover:border-sky-300/50">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                    <span className="text-sky-300">CHECK {String(i + 1).padStart(2, "0")} · {c.code}</span>
                    <span className="flex items-center gap-1.5 text-copper-400">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-copper-500" /> Flag
                    </span>
                  </div>
                  <div aria-hidden className="mt-5 flex h-14 items-end gap-1.5 border-b border-steel-300/20">
                    {c.bars.map((h, j) => (
                      <span
                        key={j}
                        style={{ height: `${h}%`, transitionDelay: `${j * 60}ms` }}
                        className={cn(
                          "w-full origin-bottom scale-y-0 transition-transform duration-700 group-data-[in=true]:scale-y-100",
                          h > 70 ? "bg-copper-500/80" : "bg-sky-400/40",
                        )}
                      />
                    ))}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{c.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}
