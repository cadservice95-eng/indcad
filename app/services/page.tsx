import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container } from "@/components/ui/Container";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { serviceCategories } from "@/data/service-categories";
import { getServiceBySlug } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CAD & Engineering Services India | Render CAD Hub",
  description:
    "Mechanical, structural, architectural, civil and electrical drafting, plus BIM, CAD conversion and engineering design services across India.",
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
      <PageHero
        eyebrow="Services"
        heading="CAD & Engineering Services"
        description="Mechanical, structural, architectural, civil and electrical drafting, plus BIM, CAD conversion and engineering design — scoped to your project and delivered in your native CAD format."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="border border-neutral-200 bg-white p-6">
                <CategoryIcon name={category.icon} className="h-6 w-6 text-copper-500" />
                <h2 className="mt-4 text-lg font-semibold text-navy-900">
                  <Link href={`/services/${category.slug}`} className="hover:text-copper-600">
                    {category.name}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{category.shortDescription}</p>
                <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                  {category.services.map((service) => {
                    const fullService = getServiceBySlug(service.slug);
                    return (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${category.slug}/${service.slug}`}
                          className="text-sm font-medium text-navy-800 hover:text-copper-600"
                        >
                          {service.name}
                        </Link>
                        {fullService ? (
                          <p className="mt-0.5 text-xs text-neutral-500">{fullService.shortDescription}</p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA variant="light" />
    </>
  );
}
