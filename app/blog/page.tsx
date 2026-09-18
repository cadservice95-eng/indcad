import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/ui/Container";
import { getArticlesByType } from "@/data/resources";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog | IndCAD",
  description: "Practical articles on CAD drafting, CAD conversion, BIM and project workflow for Indian engineering and construction teams.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getArticlesByType("blog");
  return (
    <>
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <PageHero eyebrow="Blog" heading="Blog" description="Practical, no-fluff articles on CAD drafting, conversion and project workflow." />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>
      <CTA variant="light" />
    </>
  );
}
