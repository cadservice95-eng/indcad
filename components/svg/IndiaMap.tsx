/**
 * Schematic India map: a simplified outline (equirectangular, corrected for
 * latitude), a faint graticule and the main service markets. Schematic only —
 * not a survey-accurate boundary and not to scale.
 */
const OUTLINE: [number, number][] = [
  [73.8, 36.9], [75.9, 36.6], [77.8, 35.5], [79.9, 35.2], [80.3, 34.3], [79.2, 33.0], [78.7, 32.4], [78.9, 31.8],
  [79.4, 31.0], [80.2, 30.5], [81.0, 30.2], [80.1, 28.8], [80.6, 28.5], [81.9, 27.9], [83.3, 27.4], [84.7, 27.0],
  [86.0, 26.6], [87.3, 26.4], [88.1, 26.5], [88.0, 27.4], [88.4, 27.9], [88.8, 28.1], [88.9, 27.3], [89.0, 26.8],
  [90.4, 26.9], [92.0, 26.9], [91.7, 27.8], [92.5, 28.2], [93.5, 28.7], [95.0, 29.3], [96.2, 29.2], [97.3, 28.3],
  [97.1, 27.5], [96.2, 27.3], [95.3, 26.4], [95.0, 26.0], [94.6, 25.2], [94.2, 23.9], [93.4, 23.0], [93.1, 22.2],
  [92.6, 21.95], [92.3, 22.9], [92.2, 23.7], [91.8, 23.1], [91.3, 23.0], [91.2, 23.9], [91.7, 24.2], [92.4, 24.5],
  [92.0, 25.1], [91.0, 25.15], [90.2, 25.2], [89.8, 25.3], [89.8, 26.0], [89.0, 26.3], [88.5, 26.2], [88.4, 25.5],
  [88.1, 24.8], [88.5, 24.1], [88.9, 23.6], [88.7, 23.1], [88.9, 22.4], [88.7, 21.6], [87.0, 21.4], [86.8, 20.8],
  [86.4, 20.2], [85.6, 19.7], [85.0, 19.3], [84.3, 18.6], [83.4, 17.8], [82.3, 16.6], [81.3, 16.0], [80.3, 15.5],
  [80.1, 14.0], [80.3, 13.1], [79.9, 11.6], [79.8, 10.3], [79.3, 9.3], [78.4, 8.9], [77.5, 8.1], [76.9, 8.6],
  [76.3, 9.8], [75.7, 11.3], [74.9, 12.8], [74.4, 14.4], [73.9, 15.6], [73.7, 17.0], [73.0, 18.9], [72.8, 20.2],
  [72.7, 21.0], [72.0, 20.8], [70.8, 20.7], [69.6, 21.6], [68.9, 22.3], [70.0, 22.9], [68.8, 23.6], [68.2, 23.7],
  [68.8, 24.3], [70.0, 24.2], [70.6, 25.6], [70.1, 26.5], [70.4, 27.7], [71.8, 28.0], [73.0, 29.0], [74.0, 29.7],
  [74.6, 31.0], [74.9, 31.6], [75.0, 32.3], [74.4, 32.8], [73.9, 33.5], [73.0, 34.2], [73.0, 35.3],
];

const X = (lon: number) => Math.round((lon - 68) * 9.3 * 10) / 10;
const Y = (lat: number) => Math.round((37.5 - lat) * 10 * 10) / 10;

const outlinePath = `M${OUTLINE.map(([lo, la]) => `${X(lo)} ${Y(la)}`).join("L")}Z`;

type Side = "l" | "r";
export const MAP_CITIES: { name: string; lon: number; lat: number; side: Side; slug?: string; lead?: number }[] = [
  { name: "Delhi NCR", lon: 77.2, lat: 28.6, side: "r", slug: "delhi-ncr" },
  { name: "Ahmedabad", lon: 72.57, lat: 23.03, side: "l", lead: 30 },
  { name: "Kolkata", lon: 88.36, lat: 22.57, side: "r", lead: 30 },
  { name: "Mumbai", lon: 72.88, lat: 19.08, side: "l", slug: "mumbai" },
  { name: "Pune", lon: 73.86, lat: 18.52, side: "r", slug: "pune" },
  { name: "Hyderabad", lon: 78.5, lat: 17.4, side: "r", slug: "hyderabad" },
  { name: "Bangalore", lon: 77.6, lat: 12.97, side: "l", slug: "bangalore", lead: 30 },
  { name: "Chennai", lon: 80.3, lat: 13.1, side: "r", slug: "chennai" },
];

export function IndiaMap({ className }: { className?: string }) {
  const grid: string[] = [];
  for (let lon = 70; lon <= 96; lon += 5) grid.push(`M${X(lon)} 0V${Y(6.5)}`);
  for (let lat = 10; lat <= 35; lat += 5) grid.push(`M0 ${Y(lat)}H${X(98)}`);

  return (
    <svg
      viewBox="-60 -8 360 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Schematic map of India marking Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Pune, Ahmedabad and Kolkata as markets served remotely"
    >
      <defs>
        <clipPath id="india-clip">
          <path d={outlinePath} />
        </clipPath>
        <pattern id="india-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V6" stroke="#38bdf8" strokeWidth="0.6" opacity="0.35" />
        </pattern>
      </defs>
      <path d={grid.join("")} stroke="#83aed3" strokeWidth="0.5" opacity="0.2" />
      <path d={outlinePath} fill="url(#india-hatch)" opacity="0.8" className="fade-in" style={{ "--d": "900ms" } as React.CSSProperties} />
      <path
        d={outlinePath}
        stroke="#7dd3fc"
        strokeWidth="1.3"
        strokeLinejoin="round"
        pathLength={1}
        className="draw"
        style={{ "--t": "2.8s" } as React.CSSProperties}
      />
      {MAP_CITIES.map((c, i) => {
        const x = X(c.lon);
        const y = Y(c.lat);
        const right = c.side === "r";
        const lead = c.lead ?? 8;
        return (
          <g key={c.name} className="fade-in" style={{ "--d": `${1600 + i * 140}ms` } as React.CSSProperties}>
            <circle cx={x} cy={y} r="3" fill="#d68a51" className="rch-pulse" style={{ "--d": `${i * 300}ms` } as React.CSSProperties} />
            <circle cx={x} cy={y} r="3" fill="#d68a51" />
            <circle cx={x} cy={y} r="7" stroke="#d68a51" strokeWidth="0.8" opacity="0.6" />
            <path d={right ? `M${x + 7} ${y}h${lead}` : `M${x - 7} ${y}h-${lead}`} stroke="#d68a51" strokeWidth="0.8" opacity="0.7" />
            <text
              x={right ? x + 11 + lead : x - 11 - lead}
              y={y + 3.5}
              textAnchor={right ? "start" : "end"}
              fill="#e2e8f0"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="0.6"
            >
              {c.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
