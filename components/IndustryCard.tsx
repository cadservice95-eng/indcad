import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/lib/types";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group flex flex-col justify-between border border-neutral-200 bg-white p-6 transition-colors hover:border-copper-400"
    >
      <div>
        <h3 className="text-base font-semibold text-navy-900">{industry.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{industry.heroDescription}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:text-copper-600">
        View industry
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
