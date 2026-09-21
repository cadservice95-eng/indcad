import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { ArticleCard } from "@/components/ArticleCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { articles, getArticlesByType } from "@/data/resources";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Resources | Render CAD Hub",
  description: "CAD, BIM and drafting guides, blog articles and drawing standards resources for Indian engineering, architecture and construction teams.",
  path: "/resources",
});

export default function ResourcesIndexPage() {
  const blog = getArticlesByType("blog");
  const guides = getArticlesByType("guide");
  const standards = getArticlesByType("standard");

  return (
    <>
      <Breadcrumbs items={[{ label: "Resources", href: "/resources" }]} />
      <PageHero
        eyebrow="Resources"
        heading="Resources"
        description="Practical guides, blog articles and drawing standards references for engineers, architects, builders and manufacturers."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 sm:grid-cols-3">
          <ResourceCategoryCard title="Blog" description="Practical articles on drafting, CAD conversion and project workflow." href="/blog" count={blog.length} />
          <ResourceCategoryCard title="Guides" description="In-depth guides on BIM, drawing standards and platform choice." href="/guides" count={guides.length} />
          <ResourceCategoryCard title="Standards" description="General references to Indian Standards (IS codes) relevant to drafting disciplines." href="/standards" count={standards.length} />
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Latest" heading="All Resources" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <CTA variant="light" />
    </>
  );
}

function ResourceCategoryCard({
  title,
  description,
  href,
  count,
}: {
  title: string;
  description: string;
  href: string;
  count: number;
}) {
  return (
    <div className="flex flex-col border border-neutral-200 bg-white p-6">
      <span className="font-mono text-xs uppercase tracking-wide text-copper-600">{count} articles</span>
      <h2 className="mt-2 text-lg font-semibold text-navy-900">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{description}</p>
      <div className="mt-5">
        <Button href={href} variant="ghost" size="md">
          Browse {title.toLowerCase()}
        </Button>
      </div>
    </div>
  );
}
