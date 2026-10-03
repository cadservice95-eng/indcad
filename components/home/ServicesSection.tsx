import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { ServiceIcon, type ServiceIconName } from "@/components/svg/ServiceIcons";
import { getServiceBySlug } from "@/data/services";

const lines: { slug: string; category: string; icon: ServiceIconName; name: string }[] = [
  { slug: "mechanical-drafting", category: "mechanical", icon: "mechanical", name: "Mechanical Drafting" },
  { slug: "structural-drafting", category: "structural", icon: "structural", name: "Structural Drafting" },
  { slug: "architectural-drafting", category: "architectural", icon: "architectural", name: "Architectural Drafting" },
  { slug: "civil-drafting", category: "civil", icon: "civil", name: "Civil Drafting" },
  { slug: "electrical-drafting", category: "electrical", icon: "electrical", name: "Electrical Drafting" },
  { slug: "bim-services", category: "bim", icon: "bim", name: "BIM Modelling" },
  { slug: "cad-conversion", category: "cad-conversion", icon: "conversion", name: "CAD Conversion" },
  { slug: "engineering-design", category: "engineering-design", icon: "engineering", name: "Engineering Design" },
];

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Our services"
            heading="CAD, BIM & Engineering Services"
            description="Drafting, modelling and design across mechanical, structural, architectural, civil and electrical work — one capability, scoped to what your project actually needs."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lines.map((line, i) => {
            const service = getServiceBySlug(line.slug);
            if (!service) return null;
            return (
              <li key={line.slug}>
                <Reveal delay={(i % 4) * 70} className="h-full">
                  <Link
                    href={`/services/${line.category}/${line.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)] focus-visible:-translate-y-1"
                  >
                    <span
                      aria-hidden
                      className="bg-blueprint-grid-light pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [mask-image:linear-gradient(to_bottom_left,black,transparent_65%)] group-hover:opacity-100"
                    />
                    <div className="relative flex items-start justify-between">
                      <ServiceIcon name={line.icon} className="text-steel-600 transition-colors duration-300 group-hover:text-copper-600" />
                      <span className="font-mono text-xs tracking-[0.14em] text-neutral-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="relative mt-6 text-lg font-semibold tracking-tight text-navy-900">{line.name}</h3>
                    <p className="relative mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                      {service.shortDescription}
                    </p>
                    <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-900 transition-colors group-hover:text-copper-600">
                      View service
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-copper-500 transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
