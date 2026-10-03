"use client";

import { useState } from "react";
import { PortalFrame, PlatformStructure, MultiStoreyFrame, MiningStructure, BrownfieldMod } from "@/components/svg/StructScenes";
import { cn } from "@/lib/utils";

const STRUCTURES = ["Warehouse frame", "Industrial platform", "Multi-storey frame", "Mining structure", "Brownfield modification"];
const MAP: number[][] = [[0, 1, 2, 3, 4], [0, 1], [2], [3], [1], [0, 2], [4], [2]];

/** Five structures; hovering an application (or a structure) highlights where it applies. */
export function ApplicationsScene({ applications, className }: { applications: string[]; className?: string }) {
  const [hot, setHot] = useState<number[]>([]);
  const [app, setApp] = useState<number | null>(null);
  const on = (i: number) => hot.includes(i);
  const setApplication = (i: number | null) => {
    setApp(i);
    setHot(i === null ? [] : MAP[i] ?? []);
  };
  const cell = (i: number) => cn("transition-opacity duration-300", hot.length === 0 || on(i) ? "opacity-100" : "opacity-25");
  const slots = [
    { x: 40, y: 150, c: (hl: boolean) => <PortalFrame ox={90} oy={72} s={5.5} hl={hl} /> },
    { x: 210, y: 150, c: (hl: boolean) => <PlatformStructure ox={44} oy={64} s={7} hl={hl} /> },
    { x: 380, y: 150, c: (hl: boolean) => <MultiStoreyFrame ox={46} oy={84} s={8} hl={hl} /> },
    { x: 550, y: 150, c: (hl: boolean) => <MiningStructure ox={44} oy={84} s={6.5} hl={hl} /> },
    { x: 720, y: 150, c: (hl: boolean) => <BrownfieldMod ox={46} oy={68} s={8} hl={hl} /> },
  ];
  return (
    <div className={className}>
      <div className="border border-steel-300/25 bg-ink-950 p-2">
        <svg viewBox="0 0 880 300" fill="none" className="h-auto w-full text-sky-300" role="img" aria-label="Five structure types: warehouse frame, industrial platform, multi-storey frame, mining structure and brownfield modification">
          {slots.map((sl, i) => (
            <g
              key={i}
              transform={`translate(${i * 172 + 8} 20)`}
              className={cn(cell(i), "cursor-pointer")}
              onMouseEnter={() => setHot([i])}
              onMouseLeave={() => (app === null ? setHot([]) : setHot(MAP[app]))}
            >
              <rect width="164" height="236" stroke={on(i) ? "#d68a51" : "#83aed3"} strokeOpacity={on(i) ? 0.9 : 0.25} />
              <g transform="translate(0 20)">{sl.c(on(i))}</g>
              <text x="12" y="224" fill={on(i) ? "#d68a51" : "#7dd3fc"} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">{STRUCTURES[i].toUpperCase()}</text>
            </g>
          ))}
          <text x="14" y="288" fill="#64748b" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2">ILLUSTRATIVE STRUCTURES</text>
        </svg>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {applications.map((a, i) => (
          <li key={a}>
            <button
              type="button"
              onMouseEnter={() => setApplication(i)}
              onMouseLeave={() => setApplication(null)}
              onFocus={() => setApplication(i)}
              onBlur={() => setApplication(null)}
              className={cn("h-full w-full border px-4 py-3 text-left text-sm leading-snug transition-colors", app === i ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}
            >
              {a}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
