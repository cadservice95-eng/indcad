import { makeIso, seg, loop } from "./iso";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

// Enclosure (open-top box) in mm: base 90 × 60, walls 36 high
const BW = 90;
const BD = 60;
const BH = 36;

/** Flat pattern with bend lines → folded enclosure. Illustrative workflow, not a guarantee. */
export function SheetMetalGraphic({ className }: { className?: string }) {
  const p = makeIso(440, 112, 1.8);

  // Flat pattern (cross) in px, centre rect 180 × 120, flaps 70 / 56
  const fx = 70;
  const fy = 96;
  const cw = 150;
  const ch = 100;
  const fl = 52;
  const flat = `M${fx + fl} ${fy}h${cw}v${fl}h${fl}v${ch}h${-fl}v${fl}h${-cw}v${-fl}h${-fl}v${-ch}h${fl}z`;
  const bends = `M${fx + fl} ${fy + fl}h${cw}M${fx + fl} ${fy + fl + ch}h${cw}M${fx + fl} ${fy + fl}v${ch}M${fx + fl + cw} ${fy + fl}v${ch}`;

  const box = [
    seg(p(0, BD, 0), p(BW, BD, 0), p(BW, 0, 0)),
    seg(p(0, BD, 0), p(0, BD, BH)),
    seg(p(BW, BD, 0), p(BW, BD, BH)),
    seg(p(BW, 0, 0), p(BW, 0, BH)),
    loop(p(0, 0, BH), p(BW, 0, BH), p(BW, BD, BH), p(0, BD, BH)),
  ].join("");
  const inner = [seg(p(0, 0, 0), p(0, 0, BH)), seg(p(0, 0, 0), p(BW, 0, 0)), seg(p(0, 0, 0), p(0, BD, 0))].join("");

  const tagCls = "fill-ink-950/85";
  return (
    <svg
      viewBox="0 0 640 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Sheet metal fabrication drawing workflow: a flat pattern with bend lines folds into a finished enclosure"
    >
      <rect x="0.5" y="0.5" width="639" height="339" stroke="#83aed3" strokeOpacity="0.25" />

      {/* flat sheet stage */}
      <g className="fade-out text-sky-200" style={d(4600)}>
        <path d={flat} className="fill-sky-400/10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} />
        <path d={bends} stroke="#d68a51" strokeWidth="1.2" strokeDasharray="8 4 2 4" className="fade-in" style={d(1400)} />
        <g className="fade-in" style={d(2000)}>
          <circle cx={fx + fl + 28} cy={fy + fl + 26} r="6" stroke="currentColor" />
          <circle cx={fx + fl + cw - 28} cy={fy + fl + 26} r="6" stroke="currentColor" />
          <circle cx={fx + fl + 28} cy={fy + fl + ch - 26} r="6" stroke="currentColor" />
          <circle cx={fx + fl + cw - 28} cy={fy + fl + ch - 26} r="6" stroke="currentColor" />
        </g>
        <g fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1" className="fade-in" style={d(2400)}>
          <text x={fx + fl + cw + 8} y={fy + fl - 6}>BEND</text>
          <text x={fx + fl - 4} y={fy - 10}>K-FACTOR</text>
        </g>
      </g>

      {/* folded stage */}
      <g className="text-sky-300">
        <g className="fade-in" style={d(5000)}>
          <path d={loop(p(0, BD, 0), p(BW, BD, 0), p(BW, BD, BH), p(0, BD, BH))} className="fill-sky-400/15" />
          <path d={loop(p(BW, BD, 0), p(BW, 0, 0), p(BW, 0, BH), p(BW, BD, BH))} className="fill-sky-400/25" />
        </g>
        <path d={inner} stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 4" opacity="0.4" className="fade-in" style={d(5000)} />
        <path d={box} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw" style={d(4800, "1.4s")} />
        <g className="fade-in" style={d(6400)}>
          <rect x="452" y="262" width="64" height="20" className={tagCls} stroke="currentColor" strokeWidth="0.8" />
          <text x="460" y="276" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">DXF</text>
          <rect x="522" y="262" width="82" height="20" className={tagCls} stroke="currentColor" strokeWidth="0.8" />
          <text x="530" y="276" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">BEND 90°</text>
          <rect x="452" y="288" width="96" height="20" className={tagCls} stroke="currentColor" strokeWidth="0.8" />
          <text x="460" y="302" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">THICKNESS</text>
        </g>
      </g>

      <g fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">
        <text x="28" y="320" className="fade-pass" style={{ "--d": "200ms", "--life": "5000ms" } as React.CSSProperties}>01 · FLAT SHEET → BEND LINES</text>
        <text x="28" y="320" className="fade-in" style={d(5400)}>02 · FOLD → FINISHED ENCLOSURE</text>
      </g>
    </svg>
  );
}
