import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { IndiaMap, MAP_CITIES } from "@/components/svg/IndiaMap";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

export function IndiaCoverage() {
  return (
    <section className="border-t border-neutral-200 py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Locations"
            heading="CAD & BIM Support Across India"
            description="Serving clients across India with remote CAD, BIM and engineering support."
          />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
            Work is delivered remotely from the drawings, models and reference material you share, so your project
            doesn&apos;t depend on where we sit. The cities on the map are markets we support — they are not office
            locations.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {MAP_CITIES.map((city) => (
              <li key={city.name}>
                {city.slug ? (
                  <Link
                    href={`/locations/${city.slug}`}
                    className="inline-block border border-neutral-300 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-navy-800 transition-colors hover:border-copper-500 hover:text-copper-600"
                  >
                    {city.name}
                  </Link>
                ) : (
                  <span className="inline-block border border-neutral-200 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-neutral-500">
                    {city.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/locations"
            className="mt-8 inline-block text-sm font-semibold text-navy-900 underline-offset-4 transition-colors hover:text-copper-600 hover:underline"
          >
            All locations →
          </Link>
        </Reveal>

        <InView threshold={0.3} className="relative mx-auto w-full max-w-lg overflow-hidden border border-navy-800 bg-ink-950 p-4">
          <TechnicalGrid id="india-grid" className="text-sky-300/[0.07]" minor={20} major={100} />
          <IndiaMap className="relative h-auto w-full" />
        </InView>
      </Container>
    </section>
  );
}
