import type { ServiceCategory } from "@/lib/types";

/**
 * Category groupings used by the header mega-menu and the /services index.
 * Every slug referenced here must exist in data/services.ts — this keeps
 * the mega-menu free of broken links even though not every sub-service
 * in the brief has its own standalone page yet.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    slug: "mechanical",
    name: "Mechanical",
    shortDescription: "Mechanical drafting, 3D CAD modelling and manufacturing documentation.",
    icon: "cog",
    services: [
      { slug: "mechanical-drafting", name: "Mechanical Drafting" },
      { slug: "3d-cad-modelling", name: "3D CAD Modelling" },
    ],
  },
  {
    slug: "structural",
    name: "Structural",
    shortDescription: "Structural drafting, steel detailing and fabrication documentation.",
    icon: "building-2",
    services: [
      { slug: "structural-drafting", name: "Structural Drafting" },
      { slug: "steel-detailing", name: "Steel Detailing" },
    ],
  },
  {
    slug: "architectural",
    name: "Architectural",
    shortDescription: "Architectural drafting, documentation sets and 3D visualisation.",
    icon: "ruler",
    services: [
      { slug: "architectural-drafting", name: "Architectural Drafting" },
      { slug: "3d-rendering", name: "3D Rendering" },
    ],
  },
  {
    slug: "civil",
    name: "Civil",
    shortDescription: "Civil drafting and construction documentation for land development.",
    icon: "map",
    services: [{ slug: "civil-drafting", name: "Civil Drafting" }],
  },
  {
    slug: "electrical",
    name: "Electrical",
    shortDescription: "Electrical schematics, single-line diagrams and switchboard drawings.",
    icon: "zap",
    services: [{ slug: "electrical-drafting", name: "Electrical Drafting" }],
  },
  {
    slug: "bim",
    name: "BIM",
    shortDescription: "Revit modelling, coordination and scan-to-BIM services.",
    icon: "boxes",
    services: [
      { slug: "bim-services", name: "BIM Modelling & Coordination" },
      { slug: "revit-modelling", name: "Revit Modelling" },
      { slug: "scan-to-bim", name: "Scan to BIM" },
    ],
  },
  {
    slug: "cad-conversion",
    name: "CAD Conversion",
    shortDescription: "PDF, scanned drawing and legacy file conversion into working CAD data.",
    icon: "file-input",
    services: [
      { slug: "cad-conversion", name: "CAD Conversion" },
      { slug: "pdf-to-cad", name: "PDF to CAD" },
    ],
  },
  {
    slug: "engineering-design",
    name: "Engineering Design",
    shortDescription: "Concept through detailed design and engineering documentation.",
    icon: "drafting-compass",
    services: [{ slug: "engineering-design", name: "Engineering Design" }],
  },
];
