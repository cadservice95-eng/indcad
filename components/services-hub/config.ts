import { serviceCategories } from "@/data/service-categories";
import { services, getServiceBySlug } from "@/data/services";
import { industries } from "@/data/industries";
import { software as allSoftware } from "@/data/software";
import type { Cat } from "./visuals";

export type Svc = { slug: string; name: string; desc: string; href: string; cat: Cat };
export type Family = { slug: Cat; name: string; desc: string; href: string; services: Svc[] };

/** Single structured source: names, routes and descriptions come from the service data files. */
export const FAMILIES: Family[] = serviceCategories.map((c) => ({
  slug: c.slug as Cat, name: c.name, desc: c.shortDescription, href: `/services/${c.slug}`,
  services: c.services.map((s) => ({ slug: s.slug, name: s.name, desc: getServiceBySlug(s.slug)?.shortDescription ?? "", href: `/services/${c.slug}/${s.slug}`, cat: c.slug as Cat })),
}));
export const ALL: Svc[] = FAMILIES.flatMap((f) => f.services);
const svc = (slug: string) => ALL.find((s) => s.slug === slug)!;

/** Example project pathways (illustrative, not mandatory workflows). */
export const PATHWAYS: { title: string; steps: { l: string; slug?: string }[] }[] = [
  { title: "Product development", steps: [{ l: "Engineering Design", slug: "engineering-design" }, { l: "3D CAD Modelling", slug: "3d-cad-modelling" }, { l: "Mechanical Drafting", slug: "mechanical-drafting" }, { l: "Manufacturing documentation" }] },
  { title: "Construction", steps: [{ l: "Architectural Drafting", slug: "architectural-drafting" }, { l: "Structural Drafting", slug: "structural-drafting" }, { l: "BIM Coordination", slug: "bim-services" }, { l: "Construction documentation" }] },
  { title: "Existing building", steps: [{ l: "Scan to BIM", slug: "scan-to-bim" }, { l: "Revit Model", slug: "revit-modelling" }, { l: "BIM Coordination", slug: "bim-services" }, { l: "Documentation" }] },
  { title: "Legacy drawings", steps: [{ l: "PDF", slug: "pdf-to-cad" }, { l: "CAD Conversion", slug: "cad-conversion" }, { l: "Mechanical / Architectural / Structural documentation" }] },
];

export const CHOICES: { q: string; to: string[]; note?: string }[] = [
  { q: "Starting with a concept?", to: ["engineering-design"] },
  { q: "Need a 3D model?", to: ["3d-cad-modelling"] },
  { q: "Need 2D drawings?", to: ["mechanical-drafting", "structural-drafting", "architectural-drafting", "civil-drafting", "electrical-drafting"], note: "Pick the drafting service for your discipline." },
  { q: "Need BIM?", to: ["bim-services", "revit-modelling"] },
  { q: "Have a point cloud?", to: ["scan-to-bim"] },
  { q: "Have a PDF?", to: ["pdf-to-cad", "cad-conversion"] },
  { q: "Need structural steel drawings?", to: ["steel-detailing"] },
  { q: "Need architectural visualisation?", to: ["3d-rendering"] },
];

export const OUTPUTS = ["3D CAD", "Drafting", "BIM Model", "Coordinated Documentation", "Engineering Documentation", "Rendered Visualisation", "Manufacturing Documentation"] as const;
const OUT: Record<string, (typeof OUTPUTS)[number][]> = {
  "mechanical-drafting": ["Drafting", "Manufacturing Documentation"], "3d-cad-modelling": ["3D CAD"], "structural-drafting": ["Drafting"], "steel-detailing": ["Drafting", "Manufacturing Documentation"],
  "architectural-drafting": ["Drafting"], "3d-rendering": ["Rendered Visualisation"], "civil-drafting": ["Drafting"], "electrical-drafting": ["Drafting"],
  "bim-services": ["BIM Model", "Coordinated Documentation"], "revit-modelling": ["BIM Model"], "scan-to-bim": ["BIM Model"],
  "cad-conversion": ["Drafting"], "pdf-to-cad": ["Drafting"], "engineering-design": ["Engineering Documentation", "3D CAD"],
};
export const INPUTS: { l: string; to: string[] }[] = [
  { l: "Concept", to: ["engineering-design", "3d-cad-modelling"] },
  { l: "Sketch", to: ["architectural-drafting", "mechanical-drafting", "3d-cad-modelling"] },
  { l: "Existing CAD", to: ["mechanical-drafting", "structural-drafting", "architectural-drafting", "civil-drafting", "electrical-drafting", "steel-detailing"] },
  { l: "PDF", to: ["pdf-to-cad", "cad-conversion"] },
  { l: "Scan / Point Cloud", to: ["scan-to-bim", "revit-modelling"] },
  { l: "BIM Model", to: ["bim-services", "3d-rendering", "revit-modelling"] },
  { l: "Engineering Brief", to: ["engineering-design", "3d-cad-modelling", "mechanical-drafting"] },
];
export const outputsOf = (slugs: string[]) => OUTPUTS.filter((o) => slugs.some((s) => OUT[s]?.includes(o)));
export const svcOf = (slug: string) => svc(slug);

/** Entry points for the lifecycle diagram. */
export const LIFECYCLE = ["Concept", "Design", "3D Model", "Drafting", "BIM / Coordination", "Conversion / Documentation", "Manufacturing / Construction"];
export const ENTRIES = [{ l: "Concept", at: 0 }, { l: "Existing CAD", at: 3 }, { l: "PDF", at: 5 }, { l: "Point Cloud", at: 4 }];

/** Software shown on the page (only titles already on the site), linked to the services whose data lists them. */
export const ECO = ["autocad", "solidworks", "inventor", "fusion-360", "revit", "tekla", "navisworks", "civil-3d", "archicad"].flatMap((s) => {
  const sw = allSoftware.find((x) => x.slug === s);
  return sw ? [{ slug: sw.slug, name: sw.name, category: sw.category, services: services.filter((v) => v.software.includes(s)).map((v) => v.name) }] : [];
});

/** Formats only where a service's own content mentions them. */
const FORMATS = ["DWG", "DXF", "RVT", "IFC", "STEP", "IGES", "STL", "PDF", "NWD", "DGN"];
export const FORMATS_BY_SERVICE = services.flatMap((v) => {
  const txt = JSON.stringify([v.deliverables, v.shortDescription, v.heroDescription, v.overview, v.faqs]);
  const found = FORMATS.filter((f) => new RegExp(`\\b${f}\\b`).test(txt));
  return found.length ? [{ name: v.name, href: `/services/${v.category}/${v.slug}`, formats: found }] : [];
});
export const FORMAT_LIST = FORMATS.filter((f) => FORMATS_BY_SERVICE.some((x) => x.formats.includes(f)));

export const INDUSTRY_LINKS = industries.map((i) => ({ slug: i.slug, name: i.name, services: i.services.flatMap((s) => { const v = ALL.find((x) => x.slug === s); return v ? [v] : []; }) }));
