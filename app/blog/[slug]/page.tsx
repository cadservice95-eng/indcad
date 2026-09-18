import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { getArticlesByType, getArticleBySlug } from "@/data/resources";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getArticlesByType("blog").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.type !== "blog") return {};
  return buildMetadata({ title: article.seoTitle, description: article.seoDescription, path: `/blog/${article.slug}` });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.type !== "blog") notFound();

  return <ArticleBody article={article} />;
}
