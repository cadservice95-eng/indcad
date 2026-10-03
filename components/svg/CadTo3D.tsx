import { IsoPart, PART, type PartDelays } from "./IsoPart";
import { makeIso, isoRx } from "./iso";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

// Slow, staged build-up: outline → extrusion → boss/bore → holes → mesh
const DELAYS: PartDelays = { base: 300, rise: 1800, boss: 3200, holes: 4600, mesh: 5600 };
const S = 2.1;
const OX = 300;
const OY = 190;

/** 2D outline becomes an extruded solid with features, then a wireframe overlay. */
export function CadTo3D({ className }: { className?: string }) {
  const { L, W, T, bossH, boss } = PART;
  const p = makeIso(OX, OY, S);
  const topC = p(L / 2, W / 2, T + bossH);
  const rx = isoRx(boss, S);
  const stages = [
    ["01 · 2D OUTLINE", 300, 1500],
    ["02 · EXTRUDE", 1800, 1300],
    ["03 · BOSS + BORE", 3200, 1300],
    ["04 · HOLES + FILLETS", 4600, 900],
  ] as const;

  return (
    <svg
      viewBox="0 0 640 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="3D mechanical CAD model built up from a 2D outline: extrusion, boss, bore, holes and a wireframe overlay"
    >
      <rect x="0.5" y="0.5" width="639" height="399" stroke="#83aed3" strokeOpacity="0.25" />
      <path d="M0 22V0h22M618 0h22v22M640 378v22h-22M22 400H0v-22" stroke="#38bdf8" strokeWidth="2" />
      <g className="text-sky-300">
        <IsoPart ox={OX} oy={OY} s={S} delays={DELAYS} solid />
      </g>
      {/* fillet marker */}
      <g className="fade-in text-copper-400" style={d(5000)}>
        <path d={`M${topC[0] + rx + 4} ${topC[1] + 6}l40 -26h46`} stroke="currentColor" strokeWidth="0.9" />
        <text x={topC[0] + rx + 52} y={topC[1] - 24} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1">R3 FILLET</text>
      </g>
      {/* captions: one at a time, last stays */}
      <g fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">
        {stages.map(([label, at, life], i) =>
          i < stages.length - 1 ? (
            <text key={label} x="28" y="380" className="fade-pass" style={{ "--d": `${at}ms`, "--life": `${life + 400}ms` } as React.CSSProperties}>{label}</text>
          ) : (
            <text key={label} x="28" y="380" className="fade-in" style={d(at)}>{label} · WIREFRAME OVERLAY</text>
          ),
        )}
      </g>
    </svg>
  );
}
