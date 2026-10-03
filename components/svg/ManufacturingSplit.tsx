import { IsoPart, type PartDelays } from "./IsoPart";
import { DimensionLine } from "./DimensionLines";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const DELAYS: PartDelays = { base: 100, rise: 600, boss: 1000, holes: 1400, mesh: 1700 };

/** CAD model on the left, the manufacturing drawing it produces on the right. */
export function ManufacturingSplit({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 780 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Split view: a 3D CAD model beside the manufacturing drawing produced from it, with dimensions, material and finish call-outs and a bill of materials"
    >
      {/* left: CAD model */}
      <rect x="10.5" y="10.5" width="340" height="300" stroke="#83aed3" strokeOpacity="0.3" />
      <text x="26" y="34" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.6">CAD MODEL</text>
      <g className="text-sky-300">
        <IsoPart ox={160} oy={150} s={1.15} delays={DELAYS} solid mesh={false} />
      </g>

      {/* connector */}
      <g className="fade-in text-copper-400" style={d(1800)}>
        <path d="M356 160h60" stroke="currentColor" strokeWidth="1.4" className="rch-flow" />
        <path d="M418 160l-7 -4v8z" fill="currentColor" />
        <circle cx="356" cy="160" r="3" fill="currentColor" className="rch-pulse" />
      </g>

      {/* right: manufacturing drawing */}
      <g className="text-sky-200">
        <rect x="424.5" y="10.5" width="345" height="300" stroke="currentColor" strokeOpacity="0.6" />
        <text x="440" y="34" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.6">MANUFACTURING DRAWING</text>
        {/* front view */}
        <path d="M470 168V150h40v-34h54v34h40v18z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw" style={d(1900, "1.4s")} />
        <path d="M526 116v52M548 116v52" stroke="#7dd3fc" strokeDasharray="4 3" opacity="0.7" className="fade-in" style={d(2600)} />
        <DimensionLine x1={470} y1={168} x2={604} y2={168} offset={22} label="125" delay={2800} />
        <DimensionLine x1={470} y1={168} x2={470} y2={116} offset={-18} label="42" delay={3000} />
        <g className="fade-in" style={d(3300)} fill="currentColor" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="0.6">
          <text x="622" y="132">MATERIAL · AS SPECIFIED</text>
          <text x="622" y="148">FINISH · AS SPECIFIED</text>
          <text x="622" y="164">GENERAL TOL · PER STD</text>
        </g>
        {/* BOM */}
        <g className="fade-in" style={d(3600)}>
          <rect x="440" y="226" width="318" height="70" stroke="currentColor" strokeOpacity="0.6" />
          <path d="M440 242h318M440 258h318M440 274h318M474 226v70M690 226v70" stroke="currentColor" strokeOpacity="0.4" />
          <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
            <text x="446" y="238">ITEM</text><text x="482" y="238">DESCRIPTION</text><text x="698" y="238">QTY</text>
            <text x="450" y="254">01</text><text x="482" y="254">FLANGED BRACKET</text><text x="702" y="254">1</text>
            <text x="450" y="270">02</text><text x="482" y="270">HEX BOLT</text><text x="702" y="270">4</text>
            <text x="450" y="286">03</text><text x="482" y="286">WASHER</text><text x="702" y="286">4</text>
          </g>
        </g>
      </g>
    </svg>
  );
}
