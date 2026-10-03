import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { IndustryArt, type IndustryArtName } from "@/components/svg/IndustryArt";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

const items: { name: string; art: IndustryArtName; href: string; line: string }[] = [
  { name: "Architecture & Construction", art: "construction", href: "/industries/construction", line: "Architectural, structural and services documentation." },
  { name: "Manufacturing", art: "manufacturing", href: "/industries/manufacturing", line: "Part, assembly and fabrication drawings." },
  { name: "Structural Engineering", art: "structural", href: "/services/structural", line: "Steel detailing and shop drawings." },
  { name: "Automotive", art: "automotive", href: "/industries/automotive", line: "Component and fixture drawings." },
  { name: "Mining", art: "mining", href: "/industries/mining", line: "Plant, structure and layout drawings." },
  { name: "Energy & Utilities", art: "energy", href: "/industries/energy", line: "Electrical and plant documentation." },
  { name: "Infrastructure", art: "infrastructure", href: "/services/civil", line: "Site, road and drainage documentation." },
  { name: "Industrial Engineering", art: "industrial", href: "/services/engineering-design", line: "Equipment, piping and layout drawings." },
];

export function IndustriesSection() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Industries"
            heading="Supporting Multiple Engineering & Construction Industries"
            description="Different sectors, different drawing conventions. We adapt to the standards and deliverables each one expects."
          />
        </Reveal>

        <InView as="ul" className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.name}>
              <Reveal delay={(i % 4) * 70} className="h-full">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)]"
                >
                  <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                    <TechnicalGrid id={`ind-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                    <div className="relative h-full w-full p-3 transition-colors duration-300 group-hover:text-sky-200">
                      <IndustryArt name={item.art} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                    <h3 className="text-base font-semibold tracking-tight text-navy-900">{item.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-600">{item.line}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 transition-colors group-hover:text-copper-600">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}
