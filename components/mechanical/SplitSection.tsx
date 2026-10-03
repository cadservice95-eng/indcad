import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { cn } from "@/lib/utils";

export type Tone = "light" | "tint" | "dark";

export const toneClass: Record<Tone, string> = {
  light: "border-t border-neutral-200 bg-white",
  tint: "border-t border-neutral-200 bg-neutral-50",
  dark: "border-t border-navy-800 bg-ink-950",
};

/** Text on one side, an animated technical visual on the other. */
export function SplitSection({
  id,
  eyebrow,
  heading,
  tone = "light",
  flip = false,
  visual,
  visualClassName,
  children,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  tone?: Tone;
  flip?: boolean;
  visual: React.ReactNode;
  visualClassName?: string;
  children: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} className={cn("relative overflow-hidden py-20 sm:py-28", toneClass[tone])}>
      {dark ? <TechnicalGrid id={`${id ?? eyebrow}-grid`.replace(/\W/g, "")} className="text-sky-300/[0.06]" /> : null}
      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(flip && "lg:order-2")}>
          <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
          <div className={cn("mt-6 space-y-4 text-base leading-relaxed", dark ? "text-neutral-300" : "text-neutral-600")}>
            {children}
          </div>
        </Reveal>
        <InView
          threshold={0.3}
          className={cn(
            "relative overflow-hidden border border-navy-800 bg-ink-950 p-2",
            flip && "lg:order-1",
            visualClassName,
          )}
        >
          <TechnicalGrid id={`${id ?? eyebrow}-v`.replace(/\W/g, "")} className="text-sky-300/[0.07]" minor={20} major={100} />
          <div className="relative">{visual}</div>
        </InView>
      </Container>
    </section>
  );
}

export function Chips({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="not-prose mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]",
            dark ? "border-steel-300/30 text-sky-200" : "border-neutral-300 text-navy-700",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "border-l-2 border-copper-500 pl-4 text-[15px] leading-relaxed",
        dark ? "text-neutral-200" : "text-navy-800",
      )}
    >
      {children}
    </p>
  );
}
