import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export function ServiceCard({
  href,
  icon,
  name,
  description,
  deliverables,
}: {
  href: string;
  icon: string;
  name: string;
  description: string;
  deliverables: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-neutral-200 bg-white p-6 transition-colors hover:border-copper-400"
    >
      <CategoryIcon name={icon} className="h-6 w-6 text-copper-500" />
      <h3 className="mt-4 text-lg font-semibold text-navy-900">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
      <ul className="mt-4 space-y-1.5">
        {deliverables.slice(0, 3).map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-neutral-500">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 bg-copper-500" />
            {item}
          </li>
        ))}
      </ul>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:text-copper-600">
        Learn more
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
