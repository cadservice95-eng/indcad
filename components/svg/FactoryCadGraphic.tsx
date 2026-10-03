import { makeIso, seg, boxPath, boxFaces, cylinder } from "./iso";
import { DimensionLine } from "./DimensionLines";

const S = 5.4;
const OX = 222;
const OY = 168;
const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

function Tag({ x, y, w, text, delay }: { x: number; y: number; w: number; text: string; delay: number }) {
  return (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={w} height={20} className="fill-ink-950/85" stroke="currentColor" strokeWidth="0.8" />
      <text x={x + 8} y={y + 14} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">
        {text}
      </text>
    </g>
  );
}

function Balloon({ x, y, n, delay }: { x: number; y: number; n: string; delay: number }) {
  return (
    <g className="fade-in" style={d(delay)} transform={`translate(${x} ${y})`}>
      <circle r="10" className="fill-ink-950" stroke="#d68a51" strokeWidth="1.2" />
      <text y="3.6" textAnchor="middle" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10">{n}</text>
      <circle r="10" stroke="#d68a51" strokeWidth="0.7" className="rch-pulse" style={d(delay)} />
    </g>
  );
}

/**
 * Hero: an isometric production line (process unit, machine units, conveyor
 * with crates) overlaid with CAD wireframe, dimensions, balloons and a mini BOM.
 * Decorative; values are fictional.
 */
export function FactoryCadGraphic({ className }: { className?: string }) {
  const p = makeIso(OX, OY, S);
  const fill = "fill-ink-950";

  // back row
  const tank = { x: 9, y: 8, r: 6, z1: 15 };
  const m1 = [22, 3, 0, 42, 15, 13] as const;
  const m3 = [50, 3, 0, 68, 14, 18] as const;
  // conveyor
  const conv = [0, 19, 4.5, 72, 29, 7.5] as const;
  const crates = [[8, 22], [28, 22], [48, 22]] as const;

  const ground: string[] = [];
  for (let x = -8; x <= 80; x += 8) ground.push(seg(p(x, -8, 0), p(x, 38, 0)));
  for (let y = -8; y <= 38; y += 8) ground.push(seg(p(-8, y, 0), p(80, y, 0)));

  const legs = [4, 22, 40, 58, 68].map((x) => seg(p(x, 28.4, 0), p(x, 28.4, conv[2]))).join("");

  const m1a = p(m1[0], m1[4], 0);
  const m1b = p(m1[3], m1[4], 0);
  const m1top = p(m1[0], m1[4], m1[5]);
  const m1base = p(m1[0], m1[4], 0);

  const faces = (b: readonly number[]) => boxFaces(p, b[0], b[1], b[2], b[3], b[4], b[5]);

  return (
    <svg
      viewBox="0 0 640 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Isometric production line with machine units and conveyor, overlaid with CAD wireframe, dimensions, component numbers and a bill of materials"
    >
      <rect x="0.5" y="0.5" width="639" height="559" stroke="#83aed3" strokeOpacity="0.25" />
      <path d="M0 24V0h24M616 0h24v24M640 536v24h-24M24 560H0v-24" stroke="#38bdf8" strokeWidth="2" />

      <g className="text-sky-300">
        <path d={ground.join("")} stroke="currentColor" strokeWidth="0.6" opacity="0.2" pathLength={1} className="draw" style={d(0, "2s")} />

        {/* process tank */}
        <path d={cylinder(p, tank.x, tank.y, 0, tank.z1, tank.r, S)} className={`draw ${fill}`} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} style={d(300, "1.4s")} />

        {/* machine units */}
        {[m1, m3].map((b, i) => (
          <g key={i} className="fade-in" style={d(500 + i * 300)}>
            <path d={faces(b)[0]} className="fill-sky-400/10" />
            <path d={faces(b)[1]} className="fill-sky-400/20" />
            <path d={faces(b)[2]} className="fill-sky-300/10" />
          </g>
        ))}
        <path d={boxPath(p, ...m1)} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} className="draw" style={d(500, "1.4s")} />
        <path d={boxPath(p, ...m3)} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} className="draw" style={d(800, "1.4s")} />
        {/* panels & vents */}
        <path
          d={[
            seg(p(25, m1[4], 3), p(39, m1[4], 3), p(39, m1[4], 10), p(25, m1[4], 10), p(25, m1[4], 3)),
            seg(p(m3[3], 5, 4), p(m3[3], 12, 4), p(m3[3], 12, 15), p(m3[3], 5, 15), p(m3[3], 5, 4)),
            seg(p(54, 3, 18), p(54, 3, 21), p(56, 3, 21), p(56, 3, 18)),
          ].join("")}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
          className="fade-in"
          style={d(1500)}
        />

        {/* conveyor */}
        <path d={boxPath(p, ...conv)} className={`draw ${fill}`} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} style={d(900, "1.4s")} />
        <path d={legs} stroke="currentColor" strokeWidth="1.2" opacity="0.7" className="fade-in" style={d(1300)} />
        {crates.map(([x, y], i) => (
          <path key={i} d={boxPath(p, x, y, conv[5], x + 6, y + 6, conv[5] + 5)} className="fade-in fill-sky-400/15" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" style={d(1500 + i * 150)} />
        ))}
      </g>

      {/* CAD wireframe overlay on the machine unit */}
      <g className="text-copper-400 fade-in" style={d(1900)}>
        <path d={boxPath(p, m1[0] - 1.5, m1[1] - 1.5, 0, m1[3] + 1.5, m1[4] + 1.5, m1[5] + 1.5)} stroke="currentColor" strokeWidth="0.9" strokeDasharray="5 4" />
      </g>

      {/* dimensions */}
      <DimensionLine x1={m1a[0]} y1={m1a[1]} x2={m1b[0]} y2={m1b[1]} offset={40} label="L 2000" delay={2300} />
      <DimensionLine x1={m1base[0]} y1={m1base[1]} x2={m1top[0]} y2={m1top[1]} offset={-30} label="H 1300" delay={2500} />

      {/* balloons */}
      <Balloon x={p(32, 9, 14.5)[0]} y={p(32, 9, 14.5)[1] - 22} n="1" delay={3200} />
      <Balloon x={p(36, 29, 8)[0] + 16} y={p(36, 29, 8)[1] - 24} n="2" delay={3350} />
      <Balloon x={p(59, 8, 20)[0]} y={p(59, 8, 20)[1] - 24} n="3" delay={3500} />

      {/* tags */}
      <g className="text-sky-300">
        <Tag x={36} y={36} w={152} text="PRODUCTION MODEL" delay={2800} />
        <Tag x={196} y={36} w={42} text="BOM" delay={2900} />
        <Tag x={246} y={36} w={62} text="REV B" delay={3000} />
        <Tag x={470} y={36} w={46} text="CAD" delay={3100} />
        <path d={`M${p(66, 6, 18)[0]} ${p(66, 6, 18)[1]}L${p(66, 6, 18)[0] + 40} 84H520`} stroke="currentColor" strokeWidth="0.8" opacity="0.5" className="fade-in" style={d(3100)} />
        <Tag x={520} y={74} w={96} text="FABRICATION" delay={3200} />
        <Tag x={548} y={330} w={72} text="ASSEMBLY" delay={3300} />
        <path d={`M${p(70, 25, 6)[0] + 4} ${p(70, 25, 6)[1]}L548 340`} stroke="currentColor" strokeWidth="0.8" opacity="0.5" className="fade-in" style={d(3300)} />
      </g>

      {/* mini BOM */}
      <g className="fade-in text-steel-300" style={d(3000)}>
        <rect x="372" y="440" width="244" height="84" className="fill-ink-950/80" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M372 458h244M372 476h244M372 494h244M406 440v84" stroke="currentColor" strokeOpacity="0.35" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="380" y="453">ITEM</text><text x="414" y="453">DESCRIPTION</text><text x="580" y="453">QTY</text>
          <text x="384" y="471">01</text><text x="414" y="471">MACHINE UNIT</text><text x="586" y="471">1</text>
          <text x="384" y="489">02</text><text x="414" y="489">CONVEYOR</text><text x="586" y="489">1</text>
          <text x="384" y="507">03</text><text x="414" y="507">PROCESS UNIT</text><text x="586" y="507">1</text>
          <text x="414" y="520" opacity="0.6">ILLUSTRATIVE</text>
        </g>
      </g>

      {/* axes */}
      <g className="fade-in text-steel-300" style={d(2000)} transform="translate(62 496)">
        <path d="M0 0l32 18M0 0l-32 18M0 0v-38" stroke="currentColor" strokeWidth="1" />
        <circle r="2.5" fill="#38bdf8" className="rch-pulse" />
      </g>
    </svg>
  );
}
