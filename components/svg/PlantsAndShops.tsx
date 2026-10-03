import { makeIso, seg, boxPath, cylinder } from "./iso";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

/** Large facility: saw-tooth roof building with an assembly line inside the cut-away. */
export function LargePlantGraphic({ className }: { className?: string }) {
  const p = makeIso(150, 100, 3.6);
  const roof = [0, 1, 2, 3].map((i) => {
    const x0 = i * 10;
    return seg(p(x0, 0, 12), p(x0 + 10, 0, 12), p(x0 + 10, 0, 17), p(x0, 0, 12)) + seg(p(x0, 22, 12), p(x0 + 10, 22, 12));
  });
  return (
    <svg viewBox="0 0 320 220" fill="none" className={className} aria-hidden>
      <g className="text-sky-300" strokeLinejoin="round" strokeLinecap="round">
        <path d={boxPath(p, 0, 0, 0, 40, 22, 12)} className="draw fill-ink-950" stroke="currentColor" strokeWidth="1.5" pathLength={1} style={d(0, "1.4s")} />
        <path d={roof.join("")} stroke="currentColor" strokeWidth="1.3" pathLength={1} className="draw" style={d(600, "1.2s")} />
        <path d={cylinder(p, 46, 6, 0, 14, 3, 3.6)} stroke="currentColor" strokeWidth="1.3" pathLength={1} className="draw" style={d(900, "1s")} />
        <g className="fade-in" style={d(1400)} stroke="currentColor" strokeWidth="1" opacity="0.7">
          <path d={seg(p(4, 22, 2), p(36, 22, 2), p(36, 22, 7), p(4, 22, 7), p(4, 22, 2))} />
          <path d={[8, 16, 24, 32].map((x) => seg(p(x, 22, 2), p(x, 22, 7))).join("")} />
          <path d={seg(p(40, 4, 3), p(40, 18, 3), p(40, 18, 8), p(40, 4, 8), p(40, 4, 3))} />
        </g>
      </g>
    </svg>
  );
}

/** Compact job shop: small workshop with a press brake and a workbench. */
export function JobShopGraphic({ className }: { className?: string }) {
  const p = makeIso(140, 90, 4.4);
  return (
    <svg viewBox="0 0 320 220" fill="none" className={className} aria-hidden>
      <g className="text-sky-300" strokeLinejoin="round" strokeLinecap="round">
        <path d={boxPath(p, 0, 0, 0, 24, 18, 9)} className="draw fill-ink-950" stroke="currentColor" strokeWidth="1.5" pathLength={1} style={d(0, "1.4s")} />
        <path d={seg(p(0, 0, 9), p(12, 0, 13), p(24, 0, 9)) + seg(p(0, 18, 9), p(12, 18, 13), p(24, 18, 9)) + seg(p(12, 0, 13), p(12, 18, 13))} stroke="currentColor" strokeWidth="1.3" pathLength={1} className="draw" style={d(500, "1.2s")} />
        <g className="fade-in" style={d(1200)} stroke="currentColor" strokeWidth="1">
          <path d={seg(p(3, 18, 0), p(3, 18, 6), p(10, 18, 6), p(10, 18, 0))} />
          <path d={seg(p(14, 18, 3), p(21, 18, 3), p(21, 18, 7), p(14, 18, 7), p(14, 18, 3))} opacity="0.7" />
        </g>
        {/* press brake */}
        <path d={boxPath(p, 28, 4, 0, 34, 14, 6)} className="fade-in fill-sky-400/15" stroke="currentColor" strokeWidth="1.3" style={d(1500)} />
        <path d={seg(p(28, 14, 6), p(28, 14, 11), p(34, 14, 11), p(34, 14, 6))} stroke="currentColor" strokeWidth="1.2" className="fade-in" style={d(1700)} />
      </g>
    </svg>
  );
}
