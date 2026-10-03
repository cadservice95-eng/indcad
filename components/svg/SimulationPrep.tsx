import { makeIso, seg, boxPath, cylinder, ellipse, loop } from "./iso";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const L = 125;
const W = 80;
const T = 12;
const S = 0.98;

type Stage = "full" | "cleanup" | "simple" | "sim";

function Mini({ ox, oy, stage, delay }: { ox: number; oy: number; stage: Stage; delay: number }) {
  const p = makeIso(ox, oy, S);
  const cx = L / 2;
  const cy = W / 2;
  const top = T + 30;
  const cosmetic = stage === "full" || stage === "cleanup";
  const holes = [[-45, -26], [45, -26], [45, 26], [-45, 26]].map(([a, b]) => ellipse(p, cx + a, cy + b, T, 4.5, S)).join("");
  const tiny = [20, 32, 44, 56, 68, 80, 92, 104].map((x) => ellipse(p, x, 10, T, 1.8, S)).join("");
  const crosses = [20, 56, 92].map((x) => {
    const c = p(x, 10, T);
    return `M${c[0] - 5} ${c[1] - 4}l10 8M${c[0] + 5} ${c[1] - 4}l-10 8`;
  }).join("");

  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round" className="text-sky-300">
      <path d={boxPath(p, 0, 0, 0, L, W, T)} className="fill-sky-400/10" stroke="currentColor" strokeWidth="1.3" pathLength={1} style={d(delay, "1s")} />
      <path d={cylinder(p, cx, cy, T, top, 21, S)} className="fill-ink-950/60" stroke="currentColor" strokeWidth="1.3" />
      <path d={ellipse(p, cx, cy, top, 10, S)} stroke="currentColor" strokeWidth="1.1" />
      <path d={holes} stroke="currentColor" strokeWidth="1.1" />

      {cosmetic ? (
        <g className="fade-in" style={d(delay + 500)}>
          <path d={tiny} stroke="currentColor" strokeWidth="0.9" />
          <path d={boxPath(p, 8, 30, T, 18, 50, T + 5)} stroke="currentColor" strokeWidth="1" />
          <path d={seg(p(100, 30, T), p(116, 30, T)) + seg(p(100, 36, T), p(112, 36, T)) + seg(p(100, 42, T), p(114, 42, T))} stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <path d={seg(p(0, 0, T), p(6, 0, T)) + seg(p(L, W, T - 4), p(L - 6, W, T - 4))} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </g>
      ) : null}

      {stage === "cleanup" ? (
        <g className="fade-in text-copper-400" style={d(delay + 900)} stroke="currentColor" strokeWidth="1.5">
          <path d={crosses} />
          <path d={boxPath(p, 8, 30, T, 18, 50, T + 5)} strokeDasharray="3 2" />
          <path d={loop(p(98, 28, T), p(118, 28, T), p(118, 44, T), p(98, 44, T))} strokeDasharray="3 2" strokeWidth="1" />
        </g>
      ) : null}

      {stage === "sim" ? (
        <g className="fade-in" style={d(delay + 400)}>
          <path d={loop(p(0, 0, T), p(L, 0, T), p(L, W, T), p(0, W, T))} fill="url(#sim-heat)" stroke="none" opacity="0.55" />
          <path
            d={Array.from({ length: 9 }, (_, i) => seg(p((i + 1) * 12.5, 0, T), p((i + 1) * 12.5, W, T))).join("") + Array.from({ length: 7 }, (_, i) => seg(p(0, (i + 1) * 10, T), p(L, (i + 1) * 10, T))).join("")}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <path d={[0.25, 0.5, 0.75].map((f) => seg(p(cx - 21, cy, T + 30 * f), p(cx + 21, cy, T + 30 * f))).join("")} stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        </g>
      ) : null}
    </g>
  );
}

const panels: { x: number; title: string; stage: Stage }[] = [
  { x: 20, title: "01 · FULL CAD MODEL", stage: "full" },
  { x: 230, title: "02 · GEOMETRY CLEANUP", stage: "cleanup" },
  { x: 440, title: "03 · SIMPLIFIED MODEL", stage: "simple" },
  { x: 650, title: "04 · SIMULATION", stage: "sim" },
];

const notes = ["REMOVE COSMETIC FEATURES", "SIMPLIFY GEOMETRY", "PRESERVE ENGINEERING INTENT"];

/** Detailed CAD → cleanup → simplified model → mesh. Workflow concept, not a universal rule. */
export function SimulationPrep({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 880 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="A detailed CAD model has cosmetic features removed, becomes a simplified model and is then meshed for simulation"
    >
      <defs>
        <linearGradient id="sim-heat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#d68a51" />
        </linearGradient>
      </defs>
      {panels.map((pn, i) => (
        <g key={pn.title}>
          <rect x={pn.x + 0.5} y="10.5" width="209" height="196" stroke="#83aed3" strokeOpacity={pn.stage === "sim" ? 0.55 : 0.3} />
          <Mini ox={pn.x + 84} oy={72} stage={pn.stage} delay={i * 900} />
          <text x={pn.x + 12} y="228" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2" className="fade-in" style={d(i * 900)}>
            {pn.title}
          </text>
        </g>
      ))}
      {notes.map((n, i) => (
        <g key={n} className="fade-in" style={d(600 + i * 900)}>
          <path d={`M${224 + i * 210} 112h12`} stroke="#d68a51" strokeWidth="1.2" className="rch-flow" />
          <text x={20 + i * 210 + 8} y="272" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}
