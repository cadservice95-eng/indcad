import { IsoPart, PART } from "./IsoPart";
import { DimensionLine } from "./DimensionLines";
import { makeIso, seg, isoRx } from "./iso";

const S = 2.0;
const OX = 281;
const OY = 228;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function Tag({ x, y, text, w, delay }: { x: number; y: number; text: string; w: number; delay: number }) {
  return (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={w} height={20} className="fill-ink-950/85" stroke="currentColor" strokeWidth="0.8" />
      <text x={x + 8} y={y + 14} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">
        {text}
      </text>
    </g>
  );
}

/**
 * Hero CAD viewport: isometric flanged bracket with dimensions, datum,
 * title-block tags, axes and CAD interface chips. Fictional values, purely
 * decorative. Layers carry .par-* classes for the pointer parallax.
 */
export function MechanicalHeroCAD({ className }: { className?: string }) {
  const { L, W, T, bossH, boss } = PART;
  const p = makeIso(OX, OY, S);
  const top = T + bossH;
  const a0 = p(0, W, 0);
  const a1 = p(L, W, 0);
  const b0 = p(L, W, 0);
  const b1 = p(L, 0, 0);
  const h0 = p(0, W, 0);
  const h1 = p(0, W, top);
  const bossC = p(L / 2, W / 2, top);
  const rx = isoRx(boss, S);

  // ground grid
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
      aria-label="Mechanical CAD drafting technical drawing: isometric flanged bracket with dimension lines, datum and title-block annotations"
    >
      <rect x="0.5" y="0.5" width="639" height="559" className="text-steel-300" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M0 24V0h24M616 0h24v24M640 536v24h-24M24 560H0v-24" stroke="#38bdf8" strokeWidth="2" />

      <g className="par-a text-sky-300">
        <path d={ground.join("")} stroke="currentColor" strokeWidth="0.6" opacity="0.22" pathLength={1} className="draw" style={{ ...d(0), "--t": "2s" } as React.CSSProperties} />
      </g>

      <g className="par-c text-sky-300">
        <IsoPart ox={OX} oy={OY} s={S} />
      </g>

      <g className="par-b">
        <DimensionLine x1={a0[0]} y1={a0[1]} x2={a1[0]} y2={a1[1]} offset={34} label="L 125.00" delay={2300} />
        <DimensionLine x1={b1[0]} y1={b1[1]} x2={b0[0]} y2={b0[1]} offset={34} label="W 80.00" delay={2500} />
        <DimensionLine x1={h0[0]} y1={h0[1]} x2={h1[0]} y2={h1[1]} offset={-28} label="H 42.00" delay={2700} />
        <DimensionLine x1={bossC[0] - rx} y1={bossC[1]} x2={bossC[0] + rx} y2={bossC[1]} offset={-46} label="Ø 42.00" delay={2900} className="text-copper-400" />

        {/* datum A */}
        <g className="fade-in text-sky-300" style={d(3100)}>
          <path d={`M${a1[0] + 4} ${a1[1] - 6}l22 -14`} stroke="currentColor" strokeWidth="0.9" />
          <path d={`M${a1[0] + 26} ${a1[1] - 20}h14v14h-14z`} stroke="currentColor" strokeWidth="1" className="fill-ink-950" />
          <text x={a1[0] + 33} y={a1[1] - 9.5} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">A</text>
        </g>

        {/* crosshair on bore */}
        <g className="fade-in text-copper-400" style={d(3000)} transform={`translate(${bossC[0]} ${bossC[1]})`}>
          <path d="M-10 0h20M0 -10v20" stroke="currentColor" strokeWidth="1" />
          <circle r="3" fill="currentColor" className="rch-pulse" />
        </g>
      </g>

      {/* tags */}
      <g className="text-sky-300">
        <Tag x={48} y={36} text="PART NO. 1047" w={118} delay={3000} />
        <Tag x={176} y={36} text="REV. B" w={62} delay={3100} />
        <Tag x={430} y={36} text="TOL ±0.05" w={92} delay={3200} />
        <Tag x={530} y={36} text="SCALE 1:2" w={86} delay={3300} />
      </g>

      {/* interface chips + axes */}
      <g className="fade-in text-steel-300" style={d(3400)}>
        <text x="48" y="86" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1.4" opacity="0.8">VIEWPORT · ISO</text>
        <text x="48" y="102" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1.4" opacity="0.6">SNAP ON · ORTHO</text>
        <g transform="translate(62 500)">
          <path d="M0 0l32 18M0 0l-32 18M0 0v-38" stroke="currentColor" strokeWidth="1" />
          <circle r="2.5" fill="#38bdf8" className="rch-pulse" />
          <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
            <text x="36" y="26">X</text>
            <text x="-46" y="26">Y</text>
            <text x="-3" y="-44">Z</text>
          </g>
        </g>
        <path d="M470 470h150v58H470z" className="fill-ink-950/70" stroke="currentColor" strokeOpacity="0.45" />
        <path d="M470 489h150M545 470v19" stroke="currentColor" strokeOpacity="0.45" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="478" y="483">BRACKET</text>
          <text x="553" y="483">REV. B</text>
          <text x="478" y="508">MATERIAL · NOT SET</text>
          <text x="478" y="521" opacity="0.7">UNITS · MM</text>
        </g>
      </g>
    </svg>
  );
}
