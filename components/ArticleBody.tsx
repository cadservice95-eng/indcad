import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { RelatedServices } from "@/components/RelatedServices";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/jsonld";
import type { Article } from "@/lib/types";

const typeLabels: Record<Article["type"], { label: string; href: string; eyebrow: string }> = {
  blog: { label: "Blog", href: "/blog", eyebrow: "Blog" },
  guide: { label: "Guides", href: "/guides", eyebrow: "Guide" },
  standard: { label: "Standards", href: "/standards", eyebrow: "Standards" },
};

export function ArticleBody({ article }: { article: Article }) {
  const meta = typeLabels[article.type];
  const path = `/${meta.href.replace(/^\//, "")}/${article.slug}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt,
          path,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
        })}
      />
      <Breadcrumbs
        items={[
          { label: meta.label, href: meta.href },
          { label: article.title, href: path },
        ]}
      />
      <PageHero eyebrow={meta.eyebrow} heading={article.title} description={article.excerpt} primaryLabel="Get a Free Quote" />

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wide text-neutral-500">
            Published {formatDate(article.publishedAt)}
            {article.updatedAt ? ` · Updated ${formatDate(article.updatedAt)}` : ""}
          </p>
          <div className="mt-8 space-y-10">
            {article.body.map((section, i) => (
              <div key={i}>
                {section.heading ? (
                  <h2 className="text-xl font-semibold text-navy-900">{section.heading}</h2>
                ) : null}
                <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="text-base leading-relaxed text-neutral-700">
                      {paragraph}
                    </p>
                  ))}
                  {section.list ? (
                    <ul className="space-y-2 border-l-2 border-copper-500/40 pl-5">
                      {section.list.map((item, k) => (
                        <li key={k} className="text-sm leading-relaxed text-neutral-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </article>

      <RelatedServices slugs={article.relatedServices} />
      <CTA variant="light" heading="Need Help With a Project Like This?" />
    </>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
