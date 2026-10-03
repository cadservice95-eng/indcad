import { IsoPart, type PartDelays } from "./IsoPart";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const DELAYS: PartDelays = { base: 2600, rise: 3000, boss: 3400, holes: 3800, mesh: 4100 };

/** Legacy 2D documentation on the left, current 3D model + documents on the right, linked by a bridge. */
export function LegacyVsCurrent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 880 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Split view: legacy 2D drawings and an older component on the left, a current 3D CAD model with updated documentation on the right, joined by a documentation bridge"
    >
      {/* LEGACY */}
      <rect x="10.5" y="10.5" width="380" height="296" stroke="#83aed3" strokeOpacity="0.3" />
      <text x="28" y="36" fill="#a8b8c8" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.8">LEGACY</text>
      <g className="text-steel-300">
        {/* old sheet */}
        <g className="fade-in" style={d(0)} transform="translate(34 62)">
          <rect width="170" height="130" stroke="currentColor" strokeOpacity="0.7" strokeDasharray="6 3" />
          <path d="M24 28h80v56H24zM40 44h48v24H40z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M20 106h130M20 116h86" stroke="currentColor" strokeOpacity="0.4" />
          <path d="M120 20l24 18M130 14l18 26" stroke="currentColor" strokeOpacity="0.35" />
        </g>
        <g className="fade-in" style={d(300)} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">
          <text x="34" y="214">2D CAD · OLDER STANDARD</text>
        </g>
        {/* older component */}
        <g className="fade-in" style={d(600)} transform="translate(262 124)">
          <path d="M0 -50l44 -25 44 25v50l-44 25-44 -25z" className="fill-steel-500/25" stroke="#a8b8c8" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="44" cy="-25" r="16" className="fill-ink-950" stroke="#a8b8c8" strokeWidth="1.4" />
          <path d="M18 -8l-8 6M70 -8l8 6" stroke="#a8b8c8" strokeOpacity="0.5" />
        </g>
        <text x="262" y="214" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1" className="fade-in" style={d(700)}>OLDER COMPONENT</text>
      </g>

      {/* BRIDGE */}
      <g className="fade-in text-copper-400" style={d(1400)}>
        <path d="M396 160H484" stroke="currentColor" strokeWidth="1.4" className="rch-flow" />
        <path d="M486 160l-7 -4v8z" fill="currentColor" />
        <circle cx="396" cy="160" r="3.2" fill="currentColor" className="rch-pulse" />
        <rect x="396" y="196" width="88" height="40" className="fill-ink-950" stroke="currentColor" strokeWidth="0.9" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="0.8" textAnchor="middle">
          <text x="440" y="212">DOCUMENTATION</text>
          <text x="440" y="226">BRIDGE</text>
        </g>
      </g>

      {/* CURRENT */}
      <rect x="490.5" y="10.5" width="380" height="296" stroke="#7dd3fc" strokeOpacity="0.5" />
      <text x="508" y="36" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.8">CURRENT</text>
      <g className="text-sky-300">
        <IsoPart ox={640} oy={168} s={1.2} delays={DELAYS} solid mesh={false} />
        <g className="fade-in" style={d(4400)}>
          <rect x="738" y="82" width="110" height="82" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.7" />
          <path d="M748 98h60M748 110h46M748 122h54M748 134h30" stroke="currentColor" strokeOpacity="0.45" />
          <path d="M814 98l10 0M814 134h24" stroke="#38bdf8" />
          <text x="748" y="156" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">REV. B · UPDATED</text>
        </g>
        <text x="508" y="290" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1" className="fade-in" style={d(4400)}>3D CAD · CURRENT STANDARD</text>
      </g>
    </svg>
  );
}
