"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { S, ln, T, Frame, Bracket } from "./parts";

function Tabs({ items, i, set, label }: { items: readonly string[]; i: number; set: (k: number) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {items.map((x, k) => (
        <button key={x} role="tab" type="button" aria-selected={i === k} onClick={() => set(k)} onKeyDown={(e) => { if (e.key === "ArrowRight") set((k + 1) % items.length); if (e.key === "ArrowLeft") set((k + items.length - 1) % items.length); }}
          className={cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400", i === k ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white")}>{x}</button>
      ))}
    </div>
  );
}
const Shell = ({ children, tabs, note }: { children: React.ReactNode; tabs: React.ReactNode; note?: string }) => (
  <div className="border border-slate-700 bg-[#0B1220]">
    {children}
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 p-2.5">{tabs}{note ? <p className="px-1 text-xs text-slate-400">{note}</p> : null}</div>
  </div>
);

/* top-down vs bottom-up */
export function TopDownView() {
  const [i, setI] = useState(0);
  const parts = [[70, "HOUSING"], [240, "SHAFT"], [410, "COVER"]] as const;
  return (
    <Shell tabs={<Tabs items={["Top-down", "Bottom-up"]} i={i} set={setI} label="Assembly approach" />} note="Illustrative example">
      <Frame w={600} h={300} label={i === 0 ? "Top-down: a layout sketch defines the envelope and interfaces, and parts reference it" : "Bottom-up: parts are modelled independently and brought together with mates"}>
        {i === 0 ? (
          <g>
            <rect x="150" y="26" width="300" height="78" {...ln(S.sky, 1.2)} fill={S.panel} />
            <rect x="172" y="44" width="256" height="44" {...ln(S.sky, 1)} strokeDasharray="6 4" />
            {[214, 300, 386].map((x) => <g key={x}><circle cx={x} cy="66" r="5" {...ln(S.cu, 1.4)} /><path d={`M${x - 9} 66h18M${x} 57v18`} {...ln(S.cu, 0.8)} /></g>)}
            <T x={160} y={20} c={S.sky}>LAYOUT SKETCH · ENVELOPE + INTERFACES</T>
            {parts.map(([x, n], k) => (
              <g key={n}>
                <path d={`M${[214, 300, 386][k]} 104L${x + 60} 200`} {...ln(S.cu, 1)} strokeDasharray="4 4" />
                <rect x={x} y="200" width="120" height="58" {...ln(S.line, 1.1)} fill={S.panel} />
                <T x={x + 60} y={234} a="middle">{n}</T>
              </g>
            ))}
            <T x={300} y={284} c={S.mute} a="middle">PARTS DRIVEN FROM SHARED REFERENCES · IN-CONTEXT LINKS KEPT DELIBERATE</T>
          </g>
        ) : (
          <g>
            {parts.map(([x, n]) => (
              <g key={n}>
                <rect x={x} y="30" width="120" height="58" {...ln(S.line, 1.1)} fill={S.panel} />
                <T x={x + 60} y={64} a="middle">{n}</T>
                <path d={`M${x + 60} 88L300 190`} {...ln(S.sky, 1)} />
              </g>
            ))}
            <rect x="200" y="190" width="200" height="66" {...ln(S.sky, 1.3)} fill={S.panel} />
            <T x={300} y={218} a="middle" c={S.sky}>ASSEMBLY</T><T x={300} y={236} a="middle" c={S.mute}>CONCENTRIC · COINCIDENT · DISTANCE</T>
            <T x={300} y={284} c={S.mute} a="middle">STANDALONE PARTS · STANDARD COMPONENTS · REUSE ACROSS PRODUCTS</T>
          </g>
        )}
      </Frame>
    </Shell>
  );
}

/* tolerance stack-up — illustrative chain */
const CHAIN = [["HOUSING", 60, 0.1], ["A", 20, 0.05], ["B", 25, 0.05], ["C", 14.5, 0.05]] as const;
export function StackView() {
  const [i, setI] = useState(0);
  const wc = CHAIN.reduce((s, c) => s + c[2], 0);
  const rss = Math.sqrt(CHAIN.reduce((s, c) => s + c[2] * c[2], 0));
  const t = [null, wc, rss][i];
  const k = 6.6; // px per mm
  const x0 = 60;
  const xs = [x0, x0 + 20 * k, x0 + 45 * k];
  return (
    <Shell tabs={<Tabs items={["Dimension chain", "Worst case", "Statistical (RSS)"]} i={i} set={setI} label="Stack-up view" />} note="Illustrative example — values invented">
      <Frame w={600} h={300} label={`Tolerance stack: housing 60 ±0.10 minus parts A, B and C gives a 0.50 nominal gap${t ? `, ±${t.toFixed(2)} (${i === 1 ? "worst case" : "RSS"})` : ""}`}>
        <path d={`M${x0 - 10} 70V170H${x0 + 60 * k + 10}V70`} {...ln(S.line, 2)} />
        {CHAIN.slice(1).map(([n, v], j) => <g key={n}><rect x={xs[j]} y="96" width={v * k} height="62" {...ln(S.sky, 1.1)} fill={S.panel} /><T x={xs[j] + (v * k) / 2} y={131} a="middle">{n}</T></g>)}
        <rect x={x0 + 59.5 * k} y="96" width={0.5 * k} height="62" fill={S.cu} fillOpacity="0.45" />
        <T x={x0 + 59.75 * k} y={88} a="middle" c={S.cu}>GAP</T>
        <g>
          <path d={`M${x0} 200H${x0 + 60 * k}M${x0} 194v12M${x0 + 60 * k} 194v12`} {...ln(S.grn, 1)} /><T x={x0 + 30 * k} y={196} a="middle" c={S.grn}>60.00 ±0.10</T>
          {CHAIN.slice(1).map(([n, v, tol], j) => <g key={n}><path d={`M${xs[j]} 226H${xs[j] + v * k}M${xs[j]} 220v12M${xs[j] + v * k} 220v12`} {...ln(S.line, 1)} /><T x={xs[j] + (v * k) / 2} y={244} a="middle" c={S.line} s={8.5}>{`${v.toFixed(2)} ±${tol.toFixed(2)}`}</T></g>)}
        </g>
        <rect x="390" y="16" width="196" height="56" {...ln(S.mute, 0.8)} fill={S.panel} />
        <T x={400} y={34} c={S.mute}>{["CHAIN", "WORST CASE", "STATISTICAL (RSS)"][i]}</T>
        <T x={400} y={54} c={S.cu} s={10}>{t === null ? "GAP = 60 − (20 + 25 + 14.5)" : `GAP 0.50 ±${t.toFixed(2)}`}</T>
        <T x={400} y={66} c={S.mute} s={8}>{t === null ? "= 0.50 NOMINAL" : `RANGE ${(0.5 - t).toFixed(2)} – ${(0.5 + t).toFixed(2)}`}</T>
        <T x={300} y={284} a="middle" c={S.mute}>CRITICAL STACKS REVIEWED BY A QUALIFIED ENGINEER</T>
      </Frame>
    </Shell>
  );
}

/* native → neutral export → validation */
const EXP = ["Native model", "STEP / IGES export", "Re-open & check"];
export function ExportView() {
  const [i, setI] = useState(0);
  const tree = ["Base-Extrude", "Upright", "Hole pattern", "Fillet", "Chamfer"];
  const checks = ["Units & scale", "Solid bodies (no open faces)", "Assembly structure", "Part names", "Small features present"];
  return (
    <Shell tabs={<Tabs items={EXP} i={i} set={setI} label="Export stage" />} note="Illustrative example">
      <Frame w={600} h={280} label={["Native SolidWorks part with full feature history", "Neutral STEP or IGES file carrying geometry only, without feature history", "Exported file re-opened and checked: units, solids, structure, names and features"][i]}>
        <rect x="20" y="24" width="170" height="232" {...ln(S.mute, 0.8)} fill={S.panel} />
        <T x={32} y={44} c={S.sky}>{i === 0 ? "FEATURE TREE" : i === 1 ? "IMPORTED BODY" : "VALIDATION"}</T>
        {i === 0 ? tree.map((f, k) => <g key={f}><rect x="32" y={58 + k * 26} width="10" height="10" {...ln(S.cu, 1)} /><T x={50} y={67 + k * 26}>{f}</T></g>) : null}
        {i === 1 ? <g><rect x="32" y="58" width="10" height="10" {...ln(S.mute, 1)} /><T x={50} y={67}>Imported1</T><T x={32} y={100} c={S.mute} s={8}>NO FEATURE HISTORY</T><T x={32} y={114} c={S.mute} s={8}>GEOMETRY ONLY</T></g> : null}
        {i === 2 ? checks.map((c, k) => <g key={c}><path d={`M32 ${63 + k * 26}l4 4 8-9`} {...ln(S.grn, 1.6)} /><T x={50} y={67 + k * 26} s={8.5}>{c}</T></g>) : null}
        <g style={{ opacity: i === 1 ? 0.75 : 1, transition: "opacity .4s" }}><Bracket ox={385} oy={118} s={1.45} stroke={i === 2 ? S.grn : S.line} /></g>
        <T x={385} y={266} a="middle" c={i === 0 ? S.cu : i === 1 ? S.line : S.grn}>{["PART.SLDPRT", "PART.STEP · AP214 / AP242", "CHECKED BEFORE ISSUE"][i]}</T>
      </Frame>
    </Shell>
  );
}
