import { W, H, LEVELS, existingContours, proposedContours, tinPath, pointCloud, gradingArrows } from "@/components/civil/geometry";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const bandColor = (lv: number) => (lv < 109 ? "#5eead4" : lv < 114 ? "#38bdf8" : "#7dd3fc");

function Contours({ proposed = false, delay = 0, animate = true, width = 1.2 }: { proposed?: boolean; delay?: number; animate?: boolean; width?: number }) {
  const paths = proposed ? proposedContours() : existingContours();
  return (
    <>
      {LEVELS.map((lv, i) =>
        paths[lv] ? (
          <path
            key={lv}
            d={paths[lv]}
            stroke={bandColor(lv)}
            strokeWidth={i % 4 === 0 ? width * 1.5 : width}
            vectorEffect="non-scaling-stroke"
            opacity={i % 4 === 0 ? 0.9 : 0.55}
            pathLength={1}
            className={animate ? "draw" : ""}
            style={animate ? d(delay + i * 90, "1.2s") : undefined}
          />
        ) : null,
      )}
    </>
  );
}

function Panel({ x, y, w, h, title, delay, children, vb = `0 0 ${W} ${H}` }: { x: number; y: number; w: number; h: number; title: string; delay: number; children: React.ReactNode; vb?: string }) {
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={w} height={h} stroke="#83aed3" strokeOpacity="0.3" />
      <svg x={x + 6} y={y + 6} width={w - 12} height={h - 12} viewBox={vb} overflow="hidden" preserveAspectRatio="xMidYMid meet" className="text-sky-300">
        {children}
      </svg>
      <text x={x + 12} y={y + h + 20} fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2" className="fade-in" style={d(delay)}>
        {title}
      </text>
    </g>
  );
}

function Arrow({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g className="fade-in text-copper-400" style={d(delay)}>
      <path d={`M${x} ${y}h22`} stroke="currentColor" strokeWidth="1.3" className="rch-flow" />
      <path d={`M${x + 24} ${y}l-6 -3.5v7z`} fill="currentColor" />
    </g>
  );
}

const pts = pointCloud(16, 10, W, H);
const tin = tinPath(14, 9, W, H * 0.9, 3.2, 120);

/** Five-step terrain build: survey points → surface → contours → grading → drawings. */
export function TerrainBuild({ className }: { className?: string }) {
  const pw = 160;
  const gap = 20;
  return (
    <svg viewBox="0 0 880 250" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Terrain build-up from survey points to a surface mesh, contours, grading and civil drawings">
      {[0, 1, 2, 3].map((i) => (
        <Arrow key={i} x={pw + i * (pw + gap) - 2} y={90} delay={800 + i * 900} />
      ))}
      <Panel x={0} y={20} w={pw} h={140} title="01 · SURVEY POINTS" delay={0}>
        <g stroke="#e2e8f0" strokeWidth="1.6" className="fade-in" style={d(0)}>
          {pts.map(([px, py], i) => (
            <path key={i} d={`M${px - 4} ${py - 4}l8 8M${px + 4} ${py - 4}l-8 8`} />
          ))}
        </g>
      </Panel>
      <Panel x={pw + gap} y={20} w={pw} h={140} title="02 · TIN / SURFACE" delay={900}>
        <path d={tin} stroke="#38bdf8" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} className="draw" style={d(900, "1.6s")} />
      </Panel>
      <Panel x={(pw + gap) * 2} y={20} w={pw} h={140} title="03 · CONTOURS" delay={1800}>
        <Contours delay={1800} />
      </Panel>
      <Panel x={(pw + gap) * 3} y={20} w={pw} h={140} title="04 · GRADING" delay={2700}>
        <Contours proposed delay={2700} />
        <g className="fade-in" style={d(3600)}>
          {gradingArrows.map((a, i) => (
            <g key={i} transform={`translate(${a.x} ${a.y}) rotate(${a.ang.toFixed(0)})`}>
              <path d="M-22 0H18M8 -8l10 8-10 8" stroke="#d68a51" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      </Panel>
      <g>
        <rect x={(pw + gap) * 4 + 0.5} y="20.5" width={pw} height="140" stroke="#7dd3fc" strokeOpacity="0.55" />
        <g className="fade-in text-sky-200" style={d(3600)}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${(pw + gap) * 4 + 30 + i * 10} ${40 + i * 10})`}>
              <rect width="90" height="78" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.8" />
              <path d="M8 12h40M8 22h30M8 62h74" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M12 30l16 6 18-8 16 10v14H12z" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            </g>
          ))}
        </g>
        <text x={(pw + gap) * 4 + 12} y="180" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2" className="fade-in" style={d(3600)}>05 · CIVIL DRAWINGS</text>
      </g>
    </svg>
  );
}

/** Close-up triptych: survey points → triangulated surface → contour map, with technical labels. */
export function SurveyToTerrain({ className }: { className?: string }) {
  const pw = 250;
  const gap = 55;
  const tag = (x: number, y: number, t: string, delay: number, color = "#7dd3fc") => (
    <g className="fade-in" style={d(delay)}>
      <rect x={x} y={y} width={t.length * 7.4 + 14} height="20" className="fill-ink-950" stroke={color} strokeWidth="0.8" />
      <text x={x + 7} y={y + 14} fill={color} fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">{t}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 880 330" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Survey points are triangulated into a terrain surface and then contoured">
      <Arrow x={pw + 14} y={140} delay={900} />
      <Arrow x={pw * 2 + gap + 14} y={140} delay={2200} />
      <Panel x={0} y={20} w={pw} h={230} title="SURVEY POINTS" delay={0}>
        <g stroke="#e2e8f0" strokeWidth="2" className="fade-in" style={d(0)}>
          {pts.map(([px, py], i) => (
            <path key={i} d={`M${px - 5} ${py - 5}l10 10M${px + 5} ${py - 5}l-10 10`} />
          ))}
        </g>
      </Panel>
      <Panel x={pw + gap} y={20} w={pw} h={230} title="TRIANGULATED SURFACE" delay={1100}>
        <path d={tin} stroke="#38bdf8" strokeWidth="1.1" vectorEffect="non-scaling-stroke" pathLength={1} className="draw" style={d(1100, "2s")} />
      </Panel>
      <Panel x={(pw + gap) * 2} y={20} w={pw} h={230} title="CONTOUR MAP" delay={2400}>
        <Contours delay={2400} width={1.4} />
      </Panel>
      {tag(14, 30, "POINT", 600, "#e2e8f0")}
      {tag(14, 56, "ELEVATION", 800, "#e2e8f0")}
      {tag(pw + gap + 8, 30, "SURFACE", 1500)}
      {tag((pw + gap) * 2 + 8, 30, "CONTOUR", 2800)}
      {tag((pw + gap) * 2 + 8, 56, "GRADE", 3000, "#d68a51")}
    </svg>
  );
}

export { Contours };
