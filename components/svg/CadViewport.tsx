import { IsoPart, PART, type PartDelays } from "./IsoPart";
import { DimensionLine } from "./DimensionLines";
import { makeIso, seg, loop, isoRx } from "./iso";

const S = 2.0;
const OX = 281;
const OY = 236;
const DELAYS: PartDelays = { base: 1900, rise: 2400, boss: 3200, holes: 3900, mesh: 4500 };
const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

function Chip({ x, y, w, text, delay }: { x: number; y: number; w: number; text: string; delay: number }) {
  return (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={w} height={20} className="fill-ink-950/85" stroke="currentColor" strokeWidth="0.8" />
      <text x={x + 8} y={y + 14} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">{text}</text>
    </g>
  );
}

/**
 * Hero CAD viewport: a sketch is drawn, extruded into a solid, picks up
 * features, then gets a wireframe overlay, dimensions and metadata.
 * Fictional values; decorative.
 */
export function CadViewport({ className }: { className?: string }) {
  const { L, W, T, bossH, boss } = PART;
  const p = makeIso(OX, OY, S);
  const top = T + bossH;
  const a0 = p(0, W, 0);
  const a1 = p(L, W, 0);
  const b0 = p(L, W, 0);
  const b1 = p(L, 0, 0);
  const h0 = p(0, W, 0);
  const h1 = p(0, W, top);
  const tc = p(L / 2, W / 2, top);
  const rx = isoRx(boss, S);
  const hole = p(L / 2 - 45, W / 2 - 26, T);
  const corner = p(L, W, T);

  const ground: string[] = [];
  for (let x = -20; x <= L + 20; x += 25) ground.push(seg(p(x, -20, 0), p(x, W + 20, 0)));
  for (let y = -20; y <= W + 20; y += 25) ground.push(seg(p(-20, y, 0), p(L + 20, y, 0)));

  return (
    <svg
      viewBox="0 0 640 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="3D CAD viewport showing a parametric part built from a sketch into a solid with fillets, holes, a wireframe overlay and dimensions"
    >
      <rect x="0.5" y="0.5" width="639" height="559" className="text-steel-300" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M0 24V0h24M616 0h24v24M640 536v24h-24M24 560H0v-24" stroke="#38bdf8" strokeWidth="2" />

      <g className="par-a text-sky-300">
        <path d={ground.join("")} stroke="currentColor" strokeWidth="0.6" opacity="0.22" pathLength={1} className="draw" style={d(0, "1.6s")} />
      </g>

      {/* axes */}
      <g className="fade-in text-steel-300" style={d(500)} transform="translate(62 492)">
        <path d="M0 0l34 19" stroke="#f87171" strokeWidth="1.3" />
        <path d="M0 0l-34 19" stroke="#34d399" strokeWidth="1.3" />
        <path d="M0 0v-40" stroke="#38bdf8" strokeWidth="1.3" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="38" y="27">X</text><text x="-46" y="27">Y</text><text x="-3" y="-46">Z</text>
        </g>
        <circle r="2.5" fill="currentColor" />
      </g>

      {/* sketch stage */}
      <g className="fade-pass text-copper-400" style={{ ...d(1000), "--life": "1700ms" } as React.CSSProperties}>
        <path d={loop(p(0, 0, 0), p(L, 0, 0), p(L, W, 0), p(0, W, 0))} stroke="currentColor" strokeWidth="1.4" strokeDasharray="6 4" />
        <path d={seg(p(L / 2 - 8, W / 2, 0), p(L / 2 + 8, W / 2, 0)) + seg(p(L / 2, W / 2 - 8, 0), p(L / 2, W / 2 + 8, 0))} stroke="currentColor" />
        <text x={p(L / 2, 0, 0)[0] + 8} y={p(L / 2, 0, 0)[1] - 8} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">SKETCH 01</text>
      </g>

      <g className="par-c text-sky-300">
        <IsoPart ox={OX} oy={OY} s={S} delays={DELAYS} solid />
      </g>

      {/* section plane + exploded marker */}
      <g className="fade-in text-copper-400" style={d(5000)}>
        <path d={loop(p(L / 2 - 2, -10, -4), p(L / 2 - 2, W + 10, -4), p(L / 2 - 2, W + 10, top + 12), p(L / 2 - 2, -10, top + 12))} stroke="currentColor" strokeWidth="0.9" strokeDasharray="6 4" fill="rgba(214,138,81,0.05)" />
        <text x={p(L / 2 - 2, -10, top + 12)[0] + 6} y={p(L / 2 - 2, -10, top + 12)[1] - 4} fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">SECTION A-A</text>
      </g>
      <g className="fade-in text-sky-300" style={d(5300)}>
        <path d={`M${tc[0]} ${tc[1] - 14}v-34m-5 7l5 -7 5 7`} stroke="currentColor" strokeWidth="1" />
        <text x={tc[0] + 10} y={tc[1] - 40} fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">COMP 02 ↑</text>
      </g>

      <g className="par-b">
        <DimensionLine x1={a0[0]} y1={a0[1]} x2={a1[0]} y2={a1[1]} offset={34} label="125.00" delay={4700} />
        <DimensionLine x1={b1[0]} y1={b1[1]} x2={b0[0]} y2={b0[1]} offset={34} label="80.00" delay={4850} />
        <DimensionLine x1={h0[0]} y1={h0[1]} x2={h1[0]} y2={h1[1]} offset={-28} label="42" delay={5000} />
        <DimensionLine x1={tc[0] - rx} y1={tc[1]} x2={tc[0] + rx} y2={tc[1]} offset={-52} label="Ø 42" delay={5150} className="text-copper-400" />
        {/* callouts */}
        <g className="fade-in text-sky-300" style={d(5400)}>
          <path d={`M${hole[0]} ${hole[1]}l-24 -26h-34`} stroke="currentColor" strokeWidth="0.9" />
          <text x={hole[0] - 62} y={hole[1] - 30} textAnchor="end" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5">M12</text>
          <path d={`M${corner[0] + 2} ${corner[1] - 2}l22 -10h26`} stroke="currentColor" strokeWidth="0.9" />
          <text x={corner[0] + 56} y={corner[1] - 8} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5">R8</text>
          <path d={`M${a0[0] - 4} ${a0[1] + 4}l-16 14`} stroke="currentColor" strokeWidth="0.9" />
          <rect x={a0[0] - 36} y={a0[1] + 18} width="14" height="14" className="fill-ink-950" stroke="currentColor" />
          <text x={a0[0] - 29} y={a0[1] + 28.5} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">A</text>
          <text x={a0[0] - 42} y={a0[1] + 29} textAnchor="end" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" opacity="0.8">DATUM A</text>
        </g>
      </g>

      {/* UI chips */}
      <g className="text-sky-300">
        <Chip x={36} y={36} w={92} text="3D MODEL" delay={5200} />
        <Chip x={136} y={36} w={104} text="PART: 1047" delay={5300} />
        <Chip x={248} y={36} w={74} text="REV: B" delay={5400} />
        <Chip x={430} y={36} w={176} text="CONFIG: STANDARD" delay={5500} />
      </g>
      <g className="fade-in text-steel-300" style={d(5600)}>
        <rect x="448" y="476" width="164" height="48" className="fill-ink-950/70" stroke="currentColor" strokeOpacity="0.45" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="458" y="494">FEATURES · 6</text>
          <text x="458" y="508">REBUILD · OK</text>
          <text x="458" y="520" opacity="0.7">ILLUSTRATIVE</text>
        </g>
      </g>
    </svg>
  );
}
