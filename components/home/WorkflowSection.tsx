"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Understand", text: "Review project requirements, drawings, specifications and deliverables." },
  { title: "Plan", text: "Define the appropriate CAD/BIM workflow and documentation structure." },
  { title: "Develop", text: "Create drawings, models or engineering documentation." },
  { title: "Review", text: "Check dimensions, coordination and project requirements." },
  { title: "Deliver", text: "Provide organised final files in the required formats." },
];

/**
 * Five-step process joined by a technical line that fills as the section
 * scrolls through the viewport (horizontal on desktop, vertical on mobile).
 */
export function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.72 - rect.top) / Math.max(rect.height * 0.9, 1);
      const p = Math.min(1, Math.max(0, raw));
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
  }, []);

  return (
    <section className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Workflow" heading="A Clear Workflow From Brief to Final Delivery" />
        </Reveal>

        <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative mt-14">
          {/* desktop line */}
          <div aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-neutral-200 lg:block">
            <div className="h-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} />
          </div>
          {/* mobile line */}
          <div aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-neutral-200 lg:hidden">
            <div className="h-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} />
          </div>

          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => {
              const on = i < active;
              return (
                <li key={step.title} className="relative pl-10 lg:pl-0 lg:pt-10">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 flex h-6 w-6 items-center justify-center border bg-white transition-colors duration-500",
                      on ? "border-copper-500" : "border-neutral-300",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 transition-all duration-500",
                        on ? "scale-100 bg-copper-500" : "scale-50 bg-neutral-300",
                      )}
                    />
                  </span>
                  <p
                    className={cn(
                      "font-mono text-xs tracking-[0.16em] transition-colors duration-500",
                      on ? "text-copper-600" : "text-neutral-400",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
