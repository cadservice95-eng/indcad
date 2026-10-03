import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";

/**
 * One stage-driven workstation viewport per platform (360 × 220). Stages are cumulative.
 * Elements wrapped in <Hv> also reveal on hover/focus of the nearest `.group` (card micro-interaction).
 */
export const PSTAGES: Record<string, string[]> = {
  autocad: ["Geometry", "Dimensions", "Layers", "Drawing sheet"],
  revit: ["Building mass", "Disciplines", "Coordinated model"],
  solidworks: ["Sketch", "Feature", "Solid", "Assembly"],
  inventor: ["Parts", "Assembly", "Engineering drawing"],
  tekla: ["Steel model", "Connection detail", "Piece marks", "Shop / erection"],
  microstation: ["Base drawing", "Layered documentation"],
  "civil-3d": ["Survey points", "Surface", "Alignment", "Grading", "Drainage"],
  navisworks: ["Discipline models", "Federated model", "Coordination check", "Coordination"],
  archicad: ["Building concept", "3D model", "Documentation"],
  "fusion-360": ["Concept", "3D model", "Refinement", "Documentation"],
};

const CY = "#38BDF8", LT = "#E2E8F0", MU = "#94A3B8", DK = "#475569", AM = "#F59E0B", TL = "#2DD4BF", RD = "#F87171", GN = "#4ADE80", BL = "#2563EB";
const mono = { fontFamily: "var(--font-mono)" } as const;
const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
const HV = "opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100";

function St({ s, at, to, children }: { s: number; at: number; to?: number; children: ReactNode }) {
  const on = s >= at && (to === undefined || s <= to);
  return <g style={{ opacity: on ? 1 : 0, transition: "opacity .55s ease" }}>{children}</g>;
}
/** Hover-reveal layer; forced visible once the stage reaches `at`. */
function Hv({ s, at, children }: { s: number; at: number; children: ReactNode }) {
  return <g className={HV} style={s >= at ? { opacity: 1 } : undefined}>{children}</g>;
}
function T({ x, y, c = LT, size = 8, a = "start", children }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} style={mono}>{children}</text>;
}
type Iso = (x: number, y: number, z: number) => P;
function cube(p: Iso, x: number, y: number, z: number, w: number, d: number, h: number) {
  const A = p(x, y, z + h), B = p(x + w, y, z + h), C = p(x + w, y + d, z + h), D = p(x, y + d, z + h);
  const E = p(x + w, y, z), F = p(x + w, y + d, z), G = p(x, y + d, z);
  return { top: loop(A, B, C, D), right: loop(B, E, F, C), left: loop(D, C, F, G) };
}
function Cube({ p, b, c, fill = "none", w = 1.3 }: { p: Iso; b: [number, number, number, number, number, number]; c: string; fill?: string; w?: number }) {
  const q = cube(p, ...b);
  return <g {...ln(c, w)}><path d={q.left} fill={fill} fillOpacity={fill === "none" ? 0 : 0.35} /><path d={q.right} fill={fill} fillOpacity={fill === "none" ? 0 : 0.2} /><path d={q.top} fill={fill} fillOpacity={fill === "none" ? 0 : 0.5} /></g>;
}

/* AutoCAD — orthographic drawing, dimensions, layers, sheet */
function AutoCAD({ s }: { s: number }) {
  const c = (lay: string) => (s >= 2 ? lay : MU);
  return (
    <>
      <g style={{ transition: "stroke .5s" }}>
        <path d="M40 60H160V140H40Z" {...ln(c(LT), 1.6)} /><circle cx="100" cy="100" r="18" {...ln(c(LT), 1.6)} /><circle cx="100" cy="100" r="7" {...ln(c(LT), 1.2)} />
        <path d="M190 60H230V140H190Z" {...ln(c(LT), 1.6)} /><path d="M190 82H230M190 118H230" {...ln(c(TL), 1)} strokeDasharray="4 3" />
        <path d="M40 160H160V186H40Z" {...ln(c(LT), 1.6)} />
        <path d="M30 100H170M100 50V150M180 100H240" {...ln(c(RD), 0.8)} strokeDasharray="8 3 2 3" />
      </g>
      <St s={s} at={1}>
        <g {...ln(c(GN), 0.9)}><path d="M40 50V40M160 50V40M40 44H160M170 60H180M170 140H180M176 60V140" /><path d="M113 87l15-11" /></g>
        <T x="100" y="38" a="middle" c={c(GN)}>120</T><T x="174" y="104" a="end" c={c(GN)} size={7}>80</T><T x="130" y="76" c={c(GN)} size={7}>Ø36</T>
      </St>
      <Hv s={s} at={1}><g {...ln(GN, 0.9)}><path d="M190 50V44M230 50V44M190 47H230" /></g><T x="210" y="42" a="middle" c={GN} size={7}>40</T></Hv>
      <St s={s} at={2}>
        <rect x="256" y="20" width="90" height="70" {...ln(DK, 1)} fill="#0B1220" /><T x="262" y="32" c={MU} size={7}>LAYERS</T>
        {[["OBJECT", LT], ["HIDDEN", TL], ["CENTER", RD], ["DIMS", GN]].map(([n, k], i) => <g key={n}><rect x="262" y={40 + i * 12} width="7" height="7" fill={k} /><T x="274" y={46 + i * 12} size={7}>{n}</T></g>)}
      </St>
      <St s={s} at={3}>
        <rect x="14" y="14" width="332" height="192" {...ln(MU, 0.8)} /><path d="M256 168H346M256 186H346M300 168V206" {...ln(MU, 0.8)} />
        <T x="262" y="180" size={7}>GA DRAWING</T><T x="262" y="198" size={7}>SHEET 01</T><T x="306" y="198" size={7}>REV A</T>
      </St>
    </>
  );
}

/* Revit — mass → disciplines → coordinated model */
function Revit({ s }: { s: number }) {
  const p = makeIso(180, 112, 1.25);
  const split = s === 1;
  const lv = [0, 24, 48];
  return (
    <>
      <St s={s} at={0} to={0}><Cube p={p} b={[0, 0, 0, 80, 56, 72]} c={MU} fill="#1E3A5F" /><T x="180" y="206" a="middle" c={MU}>MASS · LEVELS</T></St>
      <St s={s} at={1}>
        <g className="transition-transform duration-500 group-hover:-translate-y-2" style={{ transform: split ? "translateY(-16px)" : undefined, transition: "transform .6s" }}>
          {lv.map((z) => <path key={z} d={cube(p, 0, 0, z + 22, 80, 56, 2).top} {...ln(CY, 1.1)} fill={CY} fillOpacity="0.12" />)}
          <path d={seg(p(0, 56, 0), p(80, 56, 0), p(80, 56, 72), p(0, 56, 72), p(0, 56, 0))} {...ln(CY, 1)} strokeOpacity="0.6" />
        </g>
        <g {...ln(AM, 1.8)}>{[[0, 0], [80, 0], [0, 56], [80, 56], [40, 0], [40, 56]].map(([x, y]) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 72))} />)}</g>
        <g className="transition-transform duration-500 group-hover:translate-y-2" style={{ transform: split ? "translateY(16px)" : undefined, transition: "transform .6s" }}>
          <path d={seg(p(4, 28, 40), p(76, 28, 40))} {...ln(TL, 3)} /><path d={seg(p(40, 4, 16), p(40, 52, 16))} {...ln(TL, 2)} />
        </g>
        <St s={s} at={1} to={1}><T x="24" y="40" c={CY}>ARCHITECTURE</T><T x="24" y="112" c={AM}>STRUCTURE</T><T x="24" y="190" c={TL}>MEP</T></St>
      </St>
      <St s={s} at={2}><g {...ln(GN, 1.6)}><circle cx="300" cy="44" r="12" /><path d="M294 44l4 4l8-8" /></g><T x="300" y="72" a="middle" c={GN} size={7}>COORDINATED</T><T x="180" y="206" a="middle" c={MU}>MODEL · SHEETS · SCHEDULES</T></St>
    </>
  );
}

/* SolidWorks — feature tree + sketch → feature → solid → assembly */
function SolidWorks({ s }: { s: number }) {
  const p = makeIso(220, 120, 1.2);
  const tree = ["Sketch1", "Boss-Extrude1", "Hole1 · Fillet1", "Mate · Concentric"];
  return (
    <>
      <rect x="12" y="16" width="104" height="188" {...ln(DK, 1)} fill="#0B1220" /><T x="20" y="30" c={MU} size={7}>FEATURE TREE</T>
      {tree.map((t, i) => <g key={t} style={{ opacity: s >= i ? 1 : 0.3, transition: "opacity .4s" }}><rect x="18" y={40 + i * 22} width="92" height="16" fill={s === i ? BL : "none"} fillOpacity="0.35" stroke={s === i ? CY : "none"} /><T x="24" y={51 + i * 22} size={7} c={s === i ? "#fff" : LT}>{t}</T></g>)}
      <St s={s} at={0} to={0}><path d="M170 150V70H230V110H290V150Z" {...ln(CY, 1.6)} /><g {...ln(GN, 0.8)}><path d="M170 160H290M170 156v8M290 156v8" /></g><T x="230" y="174" a="middle" c={GN} size={7}>SKETCH · FULLY DEFINED</T></St>
      <St s={s} at={1}>
        <g className="origin-center transition-transform duration-700 [transform-box:fill-box] group-hover:rotate-[4deg]">
          <Cube p={p} b={[-30, -20, 0, 60, 40, 14]} c={CY} fill={s >= 2 ? "#3B82F6" : "none"} />
          <Cube p={p} b={[-30, -20, 14, 22, 40, 34]} c={CY} fill={s >= 2 ? "#3B82F6" : "none"} />
          <St s={s} at={2}><ellipse cx={p(12, 0, 14)[0]} cy={p(12, 0, 14)[1]} rx="9" ry="5" {...ln(LT, 1.2)} fill="#0B1220" /><path d={seg(p(-8, -20, 48), p(-8, 20, 48))} {...ln(AM, 1.4)} /></St>
        </g>
      </St>
      <St s={s} at={3}>
        <g {...ln(TL, 1.6)}><path d={`M${p(12, 0, 14)[0] - 5} ${p(12, 0, 14)[1]}V${p(12, 0, 14)[1] - 46}M${p(12, 0, 14)[0] + 5} ${p(12, 0, 14)[1]}V${p(12, 0, 14)[1] - 46}`} /><ellipse cx={p(12, 0, 14)[0]} cy={p(12, 0, 14)[1] - 46} rx="5" ry="3" /></g>
        <T x="300" y="60" c={TL} size={7}>PIN · MATED</T>
      </St>
      <Hv s={s} at={9}><T x="236" y="200" a="middle" c={MU} size={7}>PART · ASSEMBLY · DRAWING</T></Hv>
    </>
  );
}

/* Inventor — exploded parts → assembly → drawing */
function Inventor({ s }: { s: number }) {
  const p = makeIso(140, 128, 1.15);
  const ex = s === 0 ? 1 : 0;
  const part = (k: number, node: ReactNode) => <g className="transition-transform duration-500 group-hover:-translate-y-1" style={{ transform: `translateY(${-ex * k * 26}px)`, transition: "transform .7s ease" }}>{node}</g>;
  return (
    <>
      <path d={`M${p(0, 0, 0)[0]} ${p(0, 0, 0)[1] + 10}V${p(0, 0, 0)[1] - 120}`} {...ln(RD, 0.8)} strokeDasharray="6 3 2 3" />
      {part(0, <Cube p={p} b={[-40, -28, 0, 80, 56, 10]} c={MU} fill="#334155" />)}
      {part(1, <Cube p={p} b={[-16, -16, 10, 32, 32, 14]} c={CY} fill="#1D4ED8" />)}
      {part(2, <Cube p={p} b={[-5, -5, 24, 10, 10, 40]} c={AM} fill="#78350F" />)}
      {part(3, <Cube p={p} b={[-12, -12, 64, 24, 24, 6]} c={TL} fill="#115E59" />)}
      <St s={s} at={0} to={0}><T x="210" y="60" c={MU} size={7}>CONSTRAINTS · AXIS</T><T x="210" y="74" c={MU} size={7}>MATE · INSERT</T></St>
      <St s={s} at={2}>
        <rect x="232" y="30" width="116" height="160" fill="#F8FAFC" stroke={MU} />
        <g {...ln("#334155", 1)}><path d="M250 150H330V140H250ZM276 140V124H304V140M286 124V70H294V124M280 70H300V64H280Z" /><path d="M290 160V56" stroke={RD} strokeWidth="0.6" strokeDasharray="5 2 1 2" /></g>
        <path d="M232 172H348" stroke={MU} /><T x="238" y="184" c="#334155" size={7}>ASSY DRAWING · BOM</T>
      </St>
    </>
  );
}

/* Tekla — steel frame → connection → piece marks → documents */
function Tekla({ s }: { s: number }) {
  const p = makeIso(120, 108, 0.95);
  const cols: [number, number][] = [[0, 0], [70, 0], [140, 0], [0, 60], [70, 60], [140, 60]];
  return (
    <>
      <g {...ln(AM, 2.2)}>
        {cols.map(([x, y]) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 70))} />)}
      </g>
      <g {...ln(CY, 2)}>
        <path d={seg(p(0, 0, 70), p(140, 0, 70))} /><path d={seg(p(0, 60, 70), p(140, 60, 70))} />
        {[0, 70, 140].map((x) => <path key={x} d={seg(p(x, 0, 70), p(x, 60, 70))} />)}
        <path d={seg(p(0, 0, 36), p(140, 0, 36))} strokeOpacity="0.7" />
      </g>
      <St s={s} at={1}>
        <circle cx={p(70, 0, 70)[0]} cy={p(70, 0, 70)[1]} r="11" {...ln(LT, 1)} strokeDasharray="3 2" />
        <path d={`M${p(70, 0, 70)[0] + 10} ${p(70, 0, 70)[1] + 6}L262 120`} {...ln(LT, 0.8)} />
        <rect x="248" y="112" width="96" height="80" {...ln(LT, 1)} fill="#0B1220" />
        <g {...ln(AM, 2)}><path d="M286 116V188" /></g><g {...ln(CY, 2)}><path d="M290 140H344M290 164H344" /></g><rect x="288" y="132" width="10" height="40" {...ln(LT, 1)} />
        <g className="transition-colors">{[138, 150, 162].map((y) => <circle key={y} cx="293" cy={y} r="2.4" className="fill-slate-300 transition-[fill] duration-300 group-hover:fill-amber-400" style={s === 1 ? { fill: AM } : undefined} />)}</g>
        <T x="252" y="186" size={7} c={MU}>END PLATE · M20</T>
      </St>
      <St s={s} at={2}>{([["C1", 0, 0], ["C2", 70, 0], ["C3", 140, 0], ["B1", 35, 0], ["B2", 105, 60]] as const).map(([m, x, y]) => { const q = p(x, y, m[0] === "C" ? 20 : 74); return <g key={m}><rect x={q[0] - 10} y={q[1] - 14} width="20" height="11" fill="#0B1220" stroke={LT} strokeWidth="0.6" /><T x={q[0]} y={q[1] - 5.5} a="middle" size={7}>{m}</T></g>; })}</St>
      <St s={s} at={3}>{["SHOP DWG", "ERECTION"].map((t, i) => <g key={t}><rect x={16 + i * 74} y="178" width="66" height="26" fill="#F8FAFC" stroke={MU} /><T x={49 + i * 74} y="194" a="middle" c="#334155" size={7}>{t}</T></g>)}</St>
    </>
  );
}

/* MicroStation — infrastructure corridor linework → levels */
function MicroStation({ s }: { s: number }) {
  const c = (k: string) => (s >= 1 ? k : MU);
  const road = "M10 150C90 140 150 90 230 82S320 70 350 60";
  return (
    <>
      <path d={road} {...ln(c(LT), 1.4)} transform="translate(0 -16)" /><path d={road} {...ln(c(LT), 1.4)} transform="translate(0 16)" />
      <path d={road} {...ln(c(RD), 1)} strokeDasharray="10 3 2 3" className="transition-[stroke-width] duration-300 group-hover:[stroke-width:2.2]" />
      <path d="M10 186C100 176 170 124 250 114S330 104 350 98" {...ln(c(TL), 1.4)} strokeDasharray="6 4" />
      {[40, 110, 180, 250, 320].map((x, i) => <g key={x}><path d={`M${x} ${154 - i * 20}v-10`} {...ln(c(AM), 1)} /></g>)}
      <path d="M10 40H120M60 20V70" {...ln(DK, 0.6)} />
      <St s={s} at={1}>
        <rect x="14" y="18" width="98" height="64" {...ln(DK, 1)} fill="#0B1220" /><T x="20" y="30" c={MU} size={7}>LEVELS</T>
        {[["CORRIDOR", LT], ["ALIGNMENT", RD], ["UTILITY", TL], ["CHAINAGE", AM]].map(([n, k], i) => <g key={n}><rect x="20" y={36 + i * 11} width="6" height="6" fill={k} /><T x="31" y={42 + i * 11} size={7}>{n}</T></g>)}
        <T x="350" y="206" a="end" c={MU} size={7}>DGN · DWG</T>
      </St>
      <Hv s={s} at={1}><T x="232" y="74" c={RD} size={7}>CL</T></Hv>
    </>
  );
}

/* Civil 3D — points → TIN surface → alignment → grading → drainage */
const NX = 8, NY = 6;
const zf = (i: number, j: number) => 14 * Math.sin(i * 0.7) + 10 * Math.cos(j * 0.9) + 6;
function Civil3D({ s }: { s: number }) {
  const p = makeIso(180, 96, 0.85);
  const g = (i: number, j: number) => p(i * 24 - 84, j * 24 - 60, zf(i, j));
  const mesh: string[] = [];
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
    if (i < NX - 1) mesh.push(seg(g(i, j), g(i + 1, j)));
    if (j < NY - 1) mesh.push(seg(g(i, j), g(i, j + 1)));
    if (i < NX - 1 && j < NY - 1) mesh.push(seg(g(i, j), g(i + 1, j + 1)));
  }
  const alp = (i: number, dz = 0) => { const j = 2.2 + 0.9 * Math.sin(i * 0.55); return p(i * 24 - 84, j * 24 - 60, zf(i, j) + dz); };
  const al = Array.from({ length: NX }, (_, i) => alp(i));
  return (
    <>
      <St s={s} at={1}><path d={mesh.join("")} {...ln(DK, 0.7)} /></St>
      <St s={s} at={0}>{Array.from({ length: NX * NY }, (_, k) => { const q = g(k % NX, Math.floor(k / NX)); return <path key={k} d={`M${q[0] - 2.5} ${q[1]}h5M${q[0]} ${q[1] - 2.5}v5`} {...ln(k % 7 ? CY : AM, 1)} />; })}</St>
      <St s={s} at={2}><path d={seg(...al)} {...ln(LT, 4)} strokeOpacity="0.8" /><path d={seg(...al)} {...ln("#0B1220", 0.9)} strokeDasharray="6 4" /></St>
      <g className={HV} style={s >= 3 ? { opacity: 1 } : undefined}>
        {[0, 1, 2].map((k) => <path key={k} d={seg(...Array.from({ length: NX }, (_, i) => { const q = alp(i); return [q[0], q[1] + 9 + k * 7] as P; }))} {...ln(GN, 1)} strokeOpacity={1 - k * 0.25} />)}
      </g>
      <St s={s} at={4}>
        <path d={seg(...al.map((q) => [q[0], q[1] + 32] as P))} {...ln(CY, 1.8)} className="rch-flow" />
        {al.filter((_, i) => i % 2 === 1).map((q, i) => <rect key={i} x={q[0] - 4} y={q[1] + 28} width="8" height="8" {...ln(CY, 1.2)} fill="#0B1220" />)}
        <T x="350" y="206" a="end" c={CY} size={7}>STORMWATER NETWORK</T>
      </St>
    </>
  );
}

/* Navisworks — discipline models → federated → coordination check */
function Navisworks({ s }: { s: number }) {
  const p = makeIso(200, 110, 1.15);
  const fed = s >= 1;
  const off = (dx: number) => ({ transform: fed ? "none" : `translate(${dx}px, 0)`, transition: "transform .8s ease" });
  const clash = p(40, 30, 40);
  return (
    <>
      <g style={off(-110)}><Cube p={p} b={[0, 0, 0, 80, 60, 64]} c={CY} fill={fed ? "none" : "#1E3A5F"} /></g>
      <g style={off(0)}><g {...ln(AM, 2)}>{[[0, 0], [80, 0], [0, 60], [80, 60]].map(([x, y]) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 64))} />)}<path d={seg(p(0, 30, 40), p(80, 30, 40))} /></g></g>
      <g style={off(110)}><path d={seg(p(40, -6, 40), p(40, 66, 40))} {...ln(TL, 3)} /><path d={seg(p(-6, 50, 18), p(86, 50, 18))} {...ln(TL, 2)} /></g>
      <St s={s} at={0} to={0}><T x="90" y="206" a="middle" c={CY}>ARCH</T><T x="200" y="206" a="middle" c={AM}>STRUCT</T><T x="310" y="206" a="middle" c={TL}>SERVICES</T></St>
      <Hv s={s} at={2}>
        <circle cx={clash[0]} cy={clash[1]} r="10" {...ln(s >= 3 ? GN : RD, 1.8)} className={s === 2 ? "rch-pulse" : undefined} />
        <path d={`M${clash[0] + 8} ${clash[1] - 8}L${clash[0] + 40} ${clash[1] - 40}H${clash[0] + 120}`} {...ln(LT, 0.8)} />
        <T x={clash[0] + 44} y={clash[1] - 44} c={s >= 3 ? GN : RD} size={7}>{s >= 3 ? "VIEWPOINT · COORDINATION CHECK" : "ILLUSTRATIVE ISSUE"}</T>
      </Hv>
      <St s={s} at={1}><T x="16" y="28" c={MU} size={7}>FEDERATED REVIEW · ARCH + STRUCT + SERVICES</T></St>
    </>
  );
}

/* ArchiCAD — plan concept → 3D model (pitched) → elevation sheet */
function ArchiCAD({ s }: { s: number }) {
  const p = makeIso(150, 120, 1.2);
  const W = 90, D = 56, H = 40;
  const ridge = seg(p(0, D / 2, H + 26), p(W, D / 2, H + 26));
  return (
    <>
      <g className="transition-opacity duration-500 group-hover:opacity-0" style={{ opacity: s === 0 ? 1 : 0, transition: "opacity .5s" }}>
        <path d="M70 50H250V170H70Z" {...ln(LT, 2.2)} /><path d="M70 110H160V50M200 110H250M160 140V170" {...ln(LT, 1.2)} />
        <path d="M130 110a22 22 0 0 1 22-22M200 110a18 18 0 0 0 18 18" {...ln(MU, 0.9)} /><T x="160" y="190" a="middle" c={MU}>PLAN CONCEPT</T>
      </g>
      <g className={s === 0 ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100" : ""} style={{ opacity: s >= 1 ? 1 : undefined, transition: "opacity .5s" }}>
        <Cube p={p} b={[0, 0, 0, W, D, H]} c={LT} fill="#64748B" />
        <g {...ln(LT, 1.3)}><path d={loop(p(0, 0, H), p(W, 0, H), p(W, D / 2, H + 26), p(0, D / 2, H + 26))} fill="#B45309" fillOpacity="0.5" /><path d={loop(p(0, D / 2, H + 26), p(0, D, H), p(0, 0, H))} fill="#78350F" fillOpacity="0.6" /><path d={ridge} /></g>
        {[0.2, 0.55].map((u) => <path key={u} d={loop(p(W * u, D, 10), p(W * u + 16, D, 10), p(W * u + 16, D, 30), p(W * u, D, 30))} {...ln(CY, 1)} fill={CY} fillOpacity="0.25" />)}
      </g>
      <St s={s} at={2}>
        <rect x="240" y="26" width="108" height="168" fill="#F8FAFC" stroke={MU} />
        <g {...ln("#334155", 1)}><path d="M254 120H334V80L294 58L254 80ZM264 120V100H282V120M300 96H322V110H300Z" /><path d="M250 120H338" strokeWidth="1.6" /></g>
        <path d="M240 150H348" stroke={MU} /><T x="246" y="164" c="#334155" size={7}>SOUTH ELEVATION</T><T x="246" y="180" c="#334155" size={7}>A-201</T>
      </St>
    </>
  );
}

/* Fusion 360 — concept sketch → body → refinement → drawing, with feature timeline */
function Fusion({ s }: { s: number }) {
  const body = "M110 70Q110 50 130 50H230Q250 50 250 70V140Q250 160 230 160H130Q110 160 110 140Z";
  return (
    <>
      <St s={s} at={0} to={0}><path d="M110 120C120 60 180 40 240 70S260 150 200 160 100 170 110 120Z" {...ln(MU, 1.2)} strokeDasharray="3 3" /><T x="180" y="188" a="middle" c={MU}>CONCEPT SKETCH</T></St>
      <St s={s} at={1}>
        <path d={body} transform="translate(10 10)" {...ln(DK, 1)} fill="#1E293B" />
        <path d={body} {...ln(CY, 1.6)} fill={s >= 2 ? "#1D4ED8" : "#0F2A4D"} fillOpacity="0.6" style={{ transition: "fill .5s" }} />
        <St s={s} at={2}><path d="M110 104H250" {...ln(LT, 0.8)} strokeDasharray="4 3" /><circle cx="180" cy="80" r="10" {...ln(LT, 1.3)} /><rect x="146" y="124" width="68" height="14" rx="7" {...ln(TL, 1.3)} /></St>
      </St>
      <St s={s} at={3}>
        <rect x="268" y="40" width="80" height="120" fill="#F8FAFC" stroke={MU} />
        <g {...ln("#334155", 1)}><rect x="280" y="56" width="56" height="40" rx="6" /><rect x="280" y="106" width="56" height="12" rx="3" /></g><T x="274" y="146" c="#334155" size={7}>PART DRAWING</T>
      </St>
      <rect x="20" y="192" width="320" height="18" {...ln(DK, 1)} fill="#0B1220" />
      {["SKETCH", "EXTRUDE", "FILLET", "SPLIT", "DRAWING"].map((f, i) => { const n = [1, 2, 4, 5][s] ?? 5; const on = i < n; return <g key={f} className={on ? "" : HV} style={{ opacity: on ? 1 : undefined }}><rect x={28 + i * 63} y="196" width="10" height="10" fill={i === n - 1 ? AM : CY} /><T x={42 + i * 63} y="204" size={7}>{f}</T></g>; })}
    </>
  );
}

const MAP: Record<string, (p: { s: number }) => ReactNode> = {
  autocad: AutoCAD, revit: Revit, solidworks: SolidWorks, inventor: Inventor, tekla: Tekla, microstation: MicroStation, "civil-3d": Civil3D, navisworks: Navisworks, archicad: ArchiCAD, "fusion-360": Fusion,
};

export function PlatformVisual({ slug, stage, label, className }: { slug: string; stage?: number; label: string; className?: string }) {
  const Body = MAP[slug];
  const s = stage ?? PSTAGES[slug].length - 1;
  return (
    <svg viewBox="0 0 360 220" className={className ?? "block h-auto w-full"} role="img" aria-label={label}>
      <title>{label}</title>
      <rect width="360" height="220" fill="#101A2E" />
      <g stroke="#38BDF8" strokeOpacity="0.06">{Array.from({ length: 19 }, (_, i) => <path key={i} d={`M${i * 20} 0V220`} />)}{Array.from({ length: 12 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 20}H360`} />)}</g>
      <Body s={s} />
    </svg>
  );
}
