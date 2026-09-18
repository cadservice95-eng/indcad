import type { ProjectCategorySlug } from "@/lib/types";

export const projectCategories: {
  slug: ProjectCategorySlug;
  name: string;
  description: string;
}[] = [
  { slug: "mechanical", name: "Mechanical", description: "Mechanical drafting, 3D CAD modelling and manufacturing documentation projects." },
  { slug: "structural", name: "Structural", description: "Structural drafting, steel detailing and structural BIM projects." },
  { slug: "civil", name: "Civil", description: "Civil drafting and construction documentation for land development and site works." },
  { slug: "architectural", name: "Architectural", description: "Architectural drafting, documentation and 3D visualisation projects." },
  { slug: "electrical", name: "Electrical", description: "Electrical schematics, switchboard and control panel drawing projects." },
  { slug: "bim", name: "BIM", description: "BIM modelling, coordination and clash detection projects." },
];

export function getProjectCategory(slug: string) {
  return projectCategories.find((category) => category.slug === slug);
}
