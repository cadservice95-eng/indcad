import { useId } from "react";
import {
  W,
  H,
  LEVELS,
  existingContours,
  surveyPath,
  boundary,
  roadCentre,
  roadEdgeA,
  roadEdgeB,
  branch,
  bulb,
  lotsA,
  lotsB,
  easement,
  servicesLine,
  pipe,
  pits,
  outfall,
  catchments,
  gradingArrows,
  spotLevels,
  fmtRL,
  offsetPt,
} from "@/components/civil/geometry";

export type LayerId = "survey" | "terrain" | "boundary" | "lots" | "roads" | "easements" | "services" | "drainage" | "grading" | "labels";
export type Layers = Partial<Record<LayerId, number>>;

export const ALL_ON: Layers = { survey: 1, terrain: 1, boundary: 1, lots: 1, roads: 1, easements: 1, services: 1, drainage: 1, grading: 1, labels: 1 };

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const bandColor = (lv: number) => (lv < 109 ? "#5eead4" : lv < 114 ? "#38bdf8" : "#7dd3fc");

/**
 * Plan view of a synthetic site: survey points, contoured terrain, boundary,
 * road, lots, easement, services, drainage and grading. Layer opacities are
 * driven by props (interactive explorers) or staged in with `animate` (hero).
 * Decorative values, not project data.
 */
export function CivilSite({
  layers = ALL_ON,
  animate = false,
  className,
  title = "Plan view of a civil site model showing terrain contours, road, lots and drainage",
}: {
  layers?: Layers;
  animate?: boolean;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const op = (id: LayerId) => layers[id] ?? 0;
  const g = (id: LayerId, delay = 0): React.CSSProperties => ({
    opacity: op(id),
    transition: "opacity 0.5s ease",
    ...(animate ? ({ "--d": `${delay}ms` } as React.CSSProperties) : {}),
  });
  const fi = animate ? "fade-in" : "";
  const contours = existingContours();
  const tintId = `${uid}t`;
  const hatchId = `${uid}h`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title}>
      <defs>
        <radialGradient id={tintId}>
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V6" stroke="#d68a51" strokeWidth="0.8" opacity="0.7" />
        </pattern>
      </defs>

      {/* terrain: tint + contours + spot levels */}
      <g style={g("terrain", 1900)} className={fi}>
        <circle cx="140" cy="100" r="170" fill={`url(#${tintId})`} />
        <circle cx="500" cy="320" r="200" fill={`url(#${tintId})`} />
        <circle cx="570" cy="80" r="130" fill={`url(#${tintId})`} />
      </g>
      <g style={{ opacity: op("terrain"), transition: "opacity 0.5s ease" }}>
        {LEVELS.map((lv, i) =>
          contours[lv] ? (
            <path
              key={lv}
              d={contours[lv]}
              stroke={bandColor(lv)}
              strokeWidth={i % 4 === 0 ? 1.2 : 0.7}
              opacity={i % 4 === 0 ? 0.85 : 0.5}
              strokeLinejoin="round"
              pathLength={1}
              className={animate ? "draw" : ""}
              style={animate ? d(900 + i * 110, "1.4s") : undefined}
            />
          ) : null,
        )}
      </g>

      {/* survey points */}
      <g style={g("survey", 0)} className={animate ? "fade-in" : ""}>
        <path d={surveyPath} stroke="#e2e8f0" strokeWidth="0.9" opacity="0.8" />
      </g>

      {/* boundary */}
      <g style={g("boundary", 2800)} className={fi}>
        <path d={boundary} stroke="#7dd3fc" strokeWidth="1.4" strokeDasharray="10 3 2 3" pathLength={1} />
      </g>

      {/* lots + easement */}
      <g style={g("easements", 4600)} className={fi}>
        <path d={easement} fill={`url(#${hatchId})`} stroke="#d68a51" strokeWidth="0.8" strokeDasharray="4 3" />
      </g>
      <g style={g("lots", 3900)} className={fi}>
        {[...lotsA, ...lotsB].map((l, i) => (
          <path
            key={i}
            d={l.d}
            stroke="#7dd3fc"
            strokeWidth="1"
            fill="rgba(56,189,248,0.05)"
            pathLength={1}
            className={animate ? "draw" : ""}
            style={animate ? d(3900 + i * 90, "0.8s") : undefined}
          />
        ))}
      </g>

      {/* roads */}
      <g style={g("roads", 3300)} className={fi}>
        <path d={roadCentre} stroke="rgba(226,232,240,0.12)" strokeWidth="26" strokeLinecap="round" />
        <path d={branch} stroke="rgba(226,232,240,0.12)" strokeWidth="22" strokeLinecap="round" />
        <circle cx={bulb[0]} cy={bulb[1]} r="17" fill="rgba(226,232,240,0.12)" />
        <path d={roadEdgeA} stroke="#e2e8f0" strokeWidth="1.2" pathLength={1} className={animate ? "draw" : ""} style={animate ? d(3300, "1.6s") : undefined} />
        <path d={roadEdgeB} stroke="#e2e8f0" strokeWidth="1.2" pathLength={1} className={animate ? "draw" : ""} style={animate ? d(3400, "1.6s") : undefined} />
        <path d={roadCentre} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="10 8" opacity="0.7" />
      </g>

      {/* services corridor */}
      <g style={g("services", 5200)} className={fi}>
        <path d={servicesLine} stroke="#d68a51" strokeWidth="1.2" strokeDasharray="2 4" />
      </g>

      {/* drainage */}
      <g style={g("drainage", 5200)} className={fi}>
        {catchments.map((c, i) => (
          <path key={i} d={c} stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="5 4" fill="rgba(56,189,248,0.04)" opacity="0.7" />
        ))}
        <path d={pipe} stroke="#38bdf8" strokeWidth="2.4" strokeLinejoin="round" pathLength={1} className={animate ? "draw" : ""} style={animate ? d(5200, "1.4s") : undefined} />
        <path d={pipe} stroke="#e0f2fe" strokeWidth="1.4" strokeDasharray="3 9" className="rch-flow" />
        {pits.map((p, i) => (
          <rect key={i} x={p[0] - 4} y={p[1] - 4} width="8" height="8" className="fill-ink-950" stroke="#38bdf8" strokeWidth="1.3" />
        ))}
        <path d={`M${outfall[0]} ${outfall[1] - 7}l8 12h-16z`} fill="#38bdf8" />
      </g>

      {/* grading arrows */}
      <g style={g("grading", 6000)} className={fi}>
        {gradingArrows.map((a, i) => (
          <g key={i} transform={`translate(${a.x} ${a.y}) rotate(${a.ang.toFixed(0)})`}>
            <path d="M-12 0H10M4 -4l6 4-6 4" stroke="#d68a51" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </g>

      {/* labels + elevation markers */}
      <g style={g("labels", 6600)} className={`${fi} max-sm:hidden`}>
        <g fill="#e2e8f0" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">
          {spotLevels.map((s, i) => (
            <g key={i}>
              <path d={`M${s.x - 4} ${s.y}h8M${s.x} ${s.y - 4}v8`} stroke="#e2e8f0" strokeWidth="0.9" />
              <text x={s.x + 7} y={s.y - 5}>RL {fmtRL(s.x, s.y)}</text>
            </g>
          ))}
          <text x={lotsA[1].label[0] - 18} y={lotsA[1].label[1] + 3}>LOT 01</text>
          <text x={offsetPt(0.22, 18)[0] - 12} y={offsetPt(0.22, 18)[1] + 22}>Ø 450</text>
          <text x="40" y="214" fill="#7dd3fc">ALIGNMENT</text>
          <text x="560" y="372" fill="#7dd3fc">SURFACE</text>
          <text x="470" y="64" fill="#d68a51">GRADING</text>
          <text x={offsetPt(0.7, 18)[0]} y={offsetPt(0.7, 18)[1] - 12} fill="#38bdf8">STORMWATER</text>
        </g>
        <g transform="translate(34 372)" stroke="#e2e8f0" strokeWidth="1">
          <circle r="7" />
          <path d="M-12 0h24M0 -12v24" />
          <text x="14" y="4" fill="#e2e8f0" stroke="none" fontFamily="var(--font-mono)" fontSize="9">DATUM</text>
        </g>
      </g>
    </svg>
  );
}
