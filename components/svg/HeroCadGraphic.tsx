import { IsometricBuilding } from "./IsometricBuilding";
import { DimensionLine } from "./DimensionLines";
import { makeIso, seg } from "./iso";

const W = 24.8;
const D = 12;
const H = 8.4;
const S = 9.5;
const OX = 228;
const OY = 212;

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Chip-style technical label with an optional leader line to a point. */
function Tag({ x, y, text, delay, w }: { x: number; y: number; text: string; delay: number; w?: number }) {
  const width = w ?? text.length * 7.2 + 16;
  return (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={width} height={20} className="fill-ink-950/80" stroke="currentColor" strokeWidth="0.8" opacity="0.95" />
      <text x={x + 8} y={y + 14} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">
        {text}
      </text>
    </g>
  );
}

/**
 * Hero illustration: an isometric BIM building with dimensions, labels,
 * coordinate markers, a plan fragment and a slow-rotating technical dial.
 * Purely decorative — content for search engines lives in the HTML around it.
 */
export function HeroCadGraphic({ className }: { className?: string }) {
  const p = makeIso(OX, OY, S);

  // Site grid on the ground plane, extended past the building footprint.
  const ground: string[] = [];
  for (let x = -6; x <= W + 6; x += 6) ground.push(seg(p(x, -6, 0), p(x, D + 6, 0)));
  for (let y = -6; y <= D + 6; y += 6) ground.push(seg(p(-6, y, 0), p(W + 6, y, 0)));

  const front0 = p(0, D, 0);
  const front1 = p(W, D, 0);
  const side0 = p(W, D, 0);
  const side1 = p(W, 0, 0);
  const h0 = p(0, D, 0);
  const h1 = p(0, D, H);
  const roofAnchor = p(W * 0.84, D * 0.25, H + 1.5);
  const faceAnchor = p(2.5, D, H * 0.55);

  // Coordinate triad
  const tx = 62;
  const ty = 478;

  return (
    <svg
      viewBox="0 0 640 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="BIM building model visualization with dimension lines, a plan fragment and technical annotations"
    >
      {/* sheet frame + corner ticks */}
      <rect x="0.5" y="0.5" width="639" height="559" className="text-steel-300" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M0 24V0h24M616 0h24v24M640 536v24h-24M24 560H0v-24" stroke="#38bdf8" strokeWidth="2" />

      <g className="text-sky-300">
        {/* ground grid */}
        <path d={ground.join("")} stroke="currentColor" strokeWidth="0.6" opacity="0.22" pathLength={1} className="draw" style={{ ...d(0), "--t": "2.4s" } as React.CSSProperties} />

        <IsometricBuilding ox={OX} oy={OY} s={S} W={W} D={D} H={H} detail="bim" bays={5} delay={300} />
      </g>

      {/* dimension lines */}
      <DimensionLine x1={front0[0]} y1={front0[1]} x2={front1[0]} y2={front1[1]} offset={30} label="L 24.80 m" delay={2000} />
      <DimensionLine x1={side0[0]} y1={side0[1]} x2={side1[0]} y2={side1[1]} offset={30} label="W 12.00 m" delay={2250} />
      <DimensionLine x1={h0[0]} y1={h0[1]} x2={h1[0]} y2={h1[1]} offset={-26} label="H 8.40 m" delay={2500} className="text-copper-400" />

      {/* leader lines + labels, anchored to model geometry */}
      <g className="text-sky-300">
        <path d={`M${roofAnchor[0]} ${roofAnchor[1]}L${roofAnchor[0] + 36} 108H452`} stroke="currentColor" strokeWidth="0.8" opacity="0.6" className="fade-in" style={d(2700)} />
        <Tag x={452} y={96} text="BIM MODEL" delay={2700} />
        <path d={`M${faceAnchor[0]} ${faceAnchor[1]}L${faceAnchor[0] - 40} ${faceAnchor[1] + 46}H132`} stroke="currentColor" strokeWidth="0.8" opacity="0.6" className="fade-in" style={d(2900)} />
        <Tag x={50} y={faceAnchor[1] + 36} text="3D MODEL" delay={2900} />
        <Tag x={50} y={faceAnchor[1] + 62} text="REVIT" delay={3100} w={62} />
        <Tag x={50} y={faceAnchor[1] + 88} text="DWG" delay={3200} w={50} />
      </g>

      {/* crosshair with pulse on the roof plant */}
      <g className="text-copper-400 fade-in" style={d(3000)} transform={`translate(${roofAnchor[0]} ${roofAnchor[1]})`}>
        <path d="M-10 0h20M0 -10v20" stroke="currentColor" strokeWidth="1" />
        <circle r="9" stroke="currentColor" strokeWidth="0.9" />
        <circle r="3" fill="currentColor" className="rch-pulse" />
      </g>

      {/* technical dial */}
      <g className="text-steel-300" transform="translate(556 156)">
        <g className="fade-in" style={d(1200)}>
          <circle r="46" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <circle r="36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" className="rch-spin-slow" />
          <circle r="26" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="14 8 3 8" className="rch-spin-rev" />
          <path d="M-52 0h104M0 -52v104" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          <circle r="2.5" fill="#38bdf8" />
          <text y="-56" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5">N</text>
        </g>
      </g>

      {/* plan fragment */}
      <g className="text-steel-300" transform="translate(440 418)">
        <g className="fade-in" style={d(3300)}>
          <rect x="-8" y="-22" width="190" height="120" className="fill-ink-950/70" stroke="currentColor" strokeOpacity="0.4" />
          <text x="0" y="-8" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" opacity="0.8">LEVEL 01 · PLAN</text>
        </g>
        <path
          d="M0 4h166v84H0ZM0 4v84M56 4v52M56 56h44M100 56v32M126 4v52M126 56h40"
          stroke="currentColor"
          strokeWidth="1.2"
          pathLength={1}
          className="draw"
          style={{ ...d(3400), "--t": "1.6s" } as React.CSSProperties}
        />
        <path d="M18 88a14 14 0 0 1 14-14M126 30a12 12 0 0 1 12-12" stroke="#38bdf8" strokeWidth="0.8" className="fade-in" style={d(4400)} />
      </g>

      {/* axis triad + scale block */}
      <g className="text-steel-300 fade-in" style={d(3500)}>
        <path d={`M${tx} ${ty}l34 19M${tx} ${ty}l-34 19M${tx} ${ty}v-40`} stroke="currentColor" strokeWidth="1" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x={tx + 38} y={ty + 26}>X</text>
          <text x={tx - 48} y={ty + 26}>Y</text>
          <text x={tx - 3} y={ty - 46}>Z</text>
        </g>
        <circle cx={tx} cy={ty} r="2.5" className="rch-pulse" fill="#38bdf8" style={d(0)} />
        <text x="34" y="534" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.4" opacity="0.8">
          SCALE 1:100 · GRID A–F
        </text>
      </g>
    </svg>
  );
}
