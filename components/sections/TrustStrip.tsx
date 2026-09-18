import { Container } from "@/components/ui/Container";

const items = [
  "CAD Drafting",
  "BIM Modelling",
  "Engineering Design",
  "2D Drafting",
  "3D Modelling",
  "Technical Documentation",
];

export function TrustStrip() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6">
        {items.map((item) => (
          <span key={item} className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">
            {item}
          </span>
        ))}
      </Container>
    </section>
  );
}
