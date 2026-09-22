import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container } from "@/components/ui/Container";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { serviceCategories } from "@/data/service-categories";
import { getServiceBySlug } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return serviceCategories.map((category) => ({ category: category.slug }));
}

function getCategory(slug: string) {
  return serviceCategories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} CAD & Drafting Services | Render CAD Hub`,
    description: category.shortDescription,
    path: `/services/${category.slug}`,
  });
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: category.name, href: `/services/${category.slug}` }]} />
      <PageHero eyebrow="Services" heading={`${category.name} Services`} description={category.shortDescription} />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex items-center gap-3">
            <CategoryIcon name={category.icon} className="h-6 w-6 text-copper-500" />
            <h2 className="text-lg font-semibold text-navy-900">{category.name} Services</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service) => {
              const fullService = getServiceBySlug(service.slug);
              return (
                <Link
                  key={service.slug}
                  href={`/services/${category.slug}/${service.slug}`}
                  className="group flex flex-col border border-neutral-200 bg-white p-6 transition-colors hover:border-copper-400"
                >
                  <h3 className="text-base font-semibold text-navy-900 group-hover:text-copper-600">{service.name}</h3>
                  {fullService ? <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{fullService.shortDescription}</p> : null}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CTA variant="light" heading={`Get a Quote for ${category.name}`} />
    </>
  );
}
