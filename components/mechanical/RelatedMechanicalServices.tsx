import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { ServiceIcon, type ServiceIconName } from "@/components/svg/ServiceIcons";
import { getServiceBySlug } from "@/data/services";

const iconFor: Record<string, ServiceIconName> = {
  mechanical: "mechanical",
  structural: "structural",
  architectural: "architectural",
  civil: "civil",
  electrical: "electrical",
  bim: "bim",
  "cad-conversion": "conversion",
  "engineering-design": "engineering",
};

export function RelatedMechanicalServices({ service }: { service: Service }) {
  const items = service.relatedServices.map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <section id="related" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Related" heading="Explore Related Services" />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <li key={s.slug}>
              <Reveal delay={i * 70} className="h-full">
                <Link
                  href={`/services/${s.category}/${s.slug}`}
                  className="group flex h-full flex-col border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40"
                >
                  <ServiceIcon name={iconFor[s.category] ?? "engineering"} className="h-9 w-9 text-steel-600 transition-colors group-hover:text-copper-600" />
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-navy-900">{s.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-600">{s.shortDescription}</p>
                  <ArrowRight className="mt-4 h-4 w-4 text-navy-900 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper-600" aria-hidden />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
