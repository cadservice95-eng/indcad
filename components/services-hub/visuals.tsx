import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";

/** Stage-driven technical illustrations, one per service family (480 × 300). Stages are cumulative unless limited with `to`. */
export type Cat = "mechanical" | "structural" | "architectural" | "civil" | "electrical" | "bim" | "cad-conversion" | "engineering-design";

export const STAGES: Record<Cat, string[]> = {
  mechanical: ["2D drawing", "3D model", "Assembly"],
  structural: ["3D frame", "Connection detail", "Shop drawing", "Erection drawing"],
  architectural: ["Sketch", "Floor plan", "3D model", "Rendered view"],
  civil: ["Survey points", "Surface", "Contours", "Road", "Drainage", "Documentation"],
  electrical: ["Circuit", "Panel", "Breaker", "Cable", "Schedule"],
  bim: ["Architecture + Structure + MEP", "Federated BIM", "Clash detection", "Coordinated model", "Point cloud", "Revit model"],
  "cad-conversion": ["PDF", "Vector geometry", "Layers", "Native CAD", "DWG"],
  "engineering-design": ["Problem", "Concept A", "Concept B", "Trade-off", "Detailed design", "DFM", "Documentation"],
};

const SKY = "#7DD3FC", INK = "#E2E8F0", AMB = "#F59E0B", TEAL = "#2DD4BF", RED = "#F87171", GRN = "#4ADE80", DIM = "#64748B";
const mono = { fontFamily: "var(--font-mono)" } as const;
const sw = (c: string, w = 1.4) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;

function St({ s, at, to, children, o = 1 }: { s: number; at: number; to?: number; children: ReactNode; o?: number }) {
  const on = s >= at && (to === undefined || s <= to);
  return <g style={{ opacity: on ? o : 0, transition: "opacity .6s ease" }}>{children}</g>;
}
const T = ({ x, y, c = INK, children, a = "start", size = 9 }: { x: number | string; y: number | string; c?: string; children: ReactNode; a?: "start" | "middle" | "end"; size?: number }) => (
  <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} style={mono}>{children}</text>
);

function box(p: (x: number, y: number, z: number) => P, x: number, y: number, z: number, w: number, d: number, h: number) {
  const a = p(x, y, z), b = p(x + w, y, z), c = p(x + w, y + d, z), e = p(x, y + d, z);
  const a2 = p(x, y, z + h), b2 = p(x + w, y, z + h), c2 = p(x + w, y + d, z + h), e2 = p(x, y + d, z + h);
  return { top: loop(a2, b2, c2, e2), front: loop(e, c, c2, e2), side: loop(b, c, c2, b2), a, b, c, e, a2, b2, c2, e2 };
}

/* ───────── mechanical ───────── */
function Mech({ s }: { s: number }) {
  const p = makeIso(330, 150, 1.5);
  const pl = box(p, 0, 0, 0, 100, 70, 14);
  const bolts = [[14, 14], [86, 14], [14, 56], [86, 56]] as const;
  return (
    <>
      <St s={s} at={0} to={0}>
        <g {...sw(SKY)}><rect x="70" y="70" width="190" height="130" /><circle cx="165" cy="135" r="34" /><circle cx="165" cy="135" r="14" />{[[88, 88], [242, 88], [88, 182], [242, 182]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" />)}</g>
        <g {...sw(INK, 1)} strokeDasharray="6 3 1 3"><path d="M60 135H270M165 60V210" /></g>
        <g {...sw(AMB, 1)}><path d="M70 226H260M70 220v12M260 220v12M280 70v130M274 70h12M274 200h12" /></g>
        <T x="165" y="242" a="middle" c={AMB}>190</T><T x="292" y="140" c={AMB}>130</T>
        <g {...sw(INK, 1)}><rect x="330" y="212" width="130" height="60" /><path d="M330 232h130M395 212v60" /></g><T x="337" y="226">PLATE</T><T x="337" y="250">SHT 1</T><T x="402" y="226">REV A</T>
      </St>
      <St s={s} at={1}>
        <g {...sw(SKY)}><path d={pl.top} fill="#0F2A4D" /><path d={pl.front} /><path d={pl.side} /></g>
        {bolts.map(([x, y]) => <ellipse key={`${x}${y}`} cx={p(x, y, 14)[0]} cy={p(x, y, 14)[1]} rx="8" ry="4.6" {...sw(SKY, 1)} />)}
        <ellipse cx={p(50, 35, 14)[0]} cy={p(50, 35, 14)[1]} rx="30" ry="17" {...sw(SKY)} />
      </St>
      <St s={s} at={2}>
        <g style={{ transform: s >= 2 ? "none" : "translateY(-40px)", transition: "transform .8s ease" }}>
          <g {...sw(AMB, 1.6)}><path d={`M${p(50, 35, 14)[0] - 22} ${p(50, 35, 14)[1]}V${p(50, 35, 14)[1] - 80}M${p(50, 35, 14)[0] + 22} ${p(50, 35, 14)[1]}V${p(50, 35, 14)[1] - 80}`} /><ellipse cx={p(50, 35, 14)[0]} cy={p(50, 35, 14)[1] - 80} rx="22" ry="12.5" fill="#3B2A07" /></g>
        </g>
        {bolts.map(([x, y]) => <g key={`b${x}${y}`} style={{ transform: s >= 2 ? "none" : "translateY(-26px)", transition: "transform .8s ease" }}><g {...sw(TEAL, 1.4)}><path d={`M${p(x, y, 14)[0]} ${p(x, y, 14)[1]}v-12`} /><ellipse cx={p(x, y, 14)[0]} cy={p(x, y, 14)[1] - 12} rx="6" ry="3.4" /></g></g>)}
      </St>
    </>
  );
}

/* ───────── structural ───────── */
function Struct({ s }: { s: number }) {
  const f = (dx: number, dy: number) => {
    const X = [90 + dx, 270 + dx], Yb = 230 + dy, Yt = 120 + dy;
    return { X, Yb, Yt };
  };
  const a = f(0, 0), b = f(80, -40);
  return (
    <>
      <St s={s} at={0} to={0}>
        <g {...sw(AMB, 2)}>
          <path d={`M${a.X[0]} ${a.Yb}V${a.Yt}H${a.X[1]}V${a.Yb}`} /><path d={`M${b.X[0]} ${b.Yb}V${b.Yt}H${b.X[1]}V${b.Yb}`} />
          <path d={`M${a.X[0]} ${a.Yt}L${b.X[0]} ${b.Yt}M${a.X[1]} ${a.Yt}L${b.X[1]} ${b.Yt}M${a.X[0]} ${a.Yb}L${b.X[0]} ${b.Yb}M${a.X[1]} ${a.Yb}L${b.X[1]} ${b.Yb}`} />
        </g>
        <g {...sw(SKY, 1)}><path d={`M${a.X[0]} ${a.Yb}L${a.X[1]} ${a.Yt}M${a.X[1]} ${a.Yb}L${a.X[0]} ${a.Yt}`} /><path d={`M${a.X[0]} 175H${a.X[1]}M${b.X[0]} 135H${b.X[1]}`} strokeDasharray="4 3" /></g>
        <circle cx={a.X[1]} cy={a.Yt} r="14" {...sw(TEAL, 1.2)} className="rch-pulse" />
      </St>
      <St s={s} at={1} to={1}>
        <g {...sw(INK, 1.8)}><path d="M150 60V250M200 60V250M150 150H60M200 150H400" /><rect x="125" y="40" width="100" height="14" /><rect x="120" y="244" width="110" height="10" /></g>
        <g {...sw(AMB, 2)}><path d="M200 100H400M200 200H400" /></g>
        {[[170, 90], [180, 210], [170, 128], [180, 172]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="4.5" {...sw(TEAL, 1.4)} />)}
        <T x="240" y="84" c={TEAL}>END PLATE · BOLT GROUP</T><T x="240" y="226" c={AMB}>BEAM · COLUMN CONNECTION</T>
      </St>
      <St s={s} at={2} to={2}>
        <g {...sw(INK, 1.4)}><path d="M60 120H420V160H60Z" /><path d="M60 140H420" strokeDasharray="6 3" /></g>
        {[90, 120, 360, 390].map((x) => <circle key={x} cx={x} cy={140} r="4" {...sw(TEAL, 1.2)} />)}
        <g {...sw(AMB, 1)}><path d="M60 184H420M60 178v12M420 178v12M90 100v-12H390" /></g>
        <T x="240" y="204" c={AMB} a="middle">OVERALL LENGTH · MARK B1</T><T x="240" y="82" c={SKY} a="middle">HOLE SET-OUT</T>
        <g {...sw(INK, 1)}><rect x="300" y="220" width="130" height="50" /><path d="M300 240h130" /></g><T x="308" y="233">SHOP DWG · B1</T>
      </St>
      <St s={s} at={3}>
        <g {...sw(DIM, 1)}>{[0, 1, 2].map((r) => <path key={r} d={`M70 ${70 + r * 70}H410`} />)}{[0, 1, 2, 3].map((c) => <path key={c} d={`M${70 + c * 113} 50V230`} />)}</g>
        {[0, 1, 2, 3].flatMap((c) => [0, 1, 2].map((r) => <g key={`${c}${r}`}><rect x={64 + c * 113} y={64 + r * 70} width="12" height="12" {...sw(AMB, 1.6)} fill="#3B2A07" /></g>))}
        <g {...sw(SKY, 2)}><path d="M82 70H183M196 70H296M309 70H409M82 140H183M196 140H296M309 140H409" /></g>
        <T x="70" y="248" c={AMB}>COLUMN MARKS</T><T x="410" y="248" c={SKY} a="end">BEAM MARKS · ERECTION PLAN</T>
      </St>
    </>
  );
}

/* ───────── architectural ───────── */
function Arch({ s }: { s: number }) {
  const p = makeIso(240, 150, 1.5);
  const m = box(p, 0, 0, 0, 100, 70, 60);
  return (
    <>
      <St s={s} at={0} to={0}>
        <g {...sw(INK, 1.2)} strokeDasharray="1 0"><path d="M90 220c60-2 150 3 300 0M92 220c-2-50 1-90 2-120M394 218c2-40 0-80 -2-118M92 100L240 44L392 100M92 100c60 2 200-3 300 0" /><path d="M150 220V170h40v50M270 150h60v40h-60Z" /></g>
        <T x="240" y="250" a="middle" c={DIM}>CONCEPT SKETCH</T>
      </St>
      <St s={s} at={1} to={1}>
        <g {...sw(SKY, 2.4)}><path d="M80 60H400V240H80Z" /><path d="M80 150H260M260 60V150M260 190V240M330 150H400" /></g>
        <g {...sw(INK, 1)}><path d="M160 150a30 30 0 0 1 30-30" /><path d="M260 190a24 24 0 0 0 24-24" /><path d="M320 60h50M320 240h50" strokeWidth="5" stroke={AMB} /></g>
        <g {...sw(AMB, 1)}><path d="M80 262H400M80 256v12M400 256v12" /></g><T x="240" y="278" a="middle" c={AMB}>FLOOR PLAN</T>
      </St>
      <St s={s} at={2}>
        <g {...sw(SKY, 1.6)}><path d={m.top} fill={s >= 3 ? "#6BA6D6" : "#0F2A4D"} style={{ transition: "fill .6s" }} /><path d={m.front} fill={s >= 3 ? "#3F6F9C" : "none"} style={{ transition: "fill .6s" }} /><path d={m.side} fill={s >= 3 ? "#254B73" : "none"} style={{ transition: "fill .6s" }} /></g>
        <g {...sw(INK, 1.2)}>{[0.25, 0.62].flatMap((u) => [0.25, 0.7].map((v) => { const a = p(100 * u, 70, 60 * v), b = p(100 * (u + 0.18), 70, 60 * v), c = p(100 * (u + 0.18), 70, 60 * (v + 0.2)), d = p(100 * u, 70, 60 * (v + 0.2)); return <path key={`${u}${v}`} d={loop(a, b, c, d)} fill={s >= 3 ? "#BAE6FD" : "none"} />; }))}</g>
        <g {...sw(SKY, 1)}><path d={seg(p(0, 0, 60), p(50, 35, 90), p(100, 0, 60))} /></g>
        <St s={s} at={3}><circle cx="400" cy="60" r="16" fill={AMB} opacity="0.85" /></St>
        <T x="240" y="292" a="middle" c={s >= 3 ? AMB : DIM}>{s >= 3 ? "RENDERED VIEW" : "3D MODEL"}</T>
      </St>
    </>
  );
}

/* ───────── civil ───────── */
const PT: [number, number][] = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) PT.push([50 + c * 64 + ((r * 7 + c * 3) % 5) * 5 - 10, 60 + r * 58 + ((c * 5 + r * 2) % 4) * 6]);
function Civil({ s }: { s: number }) {
  return (
    <>
      <St s={s} at={1} to={2} o={0.8}><g {...sw(DIM, 0.8)}>{PT.flatMap(([x, y], i) => { const c = i % 7, r = Math.floor(i / 7); const o: ReactNode[] = []; if (c < 6) o.push(<path key={`h${i}`} d={`M${x} ${y}L${PT[i + 1][0]} ${PT[i + 1][1]}`} />); if (r < 3) o.push(<path key={`v${i}`} d={`M${x} ${y}L${PT[i + 7][0]} ${PT[i + 7][1]}`} />); if (c < 6 && r < 3) o.push(<path key={`d${i}`} d={`M${x} ${y}L${PT[i + 8][0]} ${PT[i + 8][1]}`} />); return o; })}</g></St>
      <St s={s} at={0}>{PT.map(([x, y], i) => <g key={i} {...sw(i % 5 === 0 ? AMB : SKY, 1.2)}><path d={`M${x - 3} ${y}H${x + 3}M${x} ${y - 3}V${y + 3}`} /></g>)}</St>
      <St s={s} at={2}><g {...sw(GRN, 1.4)}>{[28, 54, 80, 106].map((r) => <ellipse key={r} cx="190" cy="140" rx={r * 1.6} ry={r} transform="rotate(-12 190 140)" />)}{[18, 42].map((r) => <ellipse key={`b${r}`} cx="350" cy="190" rx={r * 1.6} ry={r} transform="rotate(10 350 190)" />)}</g></St>
      <St s={s} at={3}><path d="M20 230C140 210 230 120 460 80" {...sw("#CBD5E1", 14)} strokeOpacity="0.9" /><path d="M20 230C140 210 230 120 460 80" {...sw("#0B1B33", 1.4)} strokeDasharray="10 7" /></St>
      <St s={s} at={4}><path d="M30 246C150 228 245 140 455 100" {...sw(SKY, 2)} className="rch-flow" />{[[110, 232], [235, 168], [360, 118]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" {...sw(SKY, 1.6)} fill="#0B1B33" />)}</St>
      <St s={s} at={5}><g {...sw(INK, 1)}><rect x="12" y="12" width="456" height="276" /><path d="M20 262H460M20 256v12M140 256v12M260 256v12M380 256v12M460 256v12" /></g><T x="20" y="252" c={AMB}>CH 0+000</T><T x="380" y="252" c={AMB}>CH 0+360</T><T x="22" y="30">CIVIL · SITE PLAN</T></St>
    </>
  );
}

/* ───────── electrical ───────── */
function Elec({ s }: { s: number }) {
  const loads = [110, 240, 370];
  return (
    <>
      <g {...sw(INK, 1.6)}><circle cx="240" cy="44" r="16" /><path d="M232 44q4-8 8 0t8 0" /><path d="M240 60V84" /><circle cx="240" cy="96" r="12" /><circle cx="240" cy="110" r="12" /><path d="M240 122V140" /></g>
      <St s={s} at={1}><rect x="60" y="128" width="360" height="136" {...sw(TEAL, 1.2)} strokeDasharray="6 4" /><T x="68" y="144" c={TEAL}>PANEL · LV SWITCHBOARD</T></St>
      <path d="M90 156H390" {...sw(AMB, 3)} />
      {loads.map((x, k) => (
        <g key={x}>
          <path d={`M${x} 156V176`} {...sw(INK, 1.6)} />
          <rect x={x - 9} y="176" width="18" height="22" {...sw(s >= 2 && k === 1 ? AMB : INK, s >= 2 && k === 1 ? 2.4 : 1.6)} style={{ transition: "stroke .5s" }} /><path d={`M${x - 9} 198L${x + 9} 176`} {...sw(s >= 2 && k === 1 ? AMB : INK, 1.4)} />
          <path d={`M${x} 198V236`} {...sw(s >= 0 && k === 1 ? SKY : INK, 1.6)} className={k === 1 ? "rch-flow" : undefined} />
          <circle cx={x} cy="250" r="14" {...sw(INK, 1.6)} /><T x={x} y="254" a="middle">M</T>
          <St s={s} at={3}><T x={x + 10} y="222" c={SKY}>C{k + 1}</T></St>
        </g>
      ))}
      <St s={s} at={2}><T x="252" y="170" c={AMB}>BREAKER</T></St>
      <St s={s} at={4}>
        <g {...sw(INK, 1)}><rect x="20" y="20" width="110" height="68" fill="#0B1B33" /><path d="M20 38H130M62 20V88" /></g>
        <T x="26" y="32" size={7}>CIRCUIT</T><T x="66" y="32" size={7}>LOAD</T>{["C1", "C2", "C3"].map((c, k) => <g key={c}><T x="26" y={52 + k * 16} size={8} c={SKY}>{c}</T><T x="66" y={52 + k * 16} size={8} c={DIM}>—</T></g>)}
      </St>
    </>
  );
}

/* ───────── BIM ───────── */
function Bim({ s }: { s: number }) {
  const p = makeIso(240, 130, 1.55);
  const lift = (n: number) => ({ transform: s >= 1 && s <= 3 ? "none" : s === 0 ? `translateY(${n}px)` : "none", transition: "transform .8s ease" });
  const arch = box(p, 0, 0, 0, 120, 70, 70);
  const cols = [[0, 0], [120, 0], [0, 70], [120, 70], [60, 0], [60, 70]] as const;
  const duct = s >= 3 ? seg(p(0, 35, 28), p(40, 35, 28), p(50, 35, 52), p(70, 35, 52), p(80, 35, 28), p(120, 35, 28)) : seg(p(0, 35, 40), p(120, 35, 40));
  return (
    <>
      <St s={s} at={0} to={3}>
        <g style={lift(-70)}><g {...sw(SKY, 1.4)}><path d={arch.top} fill="#0F2A4D" fillOpacity="0.6" /><path d={arch.front} /><path d={arch.side} /><path d={seg(p(0, 70, 35), p(120, 70, 35))} strokeOpacity="0.5" /></g></g>
        <g style={lift(0)}><g {...sw(AMB, 2.2)}>{cols.map(([x, y]) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 70))} />)}<path d={seg(p(0, 0, 70), p(120, 0, 70), p(120, 70, 70), p(0, 70, 70), p(0, 0, 70))} /></g></g>
        <g style={lift(70)}><g {...sw(s >= 3 ? GRN : TEAL, 3)}><path d={duct} style={{ transition: "d .6s" }} /></g><g {...sw(TEAL, 1.6)}><path d={seg(p(60, 0, 40), p(60, 70, 40))} /></g></g>
        <St s={s} at={2} to={2}>{[p(60, 35, 40), p(60, 35, 66)].map((c, k) => <circle key={k} cx={c[0]} cy={c[1]} r="12" {...sw(RED, 2)} className="rch-pulse" />)}</St>
        <St s={s} at={3}>{[p(60, 35, 40)].map((c, k) => <g key={k} {...sw(GRN, 2.2)}><circle cx={c[0]} cy={c[1] - 4} r="11" /><path d={`M${c[0] - 5} ${c[1] - 4}l4 4l7-8`} /></g>)}</St>
      </St>
      <St s={s} at={4} to={4}>
        <g fill={SKY} opacity="0.9">{Array.from({ length: 300 }, (_, i) => { const a = (i * 137.5) % 360, r = 40 + ((i * 53) % 90); const x = 240 + Math.cos((a * Math.PI) / 180) * r * 1.5, y = 150 + Math.sin((a * Math.PI) / 180) * r * 0.55 - (i % 9) * 3; return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.3" opacity={0.45 + ((i * 7) % 5) / 10} />; })}</g>
        <T x="240" y="262" a="middle" c={SKY}>POINT CLOUD</T>
      </St>
      <St s={s} at={5}>
        <g {...sw(TEAL, 1.6)}><path d={arch.top} fill="#0F2A4D" fillOpacity="0.6" /><path d={arch.front} /><path d={arch.side} /></g><g {...sw(INK, 1)}>{[0.3, 0.7].map((u) => <path key={u} d={loop(p(120 * u, 70, 20), p(120 * u + 14, 70, 20), p(120 * u + 14, 70, 50), p(120 * u, 70, 50))} />)}</g>
        <T x="240" y="262" a="middle" c={TEAL}>REVIT MODEL</T>
      </St>
    </>
  );
}

/* ───────── CAD conversion ───────── */
function Conv({ s }: { s: number }) {
  const lc = (lay: string, base: string) => (s >= 2 ? lay : base);
  const L = (d: string, lay: string, w = 1.6) => <path d={d} fill="none" stroke={lc(lay, "#94A3B8")} strokeWidth={w} style={{ transition: "stroke .6s" }} />;
  return (
    <>
      <rect x="40" y="26" width="270" height="250" fill={s >= 3 ? "#0F1B30" : "#F8FAFC"} style={{ transition: "fill .6s" }} stroke={s >= 3 ? DIM : "#CBD5E1"} />
      <g>
        {L("M70 70H280V240H70Z", AMB, 2.4)}{L("M70 150H190M190 70V150", SKY)}{L("M130 150a24 24 0 0 1 24-24", TEAL, 1.2)}{L("M190 190a20 20 0 0 0 20-20M190 190V240", TEAL, 1.2)}{L("M70 258H280M70 252v12M280 252v12", GRN, 1)}
        <g style={{ opacity: s >= 1 && s <= 2 ? 1 : 0, transition: "opacity .5s" }}>{[[70, 70], [280, 70], [280, 240], [70, 240], [70, 150], [190, 150], [190, 70], [190, 240]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 3} y={y - 3} width="6" height="6" fill="#0B1B33" stroke={RED} />)}</g>
        <g style={{ opacity: s >= 3 ? 1 : 0, transition: "opacity .5s" }}><path d="M46 270V240M46 270H76" stroke={GRN} strokeWidth="1.6" /><T x="50" y="282" c={GRN} size={8}>UCS</T>{[[70, 70], [280, 240]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="none" stroke={AMB} />)}</g>
      </g>
      <St s={s} at={2}>
        <g {...sw(INK, 1)}><rect x="334" y="30" width="128" height="104" fill="#0B1B33" /><path d="M334 48H462" /></g><T x="342" y="42" size={8}>LAYERS</T>
        {[["A-WALL", AMB], ["A-DOOR", TEAL], ["A-DIMS", GRN], ["A-ANNO", SKY]].map(([n, c], k) => <g key={n}><rect x="342" y={56 + k * 18} width="10" height="10" fill={c} /><T x="360" y={65 + k * 18} size={8}>{n}</T></g>)}
      </St>
      <St s={s} at={4}><g {...sw(AMB, 1.6)}><path d="M312 196h26" /><path d="M332 190l8 6l-8 6" /></g><g><rect x="350" y="170" width="100" height="60" {...sw(AMB, 1.6)} fill="#0B1B33" /><T x="400" y="206" a="middle" c={AMB} size={20}>DWG</T></g></St>
    </>
  );
}

/* ───────── engineering design ───────── */
function Eng({ s }: { s: number }) {
  const nodes: { l: string; g: ReactNode }[] = [
    { l: "PROBLEM", g: <g {...sw(INK, 1.2)}><circle cx="0" cy="0" r="12" /><path d="M-5-4q5-6 10 0t-5 7M0 10v1" /></g> },
    { l: "CONCEPT A", g: <g {...sw(SKY, 1.4)}><path d="M-14 10V-10H14V10Z" /><circle cx="0" cy="0" r="5" /></g> },
    { l: "CONCEPT B", g: <g {...sw(TEAL, 1.4)}><path d="M-14 10L-6-10H14L6 10Z" /><circle cx="0" cy="0" r="4" /></g> },
    { l: "TRADE-OFF", g: <g {...sw(AMB, 1.4)}><path d="M0-12V12M-14 6l10-4M14 2l-10 4M-14-6H-2M2-6H14" /></g> },
    { l: "DETAILED", g: <g {...sw(TEAL, 1.4)}><path d="M-14 10L-6-10H14L6 10Z" /><circle cx="0" cy="0" r="4" /><path d="M-14 16H6" stroke={AMB} /></g> },
    { l: "DFM", g: <g {...sw(GRN, 1.4)}><path d="M-12 0l8 8l16-16" /></g> },
    { l: "DOCS", g: <g {...sw(INK, 1.2)}><rect x="-12" y="-14" width="24" height="28" /><path d="M-7-6H7M-7 0H7M-7 6H3" /></g> },
  ];
  return (
    <>
      {nodes.map((n, k) => {
        const x = 46 + k * 64, on = s === k;
        return (
          <St key={n.l} s={s} at={k}>
            {k > 0 ? <path d={`M${x - 36} 150H${x - 22}M${x - 27} 145l5 5l-5 5`} {...sw(DIM, 1.2)} /> : null}
            <rect x={x - 28} y="110" width="56" height="80" fill={on ? "#12294A" : "#0B1B33"} stroke={on ? SKY : DIM} strokeWidth={on ? 1.8 : 1} />
            <g transform={`translate(${x} 146)`}>{n.g}</g><T x={x} y="182" a="middle" size={7} c={on ? "#fff" : INK}>{n.l}</T>
          </St>
        );
      })}
      <St s={s} at={3} to={3}><T x="240" y="230" a="middle" c={AMB}>DESIGN DECISION — NOT JUST DRAFTING</T></St>
      <St s={s} at={5} to={5}><T x="240" y="230" a="middle" c={GRN}>MADE TO BE MANUFACTURED</T></St>
    </>
  );
}

export function Hub({ className }: { className?: string }) {
  const p = makeIso(0, 8, 0.8);
  const b = box(p, -26, -20, 0, 52, 40, 30);
  return <g className={className} {...sw(SKY, 1.3)}><path d={b.top} /><path d={b.front} /><path d={b.side} /><path d={seg(p(-26, 0, 30), p(26, 0, 30))} stroke={AMB} /></g>;
}

export function ServiceVisual({ cat, stage, label }: { cat: Cat; stage: number; label: string }) {
  const Body = { mechanical: Mech, structural: Struct, architectural: Arch, civil: Civil, electrical: Elec, bim: Bim, "cad-conversion": Conv, "engineering-design": Eng }[cat];
  return (
    <svg viewBox="0 0 480 300" className="mx-auto block h-auto max-h-[440px] w-full" role="img" aria-label={label}>
      <title>{label}</title>
      <rect width="480" height="300" fill="#0B1B33" />
      <g opacity="0.08" stroke={SKY}>{Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${i * 24} 0V300`} />)}{Array.from({ length: 13 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 24}H480`} />)}</g>
      <Body s={stage} />
    </svg>
  );
}
