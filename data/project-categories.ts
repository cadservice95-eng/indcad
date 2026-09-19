import type { ProjectCategorySlug, FAQItem, ContentSection } from "@/lib/types";

export const projectCategories: {
  slug: ProjectCategorySlug;
  name: string;
  description: string;
  intro: ContentSection[];
  faqs: FAQItem[];
}[] = [
  {
    slug: "mechanical",
    name: "Mechanical",
    description: "Mechanical drafting, 3D CAD modelling and manufacturing documentation projects.",
    intro: [
      {
        heading: "What This Category Covers",
        paragraphs: [
          "Mechanical projects make up a large share of the work we take on, spanning everything from a single reverse-engineered spare part through to full fabrication drawing packages for custom equipment. What ties this category together isn't any single deliverable type, but the underlying discipline of producing documentation a workshop can genuinely build from without needing to call back to the design office for clarification.",
          "The examples below are illustrative — clearly marked placeholder case studies that demonstrate the kind of mechanical drafting, 3D CAD modelling and manufacturing documentation work this service covers, rather than a record of specific past clients. They're structured the way we'd document a real project: challenge, scope, process, deliverables, key considerations and outcome, so you can see how a typical mechanical engagement is actually run from brief to delivery.",
        ],
      },
      {
        heading: "Where a Mechanical Project Typically Starts",
        paragraphs: [
          "Mechanical work in this category typically starts from one of three positions — a concept sketch that needs to become a manufacturable design, a physical part with no digital documentation that needs to be reverse-engineered, or an existing model or drawing set that needs updating through a design change. Each starting point demands a slightly different approach, and the case studies below reflect that range.",
          "A recurring theme across the mechanical examples is that the technically obvious solution isn't always the practically correct one — a flat pattern that looks right in software but ignores a specific press brake's real behaviour, or a reverse-engineered dimension that captures wear rather than original design intent, are the kinds of gaps that separate documentation that merely looks complete from documentation that's actually reliable.",
        ],
      },
      {
        heading: "Deadlines, Configuration and Traceability",
        paragraphs: [
          "Turnaround pressure shows up differently across mechanical projects than it does in other disciplines — a manufacturer's procurement lead time, a customer delivery commitment, or a production changeover date all create real deadlines that shape how a drafting engagement gets sequenced, and the examples below illustrate how we plan around these constraints rather than treating drafting as an isolated task disconnected from the client's broader production schedule.",
          "Configuration management and traceability are more central to mechanical drafting than they might first appear — a manufacturer supporting several related product variants, or a sustainment programme needing a documented basis for every dimension on a reverse-engineered part, both depend on documentation practices that go beyond simply producing a technically correct drawing.",
        ],
      },
      {
        heading: "Getting Tolerancing and Material Selection Right",
        paragraphs: [
          "Tolerancing decisions run through almost every mechanical project in this category in ways that aren't always visible in the finished drawing alone — a tolerance that's tighter than a design genuinely requires drives up manufacturing cost for no real functional benefit, while one that's too loose risks a fit or assembly problem discovered only once parts reach the shop floor. Getting this balance right depends on understanding how a part actually functions and mates with its neighbours, not just replicating whatever tolerance happened to appear on a reference drawing.",
          "Material selection and its knock-on effect on manufacturability is another thread that runs through mechanical documentation — a design that's dimensionally sound but specifies a material poorly suited to the intended manufacturing process creates real difficulty for whoever eventually has to produce it, and the case studies below illustrate how material and process considerations get factored into drafting decisions rather than treated as a separate concern handled elsewhere.",
        ],
      },
      {
        heading: "Assembly Documentation and Managing Change",
        paragraphs: [
          "Assembly-level documentation carries its own distinct challenges beyond individual part drawings — bill of materials accuracy, clear assembly sequencing notes, and interference checking between mating components all matter more as an assembly grows in part count, and the examples below reflect how this scales from a simple two-part bracket assembly through to a more complex multi-component machine build.",
          "Where a mechanical project involves an existing product being revised rather than designed from scratch, change management becomes a central concern — tracking exactly what changed between revisions, understanding which downstream documents (bills of materials, purchasing specifications, quality inspection plans) need to update in step, and avoiding a situation where an old and new part revision are both in circulation without anyone being quite sure which is current.",
        ],
      },
      {
        heading: "Design for Manufacture and Supplier Coordination",
        paragraphs: [
          "Design for manufacture and assembly considerations show up throughout mechanical drafting even when they aren't the explicit focus of a project — a part that's technically correct geometrically but genuinely awkward to machine, weld or assemble creates real downstream cost, and experienced mechanical drafting anticipates these practical difficulties rather than leaving them to be discovered during production.",
          "Supplier and vendor coordination is a practical reality behind many mechanical projects — drawings sometimes need to communicate not just final geometry but enough manufacturing context for a supplier unfamiliar with a client's specific product to quote and produce accurately, and this shapes how much explanatory detail and note content a drawing set carries beyond the pure geometric definition.",
        ],
      },
      {
        heading: "From Prototype to Production",
        paragraphs: [
          "Prototype-to-production transitions are a recurring mechanical project type in this category — a design proven through a single prototype build often needs meaningful drafting rework before it's genuinely ready for repeatable production, addressing tolerances, fixturing assumptions and inspection requirements that a one-off prototype build didn't need to consider.",
          "Inspection and quality documentation increasingly accompanies mechanical drawing packages, particularly for parts entering a regulated supply chain — first article inspection reports, dimensional inspection plans and characteristic call-outs all depend on the underlying drawing being structured clearly enough to support them, and the case studies below reflect drawings produced with this downstream quality requirement already in mind.",
        ],
      },
      {
        heading: "Weight Accuracy and Outsourced Manufacture",
        paragraphs: [
          "Weight and mass property accuracy matters more in certain mechanical projects than others — an assembly destined for a weight-sensitive application, or one where mass properties feed directly into a separate structural or dynamic analysis, depends on models built with genuine attention to material assignment and volume accuracy, not just visual geometric correctness.",
          "Where a mechanical project involves outsourced or multi-vendor manufacture, drawing clarity becomes especially important since there's no opportunity for a quick informal clarification the way there might be with an in-house drafter sitting nearby — the case studies below reflect the more complete, self-contained documentation this kind of arrangement genuinely requires.",
        ],
      },
      {
        heading: "Standard Parts, Spares and the Underlying Test",
        paragraphs: [
          "Standard parts and catalogue component integration is a practical, everyday part of mechanical drafting that's easy to overlook — correctly specifying and referencing standard fasteners, bearings and off-the-shelf components, rather than redrawing them as bespoke geometry, keeps a drawing set both accurate and efficient to produce, and the case studies below reflect this kind of disciplined, practical modelling choice throughout.",
          "Documentation for maintenance and spare parts planning is a natural extension of well-organised mechanical drafting — a drawing set structured clearly enough to support day-to-day design and manufacturing also tends to serve a maintenance team well later, identifying wear parts and consumables clearly enough to support future spares planning without needing a separate documentation exercise.",
          "Finally, across every mechanical example in this category, the underlying test is the same: would a workshop unfamiliar with the project be able to build confidently and correctly from this drawing set alone, without needing to call back for clarification on anything genuinely important to getting the part right.",
        ],
      },
      {
        heading: "Cosmetic Finish and When GD&T Is Warranted",
        paragraphs: [
          "Surface finish and cosmetic requirements, particularly for consumer-facing products, add a layer of specification beyond pure functional geometry — call-outs for grain direction, visible weld grinding, or a specific surface texture need to be communicated clearly enough that a machinist or fabricator understands exactly which surfaces the requirement applies to and which don't.",
          "GD&T (geometric dimensioning and tolerancing) application, where a project's precision requirements genuinely warrant it, replaces a simpler plus-or-minus tolerancing approach with a more precise, functionally grounded specification of form, orientation and position — and knowing when this added rigour is actually warranted, versus when simpler tolerancing serves a project just as well without unnecessary complexity, is itself a meaningful drafting judgement.",
        ],
      },
    ],
    faqs: [
      { question: "What kind of mechanical projects do you typically take on?", answer: "Everything from single-part fabrication drawings and reverse engineering through to full assembly documentation packages for custom equipment — see our mechanical drafting and 3D CAD modelling service pages for the full scope." },
      { question: "Are these case studies from real clients?", answer: "No — these are clearly labelled illustrative examples used to demonstrate the format and depth of a typical mechanical project, not records of specific past clients. Real, verified case studies will replace these as they become available." },
      { question: "Do mechanical projects typically involve reverse engineering, or mostly new design work?", answer: "Both are common — the split depends heavily on the client's situation, whether that's a legacy part with no digital record or a genuinely new product being developed from scratch." },
      { question: "How do you handle a mechanical project with a tight, externally-driven deadline?", answer: "We identify what's actually driving the deadline — a procurement lead time, a customer commitment, a production changeover — and sequence the drafting work to support that specific constraint rather than treating it as a generic rush job." },
      { question: "Can mechanical drafting support a product family with several related variants?", answer: "Yes, configuration-driven modelling approaches, illustrated in one of the examples below, are a common way to support related variants without maintaining fully separate, diverging files." },
      { question: "What level of traceability is typical for mechanical reverse-engineering documentation?", answer: "This varies by project and industry — a general manufacturing spare part might need only basic dimensional confidence notes, while a defence sustainment part typically needs a fully documented basis for every critical dimension, as one of the examples below illustrates." },
      { question: "Do mechanical projects in this category typically involve sheet metal work?", answer: "Sheet metal fabrication is common, and one of the examples below specifically covers a sheet metal enclosure, including bend allowance calibration and configuration-driven modelling for related variants." },
      { question: "How do these examples handle a manufacturer's procurement or production scheduling constraints?", answer: "By sequencing drawing release to support material procurement or a production changeover date, illustrated in the sheet metal enclosure example, rather than treating drafting as disconnected from the client's broader schedule." },
      { question: "Can mechanical drafting projects involve defence or sustainment-specific requirements?", answer: "Yes, one of the examples below covers a defence-adjacent reverse-engineering project with the traceability and documented-basis requirements typical of a sustainment programme." },
      { question: "What software is typically used across mechanical projects like these?", answer: "SolidWorks features in both examples below, though the specific platform is scoped to match your team's existing environment rather than a fixed default." },
      { question: "How detailed are the outcome sections in these mechanical case studies?", answer: "Each example describes what was delivered and what practical difference the specific approach made, illustrating results in realistic, non-quantified terms rather than invented performance figures." },
      { question: "Can I request a mechanical project example closer to my own specific use case?", answer: "Get in touch with your project's specifics — while these illustrative examples cover common scenarios, we're happy to discuss how a similar approach would apply to your particular part or assembly." },
    ],
  },
  {
    slug: "structural",
    name: "Structural",
    description: "Structural drafting, steel detailing and structural BIM projects.",
    intro: [
      {
        heading: "What This Category Covers",
        paragraphs: [
          "Structural projects in this category cover the detailing work that turns a structural engineer's design into documentation a fabricator or builder can actually price, build and erect from — shop drawings, erection drawings, connection detail and, where a project calls for it, a coordinated structural BIM model.",
          "The examples below are illustrative placeholder case studies, structured to show how a typical structural detailing engagement runs in practice — including the kind of site, schedule and fabrication-shop constraints that shape real detailing decisions, not just the theoretical structural design itself.",
        ],
      },
      {
        heading: "Technically Correct Isn't Always Good Enough",
        paragraphs: [
          "A recurring theme across structural work is that a technically correct connection or member detail isn't automatically a good one — constructability, fabrication shop capacity, and site erection sequencing all shape what a genuinely usable structural drawing set looks like, and the case studies below illustrate how those practical constraints get factored into the detailing process.",
        ],
      },
      {
        heading: "Detailing Against an Existing (Brownfield) Structure",
        paragraphs: [
          "Brownfield structural work carries its own specific character across these examples — existing structures rarely match their original drawings after years of undocumented modification, and detailing a new connection or addition against an existing structure genuinely depends on verifying real, current conditions rather than trusting historical records at face value.",
        ],
      },
      {
        heading: "Working to Fixed Deadlines and Future Plans",
        paragraphs: [
          "Fixed deadlines — a booked crane date, a shutdown window — appear repeatedly across structural projects, and much of what separates a smooth detailing engagement from a stressful one comes down to how well fabrication capacity, site access constraints and erection sequencing are understood and planned for before drawings are finalised, not after.",
          "Forward-looking considerations, like a possible future building extension or a structure that may need to be relocated later, sometimes shape current-day detailing decisions in small but meaningful ways, and the examples below show how these get incorporated without expanding the scope of the immediate project.",
        ],
      },
      {
        heading: "Documentation for Several Audiences at Once",
        paragraphs: [
          "Structural documentation in this category needs to hold up under scrutiny from several different audiences at once — the engineer confirming design intent has been correctly translated, the fabricator working out how to actually cut and weld each piece, and the erector figuring out sequencing on site — and a drawing set that serves one of these audiences well while confusing another isn't really doing its job, however technically accurate any single sheet might be in isolation.",
          "Coordination with other trades is a growing part of structural detailing as buildings become more services-dense — a structural member that clashes with ductwork, cable tray or plumbing discovered only after fabrication is a significant and entirely avoidable cost, and the examples below reflect how early coordination against other discipline models heads this off before it becomes an expensive site problem.",
        ],
      },
      {
        heading: "Load Path, Connection Capacity and Revisions",
        paragraphs: [
          "Load path and connection capacity checking sits at the centre of structural detailing quality — a connection that looks reasonable in isolation can still fail to deliver the capacity a design actually requires if load path assumptions aren't carried through consistently from the engineer's design into the detailed connection, and the case studies below show how this gets verified rather than assumed.",
          "Revision management on structural projects deserves particular care given how much can change between a tender-stage steel package and its final for-construction issue — a fabricator working from an outdated drawing revision can genuinely cut and weld a piece that no longer matches current design intent, and the examples below reflect the kind of disciplined revision tracking that prevents this.",
        ],
      },
      {
        heading: "Material Take-Offs and Weld Access",
        paragraphs: [
          "Material take-off accuracy is a quieter but genuinely consequential part of structural detailing — a take-off that doesn't precisely match what the drawings actually show creates procurement and cost problems well before fabrication even starts, and the examples below reflect a detailing process where take-offs and bolt lists are generated directly from the same model or drawing set used to produce the shop drawings themselves, rather than compiled independently.",
          "Weld access and sequencing considerations shape connection design more than is often appreciated from outside the fabrication process — a connection that's structurally sound on paper can be genuinely difficult or unsafe for a welder to actually execute if access and sequencing weren't considered during detailing, and the case studies below reflect this kind of practical, fabrication-aware connection design.",
        ],
      },
      {
        heading: "Staged, Multi-Storey Projects",
        paragraphs: [
          "Multi-storey and staged structural projects introduce their own specific detailing complexity, since different levels or zones of a structure often progress through detailing, fabrication and erection at different rates simultaneously, and keeping this staged progress coordinated without pieces arriving on site out of the sequence they're needed is a real, ongoing planning challenge reflected in how these projects get detailed.",
        ],
      },
      {
        heading: "Finishing, Seismic Loads and Temporary Works",
        paragraphs: [
          "Surface protection and finishing specification — galvanizing, painting systems, fireproofing — needs to be coordinated with the detailing itself rather than treated as a separate downstream concern, since certain connection types and fabrication sequences interact with finishing requirements in ways that are far cheaper to address during detailing than after fabrication has already started.",
          "Seismic and wind load detailing considerations, where relevant to a project's location and structure type, introduce connection requirements that go beyond standard gravity-load connection design, and the case studies below reflect the additional verification and detailing rigour these conditions call for.",
          "Temporary works coordination — bracing, propping, erection sequencing aids — sits adjacent to permanent structural detailing but genuinely affects it, since a permanent connection detail sometimes needs to account for a temporary condition during construction that won't exist once the structure is complete, and overlooking this distinction is a recurring, avoidable source of on-site friction.",
        ],
      },
      {
        heading: "Fabrication Shop Feedback and Certification Records",
        paragraphs: [
          "Fabrication shop feedback loops, where a shop flags a practical difficulty with a detail before cutting begins, are a valuable but easy-to-skip step under deadline pressure — the case studies below reflect an approach that welcomes this feedback and adjusts detailing accordingly, rather than treating shop drawings as a one-directional handoff that fabrication simply has to accommodate regardless of practicality.",
          "Documentation for structural inspection and certification sign-off needs to align clearly with what was actually detailed and fabricated, and keeping as-built structural records consistent with what was inspected and approved is a discipline that pays off well beyond project completion, particularly if the structure is ever queried, modified or extended later.",
        ],
      },
      {
        heading: "Crane, Lifting and the Underlying Test",
        paragraphs: [
          "Crane and lifting considerations shape piece sizing and connection design in ways that go beyond pure structural capacity — a piece that's structurally efficient as a single unit but exceeds practical crane capacity or reach for a specific site needs to be reconsidered at the detailing stage, not discovered as a problem once erection is already underway.",
          "Ultimately, structural detailing in this category is judged by a simple practical test that runs through every example below: does the drawing set let a fabricator and an erector build exactly what the engineer designed, safely, efficiently and without needing to guess at intent the drawings should have made explicit.",
        ],
      },
      {
        heading: "Corrosion Protection and Bolt Access",
        paragraphs: [
          "Coating and corrosion protection detailing carries particular importance in India's varied climate conditions — a coastal industrial structure and an inland warehouse face genuinely different corrosion risk profiles, and the case studies below reflect detailing that accounts for the actual environmental exposure a specific structure will face rather than a single generic protection specification applied regardless of location.",
          "Bolt tensioning and inspection access is a practical detail worth planning for during the connection design itself — a connection that's structurally sound but leaves no realistic access for the required tensioning tool or subsequent inspection creates a genuine site problem that detailing could have avoided with a small adjustment made early.",
        ],
      },
      {
        heading: "Handling Points and Bearing Design",
        paragraphs: [
          "Handling and lifting point detailing on individual fabricated pieces, distinct from overall crane capacity planning, ensures each piece can actually be lifted and manoeuvred safely on site without relying on an improvised lifting arrangement worked out informally once the piece has already arrived.",
          "Bearing and support detailing at column bases and beam supports carries particular importance for load transfer accuracy, and getting this detail right depends on close coordination with the foundation or supporting structure design, not just the steel superstructure in isolation.",
        ],
      },
    ],
    faqs: [
      { question: "Do these structural examples include full BIM coordination?", answer: "Some do, where the illustrative project involves coordination with other discipline models — see our structural drafting and BIM services pages for how that coordination process works on a real project." },
      { question: "Can you detail steel structures for brownfield or shutdown-window projects?", answer: "Yes, one of the examples below specifically illustrates the kind of site-verification and staged-delivery approach a brownfield shutdown project typically needs." },
      { question: "How do fixed deadlines like a crane booking affect structural detailing?", answer: "They shape how detailing gets sequenced and how much buffer is built in for fabrication and delivery — one of the examples below illustrates this planning process directly." },
      { question: "Can structural drawings account for a fabricator's specific bolt and welding capacity?", answer: "Yes, checking connection detail against a specific fabricator's actual capability, illustrated in one of the examples below, is a common and valuable part of the detailing process." },
      { question: "Do you review structural designs for future extension or relocation compatibility?", answer: "Yes, where a client flags this as a consideration, a focused compatibility review can be scoped without expanding the current project into designing that future work." },
      { question: "Do these structural examples cover both warehouse and industrial plant structures?", answer: "Yes, one example covers a new warehouse frame and another covers a brownfield processing plant platform, giving a sense of how detailing approach adapts to different structural contexts." },
      { question: "How do these examples handle site verification when existing drawings are unreliable?", answer: "By prioritising verification of the connection points the new design actually depends on within whatever access window is available, illustrated in the processing plant example, rather than assuming full re-survey is always possible." },
      { question: "What software is used across these structural examples?", answer: "Tekla Structures is used in both examples, reflecting its common role in structural steel detailing that needs fabrication-level connection accuracy." },
      { question: "Do these examples address coordination with a fabrication shop's actual capacity?", answer: "Yes, checking bolt and welding capacity with the fabricator before finalising connection details, illustrated in the warehouse example, is a specific and recurring theme." },
      { question: "Can structural detailing examples like these apply to a smaller, simpler steel package?", answer: "Yes, the same underlying discipline — checking constructability, verifying existing conditions, planning around real deadlines — applies regardless of project scale, even if a smaller package needs less of each." },
    ],
  },
  {
    slug: "civil",
    name: "Civil",
    description: "Civil drafting and construction documentation for land development and site works.",
    intro: [
      {
        heading: "What This Category Covers",
        paragraphs: [
          "Civil projects in this category cover site and subdivision documentation, road and stormwater design, and general construction documentation for land development, produced in coordination with a civil engineer's design and, where relevant, a specific certifying authority's requirements.",
          "The examples below are illustrative placeholder case studies, chosen to show how civil documentation decisions are actually made in practice — how grading and drainage modelling can genuinely reshape a subdivision layout, or how limited survey data gets handled honestly rather than papered over with unstated assumptions.",
        ],
      },
      {
        heading: "Keeping a Drawing Set Internally Consistent",
        paragraphs: [
          "Civil work in this category tends to be judged on internal consistency as much as individual drawing quality — a site plan, a grading plan and a stormwater drawing that don't quite agree with each other create exactly the kind of confusion that generates costly queries during approval or construction, and the case studies below reflect how we approach keeping a civil drawing set coordinated as a design develops.",
          "Staged delivery is a common thread across civil projects — a subdivision released in stages to match a developer's finance arrangements, or a road corridor issued early to support a parallel approval process, both require documentation structured to support progressive decision-making rather than assuming a single, all-at-once design and construction sequence.",
        ],
      },
      {
        heading: "External Constraints and Earthworks Cost",
        paragraphs: [
          "Constraints outside the immediate site — an easement corridor, a bushfire assessment overlay, a specific council's submission checklist — recur across civil projects, and the case studies below show how these get identified and worked into a design early, rather than discovered as a problem late in the approval process.",
          "Earthworks balance and cost sensitivity run through nearly every civil project in this category — a grading design that requires importing or exporting large volumes of fill material adds real, often underestimated cost to a project, and the case studies below reflect how surface modelling gets used deliberately to minimise unnecessary cut-and-fill volume rather than optimising purely for finished grade appearance.",
        ],
      },
      {
        heading: "Stormwater Performance and Utility Coordination",
        paragraphs: [
          "Stormwater design in this category needs to satisfy both an immediate regulatory approval requirement and a genuine, longer-term performance expectation — a drainage system that technically satisfies a design storm calculation on paper but performs poorly in practice during a real, unusual rainfall event reflects a documentation gap that's easy to miss if compliance is treated as the only design objective.",
          "Utility coordination is an increasingly central, if less visible, part of civil documentation — confirming existing service locations, coordinating new utility corridors against other site infrastructure, and avoiding a clash between a stormwater line and a power or telecommunications conduit are all part of producing a civil drawing set that survives contact with real construction conditions.",
        ],
      },
      {
        heading: "Master-Planned Developments and Construction Support",
        paragraphs: [
          "Where a civil project sits within a larger master-planned development, documentation needs to stay coordinated not just internally but against the master plan's own evolving constraints — a lot layout or road alignment finalised in isolation from the broader development plan risks a costly rework once the two are reconciled, and the case studies below reflect how this broader coordination gets managed.",
          "Construction-stage support is an underappreciated extension of civil documentation work — a design that was entirely sound at approval stage can still encounter a real site condition during construction that the original drawings didn't anticipate, and how quickly and clearly a documentation team can respond to that kind of field query has a real, direct effect on whether construction stays on programme.",
        ],
      },
      {
        heading: "Long-Term Asset Handover",
        paragraphs: [
          "Long-term asset handover considerations increasingly shape civil documentation on infrastructure and larger development projects — drawings and models produced for construction are, more often now than in the past, expected to transition into an asset owner's long-term maintenance and management systems, and the case studies below reflect documentation practices that support this transition rather than treating construction completion as the final point of relevance.",
          "Interfacing with existing infrastructure — tying a new road into an existing network, connecting new stormwater infrastructure into an existing municipal system — carries its own specific verification burden, since the assumptions behind existing infrastructure aren't always documented reliably, and confirming real conditions before finalising a design that depends on them is a recurring theme across the case studies below.",
        ],
      },
      {
        heading: "Environmental Constraints and Buildability",
        paragraphs: [
          "Environmental and geotechnical constraints shape civil design decisions in ways that need to be reflected consistently across an entire drawing set — a soil condition, a flood overlay or an environmentally sensitive area affects grading, road design and drainage simultaneously, and the case studies below reflect how these constraints get carried through every affected drawing rather than addressed only where they're most obviously relevant.",
          "Construction sequencing and staging plans are an often underappreciated civil deliverable in their own right — a design that's sound in its finished state can still be genuinely difficult to build if construction access, staging areas and sequencing weren't considered during design, and the case studies below reflect documentation that anticipates how a site will actually be built, not only how it will look once complete.",
        ],
      },
      {
        heading: "Quantity Take-Offs and Stakeholder Communication",
        paragraphs: [
          "Quantity take-offs derived from a coordinated civil model carry real weight in tender and procurement decisions, and keeping these take-offs accurate as a design evolves depends on the same underlying model discipline that keeps the drawing set itself internally consistent — a take-off generated independently from an outdated design iteration is a common and costly source of budget surprise.",
          "Public and stakeholder consultation processes, common on larger civil and infrastructure projects, often depend on clear, accessible drawings and visualisations that a non-technical audience can genuinely understand, and the case studies below reflect how technical civil documentation gets translated into something useful for this broader audience without compromising its underlying technical accuracy.",
        ],
      },
      {
        heading: "As-Constructed Records and Traffic Management",
        paragraphs: [
          "As-constructed documentation at project completion closes the loop on a civil project's documentation lifecycle, and the accuracy of this final record matters well beyond the immediate construction period — it's frequently the primary reference for any future work on or near the same site, and the case studies below reflect the same care applied to as-constructed records as to the original design documentation.",
          "Traffic management and construction-phase access planning, while sometimes treated as a separate contractor responsibility, benefits from being considered during civil design itself — a road or site layout that inadvertently makes construction-phase traffic management genuinely difficult imposes real, avoidable cost on whoever eventually builds it.",
        ],
      },
      {
        heading: "The Underlying Standard and Monsoon Conditions",
        paragraphs: [
          "Across every civil example in this category, the same underlying standard applies: does the drawing set give a contractor, an approval authority and a future asset owner a consistent, reliable basis for building, approving and maintaining the finished works, not just a design that looks correct on the day it's issued.",
          "Monsoon and seasonal water management is a genuinely important consideration for Indian civil projects specifically, since a drainage and grading design that performs adequately in a moderate rainfall event can still fail under monsoon-intensity conditions if it wasn't specifically checked against that realistic seasonal extreme rather than a generic design storm figure.",
        ],
      },
      {
        heading: "Statutory Coordination and Erosion Control",
        paragraphs: [
          "Coordination with utility providers and statutory authorities beyond the primary approval authority — power, water, telecommunications — often runs on its own separate timeline that a civil project's documentation needs to accommodate, and the case studies below reflect how this parallel coordination gets planned for rather than treated as an afterthought once the core design is otherwise complete.",
          "Erosion and sediment control documentation during the construction phase itself, distinct from the permanent stormwater design, is an area that's easy to under-resource relative to its actual regulatory and environmental importance, and the case studies below reflect the same documentation discipline applied to construction-phase controls as to the permanent design.",
        ],
      },
      {
        heading: "Pavement Design for Real Traffic Loading",
        paragraphs: [
          "Pavement and road surface design specification needs to reflect actual expected traffic loading rather than a generic default, since under-specifying pavement thickness or material for genuine expected use is a common source of premature road surface failure well before its intended design life.",
        ],
      },
    ],
    faqs: [
      { question: "Do these civil examples include Civil 3D modelling?", answer: "Yes, the illustrative examples below reflect a typical Civil 3D-based workflow — see our civil drafting service page for more on how surface, grading and drainage modelling is coordinated across a drawing set." },
      { question: "Can you work with limited or incomplete survey data?", answer: "Yes, one of the examples below specifically illustrates how we handle a site with limited existing survey coverage, flagging confidence levels rather than treating the whole site as equally well understood." },
      { question: "Can civil documentation support a staged subdivision or road delivery programme?", answer: "Yes, one of the examples below shows how documentation can be structured to support progressive approval and construction stages rather than a single all-at-once package." },
      { question: "How do you handle a site constraint like an easement or environmental overlay?", answer: "We incorporate it explicitly into the design and check for compliance before the plan is finalised, as illustrated in one of the examples below, rather than treating it as a detail to resolve later." },
      { question: "Can civil drafting support a project running in parallel with a separate approval process?", answer: "Yes, issuing a specific deliverable — like a confirmed road alignment — early enough to support a parallel process is a common and achievable approach, illustrated in one of the examples below." },
      { question: "Do these civil examples cover both subdivision and infrastructure access projects?", answer: "Yes, one covers a residential subdivision's road, stormwater and lot layout, and the other covers access road and drainage design for an energy infrastructure site." },
      { question: "How is Civil 3D used across these examples?", answer: "Both examples rely on Civil 3D's dynamic surface modelling to keep grading, road and drainage design coordinated as the design develops, rather than drafting each sheet independently." },
      { question: "Do these examples address heavy vehicle access requirements?", answer: "Yes, the site access road example specifically covers checking road geometry against heavy-vehicle swept paths for both construction and long-term maintenance access." },
      { question: "How do these examples handle seasonal or environmental site conditions?", answer: "The site access example specifically reviews pavement durability against the site's seasonal weather range, rather than assuming fair-weather conditions throughout." },
      { question: "Can civil drafting examples like these scale to a larger, multi-stage development?", answer: "Yes, the subdivision example specifically illustrates documentation structured to support a staged, progressive development and approval programme." },
    ],
  },
  {
    slug: "architectural",
    name: "Architectural",
    description: "Architectural drafting, documentation and 3D visualisation projects.",
    intro: [
      {
        heading: "What This Category Covers",
        paragraphs: [
          "Architectural projects in this category span construction documentation for renovations and new builds, retail and commercial fit-out drawings, and 3D visualisation work produced from design or BIM models for presentation and approval purposes.",
          "The examples below are illustrative placeholder case studies, structured to show the kind of coordination and existing-conditions judgement calls that shape a real architectural documentation project — not just the finished drawing set, but the decisions made along the way about what to verify, what to flag, and how to keep a presentation render honest to the underlying design.",
        ],
      },
      {
        heading: "Where Documentation Quality Is Actually Won or Lost",
        paragraphs: [
          "A theme that runs through architectural work in this category is that documentation quality is often won or lost in the less visible coordination details — whether an existing-conditions plan reflects what's actually on site, whether a tricky junction gets the detailed attention it needs, or whether a presentation render quietly promises more than the documentation behind it can actually deliver.",
          "Budget and scope management recur across architectural projects in ways that aren't always obvious from the finished drawing set alone — segmenting scope into core and optional inclusions, or reviewing a design for future adaptability without committing to that future work now, are both examples of how documentation can support a client's practical decision-making beyond simply describing a fixed design.",
        ],
      },
      {
        heading: "Programme Pressure and Multi-Disciplinary Coordination",
        paragraphs: [
          "Programme pressure on architectural projects often means design decisions and downstream deliverables — a render, a construction drawing — need to progress in parallel rather than in a strict, non-overlapping sequence, and the examples below show how this coordination is managed without the downstream work getting ahead of a design that's still being confirmed.",
          "Coordination between architectural documentation and other consulting disciplines — structural, services, civil — is a recurring theme across this category, since an architectural drawing set produced in isolation from the structural and services design it needs to sit alongside tends to generate coordination queries during construction that a more collaborative documentation process would have caught earlier.",
        ],
      },
      {
        heading: "Junction Detail and Regulatory Requirements",
        paragraphs: [
          "Detail resolution at junctions and transitions — where one material meets another, where an internal space meets an external one — often separates a genuinely buildable architectural drawing set from one that merely looks complete at a glance. The case studies below reflect the level of attention these transition details typically warrant relative to the more straightforward, repetitive parts of a drawing set.",
          "Regulatory and approval-authority requirements shape architectural documentation as much as the design itself in many cases — a submission drawing set needs to satisfy a specific council's or authority's checklist requirements alongside representing the design accurately, and the examples below illustrate how this dual requirement gets managed without compromising the clarity of the underlying design documentation.",
        ],
      },
      {
        heading: "Client Communication and Existing Building Documentation",
        paragraphs: [
          "Client communication through the documentation process is a genuinely important, if sometimes underappreciated, part of architectural work — helping a client understand what a drawing set actually commits them to, what remains flexible, and what a specific design decision will mean in practice, is part of what makes architectural documentation valuable beyond its purely technical content.",
          "Existing building documentation carries its own particular challenges distinct from new-build work — a renovation or fit-out project depends on an accurate understanding of what's actually there before a new design can be reliably overlaid onto it, and the gap between what historical drawings claim and what a building has actually become over years of undocumented use is a recurring source of risk the case studies below address directly.",
        ],
      },
      {
        heading: "Material Specification and Accessibility Compliance",
        paragraphs: [
          "Material and finish specification, while sometimes treated as a separate, later-stage decision from the core drawing set, genuinely affects constructability and cost in ways worth resolving earlier rather than later — a specification finalised without regard for how it interacts with the documented junction details risks creating exactly the kind of conflict the documentation was meant to prevent.",
          "Accessibility and compliance requirements run through architectural documentation regardless of building type, and confirming a design satisfies these requirements needs to happen as an integrated part of the drafting process rather than a separate compliance check performed after a design is otherwise finalised, since retrofitting compliance into an already-resolved design is considerably more disruptive than designing with it in mind from the outset.",
        ],
      },
      {
        heading: "Handover Clarity and Furniture Coordination",
        paragraphs: [
          "Documentation handover to a builder or contractor is where architectural drafting quality is ultimately tested in practice — a drawing set that reads clearly to the design team who produced it needs to read just as clearly to a builder encountering the project for the first time, and the case studies below reflect the kind of clarity that supports a smooth handover rather than one dependent on the original design team being available to answer constant clarifying questions.",
          "Furniture, fixture and equipment coordination is a detail-heavy but genuinely important part of many architectural projects, particularly commercial and hospitality fit-outs, since a drawing set that gets the architectural envelope right but overlooks how it will actually be furnished and equipped leaves a real gap between the documented design and how the space will actually function once occupied.",
        ],
      },
      {
        heading: "Passive Design and Staged Documentation Releases",
        paragraphs: [
          "Environmental and passive design considerations — orientation, shading, natural ventilation — increasingly shape architectural documentation beyond pure aesthetic or functional layout decisions, and reflecting these considerations accurately in construction drawings, not just in early concept diagrams, ensures the design intent that drove these decisions actually survives into the built outcome.",
          "Staged documentation releases — schematic design, design development, construction documentation — each serve a different purpose and audience, and understanding what level of resolution each stage genuinely needs, rather than either rushing ahead of design certainty or over-detailing a stage prematurely, is a judgement the case studies below reflect throughout.",
        ],
      },
      {
        heading: "Heritage Context and Long-Term Performance",
        paragraphs: [
          "Heritage and character-area considerations, where they apply to a specific project, add another layer of documentation care — demonstrating how a new design responds to an existing heritage context or character requirement often needs to be made explicit within the documentation itself, not left implicit in the design intent alone, and the case studies below reflect this kind of documented reasoning where it's genuinely called for.",
          "Long-term building performance considerations — maintenance access, material durability, ease of future modification — increasingly factor into architectural documentation decisions alongside the immediate construction outcome, reflecting a broader shift toward documentation that serves a building across its full working life, not only its initial construction.",
        ],
      },
      {
        heading: "Signage Integration and the Underlying Question",
        paragraphs: [
          "Signage, wayfinding and branding integration, particularly for commercial and retail projects, needs coordinating with the base architectural documentation even where it's designed by a separate specialist, since a mismatch between the base building drawings and a fit-out or signage package is a common, avoidable source of on-site coordination friction.",
          "Across every architectural example in this category, the underlying question is consistent: does the documentation give a builder, an approval authority and the client themselves a clear, accurate and genuinely buildable representation of the intended design, not merely an attractive one.",
        ],
      },
      {
        heading: "Climate-Responsive Detailing and Cost Planning",
        paragraphs: [
          "Climate-responsive detailing — waterproofing, ventilation and shading appropriate to a specific region's climate conditions across India's varied geography — needs to be reflected in construction detail drawings themselves, not only in early passive design diagrams, since a detail that looks reasonable in a generic drawing can perform poorly if it wasn't checked against the specific climate the building will actually operate in.",
          "Cost planning coordination between the architectural documentation and a quantity surveyor or cost consultant benefits from happening early and iteratively rather than only once a drawing set is considered complete, since design decisions made without cost visibility sometimes need costly reworking once a budget reality check catches up with them later in the process.",
        ],
      },
      {
        heading: "Staged Occupation and Acoustic Separation",
        paragraphs: [
          "Documentation for phased or staged occupation, where part of a building needs to be handed over and occupied while construction continues elsewhere, requires particular clarity around temporary separations, life safety provisions and access arrangements that a single, all-at-once handover project wouldn't need to address at all.",
          "Acoustic separation and noise transfer detailing, particularly relevant for multi-tenancy commercial and residential projects, needs to be reflected explicitly in construction detail drawings rather than assumed to follow automatically from a generally sound design, since acoustic performance is one of the more common post-occupancy complaints when it isn't addressed deliberately during documentation.",
        ],
      },
    ],
    faqs: [
      { question: "Do these architectural examples include 3D rendering?", answer: "Yes, one of the examples below specifically covers a combined fit-out documentation and 3D render engagement — see our 3D rendering service page for more detail on how that process works." },
      { question: "Can you document a renovation where existing records are incomplete or unreliable?", answer: "Yes, one of the examples below illustrates how we approach existing-conditions verification when a building has been informally altered over time without matching documentation." },
      { question: "Can architectural drawings be segmented to support a client's budget decisions?", answer: "Yes, one of the examples below shows how drawings can clearly distinguish core scope from optional, budget-dependent inclusions to support a builder's itemised quote." },
      { question: "How do you keep a presentation render honest to what will actually be built?", answer: "By building the render from the same underlying design decisions the construction documentation is based on, illustrated in one of the examples below, rather than a separately idealised visualisation." },
      { question: "Can a design be reviewed for future adaptability without committing to that future work now?", answer: "Yes, a focused adaptability review, illustrated in one of the examples below, gives useful documented insight without expanding into designing the future work today." },
      { question: "Do these architectural examples cover both residential and commercial project types?", answer: "Yes, one covers a residential renovation and extension, and the other covers a retail fit-out with a combined documentation and 3D render engagement." },
      { question: "How do these examples handle existing-conditions verification?", answer: "The renovation example specifically shows how existing conditions are checked against site survey rather than trusted from potentially outdated records, given how often houses are altered informally over time." },
      { question: "Do these examples address budget-driven scope decisions?", answer: "Yes, the renovation example illustrates segmenting drawings to distinguish core scope from optional, budget-dependent inclusions, supporting a builder's itemised quote." },
      { question: "Can architectural documentation examples like these support a future second location for the same client?", answer: "Yes, the retail fit-out example specifically illustrates reviewing joinery modules for adaptability to a differently-shaped future tenancy without redesigning for it now." },
      { question: "What software is used across these architectural examples?", answer: "Revit and AutoCAD both feature, reflecting a common mix of coordinated BIM modelling and straightforward 2D documentation depending on the specific deliverable." },
    ],
  },
  {
    slug: "electrical",
    name: "Electrical",
    description: "Electrical schematics, switchboard and control panel drawing projects.",
    intro: [
      {
        heading: "What This Category Covers",
        paragraphs: [
          "Electrical projects in this category cover single-line diagrams, schematics, switchboard and control panel drawings, and as-built documentation for existing installations, produced to a standard a panel shop or site electrician can build from directly.",
          "The examples below are illustrative placeholder case studies, chosen to reflect two of the most common real-world pressures in electrical drafting work — a design that keeps changing as component selection is finalised, and an as-built exercise that has to reconstruct installation history that was never properly recorded in the first place.",
        ],
      },
      {
        heading: "Consistency and Legacy System Compatibility",
        paragraphs: [
          "Electrical documentation in this category is judged heavily on consistency between the schematic, the physical layout and the cable schedule — a mismatch between these three is one of the more common and disruptive errors in electrical work, and the case studies below show how we structure drafting to avoid it.",
          "Legacy system compatibility is a recurring and easily underestimated challenge in electrical work — a new panel or control system frequently needs to interface with something older already installed on site, and confirming that interface works correctly before finalising new design logic is a small step that prevents a much bigger problem at commissioning.",
        ],
      },
      {
        heading: "Documentation That Lasts Beyond Installation",
        paragraphs: [
          "Where documentation needs to support a facilities team years into the future rather than just the immediate installation, the case studies below show how we think about long-term reliability and honest confidence-flagging as seriously as immediate technical correctness.",
          "Panel and enclosure layout drawings carry practical constraints that go beyond electrical schematic logic alone — physical component clearance, heat dissipation, cable routing and future maintenance access all shape a genuinely buildable panel layout, and the case studies below reflect how these practical, physical constraints get worked through alongside the underlying electrical design.",
        ],
      },
      {
        heading: "Discipline Coordination and Labelling Consistency",
        paragraphs: [
          "Coordination with mechanical and structural disciplines is an increasingly important part of electrical documentation on larger projects — confirming a switchboard location doesn't clash with structural or mechanical elements, and that cable routing paths are actually available once other building systems are accounted for, prevents a class of costly late-stage coordination problem.",
          "Standards compliance and labelling consistency run through every electrical drawing in this category — consistent tag numbering between the schematic, the physical layout and the cable schedule is what actually lets a site electrician or maintenance team work confidently from the documentation, and inconsistency here is one of the more common, avoidable sources of on-site confusion and rework.",
        ],
      },
      {
        heading: "Testing, Load Calculation and Cable Sizing",
        paragraphs: [
          "Testing and commissioning documentation, while sometimes treated as a separate deliverable from the design drawings themselves, benefits from being considered during the drafting process rather than as an afterthought — the case studies below reflect how documentation gets structured with eventual testing and commissioning needs in mind from the outset.",
          "Load calculation and cable sizing accuracy underpins every electrical drawing in this category, even where the drawing itself doesn't explicitly show the calculation — a schematic drawn without accurate underlying load and sizing figures looks complete but carries real risk, and the case studies below reflect documentation built on a properly verified electrical basis rather than assumed or approximated figures.",
        ],
      },
      {
        heading: "Hazardous Areas and Future Spare Capacity",
        paragraphs: [
          "Hazardous area and environmental rating considerations apply to a meaningful share of Indian industrial and manufacturing electrical work, and documentation for equipment operating in these environments needs to reflect the correct rating and protection requirements explicitly, since an omission here has genuine safety consequences rather than being a purely administrative documentation gap.",
          "Spare capacity and future expansion planning is a consideration that experienced electrical documentation builds in deliberately — a switchboard or panel designed with zero spare capacity forecloses future expansion in a way that's expensive to reverse, and the case studies below reflect how reasonable future capacity gets planned for without over-engineering a design well beyond its actual near-term need.",
        ],
      },
      {
        heading: "Earthing, Protection and System Interfaces",
        paragraphs: [
          "Earthing and protection coordination documentation is a category of electrical drawing that carries real safety weight beyond its administrative appearance — confirming protective device coordination and earthing arrangements are documented accurately, not just assumed to be standard, is treated with the same seriousness as the primary power schematic itself across the case studies below.",
          "Interface documentation between electrical and other building or process control systems — a building management system, a process control PLC, a fire system interlock — needs particular clarity given how often these interfaces are where a genuinely well-designed electrical system nonetheless fails to integrate smoothly with the broader system it's part of.",
        ],
      },
      {
        heading: "Environmental Factors and Commissioning Support",
        paragraphs: [
          "Site-specific environmental factors — ambient temperature range, dust, moisture exposure, vibration — shape enclosure rating and component selection decisions in ways that need to be reflected explicitly in documentation rather than assumed to be self-evident, and the case studies below illustrate this kind of environment-aware specification.",
          "Commissioning support documentation — test schedules, functional test records tied back to specific schematic references — helps a commissioning team verify a system methodically rather than working from the schematic alone without a structured test framework, and the case studies below reflect documentation that anticipates this commissioning need directly.",
        ],
      },
      {
        heading: "Handover Documentation and Load Balancing",
        paragraphs: [
          "Handover documentation for facilities and maintenance teams needs to be considered as seriously as the original design documentation, since an electrical installation is typically operated and maintained for a far longer period than it takes to design and install, and documentation that only serves the installation phase well leaves a genuine gap for whoever maintains the system afterward.",
          "Power quality and load balancing considerations, particularly on installations with significant motor loads or sensitive equipment, shape circuit design decisions in ways that need to be reflected clearly in documentation rather than left to be worked out informally during installation, and the case studies below reflect this kind of documented, deliberate load planning.",
        ],
      },
      {
        heading: "Cable Segregation and the Underlying Test",
        paragraphs: [
          "Segregation requirements between power, control and instrumentation cabling are a recurring documentation consideration on industrial projects, since inadequate segregation creates real interference risk, and confirming these requirements are reflected accurately in cable schedules and routing drawings is treated as seriously as the primary circuit design itself.",
          "Across every electrical example in this category, the same underlying test applies throughout: can a panel shop, a site electrician or a facilities maintenance team work confidently and safely from this documentation alone, without needing to guess at intent the drawings should have made explicit from the outset.",
        ],
      },
      {
        heading: "Physical Routing and Emergency Power",
        paragraphs: [
          "Cable and conduit routing drawings, distinct from the schematic itself, require their own specific coordination with the physical building or site layout — a routing path that's electrically valid on a schematic can still be physically impractical once real ceiling voids, floor penetrations or underground services are accounted for, and the case studies below reflect routing decisions checked against real physical constraints rather than assumed clear paths.",
          "Emergency and backup power system documentation carries particular importance given its safety-critical role — clear, unambiguous drawings covering changeover logic, backup capacity and load prioritisation matter more here than in a standard, non-critical circuit, and the case studies below reflect the additional care this category of documentation warrants.",
        ],
      },
      {
        heading: "Metering, Lighting and Renewable Integration",
        paragraphs: [
          "Metering and sub-metering documentation, increasingly relevant for multi-tenant and energy-monitored facilities, needs to align clearly with the billing or monitoring structure it's meant to support, and the case studies below reflect this kind of purpose-aware documentation rather than a generic circuit layout that happens to include a meter symbol without real regard for how it will actually be used.",
          "Lighting design documentation, where it forms part of a project's scope, needs to balance illumination performance requirements against energy efficiency targets, and reflecting both considerations clearly in the same drawing set avoids a common gap where a lighting layout satisfies one requirement while quietly falling short of the other.",
          "Renewable and distributed generation integration — rooftop solar, battery storage — introduces interface and protection coordination requirements distinct from a purely grid-supplied installation, and the case studies below reflect the additional documentation care this kind of hybrid system genuinely requires.",
        ],
      },
    ],
    faqs: [
      { question: "Do these electrical examples cover as-built documentation?", answer: "Yes, one of the examples below specifically illustrates how we approach reconstructing as-built documentation when field variations weren't properly recorded during installation." },
      { question: "Can you handle a design that keeps changing as component selection is finalised?", answer: "Yes, one of the examples below shows how drawings can be structured so a component substitution updates in one place and propagates through the schematic and cable schedule, rather than requiring a full manual redraft each time." },
      { question: "Can new electrical designs be checked against an existing legacy control system?", answer: "Yes, one of the examples below illustrates how we verify signal type and voltage compatibility before finalising new control logic that needs to interface with older, already-installed equipment." },
      { question: "How do you handle a multi-batch production run with component changes between batches?", answer: "Revisions are tracked explicitly against which batch they apply to, illustrated in one of the examples below, avoiding ambiguity about which drawing version governs a specific physical batch." },
      { question: "Do these examples reflect documentation intended for long-term facilities use, not just installation?", answer: "Yes, particularly the as-built example, which specifically addresses how documentation needs to remain reliable and honestly caveated for a facilities team using it years after the original installation." },
      { question: "Do these electrical examples cover both new-build and as-built documentation?", answer: "Yes, one covers a new switchboard and control panel build, and the other covers reconstructing as-built documentation for an existing, incompletely-documented installation." },
      { question: "How is component substitution handled across these examples?", answer: "The switchboard example specifically illustrates structuring drawings so a component change updates centrally and propagates through the schematic and cable schedule, rather than requiring a manual redraft each time." },
      { question: "Do these examples address legacy control system compatibility?", answer: "Yes, the switchboard example covers verifying signal type and voltage compatibility with an existing legacy control system before finalising new control logic." },
      { question: "How do these examples handle a fixed, non-negotiable project deadline?", answer: "The as-built example specifically illustrates prioritising verification effort against a fixed close-out deadline, focusing on the areas most critical to future maintenance rather than spreading effort evenly." },
      { question: "What software is used across these electrical examples?", answer: "AutoCAD is used in both examples, reflecting its common role in producing schematics, layout drawings and as-built documentation that a panel shop or site electrician can work from directly." },
    ],
  },
  {
    slug: "bim",
    name: "BIM",
    description: "BIM modelling, coordination and clash detection projects.",
    intro: [
      {
        heading: "What This Category Covers",
        paragraphs: [
          "BIM projects in this category cover multi-disciplinary model coordination and clash detection, and scan-to-BIM conversion of existing buildings and structures into working Revit models for design teams.",
          "The examples below are illustrative placeholder case studies, structured to show two of the more common real-world BIM challenges — triaging an overwhelming first-pass clash detection report into genuinely actionable priorities, and deciding how much as-built irregularity a scan-derived model should actually capture for a renovation project to be usable.",
        ],
      },
      {
        heading: "What Coordination Is Actually Judged On",
        paragraphs: [
          "BIM coordination work in this category tends to be judged less on whether a clash report exists at all, and more on whether it actually helps a design team make good decisions under real programme pressure — the case studies below reflect the judgement calls involved in making that happen.",
          "Consultant diversity — different disciplines working in different platforms, at different Levels of Development, sometimes with genuinely limited BIM experience — is a practical reality on most real coordination projects, and the examples below show how we account for this rather than assuming every model arriving for federation is equally mature or comparable.",
        ],
      },
      {
        heading: "Communicating Status to Non-Technical Stakeholders",
        paragraphs: [
          "Communicating BIM status to non-technical stakeholders is a quieter but genuinely important part of this work — a project owner or client rarely needs to interpret a raw clash list themselves, and the case studies below illustrate how technical coordination findings get translated into something a broader audience can actually use.",
          "Model federation strategy — how individual discipline models are combined, how often, and using what shared coordinate basis — shapes how useful a coordination process actually is in practice, and the case studies below reflect the kind of federation discipline that keeps a coordination model meaningful rather than a loosely assembled collection of individually correct but poorly aligned discipline models.",
        ],
      },
      {
        heading: "Version Control and Facilities Management Data",
        paragraphs: [
          "Version control across a federated BIM environment carries real practical weight — confirming every discipline is coordinating against the current version of every other discipline's model, not an outdated cached copy, is a basic but easily overlooked discipline that a well-run coordination process treats as seriously as the clash detection process itself.",
          "BIM data beyond pure geometry — asset information, equipment specifications, maintenance data — increasingly matters as models are handed over for facilities management use rather than only design coordination, and the case studies below reflect how this data requirement gets planned for during the modelling process rather than retrofitted awkwardly at project handover.",
        ],
      },
      {
        heading: "Sustaining Coordination Over a Long Programme",
        paragraphs: [
          "Where a BIM coordination project spans a long construction programme, keeping the coordination process itself sustainable — manageable federation file sizes, a realistic review cadence, clear ownership of resolving each identified issue — matters as much as the technical rigour of any individual clash detection run, and the examples below reflect this practical, sustained-effort view of coordination rather than treating it as a single one-time exercise.",
          "Establishing genuine LOD consistency across a federated model before relying heavily on its clash results is a discipline that separates a mature coordination process from a superficial one — running clash detection against elements modelled well below the LOD needed for reliable coordination produces results that look thorough but are actually misleading, and the case studies below reflect the verification step that catches this before it wastes a design team's time chasing false or missed clashes.",
        ],
      },
      {
        heading: "Issue Resolution Workflow and Scan Simplification",
        paragraphs: [
          "Coordination meetings and issue resolution workflow matter just as much as the clash detection technology itself — a well-run coordination process gives every discipline a clear, trackable record of which issues are open, who owns resolving each one, and what the agreed resolution actually was, rather than a clash report that generates discussion but no accountable resolution path.",
          "Scan-to-BIM work in particular depends on making deliberate, well-communicated decisions about geometric simplification — a scan-derived model that attempts to capture every real-world imperfection of an existing building becomes unusably heavy and detailed for most practical design purposes, while one that's over-simplified loses genuinely important as-built information, and the case studies below reflect the judgement involved in finding the right balance for a specific project's intended use.",
        ],
      },
      {
        heading: "Quantity Extraction and Model Usability",
        paragraphs: [
          "Quantity extraction from a coordinated BIM model is only as reliable as the modelling discipline behind it — a model built primarily for visual coordination without regard for how quantities will later be extracted from it can produce quantity take-offs that look precise but are actually unreliable, and the case studies below reflect modelling practices that keep quantity extraction genuinely trustworthy.",
          "Model performance and usability for the whole project team matters as much as coordination accuracy — a federated model so large or poorly organised that it's slow and frustrating to navigate day to day undermines the collaboration BIM is meant to enable, and the case studies below reflect a deliberate effort to keep models genuinely usable, not just technically comprehensive.",
        ],
      },
      {
        heading: "Team Training and Clash Rule Configuration",
        paragraphs: [
          "Training and onboarding for project team members less experienced with BIM workflows is a practical consideration that affects how smoothly a coordination process actually runs — the case studies below reflect an approach that accounts for varying levels of BIM maturity across a project team rather than assuming uniform proficiency from every participant.",
          "Clash detection rule configuration itself is a skill that develops with project experience — a generic, out-of-the-box clash detection ruleset applied uniformly across every discipline pairing tends to generate an overwhelming volume of low-value results, and the case studies below reflect a more deliberately tuned approach that surfaces genuinely significant clashes without burying them in noise.",
        ],
      },
      {
        heading: "BIM Execution Planning and Point Cloud Management",
        paragraphs: [
          "BIM execution planning at project outset — agreeing modelling responsibilities, coordinate systems, file exchange protocols and LOD targets before modelling begins in earnest — is what makes the coordination process described in these case studies actually achievable, rather than something bolted on reactively once inconsistencies have already crept into a project's models.",
          "Point cloud data management for scan-to-BIM projects carries its own practical considerations well beyond the modelling itself — organising, registering and maintaining access to raw scan data alongside the derived model means a specific as-built question can always be checked back against the original captured data rather than relying solely on the modeller's interpretation of it.",
        ],
      },
      {
        heading: "Status Reporting and the Underlying Standard",
        paragraphs: [
          "Reporting and dashboard-style summaries of coordination status — how many clashes remain open, which disciplines are driving the most outstanding issues — help keep a broader project team engaged with BIM coordination progress without requiring every stakeholder to interpret the underlying technical model directly, and the case studies below reflect this kind of accessible status reporting.",
          "Across every BIM example in this category, the same underlying standard holds: does the coordination process genuinely reduce real-world clashes, rework and confusion once construction begins, rather than simply producing an impressive-looking but ultimately underused federated model.",
        ],
      },
      {
        heading: "File Organisation and Change Tracking",
        paragraphs: [
          "Naming and file organisation conventions across a federated project might seem like a minor administrative detail, but at scale — dozens of models across several disciplines and phases — a poorly organised model environment becomes genuinely difficult to navigate reliably, and the case studies below reflect the kind of disciplined file and naming convention that keeps a large coordination project navigable throughout its life.",
          "Change tracking between federated model versions helps a coordination team understand not just where clashes currently exist but which recent design change introduced a newly appearing one, and this kind of change-aware review, reflected in the case studies below, is considerably more efficient than re-reviewing an entire federated model from scratch after every update.",
        ],
      },
      {
        heading: "Cloud-Based Sharing and Access Management",
        paragraphs: [
          "Cloud-based model sharing and access management increasingly underpins how federated coordination actually happens day to day, and keeping this access appropriately managed — the right people able to view and update the right models at the right stage — is a practical, often overlooked part of running a coordination process smoothly across a distributed project team.",
        ],
      },
    ],
    faqs: [
      { question: "Do these BIM examples include full clash detection reporting?", answer: "Yes, one of the examples below specifically illustrates how we triage a large first-pass clash detection report into prioritised, actionable issues — see our BIM services page for more on this process." },
      { question: "Do these examples include scan-to-BIM conversion?", answer: "Yes, one of the examples below covers converting point cloud scan data of an existing building into a working Revit model for a renovation project." },
      { question: "How do you handle BIM coordination when consultants use different platforms or LOD conventions?", answer: "We check for LOD consistency before trusting comparative clash results, illustrated in one of the examples below, rather than assuming every federated model is equally detailed or comparable." },
      { question: "Can BIM coordination findings be communicated to a non-technical project stakeholder?", answer: "Yes, one of the examples below shows how a plain-language summary is prepared alongside the full technical clash report for exactly this audience." },
      { question: "How much as-built irregularity should a scan-derived model capture for a renovation project?", answer: "This is agreed with the design team based on intended use, illustrated in one of the examples below, rather than defaulting to either extreme of over- or under-capturing real building imperfections." },
      { question: "Do these BIM examples cover both new construction and existing building conversion?", answer: "Yes, one covers multi-discipline clash detection on a new construction project, and the other covers converting scan data of an existing building into a working BIM model." },
      { question: "How is clash prioritisation handled in these examples?", answer: "The clash detection example illustrates triaging a large first-pass report into hard clashes, soft clearance issues and duplicates, focusing design team effort on what genuinely matters to the schedule." },
      { question: "Do these examples address incomplete or lower-confidence data?", answer: "Yes, the scan-to-BIM example specifically covers flagging areas of incomplete scan coverage and lower capture confidence rather than presenting a uniformly confident model." },
      { question: "What software is used across these BIM examples?", answer: "Navisworks and Revit both feature, reflecting their common combined role in federated model coordination and clash detection." },
      { question: "Can BIM coordination examples like these apply to a smaller, less complex project?", answer: "Yes, the same underlying discipline — checking model consistency, prioritising genuine issues, communicating status clearly — scales down to smaller projects even if the coordination effort itself is more contained." },
    ],
  },
];

export function getProjectCategory(slug: string) {
  return projectCategories.find((category) => category.slug === slug);
}
