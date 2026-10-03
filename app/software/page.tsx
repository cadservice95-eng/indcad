import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SoftwarePage } from "@/components/software-hub/SoftwarePage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CAD & BIM Software We Work In | Render CAD Hub",
  description:
    "AutoCAD, Revit, SolidWorks, Inventor, Tekla, MicroStation, Civil 3D, Navisworks, ArchiCAD and Fusion 360 — the CAD and BIM platforms we deliver work in.",
  path: "/software",
});

export default function SoftwareIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Software", href: "/software" }]} />
      <SoftwarePage />
    </>
  );
}
