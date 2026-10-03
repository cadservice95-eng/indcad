import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";

const icons: MechIconName[] = ["machine", "product", "sheet", "fixture", "spare", "line", "custom", "handover", "change", "proto"];

export function MechanicalApplications({ service }: { service: Service }) {
  return (
    <section id="applications" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Applications" heading="Where Mechanical Drafting Is Used" />
        </Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-5">
          {service.applications.map((app, i) => (
            <li key={app} className="bg-white">
              <Reveal delay={(i % 5) * 60} className="h-full">
                <div className="group flex h-full flex-col gap-5 p-5 transition-colors duration-300 hover:bg-steel-50">
                  <MechIcon name={icons[i % icons.length]} className="text-steel-600 transition-colors group-hover:text-copper-600" />
                  <p className="text-sm font-medium leading-snug text-navy-900">{app}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
