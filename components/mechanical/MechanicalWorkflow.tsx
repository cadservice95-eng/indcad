"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";
import { cn } from "@/lib/utils";

const stepIcons: MechIconName[] = ["sketch", "bom", "model3d", "cad2d", "folder"];

/** Five-stage timeline; the line draws and each stage activates as the section scrolls past. */
export function MechanicalWorkflow({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - r.top) / Math.max(r.height * 0.9, 1)));
      el.style.setProperty("--p", p.toFixed(3));
      const count = Math.round(p * (steps.length - 1)) + (p > 0.02 ? 1 : 0);
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
  }, [steps.length]);

  return (
    <section id="how-it-works" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Process" heading="How It Works" />
        </Reveal>
        <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative mt-14">
          <div aria-hidden className="absolute left-0 right-0 top-[28px] hidden h-px bg-neutral-200 lg:block">
            <div className="h-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} />
          </div>
          <div aria-hidden className="absolute bottom-6 left-[28px] top-6 w-px bg-neutral-200 lg:hidden">
            <div className="h-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} />
          </div>
          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => {
              const on = i < active;
              return (
                <li key={step.title} className="group relative pl-20 lg:pl-0 lg:pt-20">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 flex h-14 w-14 items-center justify-center border bg-white transition-colors duration-500",
                      on ? "border-copper-500 text-copper-600" : "border-neutral-300 text-neutral-400",
                    )}
                  >
                    <MechIcon name={stepIcons[i % stepIcons.length]} className="h-8 w-8" />
                  </span>
                  <p className={cn("font-mono text-xs tracking-[0.16em] transition-colors duration-500", on ? "text-copper-600" : "text-neutral-400")}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold tracking-tight text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
