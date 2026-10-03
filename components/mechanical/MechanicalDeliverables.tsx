import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";

// Every item of service.deliverables is mapped to a group; unmatched items fall into "Documentation".
const groups: { title: string; icon: MechIconName; match: RegExp }[] = [
  { title: "Drawings", icon: "drawings", match: /2D mechanical|Fabrication and manufacturing|GA \(/i },
  { title: "Models", icon: "models", match: /3D CAD|Reverse-engineered|STEP/i },
  { title: "Manufacturing", icon: "manufacturing", match: /flat patterns|Assembly drawings|Fastener/i },
  { title: "Documentation", icon: "documentation", match: /Revision|Tolerance|Material and finish/i },
];

export function MechanicalDeliverables({ service }: { service: Service }) {
  const buckets = groups.map(() => [] as string[]);
  for (const item of service.deliverables) {
    const i = groups.findIndex((g) => g.match.test(item));
    buckets[i === -1 ? groups.length - 1 : i].push(item);
  }
  return (
    <section id="deliverables" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Deliverables" heading="What You Get" description="Everything is delivered in the native format your team uses, with neutral-format exports where a supplier needs them." />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 80} className="h-full">
              <div className="group relative h-full border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)]">
                <MechIcon name={g.icon} className="text-steel-600 transition-colors group-hover:text-copper-600" />
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-navy-900">{g.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {buckets[i].map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-snug text-neutral-600">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
