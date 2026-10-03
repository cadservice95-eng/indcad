import type { Service } from "@/lib/types";
import { SplitSection } from "./SplitSection";
import { DrawingCheckGraphic, CHECKS } from "@/components/svg/DrawingCheckGraphic";
import { overviewParagraphs } from "./content";

export function DrawingChecking({ service }: { service: Service }) {
  const [text] = overviewParagraphs(service, "How We Check Drawings");
  const step = service.process.find((p) => p.title.toLowerCase().includes("check"));
  return (
    <SplitSection
      id="checking"
      tone="tint"
      flip
      eyebrow="Quality"
      heading="How We Check Drawings"
      visual={<DrawingCheckGraphic className="h-auto w-full" />}
    >
      <p>{text}</p>
      {step ? <p>{step.description}</p> : null}
      <ul className="space-y-2 pt-2">
        {CHECKS.map((c) => (
          <li key={c.label} className="flex items-center gap-3 text-sm text-navy-800">
            <span aria-hidden className="flex h-5 w-5 items-center justify-center border border-emerald-500/60 bg-emerald-500/10 text-emerald-600">
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6.5l2.5 2.5L10 3.5" />
              </svg>
            </span>
            {c.label}
          </li>
        ))}
      </ul>
    </SplitSection>
  );
}
