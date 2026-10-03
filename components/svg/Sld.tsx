"use client";

import { CIRCUITS, PANELS, REVISIONS, type Circuit, type PanelId } from "@/components/electrical/model";
import { cn } from "@/lib/utils";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;

const BASE = "#38bdf8";
const ACTIVE = "#22c55e";
const CHANGED = "#f59e0b";

/** Breaker / protective device symbol on a vertical run. */
function Breaker({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="1.5">
      <rect x={x - 5} y={y} width="10" height="14" className="fill-ink-950" />
      <path d={`M${x - 5} ${y + 14}L${x + 5} ${y}`} strokeWidth="1" />
    </g>
  );
}

/**
 * Illustrative single-line diagram: incoming supply, main switch, main bus,
 * three panels and six circuits to loads. Select/hover a circuit or panel to
 * trace it; `revision` shows the diagram at issue A–D. Values are decorative.
 */
export function Sld({
  className,
  animate = false,
  activeCircuit = null,
  activePanel = null,
  onCircuit,
  onPanel,
  revision,
  flow = false,
  showLabels = true,
  title = "Illustrative single-line diagram: incoming supply, main switchboard, distribution panels and loads",
}: {
  className?: string;
  animate?: boolean;
  activeCircuit?: string | null;
  activePanel?: PanelId | null;
  onCircuit?: (id: string | null, commit?: boolean) => void;
  onPanel?: (id: PanelId | null, commit?: boolean) => void;
  revision?: number;
  flow?: boolean;
  showLabels?: boolean;
  title?: string;
}) {
  const all = revision === undefined;
  const rev = revision ?? 99;
  const changed = all ? [] : REVISIONS[revision!].changed;
  const visible = (c: Circuit) => all || (c.since <= rev && (c.until === undefined || rev < c.until));
  const ghost = (c: Circuit) => !all && c.until !== undefined && rev === c.until;
  const act = activeCircuit ? CIRCUITS.find((c) => c.id === activeCircuit) : undefined;
  const panelOn = (p: PanelId) => activePanel === p || act?.panel === p;
  const circuitOn = (c: Circuit) => activeCircuit === c.id || activePanel === c.panel;
  const anyOn = !!activeCircuit || !!activePanel;
  const mainOn = anyOn;
  const dim = (on: boolean) => (anyOn && !on ? 0.3 : 1);
  const interactive = !!onCircuit || !!onPanel;
  const draw = animate ? "draw" : "";
  const fade = animate ? "fade-in" : "";

  return (
    <svg viewBox="0 0 640 420" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title} strokeLinecap="round" strokeLinejoin="round">
      {/* incoming supply + main switch */}
      <g style={{ opacity: dim(mainOn), transition: "opacity .3s" }}>
        <path d="M320 20V68" stroke={mainOn ? ACTIVE : BASE} strokeWidth="2" pathLength={1} className={draw} style={animate ? d(300, "0.6s") : undefined} />
        <g stroke={mainOn ? ACTIVE : BASE} strokeWidth="1.6" className={fade} style={animate ? d(800) : undefined}>
          <circle cx="320" cy="70" r="2.6" className="fill-ink-950" />
          <circle cx="320" cy="94" r="2.6" className="fill-ink-950" />
          <path d="M320 70l14 22" />
        </g>
        <path d="M320 96V120" stroke={mainOn ? ACTIVE : BASE} strokeWidth="2" pathLength={1} className={draw} style={animate ? d(1000, "0.5s") : undefined} />
        <path d="M96 120H544" stroke={mainOn ? ACTIVE : BASE} strokeWidth="4" pathLength={1} className={draw} style={animate ? d(1300, "1s") : undefined} />
        {mainOn && flow ? <path d="M320 20V68M320 96V120" stroke="#dcfce7" strokeWidth="1.4" className="rch-flow" /> : null}
      </g>

      {/* panels + feeders */}
      {PANELS.map((p, i) => {
        const on = panelOn(p.id);
        const col = on ? ACTIVE : changed.includes(p.id) ? CHANGED : BASE;
        return (
          <g
            key={p.id}
            onMouseEnter={onPanel ? () => onPanel(p.id) : undefined}
            onMouseLeave={onPanel ? () => onPanel(null) : undefined}
            onClick={onPanel ? () => onPanel(p.id, true) : undefined}
            style={{ opacity: dim(on), transition: "opacity .3s", cursor: onPanel ? "pointer" : undefined }}
          >
            <path d={`M${p.x} 120V168`} stroke={col} strokeWidth="2" pathLength={1} className={draw} style={animate ? d(1700 + i * 150, "0.5s") : undefined} />
            <Breaker x={p.x} y={134} color={col} />
            <g className={fade} style={animate ? d(2000 + i * 150) : undefined}>
              <rect x={p.x - 60} y="168" width="120" height="44" className="fill-ink-950" stroke={col} strokeWidth={on ? 2.2 : 1.5} />
              <path d={`M${p.x - 60} 184h120`} stroke={col} strokeWidth="0.8" opacity="0.6" />
              <text x={p.x} y="180" textAnchor="middle" fill={col} fontSize="9.5" letterSpacing="1.2" style={mono}>{p.id}</text>
              <text x={p.x} y="203" textAnchor="middle" fill="#94a3b8" fontSize="8" letterSpacing="1" style={mono}>{p.id === "MCC" ? "MOTOR CONTROL" : "DISTRIBUTION"}</text>
            </g>
            {on && flow ? <path d={`M${p.x} 120V168`} stroke="#dcfce7" strokeWidth="1.4" className="rch-flow" /> : null}
          </g>
        );
      })}

      {/* circuits */}
      {CIRCUITS.map((c, i) => {
        const vis = visible(c);
        const gh = ghost(c);
        if (!vis && !gh) return null;
        const on = circuitOn(c);
        const isChanged = changed.includes(c.id);
        const col = gh ? "#ef4444" : on ? ACTIVE : isChanged ? CHANGED : BASE;
        const op = gh ? 0.55 : dim(on);
        return (
          <g
            key={c.id}
            onMouseEnter={onCircuit ? () => onCircuit(c.id) : undefined}
            onMouseLeave={onCircuit ? () => onCircuit(null) : undefined}
            onClick={onCircuit ? () => onCircuit(c.id, true) : undefined}
            style={{ opacity: op, transition: "opacity .3s", cursor: onCircuit ? "pointer" : undefined }}
          >
            {interactive ? <path d={`M${c.x} 212V322`} stroke="transparent" strokeWidth="18" /> : null}
            <path
              d={`M${c.x} 212V322`}
              stroke={col}
              strokeWidth={on ? 2.6 : 1.8}
              strokeDasharray={gh ? "5 4" : undefined}
              pathLength={1}
              className={draw}
              style={animate ? d(2600 + i * 180, "0.7s") : undefined}
            />
            <Breaker x={c.x} y={246} color={col} />
            {on && flow ? <path d={`M${c.x} 212V322`} stroke="#dcfce7" strokeWidth="1.4" className="rch-flow" /> : null}
            <g className={fade} style={animate ? d(3300 + i * 160) : undefined}>
              <circle cx={c.x} cy="336" r="13" className="fill-ink-950" stroke={col} strokeWidth={on ? 2.2 : 1.5} />
              <text x={c.x} y="340" textAnchor="middle" fill={col} fontSize="11" style={mono}>{c.motor ? "M" : "L"}</text>
              {showLabels ? (
                <>
                  <text x={c.x} y="368" textAnchor="middle" fill="#94a3b8" fontSize="8.5" letterSpacing="0.8" style={mono}>{c.load}</text>
                  <text x={c.x + 8} y="286" fill={col} fontSize="8.5" letterSpacing="0.8" style={mono}>{c.id}</text>
                  <text x={c.x + 8} y="298" fill="#64748b" fontSize="8" style={mono}>{c.cable}</text>
                </>
              ) : null}
            </g>
          </g>
        );
      })}

      {showLabels ? (
        <g className={cn(fade, "max-sm:hidden")} style={animate ? d(3800) : undefined} fill="#94a3b8" fontSize="8.5" letterSpacing="1.2">
          <text x="334" y="48" style={mono}>MAIN INCOMING</text>
          <text x="100" y="112" style={mono}>MSB</text>
          <text x="16" y="408" style={mono}>SLD-01 · REV B · ILLUSTRATIVE</text>
        </g>
      ) : null}
    </svg>
  );
}
