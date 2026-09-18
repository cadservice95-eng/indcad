import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container } from "@/components/ui/Container";
import { software } from "@/data/software";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "CAD & BIM Software We Work In | IndCAD",
  description:
    "AutoCAD, Revit, SolidWorks, Inventor, Tekla, MicroStation, Civil 3D, Navisworks, ArchiCAD and Fusion 360 — the CAD and BIM platforms we deliver work in.",
  path: "/software",
});

export default function SoftwareIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Software", href: "/software" }]} />
      <PageHero
        eyebrow="Software"
        heading="CAD & BIM Platforms We Work In"
        description="We work in the platform your team already uses, and deliver native files ready to drop back into your workflow."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {software.map((item) => (
              <Link
                key={item.slug}
                href={`/software/${item.slug}`}
                className="group flex flex-col border border-neutral-200 bg-white p-6 transition-colors hover:border-copper-400"
              >
                <span className="font-mono text-xs uppercase tracking-wide text-copper-600">{item.category}</span>
                <h2 className="mt-2 text-lg font-semibold text-navy-900">{item.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <CTA variant="light" />
    </>
  );
}
