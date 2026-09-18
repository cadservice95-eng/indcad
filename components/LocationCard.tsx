import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Location } from "@/lib/types";

export function LocationCard({ location }: { location: Location }) {
  return (
    <Link
      href={`/locations/${location.slug}`}
      className="group flex flex-col justify-between border border-neutral-200 bg-white p-6 transition-colors hover:border-copper-400"
    >
      <div>
        <div className="flex items-center gap-2 text-copper-500">
          <MapPin className="h-4 w-4" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-wide">{location.state}</span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-navy-900">{location.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{location.heroDescription}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:text-copper-600">
        View location
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
