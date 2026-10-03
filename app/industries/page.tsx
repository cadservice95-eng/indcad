import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IndustriesPage } from "@/components/industries/IndustriesPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Support | CAD, BIM & Engineering Design | Render CAD Hub",
  description:
    "Drafting, BIM and engineering design support for construction, manufacturing, mining, oil & gas, automotive, defence, aerospace and energy projects.",
  path: "/industries",
});

export default function IndustriesIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Industries", href: "/industries" }]} />
      <IndustriesPage />
    </>
  );
}
