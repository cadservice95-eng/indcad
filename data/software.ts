import type { Software } from "@/lib/types";

export const software: Software[] = [
  {
    slug: "autocad",
    name: "AutoCAD",
    category: "2D / 3D CAD",
    summary:
      "Industry-standard 2D drafting and documentation software used across mechanical, structural, architectural, civil and electrical drafting.",
    usedFor: [
      "2D drawing production and documentation",
      "Drawing standardisation across a project or drawing register",
      "CAD conversion and legacy drawing digitisation",
      "General arrangement and layout drawings",
    ],
    deliverables: ["2D DWG drawing sets", "Title blocks and drawing templates", "Layered, standards-compliant drawings"],
    relatedServices: ["mechanical-drafting", "structural-drafting", "architectural-drafting", "civil-drafting", "electrical-drafting", "cad-conversion", "pdf-to-cad"],
    relatedIndustries: ["manufacturing", "construction", "mining", "energy"],
    seoTitle: "AutoCAD Drafting Services India | IndCAD",
    seoDescription: "AutoCAD drafting services across mechanical, structural, architectural, civil and electrical disciplines for Indian projects.",
  },
  {
    slug: "revit",
    name: "Revit",
    category: "BIM",
    summary:
      "Building Information Modelling software used for coordinated architectural, structural and MEP modelling and documentation.",
    usedFor: [
      "Architectural, structural and MEP BIM modelling",
      "Multi-disciplinary design coordination",
      "Model-derived drawing sheets and schedules",
      "Scan-to-BIM conversion",
    ],
    deliverables: ["Coordinated Revit models", "Model-derived drawing sets", "Revit families", "Federated models for clash detection"],
    relatedServices: ["bim-services", "revit-modelling", "scan-to-bim", "architectural-drafting", "3d-rendering"],
    relatedIndustries: ["construction", "manufacturing", "energy"],
    seoTitle: "Revit Modelling Services India | IndCAD",
    seoDescription: "Revit BIM modelling and coordination services across architectural, structural and MEP disciplines for Indian projects.",
  },
  {
    slug: "solidworks",
    name: "SolidWorks",
    category: "Mechanical CAD",
    summary:
      "Parametric 3D mechanical CAD software used for part and assembly modelling, sheet metal design and manufacturing documentation.",
    usedFor: [
      "Parametric part and assembly modelling",
      "Sheet metal design and flat pattern development",
      "Manufacturing drawing production",
      "Reverse engineering",
    ],
    deliverables: ["Parametric 3D models", "Sheet metal flat patterns", "Assembly drawings and BOMs", "STEP/IGES exports"],
    relatedServices: ["3d-cad-modelling", "mechanical-drafting", "engineering-design"],
    relatedIndustries: ["manufacturing", "automotive", "defence", "aerospace"],
    seoTitle: "SolidWorks Design & Drafting Services India | IndCAD",
    seoDescription: "SolidWorks 3D CAD modelling and drafting services for manufacturers, fabricators and product designers in India.",
  },
  {
    slug: "inventor",
    name: "Inventor",
    category: "Mechanical CAD",
    summary:
      "Parametric 3D mechanical CAD software used for product design, assembly modelling and manufacturing documentation.",
    usedFor: [
      "Parametric part and assembly modelling",
      "Product design and development",
      "Manufacturing drawing production",
      "Sheet metal design",
    ],
    deliverables: ["Parametric 3D models", "Assembly drawings and BOMs", "Manufacturing drawings", "Neutral format exports"],
    relatedServices: ["3d-cad-modelling", "mechanical-drafting", "engineering-design"],
    relatedIndustries: ["manufacturing", "automotive", "aerospace"],
    seoTitle: "Autodesk Inventor Design & Drafting Services India | IndCAD",
    seoDescription: "Inventor 3D CAD modelling and mechanical drafting services for Indian manufacturers and product design teams.",
  },
  {
    slug: "tekla",
    name: "Tekla Structures",
    category: "Structural BIM",
    summary:
      "Structural detailing software used for structural steel and concrete shop drawings, erection drawings and structural BIM models.",
    usedFor: [
      "Structural steel shop and erection drawings",
      "Connection and bolt detailing",
      "Structural BIM modelling",
      "Material take-offs",
    ],
    deliverables: ["Tekla structural models", "Shop and erection drawings", "Material take-offs and bolt lists"],
    relatedServices: ["steel-detailing", "structural-drafting", "bim-services"],
    relatedIndustries: ["construction", "mining", "manufacturing"],
    seoTitle: "Tekla Structural Detailing Services India | IndCAD",
    seoDescription: "Tekla Structures steel detailing and structural BIM services — shop drawings, erection drawings and material take-offs.",
  },
  {
    slug: "microstation",
    name: "MicroStation",
    category: "2D / 3D CAD",
    summary:
      "CAD platform commonly used in infrastructure and utilities projects, supported for drawing conversion and documentation.",
    usedFor: [
      "DGN file conversion and drafting",
      "Infrastructure and utilities documentation",
      "Legacy drawing digitisation",
    ],
    deliverables: ["Converted DGN/DWG drawings", "Standardised drawing sets"],
    relatedServices: ["cad-conversion", "civil-drafting"],
    relatedIndustries: ["construction", "energy"],
    seoTitle: "MicroStation Drafting & Conversion Services India | IndCAD",
    seoDescription: "MicroStation drawing conversion and drafting support for infrastructure and utilities projects in India.",
  },
  {
    slug: "civil-3d",
    name: "Civil 3D",
    category: "Civil CAD",
    summary:
      "Civil engineering design software used for site, subdivision, road and stormwater design and construction documentation.",
    usedFor: [
      "Site and subdivision design",
      "Road and stormwater design",
      "Earthworks and grading",
      "Construction documentation",
    ],
    deliverables: ["Civil 3D models and surfaces", "Construction drawing sets", "Grading and stormwater plans"],
    relatedServices: ["civil-drafting"],
    relatedIndustries: ["construction", "mining", "energy"],
    seoTitle: "Civil 3D Drafting & Design Services India | IndCAD",
    seoDescription: "Civil 3D drafting and design services for land development, subdivision and site infrastructure projects in India.",
  },
  {
    slug: "navisworks",
    name: "Navisworks",
    category: "BIM Coordination",
    summary:
      "Model review and coordination software used for federating multi-disciplinary BIM models and running clash detection.",
    usedFor: [
      "Federated model review",
      "Clash detection across disciplines",
      "Construction sequencing review",
    ],
    deliverables: ["Federated coordination models", "Clash detection reports"],
    relatedServices: ["bim-services", "revit-modelling", "scan-to-bim"],
    relatedIndustries: ["construction", "manufacturing", "energy"],
    seoTitle: "Navisworks Clash Detection & Coordination Services India | IndCAD",
    seoDescription: "Navisworks-based BIM coordination and clash detection services for multi-disciplinary construction projects.",
  },
  {
    slug: "archicad",
    name: "ArchiCAD",
    category: "Architectural BIM",
    summary:
      "Architectural BIM software used for building design documentation and 3D architectural modelling.",
    usedFor: [
      "Architectural BIM modelling",
      "Construction documentation",
      "3D architectural visualisation",
    ],
    deliverables: ["ArchiCAD BIM models", "Architectural drawing sets", "3D renders"],
    relatedServices: ["architectural-drafting", "3d-rendering"],
    relatedIndustries: ["construction"],
    seoTitle: "ArchiCAD Modelling & Drafting Services India | IndCAD",
    seoDescription: "ArchiCAD architectural modelling and drafting services for Indian architectural practices and builders.",
  },
  {
    slug: "fusion-360",
    name: "Fusion 360",
    category: "Mechanical CAD",
    summary:
      "Cloud-based 3D CAD platform used for product design, mechanical modelling and manufacturing documentation.",
    usedFor: [
      "Product design and development",
      "Parametric 3D modelling",
      "Manufacturing drawing production",
    ],
    deliverables: ["3D CAD models", "Manufacturing drawings", "Neutral format exports"],
    relatedServices: ["3d-cad-modelling", "mechanical-drafting", "engineering-design"],
    relatedIndustries: ["manufacturing", "automotive", "aerospace"],
    seoTitle: "Fusion 360 Design & Drafting Services India | IndCAD",
    seoDescription: "Fusion 360 3D CAD modelling and drafting services for product design and manufacturing projects in India.",
  },
];

export function getSoftwareBySlug(slug: string) {
  return software.find((item) => item.slug === slug);
}
