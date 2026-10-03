"use client";

import { useState } from "react";
import { makeIso, seg } from "@/components/svg/iso";
import { DimensionLine } from "@/components/svg/DimensionLines";
import { cn } from "@/lib/utils";
import { members, nodes, memberInfo, REVISIONS, XS, YS, type Member } from "./steel";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const WIDTH = { col: 3.4, beam: 2.4, brace: 1.5 } as const;

/**
 * Interactive isometric steel frame (columns, beams, bracing, connection nodes,
 * bolts, grids, levels, dimensions, piece marks). Used by the hero, take-off,
 * revision and lifecycle sections. Illustrative geometry only.
 *
 * animate: staged draw-on (needs an InView ancestor)
 * revision: 0–3 → show the frame as at that issue, highlighting changes
 * detail: 0–5 → how much documentation is shown (lifecycle)
 * highlightIds: externally highlighted members
 */
export function SteelFrame({
  className,
  animate = false,
  interactive = false,
  revision,
  detail = 5,
  highlightIds,
  s = 16,
  cx = 320,
  cy = 270,
  showInfoCard = false,
  viewBox = "0 0 640 560",
}: {
  className?: string;
  animate?: boolean;
  interactive?: boolean;
  revision?: number;
  detail?: number;
  highlightIds?: string[];
  s?: number;
  cx?: number;
  cy?: number;
  showInfoCard?: boolean;
  viewBox?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const ox = cx - ((XS[2] - YS[1]) / 2) * 0.866 * s;
  const p = makeIso(ox, cy, s);
  const rev = revision ?? 99;
  const changed = revision !== undefined ? REVISIONS[revision].changed : [];
  const hl = new Set([...(highlightIds ?? []), ...(active ? [active] : [])]);

  const all = revision === undefined;
  const visible = (m: Member) => all || (m.since <= rev && (m.until === undefined || rev < m.until));
  const ghost = (m: Member) => !all && m.until !== undefined && rev === m.until;

  const delayFor = (m: Member, i: number) => (m.kind === "col" ? 800 + i * 120 : m.kind === "beam" ? 1800 + i * 90 : 2900 + i * 120);
  const hasAny = hl.size > 0;

  const grid: string[] = [];
  for (let x = -4; x <= 20; x += 4) grid.push(seg(p(x, -4, 0), p(x, 10, 0)));
  for (let y = -4; y <= 10; y += 5) grid.push(seg(p(-4, y, 0), p(20, y, 0)));

  const front0 = p(0, 6, 0);
  const mid = p(8, 6, 0);
  const front2 = p(16, 6, 0);
  const h0 = p(0, 6, 0);
  const h1 = p(0, 6, 8);
  const activeMember = active ? members.find((m) => m.id === active) : undefined;
  const infoText = activeMember ? memberInfo(activeMember) : null;

  const changedMid = changed.length ? members.find((m) => m.id === changed[0]) : undefined;
  const cloud = changedMid ? p((changedMid.a[0] + changedMid.b[0]) / 2, (changedMid.a[1] + changedMid.b[1]) / 2, (changedMid.a[2] + changedMid.b[2]) / 2) : null;

  return (
    <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Isometric steel frame with columns, beams, bracing, connection nodes, grid references and levels">
      {/* grid */}
      <g className="text-sky-300">
        <path d={grid.join("")} stroke="currentColor" strokeWidth="0.6" opacity="0.2" pathLength={1} className={animate ? "draw" : ""} style={animate ? d(0, "1.4s") : undefined} />
      </g>

      {/* grid bubbles + levels */}
      <g className={cn("text-sky-300", animate && "fade-in")} style={animate ? d(600) : undefined}>
        {["A", "B", "C"].map((t, i) => {
          const b = p(XS[i], 9.4, 0);
          return (
            <g key={t}>
              <path d={seg(p(XS[i], 6, 0), p(XS[i], 8.6, 0))} stroke="currentColor" strokeWidth="0.7" strokeDasharray="6 2 1 2" opacity="0.7" />
              <circle cx={b[0]} cy={b[1]} r="9" className="fill-ink-950" stroke="currentColor" />
              <text x={b[0]} y={b[1] + 3.6} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">{t}</text>
            </g>
          );
        })}
        {["1", "2"].map((t, i) => {
          const b = p(19.4, YS[i], 0);
          return (
            <g key={t}>
              <path d={seg(p(16, YS[i], 0), p(18.6, YS[i], 0))} stroke="currentColor" strokeWidth="0.7" strokeDasharray="6 2 1 2" opacity="0.7" />
              <circle cx={b[0]} cy={b[1]} r="9" className="fill-ink-950" stroke="currentColor" />
              <text x={b[0]} y={b[1] + 3.6} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">{t}</text>
            </g>
          );
        })}
        {[4, 8].map((z, i) => {
          const b = p(16, 0, z);
          return (
            <g key={z} className="max-sm:hidden">
              <path d={`M${b[0] + 8} ${b[1]}h46`} stroke="#d68a51" strokeWidth="0.9" strokeDasharray="5 3" />
              <path d={`M${b[0] + 54} ${b[1] - 4}l6 4-6 4z`} fill="#d68a51" />
              <text x={b[0] + 64} y={b[1] + 3.5} fill="#d68a51" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">LEVEL 0{i + 1}</text>
            </g>
          );
        })}
      </g>

      {/* members */}
      <g strokeLinecap="round">
        {members.map((m, i) => {
          const vis = visible(m);
          const gh = ghost(m);
          if (!vis && !gh) return null;
          const isHl = hl.has(m.id);
          const isChanged = changed.includes(m.id);
          const color = gh ? "#f87171" : isChanged || isHl ? "#d68a51" : "#7dd3fc";
          const op = gh ? 0.55 : hasAny && !isHl ? 0.35 : 1;
          const A = p(...m.a);
          const B = p(...m.b);
          const dPath = seg(A, B);
          return (
            <g
              key={m.id}
              onMouseEnter={interactive ? () => setActive(m.id) : undefined}
              onMouseLeave={interactive ? () => setActive(null) : undefined}
              onClick={interactive ? () => setActive((a) => (a === m.id ? null : m.id)) : undefined}
              className={interactive ? "cursor-pointer" : ""}
            >
              {interactive ? <path d={dPath} stroke="transparent" strokeWidth="14" /> : null}
              <path
                d={dPath}
                stroke={color}
                strokeWidth={isHl ? WIDTH[m.kind] + 1.2 : WIDTH[m.kind]}
                strokeDasharray={gh ? "5 4" : undefined}
                opacity={op}
                pathLength={1}
                className={animate ? "draw" : ""}
                style={{ ...(animate ? d(delayFor(m, i), "0.9s") : {}), transition: "opacity .3s, stroke .3s" }}
              />
              {m.kind !== "brace" ? <path d={dPath} stroke="#08111f" strokeWidth={WIDTH[m.kind] * 0.35} opacity={op * 0.8} /> : null}
            </g>
          );
        })}
      </g>

      {/* connection nodes + bolts */}
      {detail >= 1 ? (
        <g className={animate ? "fade-in" : ""} style={animate ? d(3500) : undefined}>
          {nodes.map((n) => {
            const q = p(...n.p);
            const glow = hl.has(n.id);
            return (
              <g key={n.id}>
                <circle cx={q[0]} cy={q[1]} r={glow ? 8 : 5.5} className="fill-ink-950" stroke={glow ? "#d68a51" : "#38bdf8"} strokeWidth="1.3" />
                {[[-2.4, -2.4], [2.4, -2.4], [2.4, 2.4], [-2.4, 2.4]].map(([a, b], i) => (
                  <circle key={i} cx={q[0] + a} cy={q[1] + b} r="0.9" fill={glow ? "#d68a51" : "#7dd3fc"} className={animate ? "rch-pulse" : ""} style={animate ? d(3800 + i * 140) : undefined} />
                ))}
              </g>
            );
          })}
        </g>
      ) : null}

      {/* dimensions */}
      {detail >= 2 ? (
        <g className="max-sm:hidden">
          <DimensionLine x1={front0[0]} y1={front0[1]} x2={mid[0]} y2={mid[1]} offset={44} label="8 000" delay={4100} />
          <DimensionLine x1={mid[0]} y1={mid[1]} x2={front2[0]} y2={front2[1]} offset={44} label="8 000" delay={4250} />
          <DimensionLine x1={h0[0]} y1={h0[1]} x2={h1[0]} y2={h1[1]} offset={-32} label="8 000" delay={4400} className="text-copper-400" />
        </g>
      ) : null}

      {/* piece marks */}
      {detail >= 3 ? (
        <g className={cn("max-sm:hidden", animate && "fade-in")} style={animate ? d(4600) : undefined}>
          {[
            { at: p(4, 0, 8), t: "BEAM B-104", dx: -30, dy: -34 },
            { at: p(16, 6, 3), t: "COLUMN C-06", dx: 34, dy: 22 },
            { at: p(8, 0, 8), t: "CONNECTION C-12", dx: -10, dy: -52 },
            { at: p(16, 0, 4), t: "PLATE P-04", dx: 52, dy: -14 },
          ].map((tg) => (
            <g key={tg.t}>
              <path d={`M${tg.at[0]} ${tg.at[1]}l${tg.dx} ${tg.dy}`} stroke="#7dd3fc" strokeWidth="0.8" opacity="0.7" />
              <rect x={tg.at[0] + tg.dx - (tg.dx < 0 ? tg.t.length * 6.6 + 12 : 0)} y={tg.at[1] + tg.dy - 11} width={tg.t.length * 6.6 + 12} height="18" className="fill-ink-950/90" stroke="#7dd3fc" strokeWidth="0.8" />
              <text x={tg.at[0] + tg.dx + (tg.dx < 0 ? -(tg.t.length * 6.6 + 6) : 6)} y={tg.at[1] + tg.dy + 2} fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="0.8">{tg.t}</text>
            </g>
          ))}
        </g>
      ) : null}

      {/* revision cloud */}
      {cloud ? (
        <g key={revision} className="fade-in" style={d(150)} transform={`translate(${cloud[0]} ${cloud[1]})`}>
          <path d="M-38 -10c-10 -12 8 -20 14 -12 6 -12 22 -10 24 0 8 -10 24 -4 20 8 12 2 14 18 0 20 4 12 -16 14 -22 6 -8 10 -26 6 -24 -4 -14 2 -18 -14 -4 -18 -8 -6 -4 -8 -8 -8z" stroke="#d68a51" strokeWidth="1.3" transform="scale(1.1)" />
        </g>
      ) : null}


      {showInfoCard ? (
        <g className="max-sm:hidden" transform="translate(402 54)">
          <rect width="214" height="74" className="fill-ink-950/90" stroke="#7dd3fc" strokeOpacity={infoText ? 0.8 : 0.3} />
          <text x="12" y="22" fill={infoText ? "#e2e8f0" : "#64748b"} fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1">{infoText ? infoText.title : "HOVER A MEMBER"}</text>
          <text x="12" y="42" fill="#94a3b8" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">{infoText ? `SECTION: ${infoText.section}` : "to read its details"}</text>
          <text x="12" y="60" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">{infoText ? "STATUS: DETAILING" : "ILLUSTRATIVE"}</text>
        </g>
      ) : null}
    </svg>
  );
}
