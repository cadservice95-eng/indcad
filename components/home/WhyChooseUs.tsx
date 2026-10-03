import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";

const glyph = {
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-9 w-9",
  "aria-hidden": true,
};

const blocks = [
  {
    title: "Technical Accuracy",
    text: "Detailed drawings and models created with attention to dimensions, standards and project requirements.",
    icon: (
      <svg {...glyph}>
        <circle cx="20" cy="20" r="11" />
        <path d="M20 5v8M20 27v8M5 20h8M27 20h8" />
        <circle cx="20" cy="20" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Engineering Understanding",
    text: "Workflows designed around real engineering, architectural and construction requirements.",
    icon: (
      <svg {...glyph}>
        <path d="M20 5L8 34M20 5l12 29" />
        <path d="M13 24h14" />
        <circle cx="20" cy="5" r="2.2" />
        <path d="M5 34h30" />
      </svg>
    ),
  },
  {
    title: "Scalable Support",
    text: "Support for individual drawings, ongoing projects and larger documentation requirements.",
    icon: (
      <svg {...glyph}>
        <path d="M20 6l14 7-14 7-14-7z" />
        <path d="M6 20l14 7 14-7" opacity="0.7" />
        <path d="M6 27l14 7 14-7" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Clear Documentation",
    text: "Organised files and technical outputs designed to fit professional project workflows.",
    icon: (
      <svg {...glyph}>
        <path d="M9 5h16l6 6v24H9z" />
        <path d="M25 5v6h6" />
        <path d="M14 18h12M14 23h12M14 28h7" opacity="0.7" />
      </svg>
    ),
  },
];

const indicators = ["2D CAD", "3D Modelling", "BIM", "Technical Documentation", "Engineering Support"];

export function WhyChooseUs() {
  return (
    <section className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Why Render CAD Hub"
            heading="Built Around Precision, Not Just Deliverables"
          />
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((block, i) => (
            <Reveal key={block.title} delay={i * 80} className="bg-white">
              <div className="group h-full p-7 transition-colors duration-300 hover:bg-steel-50">
                <div className="flex items-center justify-between text-steel-600 transition-colors group-hover:text-copper-600">
                  {block.icon}
                  <span className="font-mono text-xs tracking-[0.14em] text-neutral-400">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-navy-900">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{block.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">Capability coverage</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {indicators.map((item) => (
              <li
                key={item}
                className="border border-neutral-300 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-navy-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
