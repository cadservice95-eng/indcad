import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/ui/Container";
import { getArticlesByType } from "@/data/resources";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Drafting Standards | IndCAD",
  description: "General reference articles on Indian Standards (IS codes) and drawing conventions relevant to structural, mechanical and architectural drafting.",
  path: "/standards",
});

export default function StandardsIndexPage() {
  const standards = getArticlesByType("standard");
  return (
    <>
      <Breadcrumbs items={[{ label: "Standards", href: "/standards" }]} />
      <PageHero
        eyebrow="Standards"
        heading="Drafting Standards"
        description="General reference material on Indian Standards (IS codes) and drawing conventions. Always confirm current, project-specific requirements with your engineer or certifier."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>
      <CTA variant="light" />
    </>
  );
}
