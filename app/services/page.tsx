import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServicesHubPage } from "@/components/services-hub/HubPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CAD & Engineering Services India | Render CAD Hub",
  description:
    "Mechanical, structural, architectural, civil and electrical drafting, plus BIM, CAD conversion and engineering design services across India.",
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
      <ServicesHubPage />
    </>
  );
}
