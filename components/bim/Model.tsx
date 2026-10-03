import { makeIso, boxFaces, loop, seg } from "@/components/svg/iso";

/* One illustrative three-storey building. All disciplines share this grid (3 × 2 bays, 120 units each).
   Everything on the page — layers, clashes, issues, scan, handover — is drawn from these numbers. All values illustrative. */

export const mono = { fontFamily: "var(--font-mono)" } as const;
export const X = 360, Y = 240, LV = [0, 70, 140, 210] as const;
const P = makeIso(280, 185, 0.78);

export const COL = { arch: "#E2E8F0", struct: "#7DD3FC", mech: "#60A5FA", elec: "#A78BFA", plumb: "#2DD4BF", clash: "#F97316", ok: "#22C55E", ink: "#0B1B33" };
export type LayerKey = "arch" | "struct" | "mech" | "elec" | "plumb";
export type Layers = Partial<Record<LayerKey, boolean>>;
export const ALL_LAYERS: Layers = { arch: true, struct: true, mech: true, elec: true, plumb: true };
export const LAYER_META: { k: LayerKey; label: string; disc: string; color: string }[] = [
  { k: "arch", label: "Architectural", disc: "ARCH", color: COL.arch },
  { k: "struct", label: "Structural", disc: "STRUCT", color: COL.struct },
  { k: "mech", label: "Mechanical", disc: "MECH", color: COL.mech },
  { k: "elec", label: "Electrical", disc: "ELEC", color: COL.elec },
  { k: "plumb", label: "Plumbing", disc: "PLUMB", color: COL.plumb },
];

export type Issue = { id: string; disc: string; issue: string; level: number; priority: "High" | "Review" | "Low"; owner: string; status: "Open" | "Assigned" | "In review" | "Resolved"; kind: "Hard clash" | "Clearance"; loc: [number, number, number]; a: string; b: string };
export const ISSUES: Issue[] = [
  { id: "BIM-001", disc: "Structural / MEP", issue: "Beam vs Duct", level: 2, priority: "High", owner: "MEP", status: "Open", kind: "Hard clash", loc: [180, 120, 130], a: "Structural beam", b: "HVAC duct" },
  { id: "BIM-002", disc: "Structural / Plumbing", issue: "Column vs Pipe", level: 1, priority: "High", owner: "MEP", status: "Assigned", kind: "Hard clash", loc: [240, 120, 30], a: "Structural column", b: "Pipe run" },
  { id: "BIM-003", disc: "Architectural / MEP", issue: "Wall vs Duct", level: 1, priority: "High", owner: "MEP", status: "In review", kind: "Hard clash", loc: [120, 60, 43], a: "Partition wall", b: "HVAC duct" },
  { id: "BIM-004", disc: "MEP", issue: "Equipment access vs Duct", level: 3, priority: "Review", owner: "Mechanical", status: "Open", kind: "Clearance", loc: [270, 170, 173], a: "Equipment access zone", b: "HVAC duct" },
  { id: "BIM-005", disc: "Structural / MEP", issue: "Beam vs Duct", level: 3, priority: "High", owner: "MEP", status: "Resolved", kind: "Hard clash", loc: [60, 120, 190], a: "Structural beam", b: "HVAC duct" },
];

type Fill = { stroke: string; fill: string; fo: number; sw?: number };
function bx(key: string, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, f: Fill) {
  const [l, r, t] = boxFaces(P, x0, y0, z0, x1, y1, z1);
  return (
    <g key={key} stroke={f.stroke} strokeWidth={f.sw ?? 0.7} fill={f.fill} fillOpacity={f.fo}>
      <path d={l} /><path d={r} fillOpacity={f.fo * 0.7} /><path d={t} fillOpacity={f.fo * 1.4} />
    </g>
  );
}

const colsPos = [0, 120, 240, 360].flatMap((x) => [0, 120, 240].map((y) => [x, y] as const));
const levels = [1, 2, 3] as const;

export function BimModel({
  layers = ALL_LAYERS, faint, clash = "off", focus = null, pin = null, level = null, mess = 0, className, title, labels = true, onIssue, steel, precast, shift = 0,
}: {
  steel?: boolean; precast?: boolean; shift?: number;
  layers?: Layers; faint?: boolean; clash?: "off" | "open" | "resolved"; focus?: string | null; pin?: [number, number, number] | null; level?: number | null; mess?: 0 | 1 | 2 | 3;
  className?: string; title: string; labels?: boolean; onIssue?: (id: string) => void;
}) {
  const g = (k: LayerKey) => ({ opacity: layers[k] ? 1 : faint ? 0.1 : 0, transition: "opacity 0.7s ease" }) as React.CSSProperties;
  const resolved = clash === "resolved";
  const S = { stroke: COL.struct, fill: COL.struct, fo: 0.1 };
  const M = { stroke: COL.mech, fill: COL.mech, fo: 0.28, sw: 0.9 };

  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="640" height="440" fill={COL.ink} />
      <path d={loop(P(-40, -40, 0), P(X + 40, -40, 0), P(X + 40, Y + 40, 0), P(-40, Y + 40, 0))} fill="#0F2442" stroke="#1D3A63" strokeWidth="0.8" />
      {level ? <path d={loop(P(-8, -8, LV[level - 1] - 2), P(X + 8, -8, LV[level - 1] - 2), P(X + 8, Y + 8, LV[level - 1] - 2), P(-8, Y + 8, LV[level - 1] - 2))} fill="#2563EB" fillOpacity="0.25" stroke="#60A5FA" strokeWidth="1.2" /> : null}

      {/* structure */}
      <g style={g("struct")}>
        {[0, 70, 140, 210].map((z) => <path key={z} d={loop(P(0, 0, z), P(X, 0, z), P(X, Y, z), P(0, Y, z))} fill={COL.struct} fillOpacity={z === 0 ? 0.04 : 0.06} stroke={COL.struct} strokeWidth="0.8" />)}
        {[70, 140, 210].map((z) => [0, 120, 240].map((y) => bx(`bx${z}${y}`, 0, y - 6, z - 14, X, y + 6, z - 6, S)))}
        {[70, 140, 210].map((z) => [0, 120, 240, 360].map((x) => bx(`by${z}${x}`, x - 6, 0, z - 14, x + 6, Y, z - 6, S)))}
        {colsPos.map(([x, y]) => bx(`c${x}${y}`, x - 6, y - 6, 0, x + 6, y + 6, 210, S))}
      </g>

      {/* architecture */}
      <g style={g("arch")}>
        <path d={loop(P(0, Y, 0), P(X, Y, 0), P(X, Y, 210), P(0, Y, 210))} fill="#fff" fillOpacity="0.05" stroke={COL.arch} strokeWidth="1.2" />
        <path d={loop(P(X, Y, 0), P(X, 0, 0), P(X, 0, 210), P(X, Y, 210))} fill="#fff" fillOpacity="0.04" stroke={COL.arch} strokeWidth="1.2" />
        {levels.map((l) => [[20, 100], [140, 220], [260, 340]].map(([a, b]) => (
          <path key={`w${l}${a}`} d={loop(P(a, Y, LV[l - 1] + 24), P(b, Y, LV[l - 1] + 24), P(b, Y, LV[l - 1] + 54), P(a, Y, LV[l - 1] + 54))} fill="#93C5FD" fillOpacity="0.18" stroke={COL.arch} strokeWidth="0.8" />
        )))}
        {levels.map((l) => [[40, 120], [160, 200]].map(([a, b]) => (
          <path key={`e${l}${a}`} d={loop(P(X, a, LV[l - 1] + 24), P(X, b, LV[l - 1] + 24), P(X, b, LV[l - 1] + 54), P(X, a, LV[l - 1] + 54))} fill="#93C5FD" fillOpacity="0.18" stroke={COL.arch} strokeWidth="0.8" />
        )))}
        <path d={loop(P(150, Y, 0), P(180, Y, 0), P(180, Y, 46), P(150, Y, 46))} stroke={COL.arch} strokeWidth="0.8" />
        {bx("part", 117 + shift * 24, 6, 0, 123 + shift * 24, Y - 6, 64, { stroke: COL.arch, fill: "#fff", fo: 0.08 })}
        {[0, 1, 2].map((i) => <path key={i} d={seg(P(0, Y, 70 * i + 64), P(X, Y, 70 * i + 64))} stroke={COL.arch} strokeOpacity="0.35" strokeWidth="0.6" />)}
      </g>

      {steel ? (
        <g stroke="#FBBF24" strokeWidth="1.3">
          {[[0, 120], [240, 360]].map(([a, b], i) => <path key={i} d={seg(P(a, Y, 0), P(b, Y, 140)) + seg(P(a, Y, 140), P(b, Y, 0))} />)}
          {[0, 120, 240, 360].flatMap((x) => [70, 140].map((z) => <rect key={`${x}${z}`} x={P(x, Y, z)[0] - 4} y={P(x, Y, z)[1] - 4} width="8" height="8" fill="#FBBF24" fillOpacity="0.35" />))}
        </g>
      ) : null}
      {precast ? <g stroke="#C4B5FD" strokeWidth="1" fill="#C4B5FD" fillOpacity="0.14">{[0, 80, 160].flatMap((y) => [0, 70, 140].map((z) => <path key={`${y}${z}`} d={loop(P(X, y + 2, z + 2), P(X, y + 78, z + 2), P(X, y + 78, z + 68), P(X, y + 2, z + 68))} />))}</g> : null}
      {shift > 0 ? <g fontSize="9" style={mono}><text x={P(150 + shift * 24, Y + 8, 70)[0]} y={P(150 + shift * 24, Y + 8, 70)[1]} fill="#FDBA74">FIELD CHANGE</text></g> : null}

      {/* plumbing */}
      <g style={g("plumb")} stroke={COL.plumb} strokeWidth="1.6">
        <path d={seg(P(300, 180, 0), P(300, 180, 214))} /><path d={seg(P(306, 180, 0), P(306, 180, 214))} strokeOpacity="0.5" />
        {levels.map((l) => <path key={l} d={seg(P(300, 180, LV[l - 1] + 24), P(300, 80, LV[l - 1] + 24), P(180, 80, LV[l - 1] + 24))} strokeWidth="1.4" />)}
        <path d={seg(P(140, 120, 30), P(350, 120, 30))} strokeWidth="2.6" />
      </g>

      {/* electrical */}
      <g style={g("elec")} stroke={COL.elec} strokeWidth="0.9">
        {levels.map((l) => {
          const z = LV[l - 1] + (l === 1 ? 28 : 26);
          return <g key={l}><path d={seg(P(12, 24, z), P(348, 24, z))} /><path d={seg(P(12, 36, z), P(348, 36, z))} />{Array.from({ length: 18 }, (_, i) => <path key={i} d={seg(P(20 + i * 19, 24, z), P(20 + i * 19, 36, z))} strokeOpacity="0.6" />)}</g>;
        })}
      </g>

      {/* mechanical */}
      <g style={g("mech")}>
        {bx("m1", 12, 48, 36, 348, 72, 50, M)}{bx("m2", 12, 48, 106, 348, 72, 120, M)}{bx("m3", 12, 48, 176, 348, 72, 190, M)}
        {bx("b2", 288, 48, 106, 312, 230, 120, M)}{bx("b3", 48, 48, 176, 72, 230, 190, M)}
        {resolved ? (
          <>
            {bx("c1", 168, 10, 124, 192, 96, 140, M)}{bx("c2", 168, 144, 124, 192, 230, 140, M)}
            <path d={seg(P(180, 90, 132), P(180, 100, 104), P(180, 140, 104), P(180, 150, 132))} stroke={COL.ok} strokeWidth="2" strokeDasharray="5 3" />
            {bx("cr", 168, 96, 98, 192, 144, 112, { stroke: COL.ok, fill: COL.ok, fo: 0.3, sw: 1 })}
          </>
        ) : bx("c0", 168, 10, 124, 192, 230, 140, M)}
        {bx("ahu", 290, 140, 140, 340, 200, 170, { stroke: COL.mech, fill: COL.mech, fo: 0.18 })}
        <path d={loop(P(250, 140, 140), P(290, 140, 140), P(290, 200, 140), P(250, 200, 140))} stroke={COL.mech} strokeDasharray="3 3" strokeWidth="0.8" />
        {bx("b4", 262, 48, 176, 278, 230, 190, M)}
      </g>

      {/* legacy-model noise */}
      {mess ? (
        <g stroke={COL.clash} strokeWidth="1" strokeDasharray="4 3">
          <g style={{ opacity: mess === 3 ? 0.25 : 1 }}>{bx("gc", 246, 130, 0, 258, 142, 140, { stroke: COL.clash, fill: COL.clash, fo: 0.08 })}{bx("gb", 60, 60, 150, 140, 72, 164, { stroke: COL.clash, fill: COL.clash, fo: 0.08 })}{bx("gd", 330, 100, 108, 346, 160, 118, { stroke: COL.clash, fill: COL.clash, fo: 0.08 })}</g>
          {[P(252, 136, 70), P(100, 66, 157), P(338, 130, 113), P(60, 200, 20), P(200, 30, 190)].map((q, i) => {
            const fixed = mess === 3 && i < 3;
            const c = fixed ? COL.ok : COL.clash;
            return (
              <g key={i} stroke={c} fill={COL.ink} strokeDasharray="0">
                <circle cx={q[0]} cy={q[1]} r="9" strokeWidth="1.4" />
                <text x={q[0]} y={q[1] + 3.5} textAnchor="middle" fontSize="10" stroke="none" fill={c} style={mono}>{fixed ? "✓" : mess === 2 ? String(i + 1) : "!"}</text>
              </g>
            );
          })}
        </g>
      ) : null}

      {/* clash markers */}
      {clash !== "off" ? ISSUES.map((it) => {
        const q = P(...it.loc);
        const res = resolved || it.status === "Resolved";
        const c = res ? COL.ok : COL.clash;
        const on = focus === it.id;
        return (
          <g key={it.id} {...(onIssue ? { role: "button", tabIndex: 0, "aria-label": `${it.id} ${it.issue}`, style: { cursor: "pointer", outline: "none" } as React.CSSProperties, onClick: () => onIssue(it.id), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onIssue(it.id); } } } : {})}>
            {!res ? <circle cx={q[0]} cy={q[1]} r={on ? 20 : 12} fill={c} fillOpacity="0.14" className="rch-pulse" style={{ transformOrigin: `${q[0]}px ${q[1]}px`, transformBox: "view-box" }} /> : null}
            <circle cx={q[0]} cy={q[1]} r={on ? 12 : 8} fill={COL.ink} fillOpacity="0.7" stroke={c} strokeWidth={on ? 2.6 : 1.6} />
            <path d={res ? `M${q[0] - 3.5} ${q[1]}l2.6 3 4.6 -6` : `M${q[0] - 3} ${q[1] - 3}l6 6M${q[0] + 3} ${q[1] - 3}l-6 6`} stroke={c} strokeWidth="1.6" />
            {on ? <g><rect x={q[0] + 16} y={q[1] - 11} width="62" height="18" fill={COL.ink} stroke={c} /><text x={q[0] + 47} y={q[1] + 2} textAnchor="middle" fontSize="9" fill={c} style={mono}>{it.id}</text></g> : null}
          </g>
        );
      }) : null}

      {pin ? (() => { const q = P(...pin); return <g><circle cx={q[0]} cy={q[1]} r="14" stroke="#60A5FA" strokeWidth="2" fill="#2563EB" fillOpacity="0.25" /><circle cx={q[0]} cy={q[1]} r="3" fill="#93C5FD" /></g>; })() : null}

      {labels ? (
        <g fill="#7DA2C9" fontSize="9" style={mono}>
          {levels.map((l) => { const q = P(0, Y, LV[l - 1]); return <text key={l} x={q[0] - 34} y={q[1] + 3}>L{l}</text>; })}
        </g>
      ) : null}
    </svg>
  );
}

/* ───────── equipment / Revit family ───────── */

export type EqHl = "type" | "size" | "ref" | "system" | "qty" | "level" | "param" | null;
export function Equipment({ lod = 3, hl = null, className, title }: { lod?: 0 | 1 | 2 | 3; hl?: EqHl; className?: string; title: string }) {
  const p = makeIso(300, 250, 1.5);
  const body = { stroke: "#7DD3FC", fill: "#60A5FA", fo: hl === "type" ? 0.4 : 0.2 };
  const bxx = (k: string, a: number, b: number, c: number, d: number, e: number, f: number, fl: Fill) => {
    const [l, r, t] = boxFaces(p, a, b, c, d, e, f);
    return <g key={k} stroke={fl.stroke} strokeWidth={fl.sw ?? 1} fill={fl.fill} fillOpacity={fl.fo}><path d={l} /><path d={r} fillOpacity={fl.fo * 0.7} /><path d={t} fillOpacity={fl.fo * 1.4} /></g>;
  };
  const q = (x: number, y: number, z: number) => p(x, y, z);
  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="640" height="400" fill={COL.ink} />
      <path d={loop(p(-20, -20, 0), p(150, -20, 0), p(150, 110, 0), p(-20, 110, 0))} fill="#0F2442" stroke="#1D3A63" />
      {lod === 0 ? bxx("m", 0, 0, 0, 130, 90, 60, { stroke: "#7DD3FC", fill: "#60A5FA", fo: 0.08, sw: 1.2 }) : null}
      {lod >= 1 ? <>
        {bxx("b", 0, 0, 10, 130, 90, 60, body)}
        {bxx("in", -26, 30, 24, 0, 52, 44, { stroke: hl === "system" ? "#2DD4BF" : "#60A5FA", fill: "#60A5FA", fo: 0.25 })}
        {bxx("out", 130, 30, 24, 156, 52, 44, { stroke: hl === "system" ? "#2DD4BF" : "#60A5FA", fill: "#60A5FA", fo: 0.25 })}
      </> : null}
      {lod >= 2 ? <>
        {[[8, 8], [112, 8], [8, 72], [112, 72]].map(([a, b], i) => bxx(`l${i}`, a, b, 0, a + 10, b + 10, 10, { stroke: "#94A3B8", fill: "#94A3B8", fo: 0.3 }))}
        <path d={loop(q(0, 90, 10), q(130, 90, 10), q(130, 90, 60), q(0, 90, 60))} stroke="#7DD3FC" strokeWidth="0.8" />
        <path d={loop(q(20, 90, 20), q(60, 90, 20), q(60, 90, 50), q(20, 90, 50))} fill="#7DD3FC" fillOpacity="0.15" stroke="#7DD3FC" />
        <path d={loop(q(0, 90, 0), q(130, 90, 0), q(130, 150, 0), q(0, 150, 0))} stroke="#7DD3FC" strokeDasharray="4 3" strokeWidth="0.9" fillOpacity="0" />
        <text x={q(65, 125, 0)[0]} y={q(65, 125, 0)[1]} textAnchor="middle" fontSize="9" fill="#7DD3FC" style={mono}>ACCESS ZONE</text>
      </> : null}
      {lod >= 2 ? (
        <g stroke={hl === "size" ? "#93C5FD" : "#7DA2C9"} fill={hl === "size" ? "#93C5FD" : "#7DA2C9"} strokeWidth={hl === "size" ? 2 : 1}>
          <path d={seg(q(0, 100, -12), q(130, 100, -12))} fill="none" /><text x={q(65, 100, -12)[0]} y={q(65, 100, -12)[1] + 14} textAnchor="middle" fontSize="10" stroke="none" style={mono}>1300</text>
          <path d={seg(q(-34, 0, 10), q(-34, 0, 60))} fill="none" /><text x={q(-34, 0, 35)[0] - 8} y={q(-34, 0, 35)[1]} textAnchor="end" fontSize="10" stroke="none" style={mono}>600</text>
        </g>
      ) : null}
      {lod >= 2 ? (
        <g><path d={seg(q(65, 0, 60), q(65, -30, 120))} stroke={hl === "ref" ? "#93C5FD" : "#7DA2C9"} /><rect x={q(65, -30, 120)[0] - 28} y={q(65, -30, 120)[1] - 22} width="56" height="22" fill={COL.ink} stroke={hl === "ref" ? "#93C5FD" : "#7DA2C9"} strokeWidth={hl === "ref" ? 2 : 1} /><text x={q(65, -30, 120)[0]} y={q(65, -30, 120)[1] - 7} textAnchor="middle" fontSize="10" fill="#E2E8F0" style={mono}>AHU-01</text></g>
      ) : null}
      {lod >= 3 ? (
        <g fontSize="9" fill="#BFD6EE" style={mono}>
          <rect x="400" y="60" width="200" height="94" fill="#0F2442" stroke="#2F5C94" />
          <text x="412" y="80" fill="#7DD3FC">HANDOVER DATA · EXAMPLE</text>
          <text x="412" y="100">Asset ref · AHU-01</text><text x="412" y="116">Warranty ref · per brief</text><text x="412" y="132">Maintenance access · see zone</text>
          <path d="M400 110L330 170" stroke="#2F5C94" />
        </g>
      ) : null}
    </svg>
  );
}

/* ───────── hard clash vs clearance (mini) ───────── */

export function ClashPair({ kind, className, title }: { kind: "hard" | "soft"; className?: string; title: string }) {
  const p = makeIso(220, 160, 1.3);
  const c = kind === "hard" ? COL.clash : "#FBBF24";
  const b = (k: string, a: number[], f: Fill) => { const [l, r, t] = boxFaces(p, a[0], a[1], a[2], a[3], a[4], a[5]); return <g key={k} stroke={f.stroke} strokeWidth="1.1" fill={f.fill} fillOpacity={f.fo}><path d={l} /><path d={r} fillOpacity={f.fo * 0.7} /><path d={t} fillOpacity={f.fo * 1.4} /></g>; };
  return (
    <svg viewBox="0 0 440 260" className={className} role="img" aria-label={title} fill="none" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="440" height="260" fill={COL.ink} />
      {kind === "hard" ? <>
        {b("beam", [-30, 0, 40, 130, 14, 58], { stroke: COL.struct, fill: COL.struct, fo: 0.22 })}
        {b("duct", [40, -50, 36, 64, 70, 66], { stroke: COL.mech, fill: COL.mech, fo: 0.3 })}
        {(() => { const q = p(52, 7, 50); return <g><circle cx={q[0]} cy={q[1]} r="18" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="2" className="rch-pulse" style={{ transformOrigin: `${q[0]}px ${q[1]}px`, transformBox: "view-box" }} /><path d={`M${q[0] - 5} ${q[1] - 5}l10 10M${q[0] + 5} ${q[1] - 5}l-10 10`} stroke={c} strokeWidth="2" /></g>; })()}
      </> : <>
        {b("eq", [-20, 0, 0, 50, 70, 40], { stroke: COL.mech, fill: COL.mech, fo: 0.2 })}
        <path d={loop(p(50, 0, 0), p(100, 0, 0), p(100, 70, 0), p(50, 70, 0))} stroke="#FBBF24" strokeDasharray="4 3" />
        <path d={loop(p(50, 0, 38), p(100, 0, 38), p(100, 70, 38), p(50, 70, 38))} stroke="#FBBF24" strokeDasharray="4 3" />
        {b("duct", [60, -20, 46, 90, 90, 64], { stroke: COL.mech, fill: COL.mech, fo: 0.3 })}
      </>}
      <text x="16" y="28" fontSize="11" fill={c} style={mono}>{kind === "hard" ? "HARD CLASH · PRIORITY HIGH" : "CLEARANCE ISSUE · PRIORITY REVIEW"}</text>
      <text x="16" y="246" fontSize="10" fill="#8FB0D4" style={mono}>{kind === "hard" ? "Structural beam intersects duct" : "Access zone approaches another element"}</text>
    </svg>
  );
}

/* ───────── point cloud ───────── */

function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function cloud(jit: number, outliers: number) {
  const r = rng(7);
  const pts: [number, number][] = [];
  const add = (x: number, y: number, z: number) => { const q = P(x, y, z); pts.push([q[0] + (r() - 0.5) * jit, q[1] + (r() - 0.5) * jit]); };
  for (let x = 0; x <= X; x += 12) for (let z = 0; z <= 210; z += 12) add(x, Y, z);
  for (let y = 0; y <= Y; y += 12) for (let z = 0; z <= 210; z += 12) add(X, y, z);
  for (let x = 0; x <= X; x += 12) for (let y = 0; y <= Y; y += 12) add(x, y, 210);
  for (const [cx, cy] of colsPos) for (let z = 0; z <= 210; z += 6) add(cx, cy, z);
  for (let i = 0; i < outliers; i++) pts.push([60 + r() * 520, 20 + r() * 400]);
  return pts.map(([a, b]) => `M${a.toFixed(1)} ${b.toFixed(1)}h0.1`).join("");
}
const CLOUD_RAW = cloud(5, 90);
const CLOUD_CLEAN = cloud(1, 0);

export function PointCloud({ stage, className, title }: { stage: 0 | 1 | 2 | 3 | 4; className?: string; title: string }) {
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="640" height="440" fill={COL.ink} />
      <path d={CLOUD_RAW} stroke="#7DD3FC" strokeWidth="2.2" opacity={stage === 0 ? 0.85 : 0} style={{ transition: "opacity 0.8s" }} />
      <path d={CLOUD_CLEAN} stroke="#7DD3FC" strokeWidth="2.2" opacity={stage >= 1 ? (stage >= 3 ? 0.25 : 0.9) : 0} style={{ transition: "opacity 0.8s" }} />
      <g opacity={stage >= 2 ? 1 : 0} style={{ transition: "opacity 0.8s" }}>
        <path d={loop(P(0, Y, 0), P(X, Y, 0), P(X, Y, 210), P(0, Y, 210))} stroke="#E2E8F0" strokeWidth="1.2" fill="#fff" fillOpacity={stage >= 3 ? 0.08 : 0} />
        <path d={loop(P(X, Y, 0), P(X, 0, 0), P(X, 0, 210), P(X, Y, 210))} stroke="#E2E8F0" strokeWidth="1.2" fill="#fff" fillOpacity={stage >= 3 ? 0.06 : 0} />
        <path d={loop(P(0, 0, 210), P(X, 0, 210), P(X, Y, 210), P(0, Y, 210))} stroke="#E2E8F0" strokeWidth="1.2" />
        {colsPos.map(([x, y]) => <path key={`${x}${y}`} d={seg(P(x, y, 0), P(x, y, 210))} stroke="#7DD3FC" strokeWidth="1.4" />)}
        {[70, 140].map((z) => <path key={z} d={loop(P(0, 0, z), P(X, 0, z), P(X, Y, z), P(0, Y, z))} stroke="#7DD3FC" strokeWidth="0.8" />)}
      </g>
      {stage >= 4 ? <g fontSize="9" fill="#7DD3FC" style={mono}><text x="24" y="36">PLAN · SECTION · ELEVATION · SCHEDULE</text></g> : null}
    </svg>
  );
}

/* ───────── custom icons ───────── */

export function BimIcon({ k, className }: { k: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {k === 0 ? <><path d="M10 50V24l22 -10 22 10v26z" /><path d="M10 24l22 10 22 -10M32 34v16" /></> : null}
      {k === 1 ? <><rect x="12" y="12" width="40" height="40" /><path d="M12 32h40M32 12v40" /><circle cx="32" cy="32" r="5" /></> : null}
      {k === 2 ? <><path d="M10 26h44v10H10zM10 44h30v8H10z" /><path d="M46 44h8v8" /></> : null}
      {k === 3 ? <><rect x="8" y="18" width="30" height="28" /><rect x="26" y="26" width="30" height="28" strokeDasharray="4 3" /></> : null}
      {k === 4 ? <><path d="M14 12h30l8 8v32H14z" /><path d="M24 30h20M24 38h20M24 46h12" /><circle cx="22" cy="22" r="3" /></> : null}
      {k === 5 ? <><rect x="14" y="26" width="30" height="22" /><path d="M44 34h8M44 40h8M20 26v-8h18v8" /><circle cx="29" cy="37" r="5" /></> : null}
      {k === 6 ? <><path d="M12 16h2M20 22h2M30 14h2M40 24h2M16 32h2M26 28h2M36 36h2M46 32h2M20 44h2M32 48h2M44 46h2M52 18h2" strokeWidth="3" /><path d="M10 52l22 -10 22 10" /></> : null}
      {k === 7 ? <><circle cx="24" cy="24" r="10" /><circle cx="40" cy="36" r="10" /></> : null}
      {k === 8 ? <><rect x="10" y="10" width="44" height="44" /><path d="M10 38h44M30 38v16M18 18h16v12H18z" /></> : null}
      {k === 9 ? <><path d="M14 14h36v36H14z" /><path d="M22 28l6 6 14 -14M22 44h20" /></> : null}
    </svg>
  );
}
