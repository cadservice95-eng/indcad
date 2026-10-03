"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";
import { GaDiagram, ConnectionDiagram, ShopDiagram, ErectionDiagram } from "@/components/svg/StructDiagrams";
import { SteelFrame } from "./SteelFrame";
import { SCHEDULE } from "./steel";
import { cn } from "@/lib/utils";

export type PackageTab = { id: string; label: string; match: string };

export const DEFAULT_TABS: PackageTab[] = [
  { id: "shop", label: "Shop", match: "shop drawings|fabrication drawings|Piece mark|Weld procedure" },
  { id: "erection", label: "Erection", match: "^Erection" },
  { id: "connections", label: "Connections", match: "Connection design" },
  { id: "ga", label: "GA", match: "General arrangement|Concrete" },
  { id: "bim", label: "BIM", match: "BIM models" },
  { id: "takeoff", label: "Take-off", match: "Bolt lists" },
  { id: "revision", label: "Revision", match: "Revision history" },
];

function Sheet({ id }: { id: string }) {
  switch (id) {
    case "shop":
      return <ShopDiagram />;
    case "erection":
      return <ErectionDiagram />;
    case "connections":
      return <ConnectionDiagram />;
    case "ga":
      return <GaDiagram />;
    case "bim":
      return <SteelFrame detail={1} className="h-full w-full" viewBox="40 70 600 420" />;
    case "takeoff":
      return (
        <svg viewBox="0 0 320 220" fill="none" className="h-full w-full" aria-hidden>
          <rect x="16.5" y="20.5" width="287" height="170" stroke="#7dd3fc" strokeOpacity="0.5" />
          <path d="M16 46h287M16 70h287M16 94h287M16 118h287M16 142h287M70 20v170M118 20v170M150 20v170M222 20v170" stroke="#7dd3fc" strokeOpacity="0.25" />
          <g fill="#7dd3fc" fontSize="8" letterSpacing="1" style={{ fontFamily: "var(--font-mono)" }}>
            {["MARK", "MEMBER", "QTY", "MATL", "LENGTH"].map((h, i) => <text key={h} x={[22, 76, 124, 156, 228][i]} y="37">{h}</text>)}
            {SCHEDULE.map((r, i) => (
              <g key={r.mark}>
                {[r.mark, r.member, String(r.qty), r.material, r.length].map((t, j) => <text key={j} x={[22, 76, 124, 156, 228][j]} y={61 + i * 24}>{t}</text>)}
              </g>
            ))}
          </g>
        </svg>
      );
    case "tekla":
      return <SteelFrame detail={1} className="h-full w-full" viewBox="40 70 600 420" />;
    case "pieces":
      return <SteelFrame detail={0} marks={["C-01", "C-02", "C-03", "B-101", "B-102", "B-103", "B-201"]} className="h-full w-full" viewBox="40 70 600 420" />;
    case "coating":
      return (
        <svg viewBox="0 0 320 220" fill="none" className="h-full w-full" aria-hidden>
          <rect x="16.5" y="20.5" width="287" height="170" stroke="#7dd3fc" strokeOpacity="0.5" />
          <path d="M16 46h287M16 70h287M16 94h287M16 118h287M16 142h287M70 20v170M150 20v170M232 20v170" stroke="#7dd3fc" strokeOpacity="0.25" />
          <g fill="#7dd3fc" fontSize="8" letterSpacing="1" style={{ fontFamily: "var(--font-mono)" }}>
            {["MARK", "SYSTEM", "COAT", "NOTE"].map((h, i) => <text key={h} x={[22, 76, 156, 238][i]} y="37">{h}</text>)}
            {["B-101", "C-01", "BR-01"].map((m, i) => (
              <g key={m}>
                {[m, "AS SPEC.", "PRIMER + FINISH", "SEE SPEC"].map((t, j) => <text key={j} x={[22, 76, 156, 238][j]} y={61 + i * 24}>{t}</text>)}
              </g>
            ))}
          </g>
        </svg>
      );
    default:
      return <SteelFrame revision={2} detail={1} className="h-full w-full" viewBox="40 70 600 420" />;
  }
}

/** Tabbed drawing-package viewer; the listed deliverables come straight from the service data. */
export function DeliverablesPackage({ service, className, tabs = DEFAULT_TABS }: { service: Service; className?: string; tabs?: PackageTab[] }) {
  const [tab, setTab] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === tab) ?? tabs[0];
  const items = service.deliverables.filter((d) => new RegExp(current.match, "i").test(d));
  return (
    <div className={className}>
      <div role="tablist" aria-label="Drawing package" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors", tab === t.id ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div key={tab} data-in="true" className="relative aspect-[320/220] border border-steel-300/25 bg-ink-950 p-3">
          <Sheet id={tab} />
          <span className="absolute bottom-3 right-3 border border-steel-300/30 bg-ink-950/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">Drawing package · {current.label}</span>
        </div>
        <div className="border border-steel-300/20 bg-ink-900/70 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Included in this sheet type</p>
          <ul className="mt-4 space-y-3" aria-live="polite">
            {items.map((i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-snug text-neutral-200"><span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
