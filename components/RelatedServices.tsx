import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServiceBySlug } from "@/data/services";

export function RelatedServices({ slugs }: { slugs: string[] }) {
  const services = slugs.map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
  if (services.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Related" heading="Related Services" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.category}/${service.slug}`}
              className="group flex items-center justify-between gap-3 border border-neutral-200 bg-white p-5 transition-colors hover:border-copper-400"
            >
              <div>
                <p className="text-sm font-semibold text-navy-900">{service.name}</p>
                <p className="mt-1 text-xs text-neutral-500">{service.shortDescription}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-copper-500" aria-hidden />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
