import { Container } from "@/components/ui/Container";

const items = [
  "CAD Drafting",
  "BIM Modelling",
  "Engineering Design",
  "CAD Conversion",
  "Technical Documentation",
];

/** Slim capability strip: static on desktop, snap-scrolling on small screens. */
export function CapabilityStrip() {
  return (
    <section aria-label="Capabilities" className="border-b border-neutral-200 bg-white">
      <Container>
        <ul className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 sm:mx-0 sm:justify-between sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex shrink-0 snap-start items-center gap-3 py-5 pr-8 font-mono text-xs uppercase tracking-[0.14em] text-navy-600 sm:pr-0"
            >
              <span aria-hidden className="font-mono text-[10px] text-copper-500">
                0{i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
