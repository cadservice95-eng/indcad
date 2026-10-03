import { DimensionLine } from "./DimensionLines";
import { makeIso, seg, loop } from "./iso";

const d = (ms: number, extra?: Record<string, string>) =>
  ({ "--d": `${ms}ms`, ...extra }) as React.CSSProperties;

// Layout in metres: outer 16 × 10, partition at x = 6.5, cross wall at y = 5.5
const W = 16;
const D = 10;
const H = 3.2;
const PX = 6.5;
const PY = 5.5;
const S = 15;

const T_SWAP = 3200; // 2D plan hands over to the 3D model
const T_RISE = 4300;

/**
 * Animated explainer: a 2D floor plan is dimensioned, hands over to an
 * isometric footprint, the walls rise, and a BIM grid + datum appear.
 * Runs once when scrolled into view (the parent <InView> flips data-in).
 */
export function PlanToModel({ className }: { className?: string }) {
  const p = makeIso(212, 108, S);

  const footprint = [
    loop(p(0, 0, 0), p(W, 0, 0), p(W, D, 0), p(0, D, 0)),
    seg(p(PX, 0, 0), p(PX, D, 0)),
    seg(p(PX, PY, 0), p(W, PY, 0)),
  ].join("");

  const risers = [
    seg(p(0, D, 0), p(0, D, H)),
    seg(p(W, D, 0), p(W, D, H)),
    seg(p(W, 0, 0), p(W, 0, H)),
    seg(p(0, 0, 0), p(0, 0, H)),
    seg(p(PX, D, 0), p(PX, D, H)),
    seg(p(PX, 0, 0), p(PX, 0, H)),
    seg(p(W, PY, 0), p(W, PY, H)),
    seg(p(PX, PY, 0), p(PX, PY, H)),
  ].join("");

  const tops = [
    loop(p(0, 0, H), p(W, 0, H), p(W, D, H), p(0, D, H)),
    seg(p(PX, 0, H), p(PX, D, H)),
    seg(p(PX, PY, H), p(W, PY, H)),
  ].join("");

  const faceFront = loop(p(0, D, 0), p(W, D, 0), p(W, D, H), p(0, D, H));
  const faceSide = loop(p(W, D, 0), p(W, 0, 0), p(W, 0, H), p(W, D, H));

  // BIM grid: bubbles along the front, datum on the right
  const gridX = [0, PX, W];
  const letters = ["A", "B", "C"];
  const g0 = p(0, D, 0);
  const g1 = p(W, D, 0);

  return (
    <svg
      viewBox="0 0 560 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Animation of a 2D floor plan becoming a 3D wireframe model and then a BIM model with a coordination grid"
    >
      <rect x="0.5" y="0.5" width="559" height="419" stroke="#83aed3" strokeOpacity="0.25" />
      <path d="M0 22V0h22M538 0h22v22M560 398v22h-22M22 420H0v-22" stroke="#38bdf8" strokeWidth="2" />

      {/* ── Stage 1: 2D plan ── */}
      <g className="fade-out text-sky-200" style={d(T_SWAP)}>
        <path
          d="M144 92h272v170H144ZM254.5 92v62M254.5 184v78M254.5 184.5H334M364 184.5H416"
          stroke="currentColor"
          strokeWidth="1.8"
          pathLength={1}
          className="draw"
          style={d(200, { "--t": "1.8s" })}
        />
        <g stroke="#38bdf8" strokeWidth="0.9" className="fade-in" style={d(1700)}>
          <path d="M254.5 154V184M254.5 184A30 30 0 0 1 284.5 154M334 184.5V154.5M334 154.5A30 30 0 0 1 364 184.5" opacity="0.75" />
        </g>
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2" opacity="0.7" className="fade-in" style={d(1900)}>
          <text x="172" y="130">ROOM 01</text>
          <text x="300" y="130">ROOM 02</text>
          <text x="300" y="232">ROOM 03</text>
        </g>
        <DimensionLine x1={144} y1={92} x2={416} y2={92} offset={-22} label="16 000" delay={1400} />
        <DimensionLine x1={416} y1={92} x2={416} y2={262} offset={26} label="10 000" delay={1600} />
      </g>

      {/* ── Stage 2 + 3: 3D model ── */}
      <g className="text-sky-300">
        <path
          d={footprint}
          stroke="currentColor"
          strokeWidth="1.3"
          pathLength={1}
          className="draw"
          style={d(T_SWAP, { "--t": "1s" })}
        />
        <path d={risers} stroke="currentColor" strokeWidth="1.3" pathLength={1} className="draw" style={d(T_RISE, { "--t": "1.2s" })} />
        <path d={tops} stroke="currentColor" strokeWidth="1.5" pathLength={1} className="draw" style={d(T_RISE + 1000, { "--t": "1.4s" })} />
        <g className="fade-in" style={d(T_RISE + 2100)}>
          <path d={faceFront} className="fill-sky-400/10" />
          <path d={faceSide} className="fill-sky-400/20" />
        </g>

        {/* BIM grid + datum */}
        <g className="fade-in text-steel-300" style={d(T_RISE + 2600)}>
          {gridX.map((x, i) => {
            const a = p(x, D + 1, 0);
            const b = p(x, D + 3.2, 0);
            const top = p(x, -1.4, 0);
            return (
              <g key={x}>
                <path d={seg(top, a)} stroke="currentColor" strokeWidth="0.7" strokeDasharray="9 3 2 3" opacity="0.7" />
                <path d={seg(a, b)} stroke="currentColor" strokeWidth="0.7" strokeDasharray="9 3 2 3" opacity="0.7" />
                <circle cx={b[0] - 4} cy={b[1] + 10} r="9" stroke="currentColor" strokeWidth="1" />
                <text x={b[0] - 4} y={b[1] + 14} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">
                  {letters[i]}
                </text>
              </g>
            );
          })}
          <path d={`M${p(W + 1.5, 0, H)[0]} ${p(W + 1.5, 0, H)[1]}h54`} stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 3" />
          <path d={`M${p(W + 1.5, 0, 0)[0]} ${p(W + 1.5, 0, 0)[1]}h54`} stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 3" />
          <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="0.8">
            <text x={p(W + 1.5, 0, H)[0] + 8} y={p(W + 1.5, 0, H)[1] - 5}>LEVEL 02 +3.20</text>
            <text x={p(W + 1.5, 0, 0)[0] + 8} y={p(W + 1.5, 0, 0)[1] - 5}>LEVEL 01 ±0.00</text>
          </g>
        </g>
        <DimensionLine x1={g0[0]} y1={g0[1]} x2={g1[0]} y2={g1[1]} offset={44} delay={T_RISE + 3000} className="text-copper-400" label="16.00 m" />
      </g>

      {/* stage captions */}
      <g fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">
        <text x="28" y="396" className="fade-pass" style={d(100, { "--life": `${T_SWAP + 300}ms` })}>01 · 2D FLOOR PLAN</text>
        <text x="28" y="396" className="fade-pass" style={d(T_SWAP + 200, { "--life": `${T_RISE + 2400 - T_SWAP}ms` })}>02 · 3D WIREFRAME</text>
        <text x="28" y="396" className="fade-in" style={d(T_RISE + 2500)}>03 · BIM MODEL + COORDINATION GRID</text>
      </g>
    </svg>
  );
}
