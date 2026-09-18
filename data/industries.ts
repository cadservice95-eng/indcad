import type { Industry } from "@/lib/types";

export const industries: Industry[] = [
  {
    slug: "construction",
    name: "Construction",
    heroHeading: "CAD & BIM Services for Construction",
    heroDescription:
      "Drafting, BIM coordination and documentation support for builders, contractors and construction project teams.",
    description: [
      "Construction projects run on documentation — architectural and structural drawing sets, coordinated services models, and shop drawings that fabricators and subcontractors actually build from. Delays or errors in that documentation flow directly into program and cost.",
      "We support builders, contractors and construction project teams with drafting and BIM capacity that scales with a project's stage — from early design documentation through to for-construction issue and as-built close-out.",
    ],
    useCases: [
      "Construction documentation sets for tender and build",
      "Structural steel shop and erection drawings",
      "Multi-disciplinary BIM coordination and clash detection",
      "As-built documentation at project close-out",
      "Converting legacy or superseded drawings for a live project",
    ],
    deliverables: [
      "Construction drawing sets",
      "Structural steel shop drawings",
      "Coordinated architectural, structural and MEP BIM models",
      "Clash detection reports",
      "As-built drawings",
    ],
    documentationRequirements: [
      "Drawings typically need to align with the project's building certifier and relevant Indian Standards for the discipline involved.",
      "Where a project is delivered through BIM, documentation is coordinated to the project's agreed Level of Development (LOD) at each stage.",
    ],
    services: ["structural-drafting", "steel-detailing", "bim-services", "architectural-drafting", "cad-conversion"],
    software: ["autocad", "revit", "tekla", "navisworks", "civil-3d"],
    projectCategories: ["structural", "architectural", "bim", "civil"],
    faqs: [
      { question: "Can you provide drafting support for a live construction project?", answer: "Yes, we work as flexible drafting and BIM capacity alongside a project's existing design and delivery team, including on tight construction-phase timelines." },
      { question: "Do you produce as-built documentation?", answer: "Yes, as-built drawing and model updates at project close-out are a common part of construction-phase work." },
      { question: "Can you coordinate structural, architectural and services models?", answer: "Yes, multi-disciplinary BIM coordination and clash detection is available through our BIM services." },
    ],
    seoTitle: "CAD & BIM Services for Construction | IndCAD",
    seoDescription:
      "Drafting, BIM coordination and documentation support for builders, contractors and construction teams across India.",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    heroHeading: "CAD & Drafting Services for Manufacturing",
    heroDescription:
      "Mechanical drafting, 3D CAD modelling and manufacturing documentation for Indian manufacturers and fabricators.",
    description: [
      "Manufacturing teams need documentation that a workshop floor can actually work from — accurate models, clear fabrication drawings and BOMs that match what's being built. That documentation load is uneven: it spikes with new product introductions, equipment changes and legacy part requalification.",
      "We provide mechanical drafting and 3D CAD modelling capacity for manufacturers and fabricators, covering new design work, reverse engineering of existing parts, and manufacturing documentation for production.",
    ],
    useCases: [
      "New product and equipment design documentation",
      "Fabrication and assembly drawing production",
      "Reverse engineering of legacy or undocumented parts",
      "Sheet metal design and flat pattern development",
      "Manufacturing drawing standardisation across a part range",
    ],
    deliverables: [
      "3D CAD models",
      "Fabrication and assembly drawings",
      "BOMs and manufacturing documentation",
      "Sheet metal flat patterns",
      "Reverse-engineered models and drawings",
    ],
    documentationRequirements: [
      "Drawings are produced to your specified dimensioning and tolerancing standard, or a standard drawing convention where none exists in-house.",
      "Native CAD files are delivered in your production platform so documentation stays usable inside your existing engineering workflow.",
    ],
    services: ["mechanical-drafting", "3d-cad-modelling", "engineering-design", "cad-conversion"],
    software: ["solidworks", "inventor", "fusion-360", "autocad"],
    projectCategories: ["mechanical"],
    faqs: [
      { question: "Can you produce fabrication drawings for our workshop?", answer: "Yes, fabrication and assembly drawings are a core part of our mechanical drafting service, drafted to your standard where supplied." },
      { question: "Can you reverse-engineer an undocumented part?", answer: "Yes, reverse engineering from a physical part, legacy drawing or scan data is a common manufacturing use case." },
      { question: "Do you work in the CAD platform we already use?", answer: "Yes, we model and draft in commonly used mechanical platforms including SolidWorks, Inventor and Fusion 360." },
    ],
    seoTitle: "CAD & Drafting Services for Manufacturing | IndCAD",
    seoDescription:
      "Mechanical drafting, 3D CAD modelling and manufacturing documentation services for Indian manufacturers and fabricators.",
  },
  {
    slug: "mining",
    name: "Mining",
    heroHeading: "CAD & Drafting Services for Mining",
    heroDescription:
      "Structural, mechanical and civil drafting support for mining and mineral processing projects.",
    description: [
      "Mining and mineral processing projects combine structural steelwork, mechanical equipment and civil infrastructure, often across remote sites and on fixed shutdown or commissioning windows. Documentation needs to be accurate the first time.",
      "We provide structural, mechanical and civil drafting support for mining sector projects — from processing plant structures and equipment documentation through to site civil works.",
    ],
    useCases: [
      "Processing plant structural steel documentation",
      "Equipment and fixed plant mechanical drafting",
      "Platform, walkway and access structure detailing",
      "Site civil and earthworks documentation",
      "Legacy drawing conversion for brownfield sites",
    ],
    deliverables: [
      "Structural steel shop and erection drawings",
      "Mechanical equipment and fabrication drawings",
      "Structural BIM models",
      "Civil site drawings",
      "As-built documentation for brownfield works",
    ],
    documentationRequirements: [
      "Brownfield projects often require reconciling drawings against as-built site conditions before new design work can proceed accurately.",
      "Structural and mechanical documentation is drafted to support fabrication and installation within site shutdown or commissioning windows.",
    ],
    services: ["structural-drafting", "steel-detailing", "mechanical-drafting", "civil-drafting", "cad-conversion"],
    software: ["tekla", "autocad", "solidworks", "civil-3d"],
    projectCategories: ["structural", "mechanical", "civil"],
    faqs: [
      { question: "Do you work on brownfield mining sites with existing structures?", answer: "Yes, brownfield work often starts with converting or reconciling existing drawings against current site conditions before new design proceeds." },
      { question: "Can you produce documentation for processing plant structures?", answer: "Yes, structural steel and platform/access documentation for processing plants is a common project type." },
      { question: "Can you support tight shutdown or commissioning timelines?", answer: "Turnaround is confirmed against your specific project timeline during scoping." },
    ],
    seoTitle: "CAD & Drafting Services for Mining | IndCAD",
    seoDescription:
      "Structural, mechanical and civil drafting support for mining and mineral processing projects across India.",
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    heroHeading: "CAD & Drafting Services for Oil & Gas",
    heroDescription:
      "Piping, mechanical and structural drafting support for oil and gas facilities and infrastructure.",
    description: [
      "Oil and gas projects carry strict documentation and traceability requirements across piping, mechanical equipment and structural steelwork, often coordinated through a shared plant model.",
      "We provide drafting support across these disciplines, working within the drawing standards, revision control and documentation formats an operator or EPC project requires.",
    ],
    useCases: [
      "Piping design and isometric documentation",
      "Structural steel documentation for plant and facilities",
      "Mechanical equipment drawings",
      "Plant model coordination",
      "Legacy drawing conversion for existing facilities",
    ],
    deliverables: [
      "Piping drawings and isometrics",
      "Structural steel shop and fabrication drawings",
      "Mechanical equipment documentation",
      "Coordinated plant models",
      "As-built and legacy drawing conversion",
    ],
    documentationRequirements: [
      "Documentation is produced to align with project-specific drawing standards and revision control requirements common on oil and gas projects.",
      "Where a plant model exists, drafting work is coordinated against it to maintain consistency across piping, structural and mechanical documentation.",
    ],
    services: ["structural-drafting", "mechanical-drafting", "engineering-design", "cad-conversion"],
    software: ["autocad", "solidworks", "tekla"],
    projectCategories: ["mechanical", "structural"],
    faqs: [
      { question: "Do you produce piping isometrics?", answer: "Piping design and isometric documentation is available as part of our mechanical drafting and engineering design services — get in touch with your project's specific requirements." },
      { question: "Can you work to project-specific drawing standards?", answer: "Yes, we draft to the standard and revision control process supplied for your project." },
      { question: "Can you convert legacy facility drawings for a brownfield project?", answer: "Yes, see our CAD conversion service for digitising legacy or as-built facility drawings." },
    ],
    seoTitle: "CAD & Drafting Services for Oil & Gas | IndCAD",
    seoDescription:
      "Piping, mechanical and structural drafting support for oil and gas facilities and infrastructure projects in India.",
  },
  {
    slug: "automotive",
    name: "Automotive",
    heroHeading: "CAD & Drafting Services for Automotive",
    heroDescription:
      "3D CAD modelling and mechanical drafting for automotive component and equipment design.",
    description: [
      "Automotive and aftermarket component work depends on accurate, manufacturable 3D models — parts that need to fit, tolerance correctly and be documented for a supply chain, not just look right in isolation.",
      "We provide 3D CAD modelling and mechanical drafting for automotive component design, tooling documentation and aftermarket part development.",
    ],
    useCases: [
      "Automotive component and bracket design",
      "Aftermarket part reverse engineering",
      "Jigs, fixtures and tooling documentation",
      "Sheet metal component design",
      "Manufacturing drawing sets for supplier handover",
    ],
    deliverables: [
      "3D CAD models of components and assemblies",
      "Manufacturing and fabrication drawings",
      "Reverse-engineered part models",
      "Sheet metal flat patterns",
      "Tooling and fixture drawings",
    ],
    documentationRequirements: [
      "Component drawings are dimensioned and toleranced to suit the intended manufacturing process and supplier documentation requirements.",
    ],
    services: ["3d-cad-modelling", "mechanical-drafting", "engineering-design"],
    software: ["solidworks", "inventor", "fusion-360"],
    projectCategories: ["mechanical"],
    faqs: [
      { question: "Can you reverse-engineer an aftermarket part from a physical sample?", answer: "Yes, this is a common automotive use case — producing an accurate 3D model and drawing set from a physical component." },
      { question: "Can you produce tooling and fixture drawings?", answer: "Yes, jigs, fixtures and tooling documentation is covered under mechanical drafting." },
      { question: "What tolerancing standard do you draft to?", answer: "We draft to your specified tolerancing standard, or confirm a suitable convention with you during scoping." },
    ],
    seoTitle: "CAD & Drafting Services for Automotive | IndCAD",
    seoDescription:
      "3D CAD modelling and mechanical drafting services for automotive component design, tooling and aftermarket parts in India.",
  },
  {
    slug: "defence",
    name: "Defence",
    heroHeading: "CAD & Drafting Services for Defence",
    heroDescription:
      "Mechanical and structural drafting support for defence and defence-adjacent manufacturing projects.",
    description: [
      "Defence and defence-adjacent manufacturing work often involves legacy equipment with limited or no digital documentation, alongside strict dimensional accuracy and documentation traceability requirements.",
      "We provide mechanical and structural drafting support for defence-sector manufacturing and sustainment work, including reverse engineering of legacy equipment and components.",
    ],
    useCases: [
      "Reverse engineering of legacy defence equipment and components",
      "Manufacturing documentation for sustainment and spares",
      "Fixture and tooling drawings",
      "Structural documentation for defence facilities",
    ],
    deliverables: [
      "Reverse-engineered 3D models and drawings",
      "Manufacturing and fabrication drawings",
      "Fixture and tooling documentation",
      "Structural drawings",
    ],
    documentationRequirements: [
      "Work involving controlled or sensitive information is scoped and handled according to your project's specific security and handling requirements — confirm these with us before sharing any restricted material.",
    ],
    services: ["mechanical-drafting", "3d-cad-modelling", "structural-drafting", "engineering-design"],
    software: ["solidworks", "inventor", "autocad"],
    projectCategories: ["mechanical", "structural"],
    faqs: [
      { question: "Can you reverse-engineer legacy equipment with no existing drawings?", answer: "Yes, reverse engineering from physical parts is a core capability for sustainment and spares documentation." },
      { question: "How do you handle sensitive or controlled project information?", answer: "Handling requirements are agreed with you before any controlled or sensitive material is shared — please flag these requirements when requesting a quote." },
    ],
    seoTitle: "CAD & Drafting Services for Defence | IndCAD",
    seoDescription:
      "Mechanical and structural drafting support for defence and defence-adjacent manufacturing and sustainment projects.",
  },
  {
    slug: "aerospace",
    name: "Aerospace",
    heroHeading: "CAD & Drafting Services for Aerospace",
    heroDescription:
      "Precision 3D CAD modelling and mechanical drafting for aerospace component and tooling work.",
    description: [
      "Aerospace component and tooling work demands precise, well-documented 3D models and drawings, with tolerancing and documentation that supports traceability through manufacturing and inspection.",
      "We provide 3D CAD modelling and mechanical drafting support for aerospace-sector component design, tooling and legacy part documentation.",
    ],
    useCases: [
      "Aerospace component and bracket modelling",
      "Jigs, fixtures and tooling documentation",
      "Reverse engineering of legacy components",
      "Manufacturing drawing sets for precision-machined parts",
    ],
    deliverables: [
      "3D CAD models",
      "Precision manufacturing drawings",
      "Fixture and tooling documentation",
      "Reverse-engineered models and drawings",
    ],
    documentationRequirements: [
      "Drawings are dimensioned and toleranced to the precision and traceability standard your project and manufacturing process require.",
    ],
    services: ["3d-cad-modelling", "mechanical-drafting", "engineering-design"],
    software: ["solidworks", "inventor", "fusion-360"],
    projectCategories: ["mechanical"],
    faqs: [
      { question: "Can you work to tight tolerancing requirements?", answer: "Yes, dimensioning and tolerancing is applied to the precision level your part and manufacturing process require." },
      { question: "Can you produce tooling drawings for machined aerospace components?", answer: "Yes, jigs, fixtures and tooling documentation is available alongside component drawings." },
    ],
    seoTitle: "CAD & Drafting Services for Aerospace | IndCAD",
    seoDescription:
      "Precision 3D CAD modelling and mechanical drafting services for aerospace component and tooling projects in India.",
  },
  {
    slug: "energy",
    name: "Energy",
    heroHeading: "CAD & Drafting Services for Energy",
    heroDescription:
      "Structural, electrical and civil drafting support for energy infrastructure and facilities projects.",
    description: [
      "Energy sector projects — from substations and switchyards to renewable energy infrastructure — combine structural, electrical and civil documentation, often across distributed sites.",
      "We provide drafting support across these disciplines for energy infrastructure projects, including structural documentation, electrical schematics and civil site drawings.",
    ],
    useCases: [
      "Substation and switchyard structural documentation",
      "Electrical single-line diagrams and schematics",
      "Civil site drawings for energy infrastructure",
      "Renewable energy site documentation",
      "As-built documentation for existing facilities",
    ],
    deliverables: [
      "Structural steel drawings",
      "Electrical schematics and single-line diagrams",
      "Civil site and access drawings",
      "As-built documentation",
    ],
    documentationRequirements: [
      "Documentation is drafted to align with the relevant network operator or project-specific drawing standard where supplied.",
    ],
    services: ["structural-drafting", "electrical-drafting", "civil-drafting", "cad-conversion"],
    software: ["autocad", "revit", "civil-3d"],
    projectCategories: ["structural", "electrical", "civil"],
    faqs: [
      { question: "Can you produce electrical single-line diagrams for substation projects?", answer: "Yes, single-line diagrams and electrical schematics are part of our electrical drafting service." },
      { question: "Do you provide civil drafting for site access and earthworks?", answer: "Yes, civil site drawings are available for energy infrastructure projects." },
    ],
    seoTitle: "CAD & Drafting Services for Energy | IndCAD",
    seoDescription:
      "Structural, electrical and civil drafting support for energy infrastructure, substations and facilities projects in India.",
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
