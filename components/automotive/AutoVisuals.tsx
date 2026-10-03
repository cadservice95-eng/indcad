import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";
import { G, T, Fade, Grid, Box, circ, ln } from "./AutoModel";

/* ───────── tolerance stack-up (symbolic) ───────── */
export const TOL_MODES = ["Nominal", "Variation", "Stack-up", "Documentation"] as const;
export function ToleranceStack({ m }: { m: number }) {
  const parts = [{ l: "A", w: 120, c: G.geo }, { l: "B", w: 90, c: "#C4B5FD" }, { l: "C", w: 110, c: G.fast }];
  const x0 = 60, y = 120, h = 70;
  const xs = parts.map((_, i) => x0 + parts.slice(0, i).reduce((a, b) => a + b.w, 0));
  const jit = ["au-jit-a", "au-jit-b", "au-jit-c"];
  return (
    <svg viewBox="0 0 560 320" className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={`Illustrative tolerance stack-up: ${TOL_MODES[m]}`}>
      <title>{`Illustrative tolerance stack-up — ${TOL_MODES[m]}`}</title>
      <rect width="560" height="320" fill={G.bg} /><Grid w={560} h={320} />
      <path d={`M${x0 - 14} ${y - 26}V${y + h + 14}H${x0 + 360}V${y - 26}`} {...ln(G.mute, 2.4)} />
      <T x={x0 - 14} y={y - 34} c={G.mute} size={9}>HOUSING / ENVELOPE</T>
      {parts.map((pt, i) => {
        const px = xs[i];
        return (
          <g key={pt.l} className={m === 1 ? jit[i] : undefined}>
            <rect x={px} y={y} width={pt.w - 4} height={h} fillOpacity="0.18" {...ln(pt.c, 1.6)} fill={pt.c} />
            <T x={px + (pt.w - 4) / 2} y={y + h / 2 + 4} a="middle" c={pt.c} size={13} w={600}>PART {pt.l}</T>
            <Fade on={m >= 1}><rect x={px + pt.w - 10} y={y - 6} width="12" height={h + 12} fill={G.tol} fillOpacity="0.22" stroke={G.tol} strokeDasharray="3 2" strokeWidth="0.8" /></Fade>
            <Fade on={m >= 3}><g {...ln(G.ok, 0.8)}><path d={`M${px} ${y + h + 26}h${pt.w - 4}M${px} ${y + h + 20}v12M${px + pt.w - 4} ${y + h + 20}v12`} /></g><T x={px + (pt.w - 4) / 2} y={y + h + 44} a="middle" c={G.ok} size={10}>{`nom ${pt.l} ± ${["a", "b", "c"][i]}`}</T></Fade>
          </g>
        );
      })}
      <Fade on={m >= 2}>
        <rect x={x0 + 306} y={y - 18} width={40} height={h + 36} fill={G.tol} fillOpacity="0.15" stroke={G.tol} />
        <path d={`M${x0} ${y - 40}H${x0 + 346}`} {...ln(G.tol, 1)} strokeDasharray="5 3" />
        <T x={x0 + 326} y={y - 46} a="middle" c={G.tol} size={9}>Σ VARIATION</T>
        <T x={x0 + 326} y={y + h + 64} a="middle" c={G.tol} size={9}>ASSEMBLY CONDITION</T>
        <T x={x0 + 326} y={y + h + 78} a="middle" c={G.mute} size={8}>fit · gap · interference?</T>
      </Fade>
      <Fade on={m >= 3}><T x="500" y="300" a="end" c={G.mute} size={9}>Σ = a + b + c (worst case, symbolic)</T></Fade>
      <T x="20" y="300" c={G.mute} size={9}>ILLUSTRATIVE TOLERANCE RELATIONSHIP · NOT A CALCULATION</T>
    </svg>
  );
}

/* ───────── reverse engineering: observed → interpreted → nominal ───────── */
const NOM: P[] = [[60, 60], [300, 60], [300, 120], [210, 120], [210, 230], [60, 230]];
function densify(pts: P[], n = 10): P[] {
  const out: P[] = [];
  pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length]; for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]); });
  return out;
}
const NOMD = densify(NOM);
const WORN = NOMD.map(([x, y], i) => {
  const n = Math.sin(i * 1.7) * 2.2 + Math.cos(i * 0.9) * 1.6;
  const wear = x > 270 && y < 80 ? -9 : 0; // chipped corner
  const edge = y > 225 ? -4 * Math.abs(Math.sin(i)) : 0; // worn lower edge
  return [x + n + wear * 0.6, y + n * 0.6 - wear * 0.4 + edge] as P;
});
export function ReverseVisual({ t }: { t: number }) {
  const u = Math.min(1, Math.max(0, t / 2));
  const pts = WORN.map((w, i) => [w[0] + (NOMD[i][0] - w[0]) * u, w[1] + (NOMD[i][1] - w[1]) * u] as P);
  const hole = { rx: 16 + 6 * (1 - u), ry: 16, cx: 120 + 4 * (1 - u) };
  const phase = t < 0.66 ? "OBSERVED CONDITION" : t < 1.34 ? "ENGINEERING INTERPRETATION" : "NOMINAL DESIGN INTENT";
  return (
    <svg viewBox="0 0 520 300" className="mx-auto block h-auto w-full max-w-[820px]" role="img" aria-label={`Reverse engineering illustration: ${phase}`}>
      <title>{`Reverse engineering — ${phase}`}</title>
      <rect width="520" height="300" fill={G.bg} /><Grid w={520} h={300} />
      <g transform="translate(40 0)">
        <path d={seg(...pts) + "Z"} fillOpacity={0.16 + u * 0.1} {...ln(u > 0.9 ? G.geo : "#94A3B8", 1.6)} fill={u > 0.9 ? G.geo : "#475569"} />
        <ellipse cx={hole.cx} cy={150} rx={hole.rx} ry={hole.ry} {...ln(u > 0.9 ? G.geo : "#94A3B8", 1.4)} fill={G.bg} />
        <Fade on={t < 1.2}>{WORN.filter((_, i) => i % 2 === 0).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill={G.fast} />)}</Fade>
        <Fade on={t >= 0.5 && t < 1.6}>
          <path d={seg(...NOMD) + "Z"} {...ln(G.datum, 1)} strokeDasharray="5 4" />
          <circle cx="292" cy="68" r="16" {...ln(G.tol, 1.2)} /><T x="316" y="54" c={G.tol} size={9}>WEAR — NOT DESIGN INTENT</T>
          <T x="230" y="252" c={G.tol} size={9}>EDGE WEAR</T><T x="146" y="190" c={G.tol} size={9}>ELONGATED HOLE</T>
        </Fade>
        <Fade on={t >= 1.6}>
          <g {...ln(G.ok, 0.8)}><path d="M60 40H300M60 34v12M300 34v12M320 60H336M320 230H336M330 60V230" /></g>
          <T x="180" y="32" a="middle" c={G.ok} size={9}>NOMINAL</T><T x="340" y="150" c={G.ok} size={9}>NOMINAL</T>
          <path d="M100 150H140M120 130V170" {...ln(G.tol, 0.7)} strokeDasharray="6 2 2 2" />
        </Fade>
      </g>
      <T x="20" y="24" c={G.hi} size={10}>{phase}</T>
      <T x="500" y="288" a="end" c={G.mute} size={8}>ILLUSTRATIVE · SAMPLE IS EVIDENCE, NOT THE SPEC</T>
    </svg>
  );
}

/* ───────── tooling fixture ───────── */
export const FIX_FOCUS = ["Base", "Locators", "Clamps", "Component", "Drawing"] as const;
export function Fixture({ f }: { f: number }) {
  const p = makeIso(250, 150, 1.25);
  const d = (k: number) => (f === 4 ? 0 : f === k ? 1 : 0.25);
  const iso = f !== 4;
  return (
    <svg viewBox="0 0 520 330" className="block h-auto w-full" role="img" aria-label={`Illustrative tooling fixture: ${FIX_FOCUS[f]}`}>
      <title>{`Illustrative tooling fixture — ${FIX_FOCUS[f]}`}</title>
      <rect width="520" height="330" fill={G.bg} /><Grid w={520} h={330} />
      <g style={{ opacity: iso ? 1 : 0, transition: "opacity .5s" }}>
        <g style={{ opacity: d(0) || 0.25, transition: "opacity .3s" }}><Box p={p} b={[0, 0, 0, 160, 100, 12]} c={G.mute} solid hot={f === 0} /></g>
        <g style={{ opacity: d(1) || 0.25, transition: "opacity .3s" }}>
          {[[20, 20], [140, 20], [80, 82]].map(([x, y]) => <Box key={`${x}${y}`} p={p} b={[x - 5, y - 5, 12, 10, 10, 6]} c={G.datum} solid hot={f === 1} />)}
          {[40, 120].map((x) => <g key={x} {...ln(f === 1 ? "#fff" : G.datum, 1.4)}><path d={seg(p(x - 3, 50, 12), p(x - 3, 50, 34))} /><path d={seg(p(x + 3, 50, 12), p(x + 3, 50, 34))} /><path d={circ(p, "xy", x, 50, 34, 3)} fill={G.datum} fillOpacity="0.5" /></g>)}
        </g>
        <g style={{ opacity: d(3) || 0.25, transition: "opacity .3s" }}>
          <Box p={p} b={[22, 18, 18, 116, 64, 6]} c={G.geo} solid hot={f === 3} />
          {[40, 120].map((x) => <path key={x} d={circ(p, "xy", x, 50, 24, 4.5)} {...ln(G.geo, 1)} fill={G.bg} />)}
        </g>
        <g style={{ opacity: d(2) || 0.25, transition: "opacity .3s" }}>
          {[6, 146].map((x, i) => <g key={x}><Box p={p} b={[x, 44, 12, 8, 12, 32]} c={G.fast} solid hot={f === 2} /><Box p={p} b={[i ? 126 : 14, 46, 38, 20, 8, 6]} c={G.fast} solid hot={f === 2} /></g>)}
        </g>
        <Fade on={f === 1}><T x="40" y="40" c={G.datum} size={10}>3-2-1 LOCATING · REST PADS + PINS</T></Fade>
        <Fade on={f === 2}><T x="40" y="40" c={G.fast} size={10}>CLAMPS HOLD AGAINST LOCATORS</T></Fade>
        <Fade on={f === 3}><T x="40" y="40" c={G.geo} size={10}>WORKPIECE · REPEATABLE POSITION</T></Fade>
        <Fade on={f === 0}><T x="40" y="40" c={G.hi} size={10}>FIXTURE BASE · REFERENCE PLANE</T></Fade>
      </g>
      <g style={{ opacity: iso ? 0 : 1, transition: "opacity .5s" }}>
        <rect x="30" y="30" width="460" height="270" {...ln(G.mute, 1)} />
        <rect x="90" y="80" width="320" height="200" {...ln(G.hi, 1.4)} /><rect x="134" y="116" width="232" height="128" {...ln(G.geo, 1.4)} />
        {[[130, 120], [370, 120], [250, 244]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 8} y={y - 8} width="16" height="16" {...ln(G.datum, 1.2)} />)}
        {[170, 330].map((x) => <g key={x}><circle cx={x} cy="180" r="6" {...ln(G.datum, 1.4)} /><path d={`M${x - 14} 180h28M${x} 166v28`} {...ln(G.tol, 0.6)} strokeDasharray="5 2 1 2" /></g>)}
        {[98, 386].map((x) => <rect key={x} x={x} y="170" width="16" height="20" {...ln(G.fast, 1.2)} />)}
        <g {...ln(G.ok, 0.8)}><path d="M170 62H330M170 56v12M330 56v12" /></g><T x="250" y="56" a="middle" c={G.ok} size={9}>PIN PITCH</T>
        <T x="40" y="292" c={G.mute} size={9}>FIXTURE GA · PLAN</T><T x="480" y="292" a="end" c={G.mute} size={9}>ILLUSTRATIVE TOOLING CONCEPT</T>
        <T x="176" y="204" c={G.datum} size={9}>B</T><T x="336" y="204" c={G.datum} size={9}>C</T><T x="136" y="108" c={G.datum} size={9}>A</T>
      </g>
    </svg>
  );
}

/* ───────── EV enclosure ───────── */
export const EV_PARTS = ["Mounting", "Sheet metal", "Structural support", "Component documentation"] as const;
export function EVEnclosure({ k }: { k: number }) {
  const p = makeIso(250, 150, 1.05);
  const on = (i: number) => k === i;
  const W = 200, D = 120, H = 30;
  return (
    <svg viewBox="0 0 520 320" className="mx-auto block h-auto w-full max-w-[820px]" role="img" aria-label={`Generic EV enclosure illustration: ${EV_PARTS[k]}`}>
      <title>{`Generic battery enclosure — ${EV_PARTS[k]}`}</title>
      <rect width="520" height="320" fill={G.bg} /><Grid w={520} h={320} />
      <g style={{ opacity: k === 3 ? 0.25 : 1, transition: "opacity .4s" }}>
        <g {...ln(on(1) ? "#fff" : G.geo, on(1) ? 2 : 1.3)}>
          <path d={loop(p(0, 0, 0), p(W, 0, 0), p(W, D, 0), p(0, D, 0))} fill={G.geo} fillOpacity="0.08" />
          <path d={loop(p(0, D, 0), p(W, D, 0), p(W, D, H), p(0, D, H))} fill={G.geo} fillOpacity={on(1) ? 0.3 : 0.15} />
          <path d={loop(p(W, 0, 0), p(W, D, 0), p(W, D, H), p(W, 0, H))} fill={G.geo} fillOpacity={on(1) ? 0.22 : 0.1} />
          <path d={seg(p(0, 0, H), p(W, 0, H), p(W, D, H), p(0, D, H), p(0, 0, H))} />
        </g>
        <g {...ln(on(2) ? "#fff" : G.datum, on(2) ? 2.4 : 1.4)}>{[50, 100, 150].map((x) => <path key={x} d={seg(p(x, 0, 2), p(x, D, 2), p(x, D, 20))} />)}<path d={seg(p(0, D / 2, 2), p(W, D / 2, 2))} /></g>
        <g {...ln(on(0) ? "#fff" : G.fast, on(0) ? 2 : 1.3)}>{[30, 100, 170].flatMap((x) => [<path key={`a${x}`} d={loop(p(x - 10, D, 6), p(x + 10, D, 6), p(x + 10, D + 18, 6), p(x - 10, D + 18, 6))} fill={G.fast} fillOpacity={on(0) ? 0.4 : 0.15} />, <path key={`h${x}`} d={circ(p, "xy", x, D + 10, 6, 3.5)} />])}</g>
        <g style={{ transform: "translateY(-40px)" }} {...ln(on(1) ? "#fff" : G.mute, 1.1)} strokeDasharray="5 3"><path d={loop(p(0, 0, H), p(W, 0, H), p(W, D, H), p(0, D, H))} /></g>
        <T x={p(0, 0, H)[0] - 20} y={p(0, 0, H)[1] - 46} c={G.mute} size={9}>LID (EXPLODED)</T>
      </g>
      <Fade on={k === 3}>
        <rect x="300" y="40" width="190" height="240" fill="#F8FAFC" stroke={G.mute} />
        <g {...ln("#334155", 1)}><rect x="320" y="70" width="150" height="80" /><path d="M357 70v80M395 70v80M432 70v80M320 110h150" /><rect x="320" y="170" width="150" height="24" /><path d="M335 194v10M395 194v10M455 194v10" /></g>
        <path d="M300 238H490" stroke={G.mute} /><T x="308" y="254" c="#334155" size={9}>ENCLOSURE GA · BOM</T><T x="308" y="270" c="#334155" size={9}>FLAT PATTERNS · MOUNTS</T>
      </Fade>
      <T x="20" y="300" c={G.mute} size={9}>GENERIC GEOMETRY · MECHANICAL DOCUMENTATION ONLY</T>
    </svg>
  );
}

/* ───────── cost-driven redesign ───────── */
export const RD_MODES = ["Existing", "Review", "Revised"] as const;
export function Redesign({ m }: { m: number }) {
  const old = m < 2;
  return (
    <svg viewBox="0 0 520 300" className="mx-auto block h-auto w-full max-w-[820px]" role="img" aria-label={`Illustrative manufacturability review: ${RD_MODES[m]}`}>
      <title>{`Illustrative manufacturability review — ${RD_MODES[m]}`}</title>
      <rect width="520" height="300" fill={G.bg} /><Grid w={520} h={300} />
      <g style={{ opacity: old ? 1 : 0, transition: "opacity .5s" }}>
        <g {...ln(G.hi, 1.6)}><path d="M80 230H220V210H180V120H160V90H120V120H100V210H80Z" /><path d="M220 230H300V200H260V210H220" /><path d="M100 210L160 150M180 210L120 150" strokeWidth="1" /><rect x="300" y="170" width="70" height="60" /></g>
        {[[96, 222], [210, 222], [240, 222], [290, 222], [320, 200], [350, 200]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" {...ln(G.fast, 1.2)} />)}
        <T x="80" y="270" c={G.mute} size={9}>3 PIECES · WELDED GUSSETS · 6 FASTENERS (ILLUSTRATIVE)</T>
      </g>
      <Fade on={m === 1}>
        {[[100, 120, "BENDS"], [140, 175, "MATERIAL USAGE"], [320, 200, "FASTENERS"], [300, 160, "TOOLING COMPLEXITY"]].map(([x, y, l]) => <g key={l as string}><circle cx={x as number} cy={y as number} r="13" {...ln(G.tol, 1.4)} className="rch-pulse" /><T x={(x as number) + 18} y={(y as number) - 14} c={G.tol} size={9}>{l as string}</T></g>)}
      </Fade>
      <g style={{ opacity: old ? 0 : 1, transition: "opacity .5s" }}>
        <g {...ln(G.geo, 1.8)}><path d="M90 230H330V214H190V100H174V214H90Z" fill={G.geo} fillOpacity="0.14" /><path d="M190 140L240 214" strokeWidth="1" strokeDasharray="4 3" /></g>
        {[[120, 222], [300, 222], [182, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" {...ln(G.fast, 1.2)} />)}
        <T x="90" y="270" c={G.ok} size={9}>SINGLE BENT PART · FEWER FASTENERS (CONCEPTUAL)</T>
      </g>
      <T x="500" y="24" a="end" c={G.mute} size={8}>ILLUSTRATIVE MANUFACTURABILITY REVIEW</T>
    </svg>
  );
}

/* ───────── small glyphs for project types / deliverables ───────── */
export function Glyph({ k, className }: { k: string; className?: string }) {
  const p = makeIso(80, 52, 0.55);
  const body: Record<string, ReactNode> = {
    bracket: <><Box p={p} b={[-40, -30, 0, 80, 60, 6]} c={G.geo} solid /><Box p={p} b={[-40, -30, 6, 80, 6, 50]} c={G.geo} solid /></>,
    reverse: <><path d="M20 70c4-30 20-40 40-38 8 1 10 8 6 14l-6 12c-4 10 4 14 2 22z" {...ln("#94A3B8", 1.4)} strokeDasharray="2 2" /><path d="M72 64h14" {...ln(G.datum, 1.4)} /><path d="M82 60l5 4-5 4" {...ln(G.datum, 1.4)} /><path d="M94 36h44v20h-20v24H94z" {...ln(G.geo, 1.6)} /></>,
    fixture: <><Box p={p} b={[-50, -40, 0, 100, 80, 8]} c={G.mute} solid /><Box p={p} b={[-30, -24, 12, 60, 48, 5]} c={G.geo} solid />{[-20, 20].map((x) => <path key={x} d={seg(p(x, 0, 8), p(x, 0, 26))} {...ln(G.datum, 2)} />)}</>,
    sheet: <><path d="M14 40h50v40H14z" {...ln("#94A3B8", 1.2)} /><path d="M14 52h50M14 68h50" {...ln(G.tol, 0.8)} strokeDasharray="4 2" /><path d="M72 60h12" {...ln(G.datum, 1.4)} /><path d="M80 56l5 4-5 4" {...ln(G.datum, 1.4)} /><path d="M96 80V44h40v36M96 44l8-8h40l-8 8M136 80l8-8V36" {...ln(G.geo, 1.4)} /></>,
    drawing: <><rect x="40" y="20" width="80" height="68" fill="#F8FAFC" /><path d="M52 34h30v24H52zM92 34h14v24H92zM52 66h30v8H52z" {...ln("#334155", 1)} /><path d="M86 78h30" stroke="#334155" /></>,
    stack: <>{[0, 1, 2].map((i) => <rect key={i} x={24 + i * 38} y="40" width="34" height="34" fillOpacity="0.2" {...ln([G.geo, "#C4B5FD", G.fast][i], 1.3)} fill={[G.geo, "#C4B5FD", G.fast][i]} />)}<rect x="132" y="34" width="10" height="46" fill={G.tol} fillOpacity="0.3" stroke={G.tol} /></>,
    ev: <><Box p={p} b={[-60, -40, 0, 120, 80, 18]} c={G.geo} solid />{[-30, 0, 30].map((x) => <path key={x} d={seg(p(x, -40, 2), p(x, 40, 2))} {...ln(G.datum, 1)} />)}</>,
    model: <><Box p={p} b={[-40, -30, 0, 80, 60, 30]} c={G.geo} solid /></>,
  };
  return <svg viewBox="0 0 160 100" className={className ?? "block h-auto w-full"} aria-hidden><rect width="160" height="100" fill={G.bg} />{body[k] ?? body.model}</svg>;
}
