import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/types";

const basePaths: Record<Article["type"], string> = {
  blog: "/blog",
  guide: "/guides",
  standard: "/standards",
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`${basePaths[article.type]}/${article.slug}`}
      className="group flex flex-col justify-between border border-neutral-200 bg-white p-6 transition-colors hover:border-copper-400"
    >
      <div>
        <h3 className="text-base font-semibold text-navy-900">{article.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{article.excerpt}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:text-copper-600">
        Read more
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
