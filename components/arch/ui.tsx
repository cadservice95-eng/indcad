import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { cn } from "@/lib/utils";

/** Warm architectural-paper section (light). */
export function Paper({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-hidden border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#F1EFEA]" : "bg-[#F8F7F4]")}>
      <Container className="relative">{children}</Container>
    </section>
  );
}

/** Charcoal section hosting white drawing sheets. */
export function Char({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative scroll-mt-20 overflow-hidden border-t border-slate-800 bg-[#111827] py-20 sm:py-28">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]">
        <defs><pattern id={`${id}-g`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${id}-g)`} />
      </svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}

export function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div>
    </Reveal>
  );
}

/** A drawing sheet: white paper with a thin technical frame. */
export function Sheet({ children, className, label }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <figure className={cn("relative border border-slate-300 bg-white p-2 shadow-[0_1px_0_rgba(17,24,39,0.04),0_14px_30px_-18px_rgba(17,24,39,0.35)] sm:p-3", className)}>
      {children}
      {label ? <figcaption className="mt-1 flex flex-wrap justify-between gap-x-4 border-t border-slate-200 px-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</figcaption> : null}
    </figure>
  );
}

export const META = "DRAWING A-101 · REV B · SHEET A-03 · STATUS FOR REVIEW · SCALE ILLUSTRATIVE";

export function chip(active: boolean, dark?: boolean) {
  return cn(
    "min-h-[40px] border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    active
      ? "border-blue-600 bg-blue-600 text-white"
      : dark
        ? "border-slate-600 bg-transparent text-slate-300 hover:border-slate-300 hover:text-white"
        : "border-slate-300 bg-white text-slate-700 hover:border-slate-900",
  );
}

export const sentences = (text: string) => text.split(/(?<=\.) /);
export const faqOf = (faqs: { question: string; answer: string }[], start: string) => faqs.find((f) => f.question.startsWith(start))?.answer ?? "";
