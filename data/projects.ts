import type { Project } from "@/lib/types";

/**
 * NOTE: All projects below are clearly-labelled placeholder case studies
 * (isPlaceholder: true). No real client names, locations, outcomes or
 * figures are implied. Replace with real project data as it becomes
 * available, and set isPlaceholder to false once verified.
 */
export const projects: Project[] = [
  {
    slug: "sheet-metal-enclosure-fabrication-drawings",
    title: "Sheet Metal Enclosure Fabrication Drawings",
    discipline: "mechanical",
    industry: "manufacturing",
    isPlaceholder: true,
    summary:
      "Illustrative example: a fabrication drawing package for a sheet metal equipment enclosure, produced from concept sketches through to workshop-ready documentation.",
    challenge:
      "A manufacturer needed a full fabrication drawing set for a new equipment enclosure, developed from initial concept sketches, with flat patterns ready for the workshop's nesting software.",
    scope: [
      "3D modelling of the enclosure and internal mounting structure",
      "Sheet metal flat pattern development",
      "Fabrication and assembly drawings with BOM",
    ],
    process:
      "The enclosure was modelled as a sheet metal part in native CAD, with bend allowances confirmed against the workshop's press brake tooling before flat patterns were finalised.",
    deliverables: ["3D CAD model", "Sheet metal flat patterns", "Fabrication drawings", "Assembly drawing with BOM"],
    software: ["solidworks", "autocad"],
    outcome:
      "The completed drawing package gave the workshop a direct path from design to fabrication, with flat patterns ready for nesting and cutting without further rework.",
    gallery: [
      { alt: "Placeholder: 3D CAD model of a sheet metal enclosure", placeholder: true },
      { alt: "Placeholder: fabrication drawing of enclosure flat pattern", placeholder: true },
    ],
    relatedServices: ["mechanical-drafting", "3d-cad-modelling"],
    seoTitle: "Sheet Metal Enclosure Fabrication Drawings — Project Example | IndCAD",
    seoDescription: "Example mechanical drafting project: fabrication drawings and flat patterns for a sheet metal equipment enclosure.",
  },
  {
    slug: "legacy-machine-part-reverse-engineering",
    title: "Legacy Machine Part Reverse Engineering",
    discipline: "mechanical",
    industry: "defence",
    isPlaceholder: true,
    summary:
      "Illustrative example: reverse engineering an undocumented legacy machine component into an accurate 3D model and manufacturing drawing.",
    challenge:
      "A legacy machine component had no existing digital documentation, and a replacement part was needed for an ongoing sustainment program.",
    scope: [
      "Physical measurement and reference dimensioning",
      "3D model reconstruction",
      "Production of a manufacturing-ready drawing",
    ],
    process:
      "The physical part was measured and modelled in 3D, with tolerances applied based on fit and function against the original assembly before the manufacturing drawing was finalised.",
    deliverables: ["3D CAD model", "Manufacturing drawing", "Tolerance analysis notes"],
    software: ["solidworks"],
    outcome:
      "The resulting model and drawing gave the client a manufacturable, documented replacement part where none had existed previously.",
    gallery: [
      { alt: "Placeholder: reverse-engineered 3D model of a legacy machine part", placeholder: true },
    ],
    relatedServices: ["mechanical-drafting", "3d-cad-modelling"],
    seoTitle: "Legacy Machine Part Reverse Engineering — Project Example | IndCAD",
    seoDescription: "Example reverse engineering project: 3D model and manufacturing drawing produced from an undocumented legacy part.",
  },
  {
    slug: "warehouse-structural-steel-shop-drawings",
    title: "Warehouse Structural Steel Shop Drawings",
    discipline: "structural",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: shop and erection drawings for a structural steel warehouse frame, detailed from a structural engineer's design.",
    challenge:
      "A steel fabricator needed a complete shop and erection drawing set for a warehouse structure, detailed from the structural engineer's design documentation.",
    scope: [
      "Structural steel detailing in Tekla Structures",
      "Connection and bolt detailing",
      "Erection drawing sequencing",
    ],
    process:
      "The structural model was built from the engineer's design and calculations, with connections detailed to standard fabrication practice before shop and erection drawings were issued.",
    deliverables: ["Tekla structural model", "Shop drawings", "Erection drawings", "Material take-off"],
    software: ["tekla"],
    outcome:
      "The fabricator received a coordinated shop and erection drawing set ready for pricing, fabrication and site sequencing.",
    gallery: [
      { alt: "Placeholder: structural steel shop drawing for a warehouse frame", placeholder: true },
      { alt: "Placeholder: Tekla structural model of a warehouse structure", placeholder: true },
    ],
    relatedServices: ["steel-detailing", "structural-drafting"],
    seoTitle: "Warehouse Structural Steel Shop Drawings — Project Example | IndCAD",
    seoDescription: "Example structural detailing project: shop and erection drawings for a structural steel warehouse frame.",
  },
  {
    slug: "processing-plant-platform-structural-detailing",
    title: "Processing Plant Platform Structural Detailing",
    discipline: "structural",
    industry: "mining",
    isPlaceholder: true,
    summary:
      "Illustrative example: structural detailing of an access platform and walkway system for a mineral processing plant.",
    challenge:
      "A processing plant upgrade required structural documentation for a new access platform and walkway system, coordinated against existing plant structures.",
    scope: [
      "Structural steel detailing for platforms and walkways",
      "Coordination against existing plant structure drawings",
      "Fabrication and erection drawing production",
    ],
    process:
      "Existing plant drawings were reviewed and reconciled against current site conditions before the new platform structure was detailed and issued for fabrication.",
    deliverables: ["Structural steel shop drawings", "Erection drawings", "Coordination notes against existing structures"],
    software: ["tekla", "autocad"],
    outcome:
      "The client received fabrication-ready structural documentation coordinated with existing plant infrastructure, supporting installation within a planned shutdown window.",
    gallery: [
      { alt: "Placeholder: structural drawing of a processing plant access platform", placeholder: true },
    ],
    relatedServices: ["steel-detailing", "structural-drafting", "cad-conversion"],
    seoTitle: "Processing Plant Platform Structural Detailing — Project Example | IndCAD",
    seoDescription: "Example structural drafting project: platform and walkway detailing for a mineral processing plant upgrade.",
  },
  {
    slug: "residential-subdivision-civil-documentation",
    title: "Residential Subdivision Civil Documentation",
    discipline: "civil",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: civil construction documentation for a residential subdivision, covering road, stormwater and site works.",
    challenge:
      "A developer required a full civil construction documentation set for a residential subdivision, coordinated with the civil engineer's design and council approval requirements.",
    scope: [
      "Site and subdivision plan drafting",
      "Road and stormwater design drawings",
      "Civil 3D model and surface development",
    ],
    process:
      "Survey and engineering design data were used to build a Civil 3D model, from which construction drawings were produced to meet the relevant council's documentation requirements.",
    deliverables: ["Civil 3D model", "Road and stormwater drawings", "Construction documentation set"],
    software: ["civil-3d"],
    outcome:
      "The documentation set supported the subdivision through council approval and into construction.",
    gallery: [
      { alt: "Placeholder: civil construction drawing for a residential subdivision", placeholder: true },
    ],
    relatedServices: ["civil-drafting"],
    seoTitle: "Residential Subdivision Civil Documentation — Project Example | IndCAD",
    seoDescription: "Example civil drafting project: road, stormwater and site documentation for a residential subdivision.",
  },
  {
    slug: "site-access-road-and-drainage-design",
    title: "Site Access Road & Drainage Design",
    discipline: "civil",
    industry: "energy",
    isPlaceholder: true,
    summary:
      "Illustrative example: access road and drainage design documentation for an energy infrastructure site.",
    challenge:
      "An energy infrastructure project required access road and drainage design documentation for a new site, coordinated with the project's civil engineering design.",
    scope: [
      "Access road alignment and grading drawings",
      "Stormwater and drainage design",
      "Construction documentation set",
    ],
    process:
      "Site survey data was modelled in Civil 3D, with road and drainage design developed to the project engineer's specification before construction drawings were issued.",
    deliverables: ["Civil 3D model", "Road and drainage drawings", "Construction documentation"],
    software: ["civil-3d", "autocad"],
    outcome:
      "The client received a coordinated access road and drainage documentation set ready for construction tender.",
    gallery: [
      { alt: "Placeholder: civil drawing of a site access road and drainage layout", placeholder: true },
    ],
    relatedServices: ["civil-drafting"],
    seoTitle: "Site Access Road & Drainage Design — Project Example | IndCAD",
    seoDescription: "Example civil engineering project: access road and drainage design documentation for an energy infrastructure site.",
  },
  {
    slug: "residential-renovation-construction-drawings",
    title: "Residential Renovation Construction Drawings",
    discipline: "architectural",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: a full renovation and extension drawing set produced from a designer's concept sketches.",
    challenge:
      "A building designer needed a complete construction documentation set for a residential renovation and extension, developed from concept floor plans and site survey.",
    scope: [
      "Existing and proposed floor plan drafting",
      "Elevations and sections",
      "Construction documentation for building approval",
    ],
    process:
      "Concept drawings and site survey were used to produce coordinated existing and proposed plans, with elevations and sections developed through to a construction-ready set.",
    deliverables: ["Floor plans", "Elevations and sections", "Construction documentation set"],
    software: ["autocad", "revit"],
    outcome:
      "The completed drawing set supported the renovation through building approval and into construction.",
    gallery: [
      { alt: "Placeholder: architectural floor plan of a residential renovation", placeholder: true },
    ],
    relatedServices: ["architectural-drafting", "3d-rendering"],
    seoTitle: "Residential Renovation Construction Drawings — Project Example | IndCAD",
    seoDescription: "Example architectural drafting project: renovation and extension construction documentation.",
  },
  {
    slug: "retail-fitout-documentation-and-3d-render",
    title: "Retail Fit-Out Documentation & 3D Render",
    discipline: "architectural",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: retail fit-out drawing set and 3D render package produced for a client presentation and construction approval.",
    challenge:
      "A retail design studio needed a fit-out drawing set and presentation-quality 3D renders to support a client pitch and subsequent construction approval.",
    scope: [
      "Retail fit-out drawing production",
      "Joinery and finish schedules",
      "3D model and still render package",
    ],
    process:
      "Design drawings were developed into a coordinated fit-out set, with a 3D model built from the same documentation used to produce presentation renders.",
    deliverables: ["Fit-out drawings", "Joinery and finish schedules", "3D renders"],
    software: ["revit", "autocad"],
    outcome:
      "The design studio used the render package for client presentation, with the underlying drawing set carried through to construction approval.",
    gallery: [
      { alt: "Placeholder: 3D render of a retail fit-out interior", placeholder: true },
    ],
    relatedServices: ["3d-rendering", "architectural-drafting"],
    seoTitle: "Retail Fit-Out Documentation & 3D Render — Project Example | IndCAD",
    seoDescription: "Example architectural project: retail fit-out drawing set and 3D visualisation package.",
  },
  {
    slug: "switchboard-and-control-panel-drawings",
    title: "Switchboard & Control Panel Drawings",
    discipline: "electrical",
    industry: "manufacturing",
    isPlaceholder: true,
    summary:
      "Illustrative example: switchboard and control panel drawing package produced for a panel builder.",
    challenge:
      "A panel builder needed switchboard and control panel drawings produced to a consistent standard ahead of a build run.",
    scope: [
      "Single-line diagram development",
      "Switchboard layout drawings",
      "Control panel schematics and cable schedules",
    ],
    process:
      "Equipment schedules and design intent were used to produce single-line diagrams, layout drawings and schematics to a consistent, buildable standard.",
    deliverables: ["Single-line diagrams", "Switchboard drawings", "Control panel schematics", "Cable schedules"],
    software: ["autocad"],
    outcome:
      "The panel builder received a complete, consistent drawing package ready for the build run.",
    gallery: [
      { alt: "Placeholder: electrical schematic of a switchboard layout", placeholder: true },
    ],
    relatedServices: ["electrical-drafting"],
    seoTitle: "Switchboard & Control Panel Drawings — Project Example | IndCAD",
    seoDescription: "Example electrical drafting project: switchboard layout and control panel schematic drawing package.",
  },
  {
    slug: "as-built-electrical-documentation",
    title: "As-Built Electrical Documentation",
    discipline: "electrical",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: as-built electrical schematics produced to match a completed site installation.",
    challenge:
      "A contractor needed as-built electrical documentation produced to match what was actually installed on site, ahead of project close-out.",
    scope: [
      "Site information review",
      "As-built schematic and layout drawing production",
      "Cable schedule reconciliation",
    ],
    process:
      "Site markups and installation records were used to update the original design drawings into an accurate as-built set.",
    deliverables: ["As-built schematics", "As-built layout drawings", "Updated cable schedules"],
    software: ["autocad"],
    outcome:
      "The contractor received a reconciled as-built documentation set for project close-out and facilities handover.",
    gallery: [
      { alt: "Placeholder: as-built electrical schematic drawing", placeholder: true },
    ],
    relatedServices: ["electrical-drafting", "cad-conversion"],
    seoTitle: "As-Built Electrical Documentation — Project Example | IndCAD",
    seoDescription: "Example electrical drafting project: as-built schematic and layout documentation for project close-out.",
  },
  {
    slug: "multi-discipline-bim-clash-detection",
    title: "Multi-Discipline BIM Clash Detection",
    discipline: "bim",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: federated model coordination and clash detection across architectural, structural and MEP models.",
    challenge:
      "A construction project needed architectural, structural and MEP models coordinated and checked for clashes ahead of issue-for-construction.",
    scope: [
      "Model federation in Navisworks",
      "Clash detection across disciplines",
      "Clash report issue and resolution tracking",
    ],
    process:
      "Discipline models were federated and run through clash detection, with a structured report issued to the design team for resolution before re-checking.",
    deliverables: ["Federated coordination model", "Clash detection reports", "Resolution tracking notes"],
    software: ["navisworks", "revit"],
    outcome:
      "Clashes were identified and resolved by the design team ahead of construction issue, rather than being discovered on site.",
    gallery: [
      { alt: "Placeholder: federated BIM model showing clash detection markers", placeholder: true },
    ],
    relatedServices: ["bim-services", "revit-modelling"],
    seoTitle: "Multi-Discipline BIM Clash Detection — Project Example | IndCAD",
    seoDescription: "Example BIM coordination project: federated model review and clash detection across architectural, structural and MEP disciplines.",
  },
  {
    slug: "point-cloud-to-bim-existing-building",
    title: "Point Cloud to BIM — Existing Building",
    discipline: "bim",
    industry: "construction",
    isPlaceholder: true,
    summary:
      "Illustrative example: converting laser scan data of an existing building into a working Revit model for a renovation project.",
    challenge:
      "A design team needed an accurate BIM model of an existing building with no current digital documentation, ahead of a planned renovation.",
    scope: [
      "Point cloud data review and registration check",
      "Architectural and structural Revit modelling from scan data",
      "Model-derived drawing production",
    ],
    process:
      "Supplied point cloud data was used to model the existing building directly in Revit, checked against the scan for dimensional accuracy before drawings were derived.",
    deliverables: ["As-built Revit model", "Model-derived 2D drawings"],
    software: ["revit", "navisworks"],
    outcome:
      "The design team received a working as-built model to design the renovation from, in place of the missing original documentation.",
    gallery: [
      { alt: "Placeholder: point cloud scan data alongside a modelled Revit building", placeholder: true },
    ],
    relatedServices: ["scan-to-bim", "bim-services"],
    seoTitle: "Point Cloud to BIM Existing Building — Project Example | IndCAD",
    seoDescription: "Example scan-to-BIM project: converting point cloud scan data of an existing building into a working Revit model.",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByDiscipline(discipline: string) {
  return projects.filter((project) => project.discipline === discipline);
}
