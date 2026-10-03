import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

export function DarkSection({ id, tone = "950", children }: { id: string; tone?: "950" | "900"; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative overflow-hidden border-t border-navy-800 py-20 sm:py-28 ${tone === "950" ? "bg-ink-950" : "bg-ink-900"}`}>
      <TechnicalGrid id={`${id}-grid`} className="text-sky-300/[0.06]" />
      <Container className="relative">{children}</Container>
    </section>
  );
}

export function LightSection({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`border-t border-neutral-200 py-20 sm:py-28 ${tint ? "bg-neutral-50" : ""}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      <div className={`space-y-4 text-base leading-relaxed ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{children}</div>
    </Reveal>
  );
}

export const sentences = (text: string) => text.split(/(?<=\.) /);
