import { CivilSite, ALL_ON } from "./CivilSite";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function Chip({ x, y, w, text, delay, color = "#7dd3fc" }: { x: number; y: number; w: number; text: string; delay: number; color?: string }) {
  return (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={w} height={20} className="fill-ink-950/85" stroke={color} strokeWidth="0.8" />
      <text x={x + 8} y={y + 14} fill={color} fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">{text}</text>
    </g>
  );
}

const sheets = [
  ["C-001", "SITE PLAN"],
  ["C-101", "GRADING PLAN"],
  ["C-201", "STORMWATER"],
  ["C-301", "ROAD DESIGN"],
];

/**
 * Hero: a Civil 3D–style viewport. Survey points appear, contours generate,
 * boundary, road, lots, drainage and grading follow, then the sheet list.
 */
export function CivilHeroTerrain({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Civil 3D style site model: survey points, contours, road alignment, lots, stormwater network and grading arrows with a drawing sheet list"
    >
      <rect x="0.5" y="0.5" width="639" height="559" stroke="#83aed3" strokeOpacity="0.25" />
      <path d="M0 24V0h24M616 0h24v24M640 536v24h-24M24 560H0v-24" stroke="#38bdf8" strokeWidth="2" />

      <g className="par-a">
        <svg x="0" y="70" width="640" height="420" viewBox="0 0 640 420" overflow="visible">
          <CivilSite layers={ALL_ON} animate title="" />
        </svg>
      </g>

      <g className="max-sm:hidden">
        <Chip x={36} y={30} w={96} text="CIVIL 3D" delay={6500} />
        <Chip x={140} y={30} w={86} text="SURFACE" delay={6600} />
        <Chip x={234} y={30} w={102} text="ALIGNMENT" delay={6700} />
        <Chip x={344} y={30} w={96} text="GRADING" delay={6800} color="#d68a51" />
        <Chip x={448} y={30} w={128} text="STORMWATER" delay={6900} color="#38bdf8" />
      </g>

      {/* drawing sheet list */}
      <g className="fade-in text-steel-300" style={d(7000)}>
        <rect x="396" y="456" width="228" height="86" className="fill-ink-950/80" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M396 472h228" stroke="currentColor" strokeOpacity="0.4" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="404" y="466" fill="#7dd3fc">SHEET INDEX · ILLUSTRATIVE</text>
          {sheets.map(([n, t], i) => (
            <g key={n}>
              <text x="404" y={488 + i * 15}>{n}</text>
              <text x="450" y={488 + i * 15}>{t}</text>
            </g>
          ))}
        </g>
      </g>

      {/* camera readout */}
      <g className="fade-in text-steel-300 max-sm:hidden" style={d(6900)} fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
        <text x="36" y="508">VIEW · PLAN</text>
        <text x="36" y="522" opacity="0.7">UNITS · M</text>
        <text x="36" y="536" opacity="0.7">DATUM · ILLUSTRATIVE</text>
      </g>
    </svg>
  );
}
