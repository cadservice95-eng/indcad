import type { Location } from "@/lib/types";

export const locations: Location[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    heroHeading: "CAD Drafting Services Mumbai",
    heroDescription:
      "CAD drafting, BIM and engineering design support for Mumbai engineers, architects, builders and manufacturers.",
    intro: [
      "Mumbai is India's financial and commercial capital, with a construction market weighted heavily toward high-rise residential and commercial redevelopment, alongside a significant industrial and manufacturing base across the wider Mumbai Metropolitan Region.",
      "We provide remote CAD drafting, BIM and engineering design support to Mumbai-based architectural practices, builders, manufacturers and engineering firms, working as flexible capacity alongside your existing team.",
    ],
    localContext: [
      "High-rise residential and commercial redevelopment across the city drives consistent demand for coordinated architectural, structural and services BIM documentation.",
      "The wider Mumbai Metropolitan Region's manufacturing, oil & gas and port-related industrial base also generates ongoing mechanical and structural drafting work.",
    ],
    localProjectTypes: [
      "High-rise residential and commercial redevelopment documentation",
      "Structural steel detailing for commercial and industrial builds",
      "BIM coordination for multi-disciplinary construction projects",
      "Mechanical fabrication and equipment drawings",
      "Renovation and fit-out documentation",
    ],
    services: ["architectural-drafting", "structural-drafting", "bim-services", "mechanical-drafting", "cad-conversion"],
    industries: ["construction", "manufacturing", "oil-gas"],
    workflow: [
      { title: "Send your brief", description: "Share drawings, sketches or a model along with your project requirements — no site visit required." },
      { title: "Scope & quote", description: "We confirm deliverables, format and turnaround before work begins." },
      { title: "Drafting & modelling", description: "Work is carried out remotely, with regular check-ins for larger projects." },
      { title: "Review & delivery", description: "Files are delivered in your required format, with revisions handled through markup rounds." },
    ],
    faqs: [
      { question: "Do you need to visit our Mumbai site or office?", answer: "No — work is delivered remotely based on the drawings, models or reference material you provide. This suits most drafting and design engagements without a site visit." },
      { question: "Can you match our practice's or workshop's existing drawing standard?", answer: "Yes, we draft to your supplied title blocks, layer standards and conventions where available." },
      { question: "What turnaround can we expect for a Mumbai project?", answer: "Turnaround depends on project scope and is confirmed as part of your quote." },
    ],
    relatedLocations: ["pune", "delhi-ncr"],
    seoTitle: "CAD Drafting Services Mumbai | IndCAD",
    seoDescription:
      "CAD drafting, BIM and engineering design services for Mumbai architects, engineers, builders and manufacturers.",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    state: "Delhi / NCR",
    heroHeading: "CAD Drafting Services Delhi NCR",
    heroDescription:
      "CAD drafting, BIM and engineering design support for Delhi NCR architects, engineers, developers and contractors.",
    intro: [
      "The National Capital Region combines large-scale infrastructure and government projects with a fast-growing commercial and residential real estate market across Delhi, Gurugram, Noida and the surrounding industrial belt.",
      "We provide remote CAD drafting, BIM and engineering design support to Delhi NCR-based practices, contractors and engineering teams, scaling drafting capacity to match project workload.",
    ],
    localContext: [
      "Commercial and residential development across Gurugram and Noida drives consistent demand for coordinated BIM documentation and structural steel detailing.",
      "NCR's manufacturing belt and ongoing metro, road and public infrastructure investment also generate civil and structural documentation work tied to site development and approvals processes.",
    ],
    localProjectTypes: [
      "Commercial and residential tower documentation",
      "Structural steel detailing for commercial construction",
      "BIM coordination across architectural, structural and services models",
      "Civil site and infrastructure drawings",
      "Industrial and warehouse fabrication drawings",
    ],
    services: ["architectural-drafting", "structural-drafting", "bim-services", "civil-drafting", "cad-conversion"],
    industries: ["construction", "manufacturing"],
    workflow: [
      { title: "Send your brief", description: "Share drawings, sketches or a model along with your project requirements — no site visit required." },
      { title: "Scope & quote", description: "We confirm deliverables, format and turnaround before work begins." },
      { title: "Drafting & modelling", description: "Work is carried out remotely, with regular check-ins for larger projects." },
      { title: "Review & delivery", description: "Files are delivered in your required format, with revisions handled through markup rounds." },
    ],
    faqs: [
      { question: "Can you support a Delhi NCR project remotely without a site visit?", answer: "Yes, drafting and BIM work is carried out from the drawings, models or reference material you supply." },
      { question: "Can you coordinate with our project's other consultants?", answer: "Yes, where a project needs coordination with other disciplines or consultants, this is agreed as part of project scoping." },
      { question: "Do you work on both residential and commercial NCR projects?", answer: "Yes, our services cover residential, commercial and industrial documentation across Delhi, Gurugram, Noida and the wider NCR." },
    ],
    relatedLocations: ["mumbai", "bangalore"],
    seoTitle: "CAD Drafting Services Delhi NCR | IndCAD",
    seoDescription:
      "CAD drafting, BIM and engineering design services for Delhi NCR architects, engineers, developers and contractors.",
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    heroHeading: "CAD Drafting Services Bangalore",
    heroDescription:
      "Mechanical, structural and BIM drafting support for Bangalore's aerospace, manufacturing and construction sectors.",
    intro: [
      "Bangalore is home to a significant aerospace and defence manufacturing base alongside a large technology-driven commercial construction market, spanning tech campuses, residential towers and precision manufacturing facilities.",
      "We provide remote CAD drafting and engineering design support to Bangalore-based engineering firms, fabricators and construction teams.",
    ],
    localContext: [
      "Aerospace and precision manufacturing in and around the city generate demand for accurate mechanical drafting, reverse engineering and fixture documentation.",
      "Bangalore's technology-driven commercial construction sector also supports ongoing architectural and structural BIM documentation work for campuses and residential towers.",
    ],
    localProjectTypes: [
      "Aerospace and precision component drafting",
      "Mechanical fixture and tooling documentation",
      "Commercial and tech-campus structural detailing",
      "BIM coordination for construction projects",
      "Legacy drawing conversion for manufacturing facilities",
    ],
    services: ["mechanical-drafting", "3d-cad-modelling", "structural-drafting", "bim-services", "cad-conversion"],
    industries: ["aerospace", "manufacturing", "construction"],
    workflow: [
      { title: "Send your brief", description: "Share drawings, sketches, a model or reference material along with your project requirements." },
      { title: "Scope & quote", description: "We confirm deliverables, format and turnaround before work begins." },
      { title: "Drafting & modelling", description: "Work is carried out remotely, with regular check-ins for larger projects." },
      { title: "Review & delivery", description: "Files are delivered in your required format, with revisions handled through markup rounds." },
    ],
    faqs: [
      { question: "Can you support Bangalore's aerospace and precision manufacturing sector?", answer: "Yes, precision mechanical drafting and reverse engineering are commonly used across Bangalore's aerospace and manufacturing base." },
      { question: "Do you provide structural detailing for Bangalore's commercial developments?", answer: "Yes, structural steel and BIM documentation is available for Bangalore-based commercial and residential construction projects." },
      { question: "Can you convert legacy manufacturing drawings for an existing facility?", answer: "Yes, see our CAD conversion service for digitising legacy or as-built facility drawings." },
    ],
    relatedLocations: ["chennai", "hyderabad"],
    seoTitle: "CAD Drafting Services Bangalore | IndCAD",
    seoDescription:
      "Mechanical, structural and BIM drafting services for Bangalore's aerospace, manufacturing and construction sectors.",
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    heroHeading: "CAD Drafting Services Pune",
    heroDescription:
      "Mechanical and structural drafting support for Pune's automotive, manufacturing and construction sectors.",
    intro: [
      "Pune is one of India's major automotive and auto-component manufacturing hubs, alongside a growing commercial and residential construction sector across the city and surrounding industrial belt.",
      "We provide remote CAD drafting and engineering design support to Pune-based manufacturers, fabricators and construction teams.",
    ],
    localContext: [
      "Automotive and auto-component manufacturing across Pune and its industrial suburbs supports demand for precision mechanical drafting, reverse engineering and fixture documentation.",
      "Pune's construction sector also generates ongoing architectural and structural drafting work across residential, commercial and industrial projects.",
    ],
    localProjectTypes: [
      "Automotive component and fixture drafting",
      "Mechanical fabrication and assembly drawings",
      "Reverse engineering of legacy components",
      "Structural steel detailing for commercial and industrial builds",
      "Architectural documentation for residential and commercial projects",
    ],
    services: ["mechanical-drafting", "structural-drafting", "architectural-drafting", "engineering-design"],
    industries: ["automotive", "manufacturing", "construction"],
    workflow: [
      { title: "Send your brief", description: "Share drawings, sketches or a model along with your project requirements — no site visit required." },
      { title: "Scope & quote", description: "We confirm deliverables, format and turnaround before work begins." },
      { title: "Drafting & modelling", description: "Work is carried out remotely, with regular check-ins for larger projects." },
      { title: "Review & delivery", description: "Files are delivered in your required format, with revisions handled through markup rounds." },
    ],
    faqs: [
      { question: "Can you support Pune's automotive and component manufacturing sector?", answer: "Yes, mechanical drafting and reverse engineering are commonly used across Pune's automotive and auto-component manufacturing base." },
      { question: "Do you provide structural drafting for Pune builders?", answer: "Yes, structural steel and architectural documentation is available for Pune-based construction projects." },
    ],
    relatedLocations: ["mumbai"],
    seoTitle: "CAD Drafting Services Pune | IndCAD",
    seoDescription:
      "Mechanical and structural drafting services for Pune's automotive, manufacturing and construction sectors.",
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    heroHeading: "CAD Drafting Services Chennai",
    heroDescription:
      "Mechanical, structural and civil drafting support for Chennai's automotive, manufacturing and port-related industry.",
    intro: [
      "Chennai is one of India's largest automotive manufacturing centres, with a substantial industrial estate footprint alongside port-related and electronics manufacturing, and a steady commercial and residential construction sector.",
      "We provide remote CAD drafting and engineering design support to Chennai-based manufacturers, fabricators and construction teams.",
    ],
    localContext: [
      "Automotive and auto-component manufacturing across Chennai's industrial estates supports demand for mechanical drafting, fixture documentation and fabrication drawings.",
      "Port-related and electronics manufacturing, alongside ongoing commercial construction, also generate structural and civil drafting work.",
    ],
    localProjectTypes: [
      "Automotive component and assembly drafting",
      "Mechanical fixture and tooling documentation",
      "Structural steel detailing for industrial estates",
      "Civil site drawings for industrial and port-related projects",
      "Commercial and residential architectural documentation",
    ],
    services: ["mechanical-drafting", "structural-drafting", "civil-drafting", "engineering-design"],
    industries: ["automotive", "manufacturing", "construction"],
    workflow: [
      { title: "Send your brief", description: "Share drawings, sketches or a model along with your project requirements — no site visit required." },
      { title: "Scope & quote", description: "We confirm deliverables, format and turnaround before work begins." },
      { title: "Drafting & modelling", description: "Work is carried out remotely, with regular check-ins for larger projects." },
      { title: "Review & delivery", description: "Files are delivered in your required format, with revisions handled through markup rounds." },
    ],
    faqs: [
      { question: "Can you support Chennai's automotive manufacturing sector?", answer: "Yes, mechanical drafting and fixture documentation are commonly used across Chennai's automotive and auto-component manufacturing base." },
      { question: "Do you provide civil drafting for industrial estate projects?", answer: "Yes, civil site drawings are available for Chennai-based industrial and port-related projects." },
    ],
    relatedLocations: ["bangalore", "hyderabad"],
    seoTitle: "CAD Drafting Services Chennai | IndCAD",
    seoDescription:
      "Mechanical, structural and civil drafting services for Chennai's automotive, manufacturing and industrial sectors.",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    heroHeading: "CAD Drafting Services Hyderabad",
    heroDescription:
      "CAD drafting, BIM and engineering design support for Hyderabad's pharma, aerospace and construction sectors.",
    intro: [
      "Hyderabad combines a major pharmaceutical and biotech manufacturing base with a growing aerospace and defence sector, alongside a fast-expanding commercial and residential construction market centred on the city's technology corridor.",
      "We provide remote CAD drafting, BIM and engineering design support to Hyderabad-based manufacturers, engineering firms and construction teams.",
    ],
    localContext: [
      "Pharmaceutical, biotech and aerospace manufacturing facilities generate demand for precise mechanical drafting, equipment documentation and reverse engineering.",
      "Rapid commercial and residential construction along Hyderabad's technology corridor also supports ongoing architectural and structural BIM documentation work.",
    ],
    localProjectTypes: [
      "Pharma and biotech facility mechanical drafting",
      "Aerospace and precision component documentation",
      "Commercial and residential structural detailing",
      "BIM coordination for construction projects",
      "Legacy drawing conversion for manufacturing facilities",
    ],
    services: ["mechanical-drafting", "structural-drafting", "bim-services", "cad-conversion"],
    industries: ["manufacturing", "aerospace", "construction"],
    workflow: [
      { title: "Send your brief", description: "Share drawings, sketches or a model along with your project requirements — no site visit required." },
      { title: "Scope & quote", description: "We confirm deliverables, format and turnaround before work begins." },
      { title: "Drafting & modelling", description: "Work is carried out remotely, with regular check-ins for larger projects." },
      { title: "Review & delivery", description: "Files are delivered in your required format, with revisions handled through markup rounds." },
    ],
    faqs: [
      { question: "Can you support Hyderabad's pharma and biotech manufacturing sector?", answer: "Yes, mechanical drafting and equipment documentation are commonly used across Hyderabad's pharma and biotech manufacturing base." },
      { question: "Do you provide BIM coordination for Hyderabad's commercial developments?", answer: "Yes, architectural, structural and services BIM coordination is available for Hyderabad-based commercial and residential projects." },
    ],
    relatedLocations: ["bangalore", "chennai"],
    seoTitle: "CAD Drafting Services Hyderabad | IndCAD",
    seoDescription:
      "CAD drafting, BIM and engineering design services for Hyderabad's pharma, aerospace and construction sectors.",
  },
];

export function getLocationBySlug(slug: string) {
  return locations.find((location) => location.slug === slug);
}
