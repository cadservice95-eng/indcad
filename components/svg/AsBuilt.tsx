"use client";

import { useId } from "react";

const mono = { fontFamily: "var(--font-mono)" } as const;

export const STATES = {
  confirmed: { label: "Confirmed", color: "#22c55e" },
  inferred: { label: "Inferred", color: "#38bdf8" },
  verify: { label: "Requires verification", color: "#f59e0b" },
} as const;

const markers: { x: number; y: number; state: keyof typeof STATES; tag: string }[] = [
  { x: 495, y: 180, state: "confirmed", tag: "PANEL MOVED" },
  { x: 330, y: 135, state: "inferred", tag: "CABLE ROUTE" },
  { x: 595, y: 150, state: "confirmed", tag: "CIRCUIT ADDED" },
  { x: 270, y: 262, state: "verify", tag: "EQUIPMENT CHANGED" },
];

/**
 * Design layer vs as-built layer of a small installation. `split` (0–1) is how
 * much of the width shows the as-built layer. Markers show confirmed / inferred /
 * requires-verification information. Illustrative.
 */
export function AsBuilt({ split = 0.5, showMarkers = true, className }: { split?: number; showMarkers?: boolean; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const x = Math.round(split * 640);
  return (
    <svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="An installation shown as designed and as built, with added circuit, moved panel, changed cable route and modified equipment, each marked as confirmed, inferred or requiring verification" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={id}><rect x="0" y="0" width={x} height="360" /></clipPath>
      </defs>
      <rect x="0.5" y="0.5" width="639" height="359" stroke="#83aed3" strokeOpacity="0.25" />

      {/* design layer */}
      <g stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4">
        <rect x="60" y="60" width="110" height="60" className="fill-ink-950" />
        <rect x="400" y="60" width="110" height="60" className="fill-ink-950" />
        <path d="M170 90H400M455 120V262H300" />
        <rect x="240" y="242" width="60" height="40" className="fill-ink-950" />
      </g>
      <g fill="#94a3b8" fontSize="9" letterSpacing="1" style={mono}>
        <text x="68" y="78">P-01</text><text x="408" y="78">P-02</text><text x="248" y="236">E-01</text>
        <text x="520" y="340">DESIGN</text>
      </g>

      {/* as-built layer */}
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="640" height="360" className="fill-ink-950" />
        <g stroke="#e2e8f0" strokeWidth="1.8">
          <rect x="60" y="60" width="110" height="60" className="fill-ink-950" />
          <rect x="440" y="150" width="110" height="60" className="fill-ink-950" />
          <path d="M170 90H330V180H440M495 210V262H296M550 180H592" />
          <circle cx="270" cy="262" r="26" className="fill-ink-950" />
          <circle cx="606" cy="180" r="14" className="fill-ink-950" />
        </g>
        <g fill="#e2e8f0" fontSize="9" letterSpacing="1" style={mono}>
          <text x="68" y="78">P-01</text><text x="448" y="168">P-02</text><text x="256" y="266">E-01*</text><text x="598" y="184">L7</text>
          <text x="20" y="340">AS-BUILT</text>
        </g>
        {showMarkers
          ? markers.map((m) => (
              <g key={m.tag} transform={`translate(${m.x} ${m.y})`}>
                <circle r="13" fill={STATES[m.state].color} fillOpacity="0.15" stroke={STATES[m.state].color} strokeWidth="1.4" strokeDasharray={m.state === "inferred" ? "3 2" : undefined} />
                <circle r="3" fill={STATES[m.state].color} />
                <text x="18" y="-14" fill={STATES[m.state].color} fontSize="8.5" letterSpacing="0.8" style={mono}>{m.tag}</text>
              </g>
            ))
          : null}
      </g>

      {/* split handle */}
      <path d={`M${x} 0V360`} stroke="#f8fafc" strokeWidth="1.4" />
      <g transform={`translate(${x} 180)`}>
        <rect x="-12" y="-14" width="24" height="28" className="fill-ink-950" stroke="#f8fafc" />
        <path d="M-4 -5l-5 5 5 5M4 -5l5 5-5 5" stroke="#f8fafc" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
