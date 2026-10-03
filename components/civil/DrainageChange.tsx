"use client";

import { useEffect, useRef, useState } from "react";
import { CivilIcon, type CivilIconName } from "@/components/svg/CivilIcons";
import { cn } from "@/lib/utils";

const affected: { label: string; note: string; icon: CivilIconName }[] = [
  { label: "Drainage", note: "Pipe grades and pit levels", icon: "drainage" },
  { label: "Grading", note: "Surface falls around the pits", icon: "grading" },
  { label: "Road profile", note: "Cover and crossing levels", icon: "road" },
  { label: "Site plan", note: "Pit positions and easements", icon: "site" },
];

/** Shows how one drainage change touches several drawing sets. A visual walkthrough — no calculation is performed. */
export function DrainageChange({ className }: { className?: string }) {
  const [step, setStep] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(affected.length);
      return;
    }
    setStep(0);
    affected.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i + 1), 650 * (i + 1)));
    });
  }

  const changed = step >= 0;
  return (
    <div className={cn("grid items-stretch gap-4 lg:grid-cols-[320px_1fr]", className)}>
      <div className="flex flex-col justify-between border border-steel-300/25 bg-ink-950 p-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Design change</p>
          <p className="mt-3 font-mono text-lg text-white">PIPE INVERT</p>
          <p className={cn("mt-1 font-mono text-sm transition-colors", changed ? "text-copper-400" : "text-neutral-500")}>
            {changed ? "RL 101.20 → 100.90" : "RL 101.20"}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Illustrative values</p>
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={run} className="flex-1 border border-copper-500 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-copper-400 transition-colors hover:bg-copper-500/10">
            Apply change
          </button>
          <button type="button" onClick={() => { timers.current.forEach(clearTimeout); setStep(-1); }} className="border border-steel-300/30 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-neutral-300 transition-colors hover:border-sky-300/60">
            Reset
          </button>
        </div>
      </div>

      <ul className="relative grid gap-3 border-l border-copper-500/40 pl-5 sm:grid-cols-2">
        {affected.map((a, i) => {
          const hit = step > i;
          return (
            <li key={a.label} className="relative">
              <span aria-hidden className={cn("absolute -left-5 top-1/2 hidden h-px w-5 transition-colors duration-500 sm:block", hit ? "bg-copper-500" : "bg-copper-500/20")} />
              <div className={cn("flex h-full items-start gap-4 border p-4 transition-all duration-500", hit ? "border-copper-500 bg-copper-500/10" : "border-steel-300/20 bg-ink-900/60")}>
                <CivilIcon name={a.icon} className={cn("h-9 w-9 shrink-0 transition-colors", hit ? "text-copper-400" : "text-sky-300")} />
                <div>
                  <p className="text-sm font-semibold text-white">{a.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{a.note}</p>
                  <p className={cn("mt-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity duration-500", hit ? "text-copper-400 opacity-100" : "opacity-0")}>May need updating</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
