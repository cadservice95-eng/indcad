import { CivilSite } from "./CivilSite";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;

const tree = ["Surfaces", "Alignments", "Profiles", "Corridors", "Pipe networks", "Sheets"];
const props: [string, string][] = [
  ["Station", "0+240.00"],
  ["Elevation", "108.62"],
  ["Grade", "−2.1 %"],
  ["Surface", "Proposed"],
];

/** Original Civil-CAD-style workspace illustration (not a reproduction of any product UI). */
export function Civil3DVisualization({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 880 440" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Civil CAD workspace showing a model tree, a site viewport with surface, alignment and pipe network, a profile strip and a properties panel">
      <rect x="0.5" y="0.5" width="879" height="439" className="fill-ink-950" stroke="#83aed3" strokeOpacity="0.35" />
      {/* top bar */}
      <path d="M0 30h880" stroke="#83aed3" strokeOpacity="0.3" />
      <g fill="#7dd3fc" fontSize="9.5" letterSpacing="1.2" style={mono} className="fade-in">
        <text x="16" y="20">CIVIL MODEL · ILLUSTRATIVE</text>
        {["PLAN", "PROFILE", "3D"].map((t, i) => (
          <g key={t}>
            <rect x={620 + i * 80} y="6" width="70" height="18" fill="none" stroke={i === 0 ? "#d68a51" : "#83aed3"} strokeOpacity={i === 0 ? 1 : 0.4} />
            <text x={655 + i * 80} y="19" textAnchor="middle" fill={i === 0 ? "#d68a51" : "#7dd3fc"}>{t}</text>
          </g>
        ))}
      </g>

      {/* model tree */}
      <g className="fade-in" style={d(300)}>
        <rect x="10" y="40" width="170" height="388" stroke="#83aed3" strokeOpacity="0.3" />
        <text x="22" y="60" fill="#7dd3fc" fontSize="9.5" letterSpacing="1.4" style={mono}>MODEL TREE</text>
        {tree.map((t, i) => (
          <g key={t} transform={`translate(22 ${86 + i * 34})`}>
            <path d="M0 -4h8" stroke="#83aed3" />
            <rect x="12" y="-10" width="8" height="8" stroke="#38bdf8" />
            <text x="28" y="-2" fill="#e2e8f0" fontSize="11">{t}</text>
          </g>
        ))}
      </g>

      {/* viewport */}
      <rect x="190.5" y="40.5" width="500" height="292" stroke="#83aed3" strokeOpacity="0.3" />
      <svg x="194" y="44" width="492" height="284" viewBox="0 0 640 420" preserveAspectRatio="xMidYMid slice">
        <CivilSite layers={{ terrain: 1, roads: 1, lots: 0.6, boundary: 1, drainage: 1, grading: 0.5, labels: 1 }} animate title="" />
      </svg>
      <g className="fade-in" style={d(2000)}>
        {[["SURFACE", 206, 58, "#7dd3fc"], ["ALIGNMENT", 206, 82, "#e2e8f0"], ["PIPE NETWORK", 206, 106, "#38bdf8"]].map(([t, x, y, c]) => (
          <g key={String(t)}>
            <rect x={Number(x)} y={Number(y)} width={String(t).length * 7 + 14} height="18" className="fill-ink-950/90" stroke={String(c)} strokeWidth="0.8" />
            <text x={Number(x) + 7} y={Number(y) + 12.5} fill={String(c)} fontSize="9.5" letterSpacing="1" style={mono}>{t}</text>
          </g>
        ))}
      </g>

      {/* profile strip */}
      <g className="fade-in" style={d(1200)}>
        <rect x="190.5" y="340.5" width="500" height="88" stroke="#83aed3" strokeOpacity="0.3" />
        <path d="M200 410C260 392 300 372 360 380S470 400 520 372 620 360 680 380" stroke="#5eead4" strokeWidth="1.4" strokeDasharray="5 3" />
        <path d="M200 400L360 376Q420 366 480 384L680 366" stroke="#38bdf8" strokeWidth="2" />
        <text x="200" y="356" fill="#7dd3fc" fontSize="9.5" letterSpacing="1.2" style={mono}>PROFILE · EXISTING / PROPOSED</text>
      </g>

      {/* properties */}
      <g className="fade-in" style={d(900)}>
        <rect x="700.5" y="40.5" width="170" height="388" stroke="#83aed3" strokeOpacity="0.3" />
        <text x="712" y="60" fill="#7dd3fc" fontSize="9.5" letterSpacing="1.4" style={mono}>PROPERTIES</text>
        {props.map(([k, v], i) => (
          <g key={k} transform={`translate(712 ${88 + i * 36})`}>
            <text fill="#a8b8c8" fontSize="9.5" letterSpacing="1" style={mono}>{k.toUpperCase()}</text>
            <text y="16" fill="#e2e8f0" fontSize="12" style={mono}>{v}</text>
            <path d="M0 24h146" stroke="#83aed3" strokeOpacity="0.2" />
          </g>
        ))}
        <rect x="712" y="250" width="146" height="60" stroke="#d68a51" strokeOpacity="0.6" strokeDasharray="3 3" />
        <text x="722" y="274" fill="#d68a51" fontSize="9.5" letterSpacing="1" style={mono}>CORRIDOR</text>
        <text x="722" y="292" fill="#a8b8c8" fontSize="9" letterSpacing="1" style={mono}>REBUILD · OK</text>
      </g>
    </svg>
  );
}
