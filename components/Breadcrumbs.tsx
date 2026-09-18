import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import type { BreadcrumbEntry } from "@/lib/types";

export function Breadcrumbs({ items }: { items: BreadcrumbEntry[] }) {
  const full: BreadcrumbEntry[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="border-b border-neutral-200 bg-neutral-50">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-3 font-mono text-xs text-neutral-500">
          {full.map((item, index) => {
            const isLast = index === full.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 ? <ChevronRight className="h-3 w-3 text-neutral-400" aria-hidden /> : null}
                {isLast ? (
                  <span aria-current="page" className="text-navy-900">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-copper-600">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
