import { makeIso, seg, loop, boxPath, cylinder, ellipse } from "./iso";
import { DimensionLine } from "./DimensionLines";

const S = 3.2;
const p = makeIso(250, 150, S);
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const LIFT = 40;

/** A pin lowers into a block and locks with concentric + coincident mates. Illustrative. */
export function MateConstraint({ className }: { className?: string }) {
  const bx = 22;
  const by = 22;
  const pinStyle = { "--d": "600ms", "--mx": "0px", "--my": `${LIFT * S}px` } as React.CSSProperties;
  const tag = (x: number, y: number, w: number, t: string, delay: number, color = "#7dd3fc") => (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={w} height="22" className="fill-ink-950" stroke={color} strokeWidth="0.9" />
      <text x={x + 9} y={y + 15} fill={color} fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.2">{t}</text>
    </g>
  );

  return (
    <svg
      viewBox="0 0 640 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Two components moving together and locking with concentric, coincident and distance mates"
    >
      <rect x="0.5" y="0.5" width="639" height="329" stroke="#83aed3" strokeOpacity="0.25" />
      <g className="text-sky-300" strokeLinejoin="round" strokeLinecap="round">
        {/* block */}
        <path d={boxPath(p, 0, 0, 0, 44, 44, 18)} className="fill-sky-400/10" stroke="currentColor" strokeWidth="1.5" pathLength={1} />
        <path d={loop(p(0, 0, 18), p(44, 0, 18), p(44, 44, 18), p(0, 44, 18))} className="fill-sky-300/10" stroke="none" />
        <path d={ellipse(p, bx, by, 18, 7.5, S)} className="fill-ink-950" stroke="currentColor" strokeWidth="1.3" />
        {/* coincident face highlight */}
        <path d={loop(p(0, 0, 18), p(44, 0, 18), p(44, 44, 18), p(0, 44, 18))} className="fade-in" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1" strokeDasharray="4 3" style={d(3700)} />
        {/* axis */}
        <path d={seg(p(bx, by, -6), p(bx, by, 70))} stroke="#d68a51" strokeWidth="1" strokeDasharray="9 3 2 3" className="fade-in" style={d(3500)} />

        {/* pin (moves down) */}
        <g className="mate" style={pinStyle}>
          <path d={cylinder(p, bx, by, 6 + LIFT, 46 + LIFT, 6.5, S)} className="fill-ink-950" stroke="currentColor" strokeWidth="1.5" />
          <path d={cylinder(p, bx, by, 18 + LIFT, 22 + LIFT, 11, S)} className="fill-sky-400/15" stroke="currentColor" strokeWidth="1.5" />
        </g>
      </g>

      <DimensionLine x1={p(44, 44, 0)[0] + 14} y1={p(44, 44, 0)[1] - 6} x2={p(44, 44, 18)[0] + 14} y2={p(44, 44, 18)[1] - 6} offset={26} label="DISTANCE" delay={4000} className="text-copper-400" />

      {tag(440, 54, 116, "MATE", 3400)}
      {tag(440, 84, 164, "CONCENTRIC", 3500, "#d68a51")}
      {tag(440, 114, 164, "COINCIDENT", 3700, "#34d399")}
      {tag(440, 144, 136, "DISTANCE", 3900, "#d68a51")}
      <path d="M440 95H388M440 125H372" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" className="fade-in text-sky-300" style={d(3500)} />

      <text x="26" y="312" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.6" className="fade-in" style={d(4200)}>
        ASSEMBLY MATES · FULLY DEFINED
      </text>
    </svg>
  );
}
