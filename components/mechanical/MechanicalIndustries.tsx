import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { IndustryArt, type IndustryArtName } from "@/components/svg/IndustryArt";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { getIndustryBySlug } from "@/data/industries";

const art: Record<string, IndustryArtName> = {
  manufacturing: "manufacturing",
  mining: "mining",
  defence: "defence",
  automotive: "automotive",
  aerospace: "aerospace",
  energy: "energy",
};

export function MechanicalIndustries({ service }: { service: Service }) {
  const items = service.industries.map(getIndustryBySlug).filter((i): i is NonNullable<typeof i> => Boolean(i));
  return (
    <section id="industries" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Industries" heading="Industries We Support" />
        </Reveal>
        <InView as="ul" className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {items.map((industry, i) => (
            <li key={industry.slug}>
              <Reveal delay={(i % 3) * 70} className="h-full">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)]"
                >
                  <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                    <TechnicalGrid id={`mi-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                    <div className="relative h-full w-full p-3">
                      <IndustryArt name={art[industry.slug] ?? "manufacturing"} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 sm:p-5">
                    <h3 className="text-base font-semibold tracking-tight text-navy-900">{industry.name}</h3>
                    <ArrowRight className="h-4 w-4 text-navy-900 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper-600" aria-hidden />
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
