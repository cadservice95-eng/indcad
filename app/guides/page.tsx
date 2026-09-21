import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/ui/Container";
import { getArticlesByType } from "@/data/resources";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Guides | Render CAD Hub",
  description: "In-depth guides on BIM Levels of Development, structural steel shop drawings and choosing the right CAD or BIM platform.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  const guides = getArticlesByType("guide");
  return (
    <>
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }]} />
      <PageHero eyebrow="Guides" heading="Guides" description="In-depth, practical guides on BIM, drafting standards and CAD platform choice." />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>
      <CTA variant="light" />
    </>
  );
}
