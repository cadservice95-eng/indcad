"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";
import { cn } from "@/lib/utils";

const stages: { label: string; icon: MechIconName }[] = [
  { label: "Concept", icon: "sketch" },
  { label: "Design", icon: "product" },
  { label: "CAD", icon: "model3d" },
  { label: "Drawings", icon: "drawing" },
  { label: "BOM", icon: "bom" },
  { label: "Production", icon: "line" },
];

/** New-product-introduction timeline whose line fills as it scrolls into view. */
export function NpiTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / Math.max(r.height * 1.1, 1)));
      el.style.setProperty("--p", p.toFixed(3));
      const count = Math.round(p * (stages.length - 1)) + (p > 0.02 ? 1 : 0);
      setActive((prev) => (prev === count ? prev : count));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="npi" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="New product introduction" heading="Support When Documentation Demand Spikes" />
          <div className="space-y-4 text-base leading-relaxed text-neutral-600">
            <p>
              Documentation load is uneven: it spikes with new product introductions, equipment changes and legacy part
              requalification, then dips in between — a poor fit for a fixed in-house headcount sized to the average
              rather than the peak.
            </p>
            <p>
              Overflow drafting capacity during a busy introduction period, without committing to a permanent headcount
              increase, is one of the most common ways manufacturers use this service.
            </p>
          </div>
        </Reveal>

        <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative mt-14">
          <div aria-hidden className="absolute left-0 right-0 top-[28px] hidden h-px bg-neutral-200 lg:block">
            <div className="h-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} />
          </div>
          <div aria-hidden className="absolute bottom-6 left-[28px] top-6 w-px bg-neutral-200 lg:hidden">
            <div className="h-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} />
          </div>
          <ol className="grid gap-8 lg:grid-cols-6 lg:gap-4">
            {stages.map((s, i) => {
              const on = i < active;
              return (
                <li key={s.label} className="relative pl-20 lg:pl-0 lg:pt-20">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 flex h-14 w-14 items-center justify-center border bg-white transition-colors duration-500",
                      on ? "border-copper-500 text-copper-600" : "border-neutral-300 text-neutral-400",
                    )}
                  >
                    <MechIcon name={s.icon} className="h-8 w-8" />
                  </span>
                  <p className={cn("font-mono text-xs tracking-[0.16em] transition-colors duration-500", on ? "text-copper-600" : "text-neutral-400")}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight text-navy-900">{s.label}</h3>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
