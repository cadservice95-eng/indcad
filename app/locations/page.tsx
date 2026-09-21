import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container } from "@/components/ui/Container";
import { LocationCard } from "@/components/LocationCard";
import { locations } from "@/data/locations";
import { SERVICE_AREAS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CAD Drafting Services by Location | Render CAD Hub",
  description:
    "CAD drafting, BIM and engineering design services delivered remotely to clients across Mumbai, Delhi NCR, Bangalore, Pune, Chennai, Hyderabad and India-wide.",
  path: "/locations",
});

export default function LocationsIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Locations", href: "/locations" }]} />
      <PageHero
        eyebrow="Locations"
        heading="CAD Drafting Services Across India"
        description="Drafting and design work is delivered remotely from the drawings, models or reference material you provide — no site visit required. We work with clients across every state and union territory."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <LocationCard key={location.slug} location={location} />
            ))}
          </div>
          <p className="mt-8 text-sm text-neutral-500">
            Also serving: {SERVICE_AREAS.filter((a) => !locations.some((l) => l.name === a)).join(", ")}.
          </p>
        </Container>
      </section>
      <CTA variant="light" />
    </>
  );
}
