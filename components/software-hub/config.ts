import { software } from "@/data/software";
import { getServiceBySlug } from "@/data/services";
import { getIndustryBySlug } from "@/data/industries";
import type { FAQItem } from "@/lib/types";

type Link = { name: string; href: string };
export type Platform = {
  slug: string; name: string; category: string; summary: string; href: string;
  group: string; tags: string[]; chain: string[]; workflow: string; output: string;
  services: Link[]; industries: Link[];
};

/** Additional navigation layer only — the cards always show the category from the data. */
export const GROUPS = ["CAD / Drafting", "BIM", "Mechanical CAD", "Structural / BIM", "Civil"] as const;

/** Per-platform extras. Tags, chains and outputs paraphrase each platform's own "used for" and deliverables data. */
const EXTRA: Record<string, { group: (typeof GROUPS)[number]; tags: string[]; chain: string[]; workflow: string; output: string }> = {
  autocad: { group: "CAD / Drafting", tags: ["2D drafting", "Layouts", "Standards", "Conversion"], chain: ["Geometry", "Dimensions & layers", "Drawing set", "DWG documentation"], workflow: "Drafting", output: "DWG drawing sets" },
  microstation: { group: "CAD / Drafting", tags: ["DGN", "Infrastructure", "Utilities", "Conversion"], chain: ["Base drawing", "Levels & linework", "Infrastructure documentation", "DGN / DWG"], workflow: "Conversion & documentation", output: "Converted DGN / DWG drawings" },
  revit: { group: "BIM", tags: ["Architectural", "Structural", "MEP", "Coordination"], chain: ["BIM modelling", "Discipline models", "Coordinated model", "Sheets & schedules"], workflow: "BIM modelling & coordination", output: "Revit models · model-derived sheets" },
  archicad: { group: "BIM", tags: ["Architectural BIM", "Documentation", "3D visualisation"], chain: ["Building concept", "3D architectural model", "Drawing set", "Renders"], workflow: "Architectural BIM", output: "ArchiCAD models · drawing sets" },
  solidworks: { group: "Mechanical CAD", tags: ["Parts", "Assemblies", "Sheet metal", "Documentation"], chain: ["3D CAD model", "Assembly", "Drawings & BOM", "Manufacturing documentation"], workflow: "3D CAD modelling", output: "Parametric models · STEP / IGES" },
  inventor: { group: "Mechanical CAD", tags: ["Product design", "Assemblies", "Weldments", "Drawings"], chain: ["Parts", "Assembly constraints", "Engineering drawing", "Manufacturing documentation"], workflow: "Assembly modelling", output: "Parametric models · assembly drawings" },
  "fusion-360": { group: "Mechanical CAD", tags: ["Product design", "Parametric", "Manufacturing drawings"], chain: ["Concept", "3D model", "Refinement", "Manufacturing drawings"], workflow: "Product design", output: "3D CAD models · drawings" },
  tekla: { group: "Structural / BIM", tags: ["Steel", "Connections", "Shop drawings", "Erection"], chain: ["Steel model", "Connection detail", "Piece marks", "Shop & erection drawings"], workflow: "Steel detailing", output: "Tekla models · shop & erection drawings" },
  navisworks: { group: "Structural / BIM", tags: ["Federation", "Clash detection", "Model review"], chain: ["Discipline models", "Federated model", "Coordination check", "Issue log & viewpoints"], workflow: "BIM coordination", output: "Federated models · clash reports" },
  "civil-3d": { group: "Civil", tags: ["Surfaces", "Grading", "Roads", "Stormwater"], chain: ["Survey points", "Surface", "Grading", "Road / drainage", "Construction documentation"], workflow: "Civil design documentation", output: "Surfaces · construction drawing sets" },
};

/** Single structured source for every component on the page. */
export const PLATFORMS: Platform[] = software.map((s) => ({
  slug: s.slug, name: s.name, category: s.category, summary: s.summary, href: `/software/${s.slug}`, ...EXTRA[s.slug],
  services: s.relatedServices.flatMap((x) => { const v = getServiceBySlug(x); return v ? [{ name: v.name, href: `/services/${v.category}/${v.slug}` }] : []; }),
  industries: s.relatedIndustries.flatMap((x) => { const v = getIndustryBySlug(x); return v ? [{ name: v.name, href: `/industries/${v.slug}` }] : []; }),
}));
export const CATEGORIES = Array.from(new Set(PLATFORMS.map((p) => p.category)));
export const byGroup = (g: string) => PLATFORMS.filter((p) => p.group === g);

export const HERO_CYCLE = ["autocad", "revit", "solidworks", "tekla", "civil-3d", "navisworks"];

export const NATIVE = ["Client project", "Existing CAD / BIM environment", "Render CAD Hub", "Modelling / drafting / coordination", "Native project deliverable", "Back into your workflow"];

export const STEPS: { t: string; d: string }[] = [
  { t: "Project input", d: "Existing drawings, models, references or project requirements." },
  { t: "Platform review", d: "Understand the software environment, standards and required output." },
  { t: "CAD / BIM production", d: "Drafting, modelling, detailing, conversion or coordination." },
  { t: "Technical review", d: "Review geometry, documentation structure and project-specific requirements." },
  { t: "Deliverable", d: "Return the relevant project files and documentation for the agreed workflow." },
];

const svc = (slug: string): Link => { const v = getServiceBySlug(slug)!; return { name: v.name, href: `/services/${v.category}/${v.slug}` }; };
export const SCENARIOS = [
  { k: "01", title: "Mechanical project", flow: ["3D component", "Assembly", "Drawing"], visual: "inventor", platforms: ["solidworks", "inventor", "fusion-360", "autocad"], services: ["3d-cad-modelling", "mechanical-drafting", "engineering-design"].map(svc) },
  { k: "02", title: "Building project", flow: ["Architectural model", "Structural model", "MEP", "Coordinated BIM"], visual: "navisworks", platforms: ["revit", "navisworks", "archicad", "tekla"], services: ["bim-services", "revit-modelling", "architectural-drafting", "structural-drafting"].map(svc) },
  { k: "03", title: "Civil project", flow: ["Survey", "Terrain", "Road", "Drainage", "Documentation"], visual: "civil-3d", platforms: ["civil-3d", "autocad"], services: ["civil-drafting"].map(svc) },
];

export const FAQS: FAQItem[] = [
  { question: "Can you work with the CAD or BIM platform our project already uses?", answer: "Yes — that is the starting point. We work in the platform your team already uses across the ten platforms listed on this page, and deliver native files intended to drop back into your workflow. Tell us the platform and version when you request a quote so we can confirm the set-up." },
  { question: "Do you work with both 2D CAD and 3D CAD?", answer: "Yes. AutoCAD and MicroStation cover 2D drafting and documentation, SolidWorks, Inventor and Fusion 360 cover parametric 3D part and assembly modelling, and Revit, ArchiCAD and Tekla Structures cover BIM modelling with model-derived drawings." },
  { question: "Can you work with an existing Revit model?", answer: "Yes. Existing Revit models can be developed, documented or coordinated through our Revit Modelling and BIM Modelling & Coordination services, with model-derived sheets and schedules where the project needs them." },
  { question: "Can you work from existing AutoCAD drawings?", answer: "Yes. Existing DWG drawings can be revised, standardised or developed further through the relevant drafting service — mechanical, architectural, structural, civil or electrical — and legacy or inconsistent drawings can be cleaned up through CAD Conversion." },
  { question: "Which software is used for structural steel detailing?", answer: "Steel Detailing is delivered in Tekla Structures and AutoCAD, producing shop and erection drawings, connection details and material or bolt lists depending on the project." },
  { question: "Can you convert drawings between CAD platforms?", answer: "Our CAD Conversion service covers converting PDF, scanned and legacy drawings into editable native CAD, including DGN and DWG drawings with MicroStation and AutoCAD. PDF drawings can also be rebuilt as layered DWG files through PDF to CAD." },
  { question: "Can you coordinate models from multiple BIM platforms?", answer: "Navisworks is used to federate multi-disciplinary models into a single review environment and run clash detection. How well a given model federates depends on the source platform and export settings, so we review the models before coordination starts." },
  { question: "Can you work from existing models rather than starting from scratch?", answer: "Often, yes. Depending on the service, the project input can include existing drawings, models, point clouds or references, and the work continues from that rather than restarting the design." },
];
