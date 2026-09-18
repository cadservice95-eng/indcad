import type { Article } from "@/lib/types";

export const articles: Article[] = [
  // ------------------------------------------------------------------
  // BLOG
  // ------------------------------------------------------------------
  {
    slug: "preparing-drawings-for-cad-conversion",
    type: "blog",
    title: "How to Prepare Drawings for a CAD Conversion Project",
    excerpt:
      "What to gather and check before sending PDF, scanned or legacy drawings out for CAD conversion, so the converted files come back accurate the first time.",
    publishedAt: "2026-02-10",
    body: [
      {
        paragraphs: [
          "CAD conversion projects go faster and come back more accurate when the source material is organised before it's sent out. A few minutes of preparation on your end usually saves a round of back-and-forth once conversion starts.",
        ],
      },
      {
        heading: "Send the highest-resolution source you have",
        paragraphs: [
          "A vector PDF exported directly from CAD converts more reliably than a scanned print of the same drawing. If you only have a scan, send the highest-resolution version available — a low-resolution scan makes fine text and dimension lines harder to reproduce accurately.",
        ],
      },
      {
        heading: "Note any known inaccuracies in the source drawing",
        paragraphs: [
          "If the source drawing is known to be out of date, or has hand-marked corrections that should be included, flag this before conversion starts rather than after. A converted file is only as accurate as the source it was built from.",
        ],
      },
      {
        heading: "Decide your output standard upfront",
        paragraphs: [
          "If you have a layer standard, title block or naming convention you want the converted file to follow, supply it at the start. Reworking layer structure after conversion takes longer than applying it during the conversion itself.",
        ],
      },
      {
        heading: "What to check when the converted file comes back",
        paragraphs: ["Before accepting a converted drawing, it's worth checking:"],
        list: [
          "Key dimensions match the source drawing",
          "Text and dimension values are correct, not just visually similar",
          "Layers are structured usably, not just visually equivalent to the original",
          "The drawing scale is correct, not just the appearance of the drawing",
        ],
      },
    ],
    relatedServices: ["cad-conversion", "pdf-to-cad"],
    seoTitle: "How to Prepare Drawings for CAD Conversion | IndCAD",
    seoDescription: "Practical guidance on preparing PDF, scanned and legacy drawings for CAD conversion, and what to check before accepting the converted file.",
  },
  {
    slug: "pdf-to-cad-what-to-check",
    type: "blog",
    title: "PDF to CAD: What to Check Before You Accept a Converted File",
    excerpt: "A short checklist for verifying a PDF-to-CAD conversion is genuinely usable, not just visually similar to the original.",
    publishedAt: "2026-02-24",
    body: [
      {
        paragraphs: [
          "A PDF-to-CAD conversion can look correct at a glance and still cause problems downstream if the underlying data isn't clean. Before a converted drawing goes into active use, it's worth running a quick verification pass.",
        ],
      },
      {
        heading: "Check dimensions, not just appearance",
        paragraphs: [
          "Overlay or spot-check key dimensions against the original PDF. A drawing can look right on screen while a dimension value or line length is slightly off from the source.",
        ],
      },
      {
        heading: "Confirm layers are meaningful, not decorative",
        paragraphs: [
          "A well-converted file separates entities onto layers that reflect their function (walls, dimensions, text, hatching) rather than dumping everything onto one layer with different colours. This matters as soon as you try to edit the drawing.",
        ],
      },
      {
        heading: "Test that text and dimensions are live, not exploded",
        paragraphs: [
          "Native, editable text and dimension objects can be updated directly. If they've been converted as exploded geometry (lines and shapes with no editable text data), the file will look right but behave like a picture rather than a drawing.",
        ],
      },
    ],
    relatedServices: ["pdf-to-cad", "cad-conversion"],
    seoTitle: "PDF to CAD: What to Check Before You Accept a Converted File | IndCAD",
    seoDescription: "A practical checklist for verifying that a PDF-to-CAD conversion is genuinely editable and dimensionally accurate.",
  },
  {
    slug: "outsource-drafting-vs-in-house",
    type: "blog",
    title: "When to Outsource Drafting vs Hire In-House",
    excerpt: "A practical look at how engineering and construction teams decide between outsourced drafting support and hiring in-house.",
    publishedAt: "2026-03-05",
    body: [
      {
        paragraphs: [
          "Most engineering, manufacturing and construction teams end up using a mix of in-house and outsourced drafting capacity rather than choosing one model exclusively. The right balance usually comes down to how steady the workload is.",
        ],
      },
      {
        heading: "Outsourcing suits variable workload",
        paragraphs: [
          "If drafting demand spikes with specific projects or seasons, outsourced capacity avoids carrying a full-time drafter through the quiet periods. It also gives access to a broader spread of software and drawing standards without retraining an in-house team for every project type.",
        ],
      },
      {
        heading: "In-house suits constant, tightly integrated work",
        paragraphs: [
          "Where drafting is a daily, ongoing part of the design process — tightly looped in with engineers making real-time decisions — an in-house team embedded in that workflow can be more efficient than handing work back and forth externally.",
        ],
      },
      {
        heading: "A blended approach is common",
        paragraphs: [
          "Many teams keep a core in-house drafting capability for day-to-day work and use outsourced support for overflow, specific disciplines they don't have in-house, or projects that need extra capacity on a deadline.",
        ],
      },
    ],
    relatedServices: ["mechanical-drafting", "engineering-design"],
    seoTitle: "When to Outsource Drafting vs Hire In-House | IndCAD",
    seoDescription: "A practical comparison of outsourced drafting support and in-house drafting teams, and when each model makes sense.",
  },
  {
    slug: "reverse-engineering-a-legacy-part",
    type: "blog",
    title: "Reverse Engineering a Legacy Part: A Practical Walkthrough",
    excerpt: "What actually happens when an undocumented legacy part is reverse-engineered into a usable 3D model and drawing.",
    publishedAt: "2026-03-18",
    body: [
      {
        paragraphs: [
          "Reverse engineering comes up whenever a physical part needs to be replaced, modified or documented and no usable digital file exists for it. The process is fairly consistent regardless of the part's complexity.",
        ],
      },
      {
        heading: "1. Measurement and reference capture",
        paragraphs: [
          "The part is measured directly (with calipers, a CMM, or 3D scan data where available), along with photographs and notes on features that affect fit or function — thread types, surface finishes, critical tolerances.",
        ],
      },
      {
        heading: "2. Model reconstruction",
        paragraphs: [
          "A 3D CAD model is built from those measurements, structured so the feature tree reflects how the part would actually be manufactured rather than just replicating its final shape.",
        ],
      },
      {
        heading: "3. Tolerance and fit verification",
        paragraphs: [
          "Where the part mates with other components, tolerances are applied based on fit and function rather than just the measured value, since a single physical sample can carry its own manufacturing variation.",
        ],
      },
      {
        heading: "4. Drawing production",
        paragraphs: [
          "A manufacturing drawing is produced from the verified model, ready to be used for requoting, requalification or a design change.",
        ],
      },
    ],
    relatedServices: ["mechanical-drafting", "3d-cad-modelling"],
    seoTitle: "Reverse Engineering a Legacy Part: A Practical Walkthrough | IndCAD",
    seoDescription: "A step-by-step look at how an undocumented legacy part is reverse-engineered into a usable 3D model and manufacturing drawing.",
  },

  // ------------------------------------------------------------------
  // GUIDES
  // ------------------------------------------------------------------
  {
    slug: "levels-of-development-lod-in-bim",
    type: "guide",
    title: "A Practical Guide to Levels of Development (LOD) in BIM",
    excerpt: "What LOD actually means for a BIM model at each project stage, and why modelling to the wrong LOD wastes time in both directions.",
    publishedAt: "2026-01-20",
    body: [
      {
        paragraphs: [
          "Level of Development (LOD) describes how much geometric detail and reliable information a BIM model element carries at a given project stage. Getting the LOD target wrong in either direction causes problems: modelling too little detail early leaves gaps in coordination, modelling too much too soon wastes time on a design that's still likely to change.",
        ],
      },
      {
        heading: "Roughly, what each LOD band means",
        paragraphs: [],
        list: [
          "LOD 100–200: Conceptual and schematic — generalised shapes and approximate quantities, useful for early design and massing.",
          "LOD 300: Precise geometry — accurate size, shape and location, suitable for coordination and construction documentation.",
          "LOD 350: LOD 300 plus interface detail between systems — where elements connect to other building components, useful for multi-discipline coordination.",
          "LOD 400: Fabrication-level detail — enough to support fabrication and assembly directly from the model.",
        ],
      },
      {
        heading: "Set the LOD target before modelling starts",
        paragraphs: [
          "The most common cause of BIM coordination problems isn't poor modelling — it's mismatched expectations about LOD between disciplines. Agreeing a target LOD per stage (usually documented in a BIM Execution Plan) before modelling starts keeps the model useful without over-building it.",
        ],
      },
    ],
    relatedServices: ["bim-services", "revit-modelling"],
    seoTitle: "A Practical Guide to Levels of Development (LOD) in BIM | IndCAD",
    seoDescription: "What Level of Development (LOD) means at each BIM project stage, and why agreeing an LOD target upfront avoids coordination problems.",
  },
  {
    slug: "understanding-structural-steel-shop-drawings",
    type: "guide",
    title: "Understanding Structural Steel Shop Drawings",
    excerpt: "What a structural steel shop drawing actually shows, and how it differs from the structural engineer's design drawings.",
    publishedAt: "2026-02-02",
    body: [
      {
        paragraphs: [
          "Shop drawings are sometimes confused with the structural engineer's design drawings, but they serve a different purpose — one is a design document, the other is a fabrication instruction.",
        ],
      },
      {
        heading: "Design drawings vs shop drawings",
        paragraphs: [
          "A structural engineer's drawing set defines member sizes, loads and the overall structural design intent, usually with connections shown generically or by design capacity rather than exact detail. A shop drawing takes that design and adds the specific, member-by-member fabrication detail — exact bolt patterns, weld symbols, hole locations and piece marks — that a workshop actually cuts and welds from.",
        ],
      },
      {
        heading: "What's typically shown on a shop drawing",
        paragraphs: [],
        list: [
          "Piece marks identifying each individual fabricated component",
          "Exact member lengths, cuts and copes",
          "Bolt hole patterns and sizes",
          "Weld symbols and locations",
          "Connection detail specific to that member",
        ],
      },
      {
        heading: "Erection drawings are a separate but related document",
        paragraphs: [
          "Where shop drawings detail individual pieces, erection drawings show how those pieces come together on site — sequencing, orientation and overall layout — and are used by the site erection crew rather than the fabrication shop.",
        ],
      },
    ],
    relatedServices: ["steel-detailing", "structural-drafting"],
    seoTitle: "Understanding Structural Steel Shop Drawings | IndCAD",
    seoDescription: "A guide to what structural steel shop drawings show, how they differ from design drawings, and what erection drawings cover.",
  },
  {
    slug: "choosing-autocad-revit-civil-3d",
    type: "guide",
    title: "Choosing Between AutoCAD, Revit and Civil 3D for Your Project",
    excerpt: "A practical comparison of when a project calls for 2D drafting, BIM modelling, or civil design software.",
    publishedAt: "2026-03-01",
    body: [
      {
        paragraphs: [
          "These three platforms solve different problems, and many projects genuinely need more than one of them at different stages.",
        ],
      },
      {
        heading: "AutoCAD — 2D drafting and documentation",
        paragraphs: [
          "AutoCAD remains the standard for straightforward 2D drawing production — layout drawings, schematics, general arrangements — where the deliverable is a drawing, not a coordinated 3D model.",
        ],
      },
      {
        heading: "Revit — coordinated building information modelling",
        paragraphs: [
          "Revit is the standard choice when a building project needs architectural, structural and MEP models coordinated against each other, with drawings derived from a single, data-rich 3D model rather than drawn independently.",
        ],
      },
      {
        heading: "Civil 3D — land development and site design",
        paragraphs: [
          "Civil 3D is purpose-built for land development work — surfaces, grading, road alignments and stormwater design — where the design itself depends on terrain and survey data in a way general CAD or BIM tools don't handle natively.",
        ],
      },
      {
        heading: "In practice",
        paragraphs: [
          "A single project might use Civil 3D for site and road design, Revit for the building itself, and AutoCAD for supplementary 2D details — the choice depends on what each deliverable actually needs to do, not a single platform preference.",
        ],
      },
    ],
    relatedServices: ["civil-drafting", "bim-services", "architectural-drafting"],
    seoTitle: "Choosing Between AutoCAD, Revit and Civil 3D | IndCAD",
    seoDescription: "A practical guide to when a project calls for AutoCAD, Revit or Civil 3D, and why many projects use more than one.",
  },

  // ------------------------------------------------------------------
  // STANDARDS
  // ------------------------------------------------------------------
  {
    slug: "indian-standards-structural-steel-detailing",
    type: "standard",
    title: "Indian Standards Relevant to Structural Steel Detailing",
    excerpt: "An overview of the Indian Standards (IS codes) commonly referenced in structural steel design and detailing work.",
    publishedAt: "2026-01-12",
    body: [
      {
        paragraphs: [
          "Structural steel detailing in India is typically carried out with reference to a small set of core Bureau of Indian Standards (BIS) codes. This page is a general overview for orientation only — the specific standards, editions and clauses that apply to your project are determined by your structural engineer and the project's certifying authority, and should always be confirmed directly against your project documentation.",
        ],
      },
      {
        heading: "Commonly referenced standards",
        paragraphs: [],
        list: [
          "IS 800 — General Construction in Steel: the core design code of practice for steel structures in India.",
          "IS 7215 — Tolerances for Fabrication of Steel Structures: covers fabrication tolerance requirements.",
          "IS 816 — Code of Practice for Use of Metal Arc Welding: covers welding requirements referenced in fabrication.",
          "IS 962 — Code of Practice for Architectural and Building Drawings: general drafting and drawing convention standard.",
        ],
      },
      {
        heading: "Detailing supports the engineer's specification",
        paragraphs: [
          "Steel detailing translates the structural engineer's design — which specifies the applicable standard and construction category — into fabrication drawings. Compliance with a given standard is a function of the engineering design and fabrication process as a whole, not something a drafting service can certify independently. Always confirm current, project-specific standards requirements with your structural engineer.",
        ],
      },
    ],
    relatedServices: ["steel-detailing", "structural-drafting"],
    seoTitle: "Indian Standards Relevant to Structural Steel Detailing | IndCAD",
    seoDescription: "An overview of Indian Standards (IS codes) commonly referenced in structural steel design and detailing, for general orientation.",
  },
  {
    slug: "drawing-standards-and-title-blocks",
    type: "standard",
    title: "Drawing Standards and Title Block Conventions for Indian Projects",
    excerpt: "A general overview of common Indian drawing conventions — title blocks, revision control and sheet sizing.",
    publishedAt: "2026-01-28",
    body: [
      {
        paragraphs: [
          "Most Indian engineering and construction drawings follow broadly similar conventions for sheet sizing, title blocks and revision control, even where individual practices and companies use their own specific templates.",
        ],
      },
      {
        heading: "Sheet sizes",
        paragraphs: [
          "ISO A-series sheet sizes (A0 down to A4) are standard across architectural, structural, civil and mechanical drafting in India, consistent with IS 962 conventions, with A1 and A3 being common working sizes for construction and fabrication drawings respectively.",
        ],
      },
      {
        heading: "Title block content",
        paragraphs: [],
        list: [
          "Project name and drawing title",
          "Drawing number and sheet reference",
          "Revision number and revision history",
          "Scale, drawn-by and checked-by fields",
          "Issuing company or practice details",
        ],
      },
      {
        heading: "Revision control",
        paragraphs: [
          "Consistent revision lettering or numbering (and a clear revision history table) is what keeps a drawing set traceable through design changes — this matters as much on a small project as a large one, since confusion over which revision is current is a common source of costly on-site errors.",
        ],
      },
    ],
    relatedServices: ["mechanical-drafting", "structural-drafting", "architectural-drafting"],
    seoTitle: "Drawing Standards and Title Block Conventions | IndCAD",
    seoDescription: "A general overview of common Indian drawing conventions for sheet sizing, title blocks and revision control.",
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByType(type: string) {
  return articles.filter((article) => article.type === type);
}
