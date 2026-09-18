import type { Service } from "@/lib/types";

export const services: Service[] = [
  // ---------------------------------------------------------------------
  // MECHANICAL
  // ---------------------------------------------------------------------
  {
    slug: "mechanical-drafting",
    name: "Mechanical Drafting",
    category: "mechanical",
    shortDescription:
      "2D mechanical drafting and 3D CAD modelling for manufacturers, fabricators and product designers.",
    heroHeading: "Mechanical Drafting Services",
    heroDescription:
      "2D drafting, 3D CAD modelling and manufacturing documentation for machine builders, fabricators, product designers and manufacturers across India.",
    problemStatement:
      "Manufacturing and engineering teams often need drafting capacity without carrying a full-time draftsperson — a concept sketch that needs to become a manufacturable assembly, a legacy part with no digital model, or a production run of fabrication drawings that needs to go out this week. Internal engineers are usually better used on design decisions than on redlining GA drawings.",
    overview: [
      "Our mechanical drafting service covers the full path from a design intent or rough sketch through to production-ready documentation. That includes 2D mechanical drafting for parts and assemblies, 3D CAD modelling for design validation and downstream use, and the manufacturing paperwork — fabrication drawings, assembly drawings, BOMs and revision-controlled drawing sets — that a workshop or fabricator actually works from.",
      "We work from your existing standards and title blocks where they exist, or set up a clean, consistent drawing standard where they don't. Models and drawings are delivered in the native format your team uses, so they slot into your existing CAD environment rather than sitting outside it.",
      "This service also covers reverse engineering: producing an accurate 3D model and drawing set from a physical part, a legacy 2D drawing, or a scanned reference, for design changes, spare parts, or requalifying an undocumented component.",
    ],
    deliverables: [
      "2D mechanical drawings (part and assembly)",
      "3D CAD models (solid and surface)",
      "Fabrication and manufacturing drawings",
      "Assembly drawings with BOMs",
      "GA (general arrangement) drawings",
      "Sheet metal flat patterns and nesting-ready DXFs",
      "Reverse-engineered models from physical parts or legacy drawings",
      "Revision-controlled drawing sets",
    ],
    applications: [
      "Machine and equipment design",
      "Product design and development",
      "Sheet metal fabrication",
      "Jigs, fixtures and tooling",
      "Spare parts and legacy component documentation",
      "Production and assembly line equipment",
      "Custom fabrication and one-off builds",
    ],
    process: [
      { title: "Brief & reference material", description: "You send sketches, existing models, redlines or physical parts, plus the standard you draft to." },
      { title: "Scope & quote", description: "We confirm deliverables, formats, drawing standard and turnaround before work starts." },
      { title: "Modelling & drafting", description: "Models and drawings are built in your native CAD format, with dimensioning and tolerancing applied to a working drawing standard." },
      { title: "Internal check", description: "Drawings are checked for dimensional accuracy, tolerancing logic and drawing-standard compliance before delivery." },
      { title: "Delivery & revisions", description: "Files are delivered with a clear revision history, and we handle markup-driven revisions through to sign-off." },
    ],
    industries: ["manufacturing", "mining", "defence", "automotive", "aerospace", "energy"],
    software: ["autocad", "solidworks", "inventor", "fusion-360"],
    faqs: [
      { question: "What is mechanical drafting?", answer: "Mechanical drafting is the production of technical drawings — 2D and 3D — that define how a mechanical part or assembly is made, machined, fabricated or assembled. It covers dimensioning, tolerancing, materials, finishes and the documentation a workshop needs to manufacture from." },
      { question: "What does a mechanical drafting service include?", answer: "Typically this covers 2D part and assembly drawings, 3D CAD models, fabrication and manufacturing drawings, BOMs and revision control. Scope is confirmed against your specific project before work begins." },
      { question: "Can you convert PDF or scanned drawings to CAD?", answer: "Yes — see our dedicated PDF to CAD and CAD conversion services for legacy drawing conversion into editable, native CAD files." },
      { question: "Can you create 3D CAD models from a 2D drawing or physical part?", answer: "Yes. This is a common reverse engineering task — we build an accurate 3D model from a 2D reference, physical sample or scan data, then produce updated drawings from that model." },
      { question: "What CAD formats can you work with?", answer: "We work in commonly used mechanical CAD packages including AutoCAD, SolidWorks, Inventor and Fusion 360, and can deliver in neutral formats (STEP, IGES, DXF, PDF) where required." },
      { question: "Can you work with our existing drawing standard?", answer: "Yes. We draft to your existing title blocks, layer standards and drawing conventions where supplied, or apply a clean standard drawing set if you don't have one in place." },
    ],
    relatedServices: ["3d-cad-modelling", "structural-drafting", "engineering-design", "cad-conversion"],
    relatedProjectCategories: ["mechanical"],
    seoTitle: "Mechanical Drafting Services India | IndCAD",
    seoDescription:
      "Mechanical drafting services for Indian manufacturers and fabricators — 2D drafting, 3D CAD modelling, fabrication drawings, BOMs and reverse engineering.",
  },
  {
    slug: "3d-cad-modelling",
    name: "3D CAD Modelling",
    category: "mechanical",
    shortDescription: "Parametric 3D CAD modelling for parts, assemblies and product development.",
    heroHeading: "3D CAD Modelling Services",
    heroDescription:
      "Parametric 3D CAD models for design development, manufacturing documentation, visualisation and downstream engineering analysis.",
    problemStatement:
      "A lot of engineering work now depends on having an accurate, editable 3D model — not just a 2D drawing — whether that's for design iteration, interference checking, FEA, marketing visuals, or feeding a fabrication shop's CNC and nesting software. Building and maintaining those models takes time that in-house engineers don't always have spare.",
    overview: [
      "We build parametric 3D CAD models for individual parts, multi-part assemblies and full machines, in the CAD platform your team already standardises on. Models are built to be usable downstream — clean feature trees, sensible mating and assembly logic, and dimensions that update predictably when a design changes.",
      "This service supports both new design work (turning a concept or sketch into a modelled, dimensioned part) and documentation of existing equipment (modelling from physical parts, legacy 2D drawings or point-cloud scan data).",
      "Models can be delivered in native format alongside neutral formats such as STEP and IGES for use in other software, and we can produce derived 2D drawings, exploded views and BOMs from the same model on request.",
    ],
    deliverables: [
      "Parametric part models",
      "Assembly models with mate/constraint logic",
      "Sheet metal models with flat patterns",
      "Surface models for complex or organic geometry",
      "STEP / IGES / STL exports for downstream use",
      "Exploded assembly views",
      "Model-derived 2D drawings on request",
    ],
    applications: [
      "Product design and development",
      "Machine and equipment design",
      "Design for manufacturing (DFM) review",
      "FEA and simulation preparation",
      "Marketing and technical visualisation",
      "Digitising legacy or undocumented equipment",
    ],
    process: [
      { title: "Reference material", description: "Sketches, existing models, physical parts or scan data, plus intended use for the model." },
      { title: "Scope & quote", description: "We confirm modelling depth, format and delivery software before starting." },
      { title: "Modelling", description: "Parts and assemblies are built with a clean, editable feature structure." },
      { title: "Review", description: "Models are checked against reference dimensions and intended fit/function." },
      { title: "Delivery", description: "Native and neutral format files delivered, with drawings or exports produced as scoped." },
    ],
    industries: ["manufacturing", "mining", "automotive", "aerospace", "defence"],
    software: ["solidworks", "inventor", "fusion-360", "autocad"],
    faqs: [
      { question: "What's the difference between 3D CAD modelling and mechanical drafting?", answer: "3D CAD modelling focuses on building the 3D model itself. Mechanical drafting typically covers the full documentation package — 2D drawings, BOMs and fabrication drawings — that is often produced from that model. Many projects use both." },
      { question: "Can you model a part from a physical sample?", answer: "Yes, this is a standard reverse-engineering task using manual measurement or supplied scan data, depending on the part's complexity and tolerance requirements." },
      { question: "Which CAD platforms do you model in?", answer: "SolidWorks, Inventor and Fusion 360 are our most common mechanical platforms; we can also deliver neutral STEP/IGES files for use in other systems." },
      { question: "Can you produce 2D drawings from the 3D model?", answer: "Yes — dimensioned 2D drawings, BOMs and exploded views can be generated from the completed model as part of the scope." },
    ],
    relatedServices: ["mechanical-drafting", "engineering-design", "cad-conversion"],
    relatedProjectCategories: ["mechanical"],
    seoTitle: "3D CAD Modelling Services India | IndCAD",
    seoDescription:
      "Parametric 3D CAD modelling services — parts, assemblies and product development models built in SolidWorks, Inventor and Fusion 360.",
  },

  // ---------------------------------------------------------------------
  // STRUCTURAL
  // ---------------------------------------------------------------------
  {
    slug: "structural-drafting",
    name: "Structural Drafting",
    category: "structural",
    shortDescription: "Structural drafting, steel detailing and shop drawings for fabrication and construction.",
    heroHeading: "Structural Drafting Services",
    heroDescription:
      "Structural steel detailing, shop drawings and structural documentation for fabricators, builders and structural engineers.",
    problemStatement:
      "Fabricators and structural engineering firms regularly need detailing capacity that flexes with workload — a tender that needs shop drawings fast, an engineer's design that needs to become fabrication-ready documentation, or a project that has outgrown the in-house drafting team's bandwidth.",
    overview: [
      "Our structural drafting service takes structural engineering design and produces the documentation a fabricator or builder works from — general arrangement drawings, connection details, and fully detailed shop and erection drawings for structural steel and, where scoped, concrete detailing.",
      "We work from the structural engineer's design (drawings, model or calculations) and produce detailing that reflects real fabrication and erection practice — member sizes, connection types, bolt patterns and welds that a workshop can price and build from without rework.",
      "Where a project is being run in Revit or Tekla, we can produce or work within a structural BIM model, keeping detailing coordinated with architectural and services models and supporting clash detection before fabrication.",
    ],
    deliverables: [
      "Structural steel shop drawings",
      "Erection drawings",
      "Connection design documentation",
      "General arrangement (GA) drawings",
      "Structural steel fabrication drawings",
      "Bolt lists and material take-offs",
      "Structural BIM models (Revit / Tekla)",
      "Concrete detailing (where scoped)",
    ],
    applications: [
      "Structural steel fabrication",
      "Industrial and warehouse structures",
      "Commercial and high-rise structures",
      "Mining and resource-sector structures",
      "Platforms, walkways and access structures",
      "Structural steel tender documentation",
    ],
    process: [
      { title: "Design input", description: "Structural engineer's drawings, model or calculations, plus fabrication and standard requirements." },
      { title: "Scope & quote", description: "We confirm drawing set, LOD (if BIM) and turnaround before starting detailing." },
      { title: "Detailing", description: "Shop and erection drawings are produced with member, connection and material detail." },
      { title: "Coordination check", description: "Drawings are checked against the structural design and, where applicable, coordinated with other discipline models." },
      { title: "Delivery & revisions", description: "Drawing sets are issued with revision control through to for-construction status." },
    ],
    industries: ["construction", "mining", "manufacturing", "energy"],
    software: ["tekla", "autocad", "revit", "civil-3d"],
    faqs: [
      { question: "What is structural drafting?", answer: "Structural drafting is the production of technical drawings that translate a structural engineer's design into documentation a fabricator or builder can price, fabricate and erect from — including shop drawings, connection details and general arrangements." },
      { question: "Do you design structural connections or only detail them?", answer: "Detailing follows the structural engineer's design intent and any specified connection design. Connection design itself is an engineering function — where required we work alongside your structural engineer rather than replacing that sign-off." },
      { question: "Can you produce Tekla or Revit structural models?", answer: "Yes — see our BIM services for structural modelling, coordination and clash detection in Tekla and Revit." },
      { question: "Can you work from PDF structural drawings?", answer: "Yes, PDF or scanned structural drawings can be converted into working CAD or BIM files — see our CAD conversion service." },
      { question: "What industries do you provide structural detailing for?", answer: "Commercial and industrial construction, mining and resources, manufacturing facilities and general structural steel fabrication are the most common." },
    ],
    relatedServices: ["steel-detailing", "bim-services", "cad-conversion", "engineering-design"],
    relatedProjectCategories: ["structural"],
    seoTitle: "Structural Drafting Services India | IndCAD",
    seoDescription:
      "Structural drafting and steel detailing services — shop drawings, erection drawings, connection documentation and structural BIM for Indian fabricators and builders.",
  },
  {
    slug: "steel-detailing",
    name: "Steel Detailing",
    category: "structural",
    shortDescription: "Structural steel shop and erection drawings, ready for fabrication.",
    heroHeading: "Structural Steel Detailing",
    heroDescription:
      "Fabrication-ready shop and erection drawings for structural steel, detailed to reflect real workshop and site-erection practice.",
    problemStatement:
      "Steel fabricators win work on turnaround and accuracy. A detailing bottleneck — whether that's a busy in-house team or a tender deadline — directly slows down quoting and fabrication. Detailing errors are worse: a missed connection detail or bolt clash found on-site is expensive to fix.",
    overview: [
      "Steel detailing turns an engineer's structural design into the piece-by-piece documentation a fabrication shop actually builds from: shop drawings for individual members, connection and bolt detail, and erection drawings that sequence how the structure goes together on site.",
      "We detail from structural engineering drawings, calculations or a coordinated 3D model, and can work in Tekla Structures or AutoCAD depending on your workflow and whether the project needs a full structural BIM model for coordination with other disciplines.",
      "Material take-offs and bolt lists are produced alongside the drawing set, giving fabrication and procurement teams consistent quantities to work from.",
    ],
    deliverables: [
      "Shop drawings (individual member detail)",
      "Erection drawings and sequencing",
      "Connection and bolt detail drawings",
      "Material take-offs and bolt lists",
      "Tekla structural models",
      "Revision-controlled for-construction drawing sets",
    ],
    applications: [
      "Structural steel fabrication shops",
      "Industrial sheds and warehouses",
      "Platforms, walkways and mezzanines",
      "Mining and processing plant structures",
      "Commercial building structural steel packages",
    ],
    process: [
      { title: "Design input", description: "Structural drawings, calculations or model, plus fabrication standard and bolt/weld preferences." },
      { title: "Scope & quote", description: "Drawing set, software (Tekla or AutoCAD) and turnaround confirmed before starting." },
      { title: "Detailing", description: "Shop and erection drawings produced member-by-member with full connection detail." },
      { title: "Checking", description: "Drawings checked against structural design intent and fabrication practicality." },
      { title: "Delivery", description: "For-construction drawing set issued with material take-offs." },
    ],
    industries: ["construction", "mining", "manufacturing"],
    software: ["tekla", "autocad"],
    faqs: [
      { question: "What's the difference between structural drafting and steel detailing?", answer: "Structural drafting is the broader service covering general arrangements, structural documentation and BIM. Steel detailing specifically refers to the fabrication-level shop and erection drawings used to build structural steel." },
      { question: "Do you use Tekla Structures?", answer: "Yes, Tekla is one of our standard structural steel detailing platforms alongside AutoCAD, depending on project needs." },
      { question: "Can you produce bolt lists and material take-offs?", answer: "Yes, these are typically delivered alongside the shop and erection drawing set." },
      { question: "Can steel detailing be coordinated with architectural or services models?", answer: "Yes — where the project is running in a shared BIM environment, structural steel detailing can be coordinated for clash detection against architectural and MEP models." },
    ],
    relatedServices: ["structural-drafting", "bim-services", "engineering-design"],
    relatedProjectCategories: ["structural"],
    seoTitle: "Structural Steel Detailing Services India | IndCAD",
    seoDescription:
      "Structural steel detailing — shop drawings, erection drawings, connection detail and material take-offs for Indian fabricators, in Tekla or AutoCAD.",
  },

  // ---------------------------------------------------------------------
  // ARCHITECTURAL
  // ---------------------------------------------------------------------
  {
    slug: "architectural-drafting",
    name: "Architectural Drafting",
    category: "architectural",
    shortDescription: "Architectural drawing sets, floor plans and building documentation.",
    heroHeading: "Architectural Drafting Services",
    heroDescription:
      "2D architectural drawing sets, floor plans and building documentation support for architects, designers, builders and developers.",
    problemStatement:
      "Architectural practices and building designers often need overflow drafting capacity — producing a full documentation set from design drawings, updating plans through a DA or CC process, or getting joinery and interior detail drawn up without pulling design staff off higher-value work.",
    overview: [
      "We produce 2D architectural drawing sets from concept and design development drawings through to construction documentation — floor plans, elevations, sections, details and schedules — drafted to a consistent, checkable standard.",
      "This includes renovation and extension drawings, interior and joinery documentation, and retail fit-out drawings, along with 3D architectural modelling and rendering where a project needs visualisation alongside its documentation set.",
      "Drawings are produced in your practice's template and layer standard where supplied, and we can work from hand sketches, marked-up plans, or an existing model that needs updating or documenting.",
    ],
    deliverables: [
      "Floor plans (existing and proposed)",
      "Elevations and sections",
      "Construction documentation sets",
      "Renovation and extension drawings",
      "Joinery and interior detail drawings",
      "Retail fit-out drawings",
      "Door, window and finish schedules",
      "3D architectural models (on request)",
    ],
    applications: [
      "Residential documentation",
      "Renovations and extensions",
      "Retail and commercial fit-outs",
      "Interior design documentation",
      "Development approval (DA) drawing sets",
      "Construction certificate (CC) documentation",
    ],
    process: [
      { title: "Design input", description: "Sketches, marked-up plans, survey or an existing model, plus your drawing template if you have one." },
      { title: "Scope & quote", description: "Drawing set, stage (DA/CC/construction) and turnaround confirmed before starting." },
      { title: "Drafting", description: "Plans, elevations, sections and details are drafted to a consistent standard." },
      { title: "Review", description: "Drawings checked for dimensional consistency and coordination across the set." },
      { title: "Delivery & revisions", description: "Set delivered with revision tracking through design changes and approval stages." },
    ],
    industries: ["construction", "manufacturing", "energy"],
    software: ["autocad", "revit", "archicad"],
    faqs: [
      { question: "What is architectural drafting?", answer: "Architectural drafting is the production of the technical drawing set — floor plans, elevations, sections and details — that documents a building design for approval and construction." },
      { question: "Can you draft from hand sketches?", answer: "Yes, we regularly draft from hand sketches, marked-up existing plans, or site survey information." },
      { question: "Do you produce 3D architectural models and renders?", answer: "Yes — see our 3D rendering service for architectural visualisation, or scope this alongside your drawing set." },
      { question: "Can you produce Revit models as well as 2D drawings?", answer: "Yes, architectural documentation can be produced in Revit as a coordinated BIM model where the project calls for it." },
      { question: "Can you work with our practice's existing drawing template?", answer: "Yes, we draft to your supplied title block, layer standard and drawing conventions." },
    ],
    relatedServices: ["3d-rendering", "bim-services", "cad-conversion"],
    relatedProjectCategories: ["architectural"],
    seoTitle: "Architectural Drafting Services India | IndCAD",
    seoDescription:
      "Architectural drafting services — floor plans, construction documentation, renovation drawings and 3D architectural modelling for Indian practices and builders.",
  },
  {
    slug: "3d-rendering",
    name: "3D Rendering",
    category: "architectural",
    shortDescription: "3D architectural visualisation and walkthroughs from design or BIM models.",
    heroHeading: "3D Rendering & Visualisation",
    heroDescription:
      "3D architectural models, renders and walkthroughs built from your design drawings or BIM model, for presentation, marketing and approvals.",
    problemStatement:
      "Design intent is easier to sell — to a client, a planning authority, or an investor — when it can be seen, not just read off a 2D plan. Building and rendering a clean 3D model in-house takes time that design teams often don't have during a live project.",
    overview: [
      "We build 3D architectural models from your 2D drawings or existing BIM model and produce still renders, image sets or walkthrough animations for presentation, marketing or approval purposes.",
      "Models can be built specifically for visualisation, or produced from a Revit/ArchiCAD model that's already part of the project's documentation, keeping the rendered output consistent with the actual design.",
    ],
    deliverables: [
      "3D architectural models",
      "Still renders (interior and exterior)",
      "3D floor plans",
      "Walkthrough animations",
      "Image sets for marketing or approval submissions",
    ],
    applications: [
      "Client presentation",
      "Planning and DA submissions",
      "Retail and interior design visualisation",
      "Property marketing",
      "Design development review",
    ],
    process: [
      { title: "Design input", description: "2D drawings or an existing BIM model, plus reference material for finishes and materials." },
      { title: "Scope & quote", description: "Number of views, render style and turnaround confirmed before starting." },
      { title: "Modelling", description: "3D model built from the supplied documentation." },
      { title: "Rendering", description: "Stills, image sets or walkthroughs produced from the model." },
      { title: "Delivery & revisions", description: "Renders delivered with a revision round for material, lighting or camera changes." },
    ],
    industries: ["construction", "manufacturing"],
    software: ["revit", "archicad", "autocad"],
    faqs: [
      { question: "Can you render from our existing Revit model?", answer: "Yes, we can work directly from an existing Revit or ArchiCAD model rather than rebuilding from scratch." },
      { question: "Do you produce walkthrough animations?", answer: "Yes, walkthroughs can be scoped alongside still renders where a project needs them." },
      { question: "How many revision rounds are included?", answer: "This is confirmed in the quote for your specific project — get in touch with the number of views and revisions you expect to need." },
    ],
    relatedServices: ["architectural-drafting", "bim-services"],
    relatedProjectCategories: ["architectural"],
    seoTitle: "3D Rendering & Architectural Visualisation India | IndCAD",
    seoDescription:
      "3D architectural rendering and walkthrough services — visualisation built from your design drawings or BIM model for presentation and approvals.",
  },

  // ---------------------------------------------------------------------
  // CIVIL
  // ---------------------------------------------------------------------
  {
    slug: "civil-drafting",
    name: "Civil Drafting",
    category: "civil",
    shortDescription: "Civil design documentation for land development, subdivision and site works.",
    heroHeading: "Civil Drafting Services",
    heroDescription:
      "Civil design documentation and construction drawings for land development, subdivision, site works and infrastructure projects.",
    problemStatement:
      "Civil design teams and developers need consistent, checkable drawing sets across a project that often spans site planning, earthworks, stormwater and road design — usually against a tight approval or construction timeline.",
    overview: [
      "We produce civil drafting and construction documentation for land development and site infrastructure projects — from site and subdivision plans through to stormwater and road design drawings, coordinated with the civil engineer's design.",
      "Work is typically produced in Civil 3D, and can be delivered as 2D construction drawing sets, 3D civil models, or both depending on how the project is being delivered and what your certifying authority requires.",
    ],
    deliverables: [
      "Site plans and subdivision plans",
      "Stormwater design drawings",
      "Road design drawings",
      "Earthworks and grading plans",
      "Construction documentation sets",
      "Civil 3D models and surfaces",
      "Infrastructure documentation",
    ],
    applications: [
      "Residential and commercial subdivision",
      "Land development",
      "Road and access design",
      "Stormwater and drainage design",
      "Site civil works for construction projects",
    ],
    process: [
      { title: "Design input", description: "Survey data, civil engineering design and any council/authority requirements." },
      { title: "Scope & quote", description: "Drawing set, software and approval stage confirmed before starting." },
      { title: "Drafting & modelling", description: "Civil drawings and models produced to the engineer's design and relevant standards." },
      { title: "Review", description: "Drawings checked for coordination across plan, grading and services." },
      { title: "Delivery & revisions", description: "Documentation issued with revision tracking through approval and construction stages." },
    ],
    industries: ["construction", "energy", "mining"],
    software: ["civil-3d", "autocad"],
    faqs: [
      { question: "What is civil drafting?", answer: "Civil drafting is the production of technical drawings for land development and site infrastructure — site plans, stormwater, road design and construction documentation — based on a civil engineer's design." },
      { question: "Do you produce Civil 3D models as well as 2D drawings?", answer: "Yes, we can deliver 2D construction drawing sets, 3D Civil 3D models, or both depending on project requirements." },
      { question: "Can you work with council or authority drawing requirements?", answer: "Yes, drawings are produced to meet the specific requirements of the relevant certifying authority where these are supplied." },
    ],
    relatedServices: ["structural-drafting", "engineering-design", "cad-conversion"],
    relatedProjectCategories: ["civil"],
    seoTitle: "Civil Drafting Services India | IndCAD",
    seoDescription:
      "Civil drafting and construction documentation — site plans, subdivision design, stormwater and road design drawings for Indian land development projects.",
  },

  // ---------------------------------------------------------------------
  // ELECTRICAL
  // ---------------------------------------------------------------------
  {
    slug: "electrical-drafting",
    name: "Electrical Drafting",
    category: "electrical",
    shortDescription: "Electrical schematics, single-line diagrams and switchboard drawings.",
    heroHeading: "Electrical Drafting Services",
    heroDescription:
      "Electrical design documentation — schematics, single-line diagrams, switchboard and control panel drawings — for contractors, panel builders and engineering teams.",
    problemStatement:
      "Electrical contractors and panel builders often need drawing documentation produced or updated faster than in-house capacity allows — for a switchboard build, a control panel change, or as-built documentation that needs to match what was actually installed.",
    overview: [
      "We produce electrical design documentation including single-line diagrams, schematics, switchboard drawings and control panel layouts, drafted to a clear, consistent standard that a panel shop or site electrician can work from directly.",
      "This includes documenting existing installations (as-builts) and coordinating electrical drawings within a broader BIM model where a project needs electrical services coordinated against structural and architectural design.",
    ],
    deliverables: [
      "Single-line diagrams",
      "Electrical schematics",
      "Switchboard drawings",
      "Control panel drawings",
      "Cable schedules",
      "As-built electrical documentation",
      "Electrical BIM coordination",
    ],
    applications: [
      "Switchboard and panel building",
      "Industrial control systems",
      "Commercial electrical installations",
      "As-built documentation",
      "Electrical services coordination in BIM projects",
    ],
    process: [
      { title: "Design input", description: "Existing drawings, equipment schedules or site information for as-built work." },
      { title: "Scope & quote", description: "Drawing set and standard confirmed before starting." },
      { title: "Drafting", description: "Schematics and layout drawings produced to a clear, buildable standard." },
      { title: "Review", description: "Drawings checked for consistency against equipment schedules and design intent." },
      { title: "Delivery & revisions", description: "Drawing set delivered with revision tracking." },
    ],
    industries: ["construction", "manufacturing", "mining", "energy"],
    software: ["autocad", "revit"],
    faqs: [
      { question: "Can you produce as-built electrical drawings?", answer: "Yes, documenting an existing installation into accurate as-built drawings is a common part of this service." },
      { question: "Can you draft switchboard and control panel layouts?", answer: "Yes, this includes panel layout, wiring schematics and cable schedules." },
      { question: "Can electrical drawings be coordinated with structural and architectural models?", answer: "Yes — where a project is running in a shared BIM environment, electrical documentation can be coordinated for clash detection against other discipline models." },
    ],
    relatedServices: ["bim-services", "cad-conversion", "engineering-design"],
    relatedProjectCategories: ["electrical"],
    seoTitle: "Electrical Drafting Services India | IndCAD",
    seoDescription:
      "Electrical drafting services — schematics, single-line diagrams, switchboard and control panel drawings for Indian contractors and panel builders.",
  },

  // ---------------------------------------------------------------------
  // BIM
  // ---------------------------------------------------------------------
  {
    slug: "bim-services",
    name: "BIM Modelling & Coordination",
    category: "bim",
    shortDescription: "Revit BIM modelling, coordination and clash detection across disciplines.",
    heroHeading: "BIM Modelling & Coordination Services",
    heroDescription:
      "Building Information Modelling services — architectural, structural and MEP modelling, coordination and clash detection — for design and construction teams.",
    problemStatement:
      "Running a project through BIM only pays off if the model is properly coordinated — architectural, structural and services models that actually align, clashes caught before they reach site, and a model built to the LOD the project actually needs at each stage.",
    overview: [
      "We provide BIM modelling and coordination across architectural, structural and MEP disciplines, primarily in Revit, including clash detection, Revit family creation and point cloud/scan-to-BIM conversion for existing buildings and structures.",
      "Models are built to an agreed Level of Development (LOD) for the project stage — concept, design development or construction — so the model stays a useful coordination tool rather than an overbuilt one.",
      "Coordination work includes running clash detection across combined discipline models (typically in Navisworks) and issuing clash reports the design team can action before issue-for-construction.",
    ],
    deliverables: [
      "Architectural, structural and MEP BIM models",
      "Revit models to agreed LOD",
      "Clash detection reports",
      "Custom Revit families",
      "Scan-to-BIM / point cloud conversion",
      "Coordinated federated models",
      "Model-derived drawing sheets",
    ],
    applications: [
      "Multi-disciplinary design coordination",
      "Construction documentation",
      "Existing building/structure documentation from scan data",
      "Renovation and retrofit projects",
      "Facilities and asset documentation",
    ],
    process: [
      { title: "Model brief", description: "Discipline, LOD target and any existing model or scan data confirmed upfront." },
      { title: "Scope & quote", description: "Deliverables, software and coordination workflow agreed before starting." },
      { title: "Modelling", description: "Discipline model(s) built or updated to the agreed LOD." },
      { title: "Coordination & clash detection", description: "Models federated and checked for clashes, with reports issued for resolution." },
      { title: "Delivery", description: "Coordinated model and any derived drawings delivered with revision tracking." },
    ],
    industries: ["construction", "manufacturing", "energy", "mining"],
    software: ["revit", "navisworks", "tekla"],
    faqs: [
      { question: "What is BIM modelling?", answer: "Building Information Modelling (BIM) is the process of creating a data-rich 3D model of a building or structure that documents design, coordination and construction information, typically in Revit." },
      { question: "What does clash detection involve?", answer: "Combined architectural, structural and services models are checked against each other (commonly in Navisworks) to identify physical clashes before construction, with a report issued for the design team to resolve." },
      { question: "Can you convert a point cloud scan into a BIM model?", answer: "Yes — see our Scan to BIM service for converting laser scan or point cloud data of an existing building or structure into a working Revit model." },
      { question: "What LOD do you model to?", answer: "This is agreed per project and project stage — we scope modelling depth against the LOD your project actually needs rather than defaulting to the highest level." },
    ],
    relatedServices: ["revit-modelling", "scan-to-bim", "structural-drafting"],
    relatedProjectCategories: ["bim"],
    seoTitle: "BIM Modelling & Coordination Services India | IndCAD",
    seoDescription:
      "BIM modelling and coordination services — Revit modelling, clash detection and scan-to-BIM for Indian design and construction teams.",
  },
  {
    slug: "revit-modelling",
    name: "Revit Modelling",
    category: "bim",
    shortDescription: "Architectural, structural and MEP Revit modelling to your project's LOD.",
    heroHeading: "Revit Modelling Services",
    heroDescription:
      "Revit modelling across architectural, structural and MEP disciplines, built to the Level of Development your project stage actually requires.",
    problemStatement:
      "Revit modelling capacity is a common bottleneck on design and documentation timelines — whether that's building a model from scratch, updating one through design changes, or picking up modelling overflow during a busy documentation period.",
    overview: [
      "We build and maintain Revit models across architectural, structural and MEP disciplines, working to your project's title block, naming conventions and BIM execution plan where one exists.",
      "This covers new model creation, updating existing models through design revisions, and producing model-derived drawing sheets and schedules as part of a coordinated documentation set.",
    ],
    deliverables: [
      "Architectural Revit models",
      "Structural Revit models",
      "MEP Revit models",
      "Custom Revit families",
      "Model-derived drawing sheets",
      "Model updates through design revisions",
    ],
    applications: [
      "New building design documentation",
      "Structural and MEP coordination",
      "Design development and construction documentation",
      "Renovation and retrofit modelling",
    ],
    process: [
      { title: "Model brief", description: "Discipline, LOD and any BIM execution plan or template confirmed upfront." },
      { title: "Scope & quote", description: "Deliverables and turnaround agreed before modelling starts." },
      { title: "Modelling", description: "Model built or updated to the agreed standard and LOD." },
      { title: "Review", description: "Model checked against reference documentation and coordination requirements." },
      { title: "Delivery", description: "Model and any derived sheets delivered, with revisions tracked." },
    ],
    industries: ["construction", "manufacturing", "energy"],
    software: ["revit", "navisworks"],
    faqs: [
      { question: "Can you work within our BIM execution plan?", answer: "Yes, we model to your supplied BEP, template and naming conventions where these exist." },
      { question: "Can you update an existing Revit model rather than starting fresh?", answer: "Yes, working within an existing model through ongoing design changes is a common part of this service." },
      { question: "Do you produce structural and MEP models, or only architectural?", answer: "All three — architectural, structural and MEP Revit modelling are covered, either individually or as a coordinated set." },
    ],
    relatedServices: ["bim-services", "scan-to-bim", "architectural-drafting"],
    relatedProjectCategories: ["bim"],
    seoTitle: "Revit Modelling Services India | IndCAD",
    seoDescription:
      "Revit modelling services across architectural, structural and MEP disciplines, built to your project's Level of Development and BIM execution plan.",
  },
  {
    slug: "scan-to-bim",
    name: "Scan to BIM",
    category: "bim",
    shortDescription: "Point cloud and laser scan conversion into working Revit BIM models.",
    heroHeading: "Scan to BIM Services",
    heroDescription:
      "Converting point cloud and laser scan data of existing buildings and structures into accurate, working Revit models.",
    problemStatement:
      "Renovation, retrofit and asset-documentation projects often start with a scanned building and no usable model — the scan data alone isn't something a design team can work in directly.",
    overview: [
      "We convert point cloud and laser scan data into coordinated Revit models — architectural, structural and MEP as required — giving design teams a working BIM model of an existing building or structure to design from.",
      "This is commonly used for renovation and retrofit projects, heritage documentation, and facilities teams that need an accurate as-built model of existing assets.",
    ],
    deliverables: [
      "Revit models built from point cloud/scan data",
      "As-built architectural, structural and MEP models",
      "Model-derived 2D drawings",
      "Coordinated federated models for design use",
    ],
    applications: [
      "Renovation and retrofit projects",
      "Heritage building documentation",
      "Facilities and asset management",
      "Existing structure documentation for design teams",
    ],
    process: [
      { title: "Scan data intake", description: "Point cloud or laser scan data supplied, along with the modelling scope and LOD target." },
      { title: "Scope & quote", description: "Discipline coverage and deliverables confirmed before modelling starts." },
      { title: "Modelling", description: "Revit model built directly from the registered scan data." },
      { title: "Review", description: "Model checked against the scan for dimensional accuracy." },
      { title: "Delivery", description: "As-built model delivered, with drawings produced on request." },
    ],
    industries: ["construction", "energy", "manufacturing"],
    software: ["revit", "navisworks"],
    faqs: [
      { question: "Do you perform the laser scanning as well?", answer: "This service covers conversion of supplied point cloud/scan data into a BIM model. Let us know if you need scanning arranged and we can advise on scope." },
      { question: "What accuracy can I expect from a scan-to-BIM model?", answer: "Accuracy depends on the quality and density of the supplied scan data — this is discussed during scoping against your intended use for the model." },
      { question: "Can you model MEP as well as architectural and structural?", answer: "Yes, where the scan data supports it, all three disciplines can be modelled from the same point cloud." },
    ],
    relatedServices: ["revit-modelling", "bim-services", "cad-conversion"],
    relatedProjectCategories: ["bim"],
    seoTitle: "Scan to BIM Services India | IndCAD",
    seoDescription:
      "Scan to BIM services — converting point cloud and laser scan data into accurate, working Revit models for renovation, retrofit and asset documentation.",
  },

  // ---------------------------------------------------------------------
  // CAD CONVERSION
  // ---------------------------------------------------------------------
  {
    slug: "cad-conversion",
    name: "CAD Conversion",
    category: "cad-conversion",
    shortDescription: "PDF, scanned and legacy drawing conversion into editable, native CAD files.",
    heroHeading: "CAD Conversion Services",
    heroDescription:
      "Converting PDF, scanned and legacy drawings into editable, native CAD files — DWG, DGN and other formats — ready for design and documentation work.",
    problemStatement:
      "Legacy drawings — old PDFs, scanned paper drawings, superseded file formats — are common on long-running projects, but they're not directly usable for design changes, quoting or documentation. Redrawing them manually eats time that's better spent on the current project.",
    overview: [
      "We convert PDF, scanned, DGN and other legacy drawing formats into clean, editable CAD files in the format your team works in — typically DWG, but also other CAD-native formats on request.",
      "This includes 2D-to-3D conversion where a project needs a 3D model built from an existing 2D drawing set, and general CAD migration between platforms and formats.",
      "Conversion isn't a raster trace — drawings are redrawn as proper vector CAD data with correct layers, line weights and text, so the result is genuinely usable for further design work, not just a picture that looks like a drawing.",
    ],
    deliverables: [
      "Editable DWG files from PDF or scanned drawings",
      "DGN / MicroStation format conversion",
      "2D to 3D model conversion",
      "Vector conversion of raster/scanned drawings",
      "CAD platform migration",
      "Legacy drawing digitisation",
    ],
    applications: [
      "Legacy drawing digitisation",
      "As-built documentation from scanned records",
      "CAD platform migration",
      "Preparing existing drawings for design changes",
      "Archiving and drawing register clean-up",
    ],
    process: [
      { title: "File intake", description: "Source files supplied — PDF, scans, DGN or other legacy formats." },
      { title: "Scope & quote", description: "Output format, layer standard and turnaround confirmed before starting." },
      { title: "Conversion", description: "Drawings redrawn as clean, layered vector CAD data." },
      { title: "Quality check", description: "Converted files checked against the source for dimensional accuracy." },
      { title: "Delivery", description: "Editable CAD files delivered in the agreed format." },
    ],
    industries: ["construction", "manufacturing", "mining", "energy"],
    software: ["autocad", "microstation"],
    faqs: [
      { question: "Can you convert PDF drawings to CAD?", answer: "Yes — see our dedicated PDF to CAD service for converting PDF drawings into editable, native CAD files." },
      { question: "Is this a raster trace or proper vector CAD data?", answer: "Proper vector CAD data — drawings are redrawn with correct layers, line weights and text, not just traced as a raster image." },
      { question: "What formats can you convert to and from?", answer: "Common formats include PDF, scanned images, DWG and DGN, with delivery in your required native CAD format." },
      { question: "Can you convert a 2D drawing into a 3D model?", answer: "Yes, 2D to 3D conversion is available where a project needs a 3D model built from existing 2D documentation." },
    ],
    relatedServices: ["pdf-to-cad", "scan-to-bim", "mechanical-drafting"],
    relatedProjectCategories: ["mechanical", "structural", "civil"],
    seoTitle: "CAD Conversion Services India | IndCAD",
    seoDescription:
      "CAD conversion services — PDF to CAD, DGN conversion, 2D to 3D conversion and legacy drawing digitisation into editable, native CAD files.",
  },
  {
    slug: "pdf-to-cad",
    name: "PDF to CAD",
    category: "cad-conversion",
    shortDescription: "Converting PDF drawings into editable, layered DWG files.",
    heroHeading: "PDF to CAD Conversion",
    heroDescription:
      "Converting PDF drawings into clean, editable DWG files with correct layers, line weights and text — ready for design work, not just viewing.",
    problemStatement:
      "A PDF drawing is fine for reference, but it can't be edited, redlined in CAD, or used as the basis for a design change. Manually redrawing a PDF from scratch is a common but avoidable time sink for busy design teams.",
    overview: [
      "We convert PDF drawings — vector or scanned — into fully editable DWG files, redrawn with proper CAD layer structure, line weights and text rather than a raster trace.",
      "This applies to architectural, structural, mechanical, civil and electrical drawings, and can be scoped for single drawings or larger drawing sets.",
    ],
    deliverables: [
      "Editable DWG files from PDF source drawings",
      "Layered, standards-compliant CAD output",
      "Text and dimension data reproduced as native CAD entities",
      "Batch conversion for larger drawing sets",
    ],
    applications: [
      "Legacy drawing sets with no CAD source file",
      "Tender and as-built documentation",
      "Preparing existing drawings for design changes",
      "Drawing register digitisation",
    ],
    process: [
      { title: "File intake", description: "PDF drawings supplied, along with required output layer standard if you have one." },
      { title: "Scope & quote", description: "Drawing count, complexity and turnaround confirmed." },
      { title: "Conversion", description: "Each drawing redrawn as clean, layered vector CAD data." },
      { title: "Quality check", description: "Converted files checked against the source PDF for accuracy." },
      { title: "Delivery", description: "Editable DWG files delivered, ready for your team to work in." },
    ],
    industries: ["construction", "manufacturing", "mining"],
    software: ["autocad"],
    faqs: [
      { question: "Will the converted file be fully editable?", answer: "Yes — output is proper vector CAD data with layers, line weights and text as native entities, not a raster trace." },
      { question: "Can you convert scanned PDFs as well as digital ones?", answer: "Yes, both vector PDFs and scanned/raster PDFs can be converted." },
      { question: "Can you match our layer standard?", answer: "Yes, if you supply a layer standard or template we'll convert to match it." },
    ],
    relatedServices: ["cad-conversion", "scan-to-bim", "mechanical-drafting"],
    relatedProjectCategories: ["mechanical", "structural", "civil"],
    seoTitle: "PDF to CAD Conversion Services India | IndCAD",
    seoDescription:
      "PDF to CAD conversion — turning PDF drawings into fully editable, layered DWG files for Indian engineering, architectural and construction teams.",
  },

  // ---------------------------------------------------------------------
  // ENGINEERING DESIGN
  // ---------------------------------------------------------------------
  {
    slug: "engineering-design",
    name: "Engineering Design",
    category: "engineering-design",
    shortDescription: "Concept through detailed engineering design and technical documentation.",
    heroHeading: "Engineering Design Services",
    heroDescription:
      "Concept and detailed engineering design support, from early-stage development through to manufacturing-ready documentation.",
    problemStatement:
      "Not every project starts with a finished design — some start with a problem to solve. Engineering and product teams often need extra design capacity to take an idea through concept development, detailed design and into documentation a manufacturer or builder can actually use.",
    overview: [
      "We support engineering design work from concept through to detailed design and manufacturing documentation, working alongside your in-house engineers as extra capacity rather than a black-box outsourced team.",
      "This covers concept development and design options, detailed design and modelling, design optimisation and design-for-manufacturing review, and the engineering documentation needed to hand a design to production or construction.",
      "Where a project needs it, this service connects directly into our drafting disciplines — mechanical, structural, civil and electrical — so a design can move from concept straight into fabrication-ready documentation without a handover gap.",
    ],
    deliverables: [
      "Concept design options and development",
      "Detailed design and 3D models",
      "Design for manufacturing (DFM) review",
      "Engineering documentation and specifications",
      "Design optimisation and value engineering input",
      "Manufacturing support documentation",
    ],
    applications: [
      "New product development",
      "Equipment and machine design",
      "Design improvement of existing products",
      "Manufacturing readiness review",
      "Technical documentation for handover to production",
    ],
    process: [
      { title: "Brief", description: "Design intent, constraints and any existing concepts or requirements documented." },
      { title: "Scope & quote", description: "Design stages covered and deliverables confirmed before starting." },
      { title: "Concept development", description: "Design options developed and reviewed against the brief." },
      { title: "Detailed design", description: "Selected concept developed into a detailed, modelled design." },
      { title: "Documentation & handover", description: "Engineering documentation issued, ready for manufacturing or construction." },
    ],
    industries: ["manufacturing", "mining", "defence", "aerospace", "automotive", "energy"],
    software: ["solidworks", "inventor", "fusion-360", "autocad"],
    faqs: [
      { question: "What is engineering design as a service?", answer: "It covers the design work that sits ahead of and alongside drafting — concept development, detailed design, modelling and documentation that defines how a product or piece of equipment works before it's built." },
      { question: "Can you take a concept through to manufacturing documentation?", answer: "Yes, this service is scoped to cover as much or as little of that path as your project needs, from an early concept through to fabrication-ready drawings." },
      { question: "Do you work alongside our in-house engineers or independently?", answer: "Both — this can be scoped as standalone project work or as extra capacity working alongside your existing engineering team." },
      { question: "Can you review an existing design for manufacturability?", answer: "Yes, design-for-manufacturing review is available as a standalone service or as part of a broader design engagement." },
    ],
    relatedServices: ["mechanical-drafting", "3d-cad-modelling", "structural-drafting"],
    relatedProjectCategories: ["mechanical", "structural"],
    seoTitle: "Engineering Design Services India | IndCAD",
    seoDescription:
      "Engineering design services — concept development, detailed design, design optimisation and engineering documentation for Indian manufacturers and industrial teams.",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(category: string) {
  return services.filter((service) => service.category === category);
}
