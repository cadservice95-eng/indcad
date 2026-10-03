import { useId } from "react";
import { makeIso, loop } from "@/components/svg/iso";
import { ROOMS, mono } from "@/components/arch/model";

/* One illustrative building drawn as an elevation. The same geometry is shown as drawing → model → materials → lighting → final. */

export type Stage = 0 | 1 | 2 | 3 | 4;
export const STAGES = ["Drawing", "Model", "Materials", "Lighting", "Final"] as const;
export type TimeId = "morning" | "day" | "golden" | "dusk" | "night";
export type Zone = "timber" | "stone" | "concrete" | "glass" | "metal";
export type PaletteId = "A" | "B" | "C";

export const TIMES: Record<TimeId, { label: string; sky: [string, string]; ground: string; sun: [number, number]; sunColor: string; shade: number; glow: number; tint: string; ti: number }> = {
  morning: { label: "Morning", sky: ["#BBD6F0", "#F7E0C2"], ground: "#9AA39B", sun: [80, 150], sunColor: "#FFE3B0", shade: 0.18, glow: 0, tint: "#FFD9A8", ti: 0.1 },
  day: { label: "Day", sky: ["#7FBDEB", "#DDEEFB"], ground: "#8E9992", sun: [330, 46], sunColor: "#FFFBE6", shade: 0.14, glow: 0, tint: "#FFFFFF", ti: 0 },
  golden: { label: "Golden hour", sky: ["#F0A25B", "#F9DDA6"], ground: "#8B8577", sun: [590, 200], sunColor: "#FFD08A", shade: 0.3, glow: 0.12, tint: "#FFB867", ti: 0.18 },
  dusk: { label: "Dusk", sky: ["#34447A", "#E8987A"], ground: "#5E6270", sun: [596, 276], sunColor: "#FFB48A", shade: 0.42, glow: 0.65, tint: "#6D7DB8", ti: 0.2 },
  night: { label: "Night", sky: ["#08101F", "#1B2B4D"], ground: "#222B3B", sun: [540, 70], sunColor: "#E6EEF9", shade: 0.55, glow: 1, tint: "#1E3A6B", ti: 0.28 },
};

export const PALETTES: Record<PaletteId, { name: string; timber: string; stone: string; concrete: string; metal: string; glass: string }> = {
  A: { name: "Option A", timber: "#B08457", stone: "#CFC7BA", concrete: "#BDBDB8", metal: "#3B4350", glass: "#A9CBE6" },
  B: { name: "Option B", timber: "#6A4A33", stone: "#8E8A83", concrete: "#D8D7D2", metal: "#1F2937", glass: "#8DB4D2" },
  C: { name: "Option C", timber: "#D9BC8E", stone: "#EDEAE3", concrete: "#9AA2AE", metal: "#B58B34", glass: "#B9D7EC" },
};

const G = 320;
const R: Record<Zone, [number, number, number, number][]> = {
  timber: [[150, 130, 200, 85]],
  stone: [[150, 215, 200, 105]],
  concrete: [[350, 210, 170, 110]],
  metal: [[138, 121, 224, 9], [348, 201, 194, 9], [262, 238, 62, 5]],
  glass: [[170, 150, 160, 45], [170, 235, 90, 77], [275, 250, 30, 70], [365, 225, 140, 87]],
};
const ZONES = Object.keys(R) as Zone[];

type Frame = { x: number; y: number; w: number; h: number; label?: string };

export function BuildingScene({
  stage, palette = "A", time = "day", season = "summer", hi = null, frame, animate, className, title, view,
}: {
  stage: Stage; palette?: PaletteId; time?: TimeId; season?: "summer" | "autumn"; hi?: Zone | null; frame?: Frame | null; animate?: boolean; className?: string; title: string; view?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const P = PALETTES[palette];
  const T = TIMES[time];
  const o = (min: number, max = 9) => ({ opacity: stage >= min && stage <= max ? 1 : 0, transition: "opacity 0.9s ease" }) as React.CSSProperties;
  const sunLeft = T.sun[0] < 320;
  const shadowD = time === "night" ? 0 : (sunLeft ? 1 : -1) * (40 + T.shade * 150);
  const leaves = season === "autumn" ? ["#C9772E", "#B4521F"] : ["#4F7A52", "#3E6444"];
  const fill = (z: Zone) => (z === "glass" ? P.glass : P[z]);
  const glowing = T.glow > 0.3;

  const outlines = ZONES.flatMap((z) => R[z].map((r, i) => ({ z, i, r })));
  const dims = (
    <g fontSize="8" style={mono}>
      <path d={`M150 346H350M350 346H520M150 342V350M350 342V350M520 342V350`} />
      <text x="250" y="358" textAnchor="middle" stroke="none">6000</text><text x="435" y="358" textAnchor="middle" stroke="none">5100</text>
      <path d={`M128 130V320M124 130H132M124 320H132`} /><text x="122" y="228" textAnchor="end" stroke="none">5700</text>
    </g>
  );

  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round" data-view={view}>
      <title>{title}</title>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T.sky[0]} /><stop offset="1" stopColor={T.sky[1]} /></linearGradient>
        <linearGradient id={`${uid}-shade`} x1={sunLeft ? 0 : 1} y1="0" x2={sunLeft ? 1 : 0} y2="0"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#0B1220" stopOpacity={T.shade} /></linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="0.5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.2" /></linearGradient>
        <radialGradient id={`${uid}-sun`}><stop offset="0" stopColor={T.sunColor} stopOpacity="0.95" /><stop offset="1" stopColor={T.sunColor} stopOpacity="0" /></radialGradient>
        <pattern id={`${uid}-timber`} width="8" height="40" patternUnits="userSpaceOnUse"><path d="M2 0V40M6 0V40" stroke="#000" strokeOpacity="0.18" strokeWidth="1" /></pattern>
        <pattern id={`${uid}-stone`} width="30" height="14" patternUnits="userSpaceOnUse"><path d="M0 0.5H30M0 7.5H30M15 0V7M0 7V14M30 7V14" stroke="#000" strokeOpacity="0.16" strokeWidth="0.8" /></pattern>
        <pattern id={`${uid}-conc`} width="60" height="30" patternUnits="userSpaceOnUse"><path d="M0 0.5H60M30 0V30" stroke="#000" strokeOpacity="0.12" strokeWidth="0.8" /></pattern>
      </defs>

      {/* backgrounds */}
      <rect width="640" height="400" fill="#0B1B33" style={o(0, 0)} />
      <g style={o(1)}><rect width="640" height="400" fill="#E9EEF4" /></g>
      <g style={o(3)}><rect width="640" height={G} fill={`url(#${uid}-sky)`} /><rect y={G} width="640" height="80" fill={T.ground} />
        {time === "night" ? [[60, 40], [140, 90], [260, 30], [420, 60], [500, 28], [590, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity="0.8" />) : null}
      </g>
      <g style={o(1, 2)}><rect y={G} width="640" height="80" fill="#D4DBE3" /></g>
      <path d={`M0 ${G}H640`} stroke="#0B1220" strokeWidth="1.4" opacity={stage >= 1 ? 0.55 : 0} />

      {/* sun / moon */}
      <g style={o(3)}>
        <circle cx={T.sun[0]} cy={T.sun[1]} r={time === "night" ? 26 : 70} fill={`url(#${uid}-sun)`} />
        <circle cx={T.sun[0]} cy={T.sun[1]} r={time === "night" ? 10 : 14} fill={T.sunColor} />
      </g>

      {/* context (final) */}
      <g style={o(4)}>
        <g fill={time === "night" ? "#17233B" : "#B8C4D2"} opacity="0.85"><rect x="0" y="210" width="70" height="110" /><rect x="70" y="240" width="46" height="80" /><rect x="545" y="230" width="60" height="90" /><rect x="605" y="200" width="35" height="120" /></g>
        {[[96, 0.9], [570, 1.1]].map(([x, s], i) => (
          <g key={i} transform={`translate(${x} ${G}) scale(${s})`}><rect x="-3" y="-60" width="6" height="60" fill="#5A4636" /><circle cy="-80" r="30" fill={leaves[0]} /><circle cx="-14" cy="-64" r="20" fill={leaves[1]} /><circle cx="16" cy="-66" r="18" fill={leaves[1]} /></g>
        ))}
        <path d="M290 322l-16 40M322 322l40 40" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
        <g fill={time === "night" ? "#0B1220" : "#2B3340"}><circle cx="296" cy="294" r="4" /><rect x="292" y="298" width="8" height="22" rx="3" /><circle cx="316" cy="298" r="3.4" /><rect x="312.5" y="302" width="7" height="18" rx="3" /></g>
        {time === "day" || time === "morning" ? <g fill="#fff" opacity="0.75"><ellipse cx="200" cy="64" rx="46" ry="10" /><ellipse cx="226" cy="56" rx="28" ry="9" /><ellipse cx="480" cy="90" rx="40" ry="8" /></g> : null}
      </g>

      {/* ground shadow */}
      <g style={o(3)}>{shadowD !== 0 ? <path d={`M150 ${G}H520L${520 + shadowD} ${G + 26}H${150 + shadowD}Z`} fill="#0B1220" opacity={0.12 + T.shade * 0.4} /> : null}</g>

      {/* model faces */}
      <g style={o(1)}>{outlines.map(({ z, i, r }) => <rect key={`${z}${i}`} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={z === "glass" ? "#CBD5E1" : z === "metal" ? "#94A3B8" : "#F8FAFC"} />)}</g>

      {/* materials */}
      <g style={o(2)}>
        {outlines.map(({ z, i, r }) => (
          <g key={`m${z}${i}`}>
            <rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={fill(z)} />
            {z === "timber" ? <rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={`url(#${uid}-timber)`} /> : null}
            {z === "stone" ? <rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={`url(#${uid}-stone)`} /> : null}
            {z === "concrete" ? <rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={`url(#${uid}-conc)`} /> : null}
          </g>
        ))}
      </g>

      {/* lighting */}
      <g style={o(3)}>
        <rect x="138" y="121" width="402" height="199" fill={`url(#${uid}-shade)`} />
        <rect x="150" y="130" width="200" height="12" fill="#0B1220" opacity={0.18 + T.shade * 0.3} /><rect x="350" y="210" width="170" height="10" fill="#0B1220" opacity={0.16 + T.shade * 0.3} />
        {R.glass.map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={`url(#${uid}-glass)`} />)}
        {glowing ? R.glass.map((r, i) => <rect key={`g${i}`} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill="#FFD88A" opacity={0.35 + T.glow * 0.5} />) : null}
        <rect x="138" y="121" width="402" height="199" fill={T.tint} opacity={T.ti} />
      </g>

      {/* linework: blueprint (drawing) and model lines */}
      <g stroke="#7DD3FC" strokeWidth="1.3" style={o(0, 0)}>
        <g stroke="#7DD3FC" strokeOpacity="0.28" strokeWidth="0.6">{Array.from({ length: 17 }, (_, i) => <path key={`v${i}`} d={`M${i * 40} 0V400`} />)}{Array.from({ length: 11 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 40}H640`} />)}</g>
        {outlines.map(({ z, i, r }) => <rect key={`b${z}${i}`} x={r[0]} y={r[1]} width={r[2]} height={r[3]} {...(animate ? { className: "draw", pathLength: 1, style: { "--d": `${(ZONES.indexOf(z) * 4 + i) * 90}ms`, "--t": "1.2s" } as React.CSSProperties } : {})} />)}
        <path d={`M100 ${G}H560`} strokeWidth="2" />
        <g stroke="#7DD3FC" fill="#7DD3FC" {...(animate ? { className: "fade-in", style: { "--d": "1800ms" } as React.CSSProperties } : {})}>{dims}</g>
      </g>
      <g stroke="#1F2937" strokeWidth="1.1" style={o(1)}>
        {outlines.map(({ z, i, r }) => <rect key={`l${z}${i}`} x={r[0]} y={r[1]} width={r[2]} height={r[3]} />)}
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M${365 + (k + 1) * 28} 225V312`} />)}<path d="M250 150V195M210 150V195M290 150V195" /><path d="M215 235V312" />
      </g>

      {/* highlight */}
      {hi ? R[hi].map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill="#2563EB" fillOpacity="0.22" stroke="#2563EB" strokeWidth="2.4" />) : null}

      {/* camera frame */}
      {frame ? (
        <g stroke="#7DD3FC" strokeWidth="1.6" style={{ transition: "all 0.6s ease" }}>
          <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} strokeDasharray="6 4" fill="#7DD3FC" fillOpacity="0.06" style={{ transition: "all 0.6s ease" }} />
          <path d={`M${frame.x} ${frame.y + 14}V${frame.y}H${frame.x + 14}M${frame.x + frame.w - 14} ${frame.y}H${frame.x + frame.w}V${frame.y + 14}M${frame.x} ${frame.y + frame.h - 14}V${frame.y + frame.h}H${frame.x + 14}M${frame.x + frame.w - 14} ${frame.y + frame.h}H${frame.x + frame.w}V${frame.y + frame.h - 14}`} strokeWidth="3" />
          {frame.label ? <text x={frame.x + 8} y={frame.y + frame.h - 8} fill="#7DD3FC" stroke="none" fontSize="10" style={mono}>{frame.label}</text> : null}
        </g>
      ) : null}
    </svg>
  );
}

/* ───────── interior (one-point perspective) ───────── */

export function InteriorView({ room, time = "day", className, title }: { room: "entry" | "living" | "kitchen"; time?: TimeId; className?: string; title: string }) {
  const T = TIMES[time];
  const night = time === "night";
  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label={title} fill="none" strokeLinejoin="round">
      <title>{title}</title>
      <path d="M0 0H640V400H0Z" fill={night ? "#1A2233" : "#F2EEE7"} />
      <path d="M0 0L180 100H460L640 0Z" fill={night ? "#222B3E" : "#FBF9F5"} />
      <path d="M0 400L180 270H460L640 400Z" fill={night ? "#2C2A27" : "#C8A878"} />
      <path d="M0 0L180 100V270L0 400Z" fill={night ? "#1D2638" : "#E8E2D8"} />
      <path d="M640 0L460 100V270L640 400Z" fill={night ? "#202A3D" : "#EDE8DF"} />
      <rect x="180" y="100" width="280" height="170" fill={night ? "#1F2A3F" : "#F5F1EA"} />
      <g stroke="#334155" strokeWidth="1" opacity="0.7"><path d="M0 0L180 100H460L640 0M0 400L180 270H460L640 400M180 100V270M460 100V270M0 0V400M640 0V400" /></g>
      {room === "living" ? (
        <g>
          <rect x="230" y="120" width="170" height="100" fill={T.sky[1]} stroke="#334155" /><path d="M315 120V220M230 170H400" stroke="#334155" />
          <path d="M230 120L400 220" stroke="#fff" strokeOpacity="0.35" strokeWidth="14" />
          <path d="M120 400L220 300H430L520 400Z" fill="#9AA6B2" opacity="0.7" />
          <rect x="250" y="236" width="140" height="30" rx="6" fill="#6B7280" stroke="#334155" /><rect x="250" y="222" width="140" height="18" rx="6" fill="#7B8493" stroke="#334155" />
          <rect x="300" y="290" width="70" height="22" fill="#B08457" stroke="#334155" />
        </g>
      ) : null}
      {room === "kitchen" ? (
        <g>
          <rect x="190" y="110" width="260" height="46" fill="#CFC7BA" stroke="#334155" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M${255 + i * 65} 110V156`} stroke="#334155" />)}
          <rect x="190" y="206" width="260" height="64" fill="#B08457" stroke="#334155" /><rect x="190" y="198" width="260" height="10" fill="#EDEAE3" stroke="#334155" />
          <path d="M120 400L190 330H460L520 400Z" fill="#CFC7BA" opacity="0.6" /><rect x="220" y="304" width="200" height="40" fill="#EDEAE3" stroke="#334155" /><rect x="220" y="344" width="200" height="22" fill="#B08457" stroke="#334155" />
        </g>
      ) : null}
      {room === "entry" ? (
        <g>
          <rect x="285" y="125" width="70" height="145" fill={T.sky[1]} stroke="#334155" strokeWidth="2" opacity="0.9" /><path d="M320 125V270M285 190H355" stroke="#334155" />
          <path d="M120 400L250 290H390L520 400Z" fill="#8E8A83" opacity="0.5" /><rect x="205" y="215" width="50" height="55" fill="#B08457" stroke="#334155" />
        </g>
      ) : null}
      {night ? <circle cx="320" cy="60" r="110" fill="#FFD88A" opacity="0.1" /> : null}
    </svg>
  );
}

/* ───────── aerial / site overview ───────── */

export function AerialView({ className, title, time = "day" }: { className?: string; title: string; time?: TimeId }) {
  const T = TIMES[time];
  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label={title} fill="none">
      <title>{title}</title>
      <rect width="640" height="400" fill={time === "night" ? "#17233B" : "#B7C7B0"} />
      <path d="M0 330H640V400H0Z" fill="#9BA3AC" /><path d="M0 365H640" stroke="#fff" strokeDasharray="14 10" strokeOpacity="0.6" />
      <path d="M140 60H520V310H140Z" fill={time === "night" ? "#202B3E" : "#CFDACB"} stroke="#334155" strokeDasharray="10 4 2 4" />
      <path d="M290 310V330H320V310" fill="#C8CDD3" />
      <path d={`M190 100h140v150h-140z M330 150h120v100h-120z`} fill="#000" opacity={0.15 + T.shade * 0.4} transform="translate(14 12)" />
      <rect x="190" y="100" width="140" height="150" fill="#94A3B8" stroke="#1F2937" strokeWidth="2" /><rect x="330" y="150" width="120" height="100" fill="#CBD5E1" stroke="#1F2937" strokeWidth="2" />
      <path d="M200 110H320V240H200Z M340 160H440V240H340Z" stroke="#1F2937" strokeOpacity="0.5" />
      {[[160, 90], [500, 90], [480, 280], [160, 280]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="18" fill="#5F8A5C" opacity="0.9" />)}
    </svg>
  );
}

/* ───────── camera plan ───────── */

export type Cam = "street" | "eye" | "aerial";
export function CameraPlan({ cam, className }: { cam: Cam; className?: string }) {
  const pos: Record<Cam, [number, number, number]> = { street: [320, 372, 0], eye: [250, 306, 0], aerial: [320, 372, 0] };
  const [cx, cy] = pos[cam];
  const fov = cam === "street" ? 62 : cam === "eye" ? 38 : 80;
  const half = (fov * Math.PI) / 360;
  const len = cam === "eye" ? 150 : 220;
  const tx = (a: number) => cx + Math.sin(a) * len * (cam === "eye" ? 1 : 1);
  const ty = (a: number) => cy - Math.cos(a) * len;
  const dir = cam === "eye" ? 0.25 : 0;
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label={`Camera plan: ${cam} camera position and field of view`} fill="none">
      <title>Camera position and field of view</title>
      <rect width="640" height="420" fill="#F8FAFC" />
      <path d="M0 395H640" stroke="#CBD5E1" strokeWidth="14" />
      <rect x="170" y="140" width="140" height="150" fill="#E2E8F0" stroke="#1F2937" strokeWidth="2.4" /><rect x="310" y="190" width="120" height="100" fill="#F1F5F9" stroke="#1F2937" strokeWidth="2.4" />
      {cam !== "aerial" ? <path d={`M${cx} ${cy}L${tx(dir - half)} ${ty(dir - half)}L${tx(dir + half)} ${ty(dir + half)}Z`} fill="#2563EB" fillOpacity="0.14" stroke="#2563EB" strokeDasharray="5 3" /> : <><circle cx="300" cy="215" r="150" stroke="#2563EB" strokeDasharray="5 3" /><circle cx="300" cy="215" r="6" fill="#2563EB" /></>}
      {cam !== "aerial" ? <g transform={`translate(${cx} ${cy}) rotate(${dir * 57.3})`}><rect x="-9" y="-6" width="18" height="12" rx="2" fill="#2563EB" /><path d="M-4 -6l3 -5h2l3 5" stroke="#2563EB" strokeWidth="2" /></g> : <text x="300" y="60" textAnchor="middle" fontSize="11" fill="#2563EB" style={mono}>CAMERA ABOVE SITE</text>}
      <text x="24" y="30" fontSize="10" fill="#64748B" style={mono}>SITE PLAN · CAMERA POSITION</text>
    </svg>
  );
}

/* ───────── planning context ───────── */

export function ContextSvg({ step, className }: { step: 0 | 1 | 2; className?: string }) {
  const g = 320;
  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label="Street context: existing buildings, proposed design, contextual visualisation" fill="none">
      <title>Existing context, proposed design and contextual visualisation</title>
      <rect width="640" height="400" fill={step === 2 ? "#DCEBF7" : "#F1F5F9"} />
      <rect y={g} width="640" height="80" fill={step === 2 ? "#9AA39B" : "#E2E8F0"} />
      <g opacity={step === 1 ? 0.45 : 1}>
        <rect x="10" y="170" width="150" height="150" fill={step === 2 ? "#C9D1DA" : "#fff"} stroke="#334155" strokeWidth="1.6" /><path d="M10 170L85 130L160 170" fill={step === 2 ? "#AAB4C0" : "#fff"} stroke="#334155" strokeWidth="1.6" />
        <rect x="480" y="150" width="150" height="170" fill={step === 2 ? "#C9D1DA" : "#fff"} stroke="#334155" strokeWidth="1.6" /><path d="M480 150H630" stroke="#334155" strokeWidth="1.6" />
        {[30, 70, 110].map((x) => <rect key={x} x={x} y="200" width="26" height="36" stroke="#334155" />)}{[500, 540, 580].map((x) => <rect key={x} x={x} y="190" width="28" height="40" stroke="#334155" />)}
      </g>
      {step === 0 ? <g stroke="#2563EB" strokeDasharray="6 4" strokeWidth="1.6"><rect x="200" y="140" width="240" height="180" /><text x="320" y="236" textAnchor="middle" fill="#2563EB" stroke="none" fontSize="11" style={mono}>PROPOSED SITE</text></g> : null}
      {step >= 1 ? (
        <g stroke={step === 1 ? "#2563EB" : "#1F2937"} strokeWidth={step === 1 ? 2.4 : 1.4}>
          <rect x="200" y="160" width="150" height="160" fill={step === 2 ? "#B08457" : "#fff"} /><rect x="350" y="230" width="90" height="90" fill={step === 2 ? "#BDBDB8" : "#fff"} />
          <rect x="196" y="152" width="160" height="8" fill="#3B4350" /><rect x="214" y="180" width="110" height="34" fill={step === 2 ? "#A9CBE6" : "#E2E8F0"} /><rect x="362" y="248" width="66" height="60" fill={step === 2 ? "#A9CBE6" : "#E2E8F0"} />
        </g>
      ) : null}
      {step === 2 ? <path d={`M200 ${g}H440L520 ${g + 22}H280Z`} fill="#0B1220" opacity="0.22" /> : null}
      {step === 2 ? <g><circle cx="540" cy="70" r="34" fill="#FFF3C4" opacity="0.85" /><g transform="translate(60 320)"><rect x="-3" y="-50" width="6" height="50" fill="#5A4636" /><circle cy="-66" r="26" fill="#4F7A52" /></g></g> : null}
      <text x="16" y="28" fontSize="10" fill={step === 2 ? "#0B1220" : "#64748B"} style={mono}>{["EXISTING CONTEXT", "PROPOSED DESIGN", "CONTEXTUAL VISUALISATION"][step]}</text>
    </svg>
  );
}

/* ───────── 3D floor plan (isometric cutaway) ───────── */

export function FloorPlan3D({ stage, rise, className }: { stage: 0 | 1 | 2 | 3 | 4; rise: number; className?: string }) {
  const p = makeIso(250, 40, 0.74);
  const wh = 58 * rise;
  const colors = ["#CFC7BA", "#C8A878", "#EDEAE3", "#B9C4CF", "#A9B79F", "#C8A878"];
  const walls: [number, number, number, number][] = [[80, 60, 560, 60], [560, 60, 560, 340], [80, 340, 560, 340], [80, 60, 80, 340], [300, 60, 300, 340], [80, 230, 300, 230], [300, 200, 560, 200], [380, 200, 380, 340], [450, 200, 450, 340]];
  const sorted = [...walls].sort((a, b) => a[0] + a[1] + a[2] + a[3] - (b[0] + b[1] + b[2] + b[3]));
  const box = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, t: number) => {
    const ax = Math.min(x0, x1) - (y0 === y1 ? 0 : t), bx = Math.max(x0, x1) + (y0 === y1 ? 0 : t);
    const ay = Math.min(y0, y1) - (x0 === x1 ? 0 : t), by = Math.max(y0, y1) + (x0 === x1 ? 0 : t);
    return [
      loop(p(ax, by, z0), p(bx, by, z0), p(bx, by, z1), p(ax, by, z1)),
      loop(p(bx, by, z0), p(bx, ay, z0), p(bx, ay, z1), p(bx, by, z1)),
      loop(p(ax, ay, z1), p(bx, ay, z1), p(bx, by, z1), p(ax, by, z1)),
    ];
  };
  const furn: [number, number, number, number, number][] = [[108, 170, 194, 200, 18], [128, 124, 174, 148, 12], [398, 118, 502, 148, 24], [100, 258, 176, 324, 16], [386, 206, 440, 230, 14], [460, 302, 540, 328, 14]];
  return (
    <svg viewBox="0 0 640 380" className={className} role="img" aria-label="Floor plan extruded into an isometric cutaway with components and materials" fill="none" strokeLinejoin="round">
      <title>3D floor plan stages</title>
      {ROOMS.map((r, i) => (
        <path key={r.id} d={loop(p(r.x0, r.y0, 0), p(r.x1, r.y0, 0), p(r.x1, r.y1, 0), p(r.x0, r.y1, 0))} fill={stage >= 3 ? colors[i] : "#fff"} stroke="#334155" strokeWidth="0.8" style={{ transition: "fill 0.8s" }} />
      ))}
      {stage >= 1 ? sorted.map((w, i) => {
        const [a, b, c] = box(w[0], w[1], w[2], w[3], 0, wh, 3);
        return <g key={i} stroke="#111827" strokeWidth="1"><path d={a} fill={stage >= 3 ? "#F4F1EB" : "#fff"} /><path d={b} fill="#E2E8F0" /><path d={c} fill="#CBD5E1" /></g>;
      }) : null}
      {stage >= 2 ? furn.map((f, i) => {
        const [a, b, c] = box(f[0], f[1], f[2], f[3], 0, f[4] * rise, 0);
        return <g key={i} stroke="#334155" strokeWidth="0.8"><path d={a} fill={stage >= 3 ? "#9A7B55" : "#fff"} /><path d={b} fill={stage >= 3 ? "#7E6243" : "#E2E8F0"} /><path d={c} fill={stage >= 3 ? "#B8956A" : "#F1F5F9"} /></g>;
      }) : null}
      {stage >= 4 ? <path d={loop(p(70, 50, 0), p(570, 50, 0), p(570, 350, 0), p(70, 350, 0))} fill="none" stroke="#2563EB" strokeDasharray="6 4" /> : null}
    </svg>
  );
}

/* ───────── custom pipeline icons ───────── */

export function StageIcon({ i, className }: { i: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {i === 0 ? <><rect x="10" y="12" width="44" height="40" /><path d="M10 32h22M32 12v40M32 40h22M18 20h8M40 20h8" /></> : null}
      {i === 1 ? <><path d="M10 40l22 -10 22 10 -22 12z" /><path d="M10 40V24l22 -10 22 10v16M32 30v22M10 24l22 10 22 -10" /></> : null}
      {i === 2 ? <><rect x="10" y="14" width="20" height="20" /><rect x="34" y="14" width="20" height="20" /><rect x="10" y="38" width="20" height="14" /><path d="M14 18l12 12M14 26l8 8M38 18h12M38 24h12M38 30h12M14 42h12M14 47h12" strokeWidth="1" /></> : null}
      {i === 3 ? <><circle cx="44" cy="20" r="7" /><path d="M44 6v4M44 30v4M30 20h4M54 20h4M34 10l3 3M51 27l3 3M54 10l-3 3M34 30l3 -3" /><path d="M10 52V36l14 -8 14 8v16z" /></> : null}
      {i === 4 ? <><rect x="8" y="22" width="34" height="24" rx="3" /><circle cx="25" cy="34" r="7" /><path d="M42 30l14 -8v24l-14 -8M16 22l3 -6h12l3 6" /></> : null}
      {i === 5 ? <><rect x="8" y="14" width="40" height="30" /><path d="M8 38l12 -10 10 8 8 -6 10 8" /><circle cx="36" cy="24" r="3" /><path d="M16 50h40M20 56h32" /></> : null}
    </svg>
  );
}

export const TEXTURES: Record<string, { label: string; draw: (id: string) => React.ReactNode }> = {
  stone: { label: "Stone", draw: (id) => <><rect width="100%" height="100%" fill="#CFC7BA" /><rect width="100%" height="100%" fill={`url(#${id}-st)`} /></> },
  concrete: { label: "Concrete", draw: (id) => <><rect width="100%" height="100%" fill="#BDBDB8" /><rect width="100%" height="100%" fill={`url(#${id}-co)`} /></> },
  timber: { label: "Timber", draw: (id) => <><rect width="100%" height="100%" fill="#B08457" /><rect width="100%" height="100%" fill={`url(#${id}-ti)`} /></> },
  glass: { label: "Glass", draw: (id) => <><rect width="100%" height="100%" fill="#A9CBE6" /><rect width="100%" height="100%" fill={`url(#${id}-gl)`} /></> },
  metal: { label: "Metal", draw: (id) => <><rect width="100%" height="100%" fill="#7C8794" /><rect width="100%" height="100%" fill={`url(#${id}-me)`} /></> },
  paint: { label: "Paint", draw: () => <><rect width="100%" height="100%" fill="#EDEAE3" /></> },
  flooring: { label: "Flooring", draw: (id) => <><rect width="100%" height="100%" fill="#C8A878" /><rect width="100%" height="100%" fill={`url(#${id}-fl)`} /></> },
  joinery: { label: "Joinery", draw: (id) => <><rect width="100%" height="100%" fill="#9A7B55" /><rect width="100%" height="100%" fill={`url(#${id}-jo)`} /></> },
  exterior: { label: "Exterior finishes", draw: (id) => <><rect width="100%" height="100%" fill="#E3DED4" /><rect width="100%" height="100%" fill={`url(#${id}-ex)`} /></> },
};

export function TextureDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-st`} width="60" height="28" patternUnits="userSpaceOnUse"><path d="M0 .5H60M0 14.5H60M30 0V14M0 14V28M60 14V28" stroke="#000" strokeOpacity=".2" /></pattern>
      <pattern id={`${id}-co`} width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="6" cy="8" r="1.2" fill="#000" fillOpacity=".25" /><circle cx="26" cy="22" r="1" fill="#000" fillOpacity=".2" /><circle cx="14" cy="34" r="1.4" fill="#000" fillOpacity=".2" /><circle cx="34" cy="6" r="0.9" fill="#fff" fillOpacity=".5" /></pattern>
      <pattern id={`${id}-ti`} width="14" height="80" patternUnits="userSpaceOnUse"><path d="M3 0C5 20 1 40 3 80M9 0C7 25 11 50 9 80" stroke="#000" strokeOpacity=".22" fill="none" /></pattern>
      <pattern id={`${id}-gl`} width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0 80L80 0M-20 80L60 0M20 80L100 0" stroke="#fff" strokeOpacity=".5" strokeWidth="6" /></pattern>
      <pattern id={`${id}-me`} width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3H6" stroke="#fff" strokeOpacity=".28" /></pattern>
      <pattern id={`${id}-fl`} width="120" height="26" patternUnits="userSpaceOnUse"><path d="M0 .5H120M0 13.5H120M40 0V13M90 13V26" stroke="#000" strokeOpacity=".2" /></pattern>
      <pattern id={`${id}-jo`} width="60" height="90" patternUnits="userSpaceOnUse"><rect x="4" y="4" width="52" height="82" stroke="#000" strokeOpacity=".28" fill="none" /><rect x="12" y="12" width="36" height="66" stroke="#000" strokeOpacity=".18" fill="none" /></pattern>
      <pattern id={`${id}-ex`} width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0 .5H24" stroke="#000" strokeOpacity=".15" /></pattern>
    </defs>
  );
}
