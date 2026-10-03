"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Part = "column" | "beam" | "plate" | "bolts" | "weld";

const PARTS: { id: Part; label: string; lines: string[] }[] = [
  { id: "column", label: "Column", lines: ["Flange face receives the end plate", "Holes drilled to the bolt pattern"] },
  { id: "beam", label: "Beam", lines: ["Beam end cut square to the plate", "Web and flange welded at the plate"] },
  { id: "plate", label: "Plate", lines: ["Thickness and size shown on the detail", "Holes match the column bolt pattern"] },
  { id: "bolts", label: "Bolts", lines: ["Bolt pattern follows the engineer's connection design", "Tightening access checked against the detail"] },
  { id: "weld", label: "Weld", lines: ["Weld size and type called out on the detail", "Cross-referenced to the weld procedure"] },
];

const PANEL = ["Member interface", "Bolt pattern", "Plate geometry", "Weld information", "Engineer reference"];

/** Exploded beam-to-column connection. Select a part to highlight it and read what it controls. Illustrative. */
export function ConnectionViewer({ className }: { className?: string }) {
  const [active, setActive] = useState<Part | null>(null);
  const [exploded, setExploded] = useState(true);
  const cls = (id: Part) => cn("transition-[opacity,color] duration-300", active === null ? "text-sky-300" : active === id ? "text-copper-400" : "text-sky-300 opacity-25");
  const sw = (id: Part) => (active === id ? 2.6 : 1.6);
  const tr = (dx: number) => ({ transform: `translateX(${exploded ? dx : 0}px)`, transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)" }) as React.CSSProperties;
  const sel = (id: Part) => ({ onMouseEnter: () => setActive(id), onMouseLeave: () => setActive(null), onClick: () => setActive((a) => (a === id ? null : id)), style: { cursor: "pointer" } });
  const current = PARTS.find((p) => p.id === active);

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.5fr_1fr]", className)}>
      <div className="relative border border-steel-300/25 bg-ink-950 p-2">
        <svg viewBox="0 0 640 360" fill="none" className="h-auto w-full" role="img" aria-label="Exploded beam-to-column connection showing column, plate, bolts, weld and beam" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 22V0h22M618 0h22v22M640 338v22h-22M22 360H0v-22" stroke="#38bdf8" strokeWidth="2" />
          {/* column */}
          <g className={cls("column")} {...sel("column")}>
            <rect x="120" y="24" width="64" height="312" stroke="currentColor" strokeWidth={sw("column")} className="fill-sky-400/5" />
            <path d="M134 24v312M170 24v312" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            {[116, 148, 212, 244].map((y) => <circle key={y} cx="177" cy={y} r="2.6" stroke="currentColor" strokeDasharray="2 2" />)}
          </g>
          {/* plate + bolts + weld + beam move apart together */}
          <g style={tr(50)}>
            <g className={cls("plate")} {...sel("plate")}>
              <rect x="184" y="96" width="14" height="168" stroke="currentColor" strokeWidth={sw("plate")} className="fill-sky-400/20" />
            </g>
            <g className={cls("weld")} {...sel("weld")}>
              <path d="M198 96l10 -9v9zM198 264l10 9v-9z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth={active === "weld" ? 2 : 1} />
              <path d="M208 87l30 -22h50" stroke="currentColor" strokeWidth="1" />
              <text x="292" y="62" fill="currentColor" fontSize="9.5" letterSpacing="1" style={{ fontFamily: "var(--font-mono)" }}>FW 6 · ALL ROUND</text>
            </g>
          </g>
          <g style={tr(110)}>
            <g className={cls("beam")} {...sel("beam")}>
              <rect x="208" y="120" width="300" height="120" stroke="currentColor" strokeWidth={sw("beam")} className="fill-sky-400/5" />
              <path d="M208 136h300M208 224h300" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
              <text x="310" y="186" fill="currentColor" fontSize="10" letterSpacing="1.4" style={{ fontFamily: "var(--font-mono)" }}>BEAM B-104</text>
            </g>
          </g>
          <g style={tr(50)}>
            <g className={cls("bolts")} {...sel("bolts")}>
              {[116, 148, 212, 244].map((y) => (
                <g key={y}>
                  <rect x="168" y={y - 6} width="36" height="12" stroke="currentColor" strokeWidth={active === "bolts" ? 2 : 1.3} className="fill-ink-950" />
                  <path d={`M176 ${y - 6}v12M196 ${y - 6}v12`} stroke="currentColor" strokeWidth="0.8" />
                </g>
              ))}
            </g>
          </g>
          <g fill="#7dd3fc" fontSize="9.5" letterSpacing="1.2" style={{ fontFamily: "var(--font-mono)" }}>
            <text x="22" y="52">DETAIL A</text>
            <text x="22" y="68" fill="#d68a51">CONNECTION C-12</text>
            <text x="24" y="340" opacity="0.7">COLUMN C-06</text>
          </g>
        </svg>
        <button type="button" onClick={() => setExploded((e) => !e)} className="absolute right-4 top-4 border border-steel-300/40 bg-ink-950/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300 transition-colors hover:border-sky-300">
          {exploded ? "Assemble" : "Explode"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div role="group" aria-label="Connection parts" className="grid grid-cols-5 gap-2 lg:grid-cols-5">
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={active === p.id}
              onClick={() => setActive((a) => (a === p.id ? null : p.id))}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              className={cn("border px-1 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors sm:text-[11px]", active === p.id ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex-1 border border-steel-300/20 bg-ink-900/70 p-5" aria-live="polite">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Connection detail</p>
          <p className="mt-2 text-lg font-semibold text-white">{current ? current.label : "Select a part"}</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            {(current ? current.lines : ["Choose a part to see how it is detailed.", "Values on the diagram are illustrative."]).map((l) => (
              <li key={l} className="flex gap-2.5"><span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />{l}</li>
            ))}
          </ul>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-steel-300/15 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
            {PANEL.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
