import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container } from "@/components/ui/Container";
import { IndustryCard } from "@/components/IndustryCard";
import { industries } from "@/data/industries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Support | IndCAD",
  description:
    "CAD, drafting and engineering design support for construction, manufacturing, mining, oil & gas, automotive, defence, aerospace and energy sector projects across India.",
  path: "/industries",
});

export default function IndustriesIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Industries", href: "/industries" }]} />
      <PageHero
        eyebrow="Industries"
        heading="Industries We Support"
        description="Drafting, BIM and engineering design capability tailored to how each industry actually documents and delivers its projects."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
        </Container>
      </section>
      <CTA variant="light" />
    </>
  );
}
