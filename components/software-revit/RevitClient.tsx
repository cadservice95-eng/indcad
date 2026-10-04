"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BimModel, PointCloud, Equipment, type Layers, type EqHl } from "@/components/bim/Model";
import { ElementIso } from "@/components/revit/RvtScene";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
    light ? (on ? "border-[#1E3A8A] bg-[#1E3A8A] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
      : (on ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white"));
function Tabs({ items, i, set, label, light }: { items: readonly string[]; i: number; set: (k: number) => void; label: string; light?: boolean }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {items.map((x, k) => <button key={x} role="tab" type="button" aria-selected={i === k} onClick={() => set(k)} onKeyDown={(e) => { if (e.key === "ArrowRight") set((k + 1) % items.length); if (e.key === "ArrowLeft") set((k + items.length - 1) % items.length); }} className={tab(i === k, light)}>{x}</button>)}
    </div>
  );
}

/* hero: architecture + structure + MEP → coordinated model */
const DISC: { k: string; label: string; layers: Layers }[] = [
  { k: "all", label: "Coordinated model", layers: { arch: true, struct: true, mech: true, elec: true, plumb: true } },
  { k: "arch", label: "Architecture", layers: { arch: true } },
  { k: "struct", label: "Structure", layers: { struct: true } },
  { k: "mep", label: "MEP", layers: { mech: true, elec: true, plumb: true } },
];
export function HeroModel() {
  const [i, setI] = useState(0);
  return (
    <div className="border border-slate-700 bg-[#0B1B33]">
      <BimModel layers={DISC[i].layers} faint labels={false} className="block h-auto w-full" title={`Illustrative Revit building model — ${DISC[i].label}`} />
      <div className="border-t border-slate-700 p-2.5"><Tabs items={DISC.map((d) => d.label)} i={i} set={setI} label="Discipline" /></div>
    </div>
  );
}

/* clash review */
export function ClashView() {
  const [i, setI] = useState(0);
  return (
    <div className="border border-slate-700 bg-[#0B1B33]">
      <BimModel clash={i === 0 ? "open" : "resolved"} labels={false} className="mx-auto block h-auto w-full max-w-[860px]" title={i === 0 ? "Federated model with open clashes marked" : "Federated model after clashes were resolved in the discipline models"} />
      <div className="border-t border-slate-700 p-2.5"><Tabs items={["Clash review", "After resolution"]} i={i} set={setI} label="Clash state" /></div>
    </div>
  );
}

/* level of development: same element at increasing development */
export function LodView() {
  const [i, setI] = useState(1);
  const kinds = ["door", "window", "equipment"] as const;
  const [k, setK] = useState(2);
  return (
    <div className="border border-slate-300 bg-white">
      <div className="grid gap-px bg-slate-200 sm:grid-cols-4">
        {[0, 1, 2, 3].map((l) => <button key={l} type="button" aria-pressed={i === l} onClick={() => setI(l)} className={cn("bg-white p-2 text-left transition-colors", i === l ? "outline outline-2 -outline-offset-2 outline-blue-700" : "opacity-70 hover:opacity-100")}><ElementIso kind={kinds[k]} lod={l as 0 | 1 | 2 | 3} glow={i === l} className="block h-auto w-full" title={`${kinds[k]} at development stage ${l + 1}`} /><span className="block px-1 pb-1 font-mono text-[10px] uppercase text-slate-500">Stage {l + 1}</span></button>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-3">
        <Tabs light items={["Door", "Window", "Equipment"]} i={k} set={setK} label="Element" />
        <p className="text-xs text-slate-500">Illustrative — detail agreed per stage and use, not maximised.</p>
      </div>
    </div>
  );
}

/* model data: object → parameters → schedule */
const PARAMS: { k: EqHl; label: string }[] = [{ k: "type", label: "Type" }, { k: "size", label: "Size" }, { k: "ref", label: "Mark / reference" }, { k: "system", label: "System" }, { k: "level", label: "Level" }, { k: "param", label: "Shared parameter" }];
export function DataView() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-px overflow-hidden border border-slate-700 bg-slate-700 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
      <div className="bg-[#0B1B33]"><Equipment hl={PARAMS[i].k} className="block h-auto w-full" title={`Equipment family with ${PARAMS[i].label} highlighted`} /></div>
      <div className="bg-[#0B1B33] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Parameters → schedule</p>
        <ul className="mt-3 space-y-1">{PARAMS.map((p, k) => <li key={p.label}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("flex w-full justify-between border px-3 py-2 text-left font-mono text-[11px] uppercase transition-colors", i === k ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-700 text-slate-300 hover:text-white")}><span>{p.label}</span><span className="text-slate-500">{i === k ? "→ schedule column" : "—"}</span></button></li>)}</ul>
        <p className="mt-3 text-xs text-slate-400">Illustrative family — values come from the project.</p>
      </div>
    </div>
  );
}

/* scan to BIM stages */
const SCAN = ["Raw point cloud", "Registered & cleaned", "Modelling against the cloud", "Existing-condition model", "Documentation / coordination"];
export function ScanView() {
  const [s, setS] = useState(0);
  return (
    <div className="border border-slate-700 bg-[#0B1B33]">
      <PointCloud stage={s as 0 | 1 | 2 | 3 | 4} className="mx-auto block h-auto w-full max-w-[860px]" title={`Scan to BIM — ${SCAN[s]}`} />
      <div className="border-t border-slate-700 p-2.5"><Tabs items={SCAN} i={s} set={setS} label="Scan to BIM stage" /></div>
    </div>
  );
}

/* phasing: existing / demolition / new */
const PH = ["Existing", "Demolition", "New construction", "Combined"];
export function PhasingView() {
  const [i, setI] = useState(3);
  const show = (k: number) => i === 3 || i === k;
  const ln = (c: string, w = 2) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round" }) as const;
  return (
    <div className="border border-slate-300 bg-white">
      <svg viewBox="0 0 520 280" className="mx-auto block h-auto w-full max-w-[760px]" role="img" aria-label={`Renovation plan — ${PH[i]} phase`}>
        <title>{`Renovation plan — ${PH[i]}`}</title>
        <rect width="520" height="280" fill="#fff" />
        <g style={{ opacity: show(0) ? 1 : 0.12, transition: "opacity .4s" }}><path d="M60 40H460V240H60Z" {...ln("#475569", 3)} /><path d="M60 140H220V40" {...ln("#475569", 2)} /></g>
        <g style={{ opacity: show(1) ? 1 : 0.12, transition: "opacity .4s" }}><path d="M220 140H340V240" {...ln("#DC2626", 2)} strokeDasharray="8 5" /><path d="M300 40V100" {...ln("#DC2626", 2)} strokeDasharray="8 5" /></g>
        <g style={{ opacity: show(2) ? 1 : 0.12, transition: "opacity .4s" }}><path d="M260 140H460M380 140V240" {...ln("#2563EB", 3)} /><path d="M460 90H500V200H460" {...ln("#2563EB", 3)} /></g>
        <g fontSize="10" style={{ fontFamily: "var(--font-mono)" }}><rect x="12" y="250" width="10" height="10" fill="#475569" /><text x="28" y="259" fill="#334155">EXISTING</text><rect x="110" y="250" width="10" height="10" fill="#DC2626" /><text x="126" y="259" fill="#334155">DEMOLISHED</text><rect x="226" y="250" width="10" height="10" fill="#2563EB" /><text x="242" y="259" fill="#334155">NEW</text></g>
      </svg>
      <div className="border-t border-slate-200 p-2.5"><Tabs light items={PH} i={i} set={setI} label="Phase filter" /></div>
    </div>
  );
}
