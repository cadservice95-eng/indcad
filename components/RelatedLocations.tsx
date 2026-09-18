import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocationCard } from "@/components/LocationCard";
import { getLocationBySlug } from "@/data/locations";

export function RelatedLocations({ slugs }: { slugs: string[] }) {
  const relatedLocations = slugs.map(getLocationBySlug).filter((l): l is NonNullable<typeof l> => Boolean(l));
  if (relatedLocations.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Nearby" heading="Related Locations" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedLocations.map((location) => (
            <LocationCard key={location.slug} location={location} />
          ))}
        </div>
      </Container>
    </section>
  );
}
