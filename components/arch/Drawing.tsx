import { useId } from "react";
import { makeIso, seg, loop, boxFaces } from "@/components/svg/iso";
import { B, CUT_X, ROOMS, OPENINGS, DOORS, WINDOWS, ceilingFixtures, mono, openingRect, type Opening } from "./model";

export const INK = "#111827";
export const LINE = "#334155";
export const SOFT = "#94A3B8";
export const FAINT = "#E2E8F0";
export const BLUE = "#2563EB";
export const SAND = "#C9A66B";
export const PAPER = "#FFFFFF";

type Css = React.CSSProperties;
const vars = (o: Record<string, string | number>) => o as Css;

export type PlanLayers = { grid?: boolean; walls?: boolean; openings?: boolean; labels?: boolean; dims?: boolean; furniture?: boolean; tags?: boolean; marks?: boolean };
export const ALL: PlanLayers = { grid: true, walls: true, openings: true, labels: true, dims: true, furniture: true, tags: true, marks: true };

type Anim = { draw: (d: number, t?: number) => object; fade: (d: number) => object };
function anim(on?: boolean): Anim {
  return {
    draw: (d, t = 1) => (on ? { className: "draw", pathLength: 1, style: vars({ "--d": `${d}ms`, "--t": `${t}s` }) } : {}),
    fade: (d) => (on ? { className: "fade-in", style: vars({ "--d": `${d}ms` }) } : {}),
  };
}

export type Interact = {
  hi?: string[];
  onHover?: (id: string | null) => void;
  onPick?: (id: string) => void;
  mode?: "rooms" | "openings" | "both";
};

function hitProps(id: string, label: string, i: Interact, kind: "rooms" | "openings") {
  const on = i.mode === kind || i.mode === "both";
  if (!on) return {};
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    style: { cursor: "pointer", outline: "none" } as Css,
    onPointerEnter: () => i.onHover?.(id),
    onPointerLeave: () => i.onHover?.(null),
    onFocus: () => i.onHover?.(id),
    onBlur: () => i.onHover?.(null),
    onClick: () => i.onPick?.(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        i.onPick?.(id);
      }
    },
  };
}

/* ───────── small drafting primitives ───────── */

export function Bubble({ x, y, t, r = 9, fill }: { x: number; y: number; t: string; r?: number; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill ?? PAPER} stroke={LINE} strokeWidth="1" />
      <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fill={INK} style={mono}>{t}</text>
    </g>
  );
}

export function HDim({ x1, x2, y, label, up = false }: { x1: number; x2: number; y: number; label: string; up?: boolean }) {
  const m = (x1 + x2) / 2;
  return (
    <g stroke={LINE} strokeWidth="0.8" fill="none">
      <path d={`M${x1} ${y}H${x2}M${x1} ${y - 4}V${y + 4}M${x2} ${y - 4}V${y + 4}`} />
      <path d={`M${x1 - 3} ${y + 3}L${x1 + 3} ${y - 3}M${x2 - 3} ${y + 3}L${x2 + 3} ${y - 3}`} strokeWidth="1.4" />
      <text x={m} y={up ? y - 5 : y + 12} textAnchor="middle" fontSize="8" fill={LINE} stroke="none" style={mono}>{label}</text>
    </g>
  );
}

export function VDim({ y1, y2, x, label, left = true }: { y1: number; y2: number; x: number; label: string; left?: boolean }) {
  const m = (y1 + y2) / 2;
  return (
    <g stroke={LINE} strokeWidth="0.8" fill="none">
      <path d={`M${x} ${y1}V${y2}M${x - 4} ${y1}H${x + 4}M${x - 4} ${y2}H${x + 4}`} />
      <path d={`M${x - 3} ${y1 + 3}L${x + 3} ${y1 - 3}M${x - 3} ${y2 + 3}L${x + 3} ${y2 - 3}`} strokeWidth="1.4" />
      <text x={left ? x - 5 : x + 5} y={m + 3} textAnchor={left ? "end" : "start"} fontSize="8" fill={LINE} stroke="none" style={mono}>{label}</text>
    </g>
  );
}

function Glyph({ o, hi, tags, animate, d }: { o: Opening; hi: boolean; tags: boolean; animate?: boolean; d: number }) {
  const A = anim(animate);
  const r = openingRect(o);
  const horiz = o.wall === "N" || o.wall === "S" || o.wall === "h";
  const c = hi ? BLUE : LINE;
  let tx = 0, ty = 0;
  if (o.kind === "window") {
    tx = o.wall === "E" ? o.x + 18 : o.wall === "W" ? o.x - 18 : o.x + o.w / 2;
    ty = o.wall === "N" ? o.y - 12 : o.wall === "S" ? o.y + 17 : o.y + o.w / 2 + 3;
  } else if (horiz) {
    tx = o.x + o.w / 2; ty = o.y + ((o.swing ?? -1) < 0 ? 14 : -8);
  } else {
    tx = o.x + ((o.swing ?? -1) < 0 ? 15 : -15); ty = o.y + o.w / 2 + 3;
  }
  const s = o.swing ?? -1;
  return (
    <g {...A.fade(d)}>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={PAPER} />
      {o.kind === "window" ? (
        horiz ? (
          <path d={`M${o.x} ${o.y - 3}H${o.x + o.w}M${o.x} ${o.y}H${o.x + o.w}M${o.x} ${o.y + 3}H${o.x + o.w}M${o.x} ${o.y - 3}V${o.y + 3}M${o.x + o.w} ${o.y - 3}V${o.y + 3}`} stroke={c} strokeWidth="0.9" fill="none" />
        ) : (
          <path d={`M${o.x - 3} ${o.y}V${o.y + o.w}M${o.x} ${o.y}V${o.y + o.w}M${o.x + 3} ${o.y}V${o.y + o.w}M${o.x - 3} ${o.y}H${o.x + 3}M${o.x - 3} ${o.y + o.w}H${o.x + 3}`} stroke={c} strokeWidth="0.9" fill="none" />
        )
      ) : horiz ? (
        <g stroke={c} fill="none">
          <path d={`M${o.x} ${o.y}V${o.y + s * o.w}`} strokeWidth="1.4" />
          <path d={`M${o.x + o.w} ${o.y}A${o.w} ${o.w} 0 0 ${s > 0 ? 1 : 0} ${o.x} ${o.y + s * o.w}`} strokeWidth="0.8" strokeDasharray="3 2" />
        </g>
      ) : (
        <g stroke={c} fill="none">
          <path d={`M${o.x} ${o.y}H${o.x + s * o.w}`} strokeWidth="1.4" />
          <path d={`M${o.x} ${o.y + o.w}A${o.w} ${o.w} 0 0 ${s > 0 ? 0 : 1} ${o.x + s * o.w} ${o.y}`} strokeWidth="0.8" strokeDasharray="3 2" />
        </g>
      )}
      {hi ? <rect x={r.x - 3} y={r.y - 3} width={r.w + 6} height={r.h + 6} fill={BLUE} fillOpacity="0.12" stroke={BLUE} strokeWidth="1.2" /> : null}
      {tags ? <text x={tx} y={ty} textAnchor="middle" fontSize="7.5" fill={hi ? BLUE : LINE} fontWeight={hi ? 700 : 400} style={mono}>{o.id}</text> : null}
    </g>
  );
}

/* ───────── PLAN ───────── */

export function PlanSvg({
  layers = ALL, animate, interact = {}, sketch, rev = 0, className, title, showRooms = true, marks = "both", dim: dimOn = true,
}: {
  layers?: PlanLayers; animate?: boolean; interact?: Interact; sketch?: boolean; rev?: number; className?: string; title: string;
  showRooms?: boolean; marks?: "section" | "elev" | "both"; dim?: boolean;
}) {
  const L = { ...ALL, ...layers };
  const A = anim(animate);
  const hi = interact.hi ?? [];
  const bx = rev >= 3 ? 470 : 450;
  const rooms = ROOMS.map((r) => (r.id === "bath" ? { ...r, x1: bx } : r.id === "study" ? { ...r, x0: bx } : r));
  const openings = OPENINGS.map((o) => (o.id === "D-06" && rev >= 3 ? { ...o, x: 515 } : o));
  const wallStroke = sketch ? BLUE : INK;
  const ext = `M${B.x0} ${B.y0}H${B.x1}V${B.y1}H${B.x0}Z`;
  const inner = `M300 ${B.y0}V${B.y1}M${B.x0} 230H300M300 200H${B.x1}M380 200V${B.y1}M${bx} 200V${B.y1}`;
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      {L.grid ? (
        <g {...A.fade(0)} stroke={FAINT} strokeWidth="0.6">
          {[80, 300, 560].map((x) => <path key={x} d={`M${x} 30V380`} strokeDasharray="10 3 2 3" stroke={SOFT} strokeOpacity="0.55" />)}
          {[60, 230, 340].map((y) => <path key={y} d={`M30 ${y}H600`} strokeDasharray="10 3 2 3" stroke={SOFT} strokeOpacity="0.55" />)}
          {["A", "B", "C"].map((t, i) => <Bubble key={t} x={[80, 300, 560][i]} y={22} t={t} />)}
          {["1", "2", "3"].map((t, i) => <Bubble key={t} x={22} y={[60, 230, 340][i]} t={t} />)}
        </g>
      ) : null}

      {showRooms ? (
        <g>
          {rooms.map((r) => {
            const on = hi.includes(r.id);
            return (
              <rect key={r.id} x={r.x0} y={r.y0} width={r.x1 - r.x0} height={r.y1 - r.y0} fill={on ? BLUE : "transparent"} fillOpacity={on ? 0.14 : 0}
                {...hitProps(r.id, `${r.name} ${r.tag}`, interact, "rooms")} />
            );
          })}
        </g>
      ) : null}

      {L.walls ? (
        <g stroke={wallStroke} strokeDasharray={sketch ? "7 3" : undefined} strokeOpacity={sketch ? 0.75 : 1}>
          <path d={ext} strokeWidth={sketch ? 2 : 6.5} {...A.draw(300, 1.1)} />
          <path d={inner} strokeWidth={sketch ? 1.6 : 3.6} {...A.draw(1500, 1.1)} />
        </g>
      ) : null}
      {L.walls && animate ? <path d={ext} stroke={SOFT} strokeWidth="1" strokeDasharray="3 3" className="fade-out" style={vars({ "--d": "1500ms" })} /> : null}

      {L.openings && !sketch ? openings.map((o, i) => <Glyph key={o.id} o={o} hi={hi.includes(o.id)} tags={!!L.tags} animate={animate} d={2500 + i * 50} />) : null}

      {/* stairs */}
      {L.furniture && !sketch ? (
        <g {...A.fade(2800)} stroke={LINE} strokeWidth="0.8">
          <rect x="305" y="215" width="70" height="85" />
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M305 ${222 + i * 5.6}H375`} strokeOpacity="0.55" />)}
          <path d="M340 296V228m-5 8l5-8 5 8" strokeWidth="1" />
          <text x="340" y="212" textAnchor="middle" fontSize="7" fill={LINE} style={mono}>UP</text>
        </g>
      ) : null}

      {L.furniture && !sketch ? (
        <g {...A.fade(3000)} stroke={SOFT} strokeWidth="0.8">
          <rect x="108" y="170" width="86" height="30" rx="4" /><rect x="128" y="124" width="46" height="24" rx="3" /><rect x="214" y="68" width="40" height="8" />
          <rect x="310" y="64" width="64" height="20" /><rect x="398" y="118" width="104" height="30" /><rect x="518" y="66" width="34" height="26" />
          <rect x="100" y="258" width="76" height="66" rx="3" /><rect x="104" y="262" width="30" height="14" rx="3" /><rect x="142" y="262" width="30" height="14" rx="3" /><rect x="236" y="244" width="56" height="16" />
          <rect x="386" y="206" width="54" height="24" rx="6" /><rect x="418" y="302" width="20" height="26" rx="8" /><rect x="388" y="248" width="26" height="14" />
          <rect x={bx + 14} y="302" width="64" height="26" />
        </g>
      ) : null}

      {L.labels && !sketch ? (
        <g {...A.fade(3100)} fill={INK} textAnchor="middle">
          {rooms.map((r) => {
            const cx = (r.x0 + r.x1) / 2;
            const cy = r.id === "hall" ? 308 : (r.y0 + r.y1) / 2 + (r.id === "living" ? 20 : r.id === "kitchen" ? 40 : r.id === "bed1" ? 24 : r.id === "study" ? -4 : 0);
            return (
              <g key={r.id}>
                <text x={cx} y={cy} fontSize={r.id === "hall" ? 7 : r.id === "bath" ? 8 : 10} fontWeight="600" letterSpacing="0.6">{r.name.toUpperCase()}</text>
                {r.id === "hall" ? null : <text x={cx} y={cy + 11} fontSize="7.5" fill={SOFT} style={mono}>{r.tag}</text>}
              </g>
            );
          })}
        </g>
      ) : null}

      {L.dims && dimOn && !sketch ? (
        <g {...A.fade(3600)}>
          <HDim x1={80} x2={300} y={46} label="6600" up /><HDim x1={300} x2={560} y={46} label="7800" up />
          <HDim x1={80} x2={300} y={362} label="6600" /><HDim x1={300} x2={560} y={362} label="7800" />
          <HDim x1={80} x2={560} y={380} label="14400" />
          <VDim y1={60} y2={230} x={60} label="5100" /><VDim y1={230} y2={340} x={60} label="3300" />
        </g>
      ) : null}

      {L.marks ? (
        <g {...A.fade(4400)}>
          {marks !== "section" ? (
            <g stroke={BLUE} fill={BLUE}>
              <path d="M300 396H560" strokeWidth="1" strokeDasharray="6 3" fill="none" />
              <path d="M424 404l6-9 6 9z" stroke="none" />
              <text x="446" y="408" fontSize="8" stroke="none" style={mono}>ELEV. S</text>
            </g>
          ) : null}
          {marks !== "elev" ? (
            <g {...A.fade(4900)}>
              <path d={`M${CUT_X} 30V372`} stroke={BLUE} strokeWidth="1.2" strokeDasharray="14 4 2 4" fill="none" />
              <g fill={BLUE} stroke="none"><path d={`M${CUT_X} 30l-7 -9h14z`} transform="translate(0 0)" opacity="0" /><path d={`M${CUT_X - 7} 36l7 -9 7 9z`} /><path d={`M${CUT_X - 7} 366l7 9 7 -9z`} /></g>
              <Bubble x={CUT_X + 15} y={24} t="B" fill="#DBEAFE" /><Bubble x={CUT_X + 15} y={378} t="B" fill="#DBEAFE" />
            </g>
          ) : null}
        </g>
      ) : null}

      {(interact.mode === "openings" || interact.mode === "both") && L.openings && !sketch
        ? openings.map((o) => {
            const r = openingRect(o);
            return <rect key={o.id} x={r.x - 6} y={r.y - 6} width={r.w + 12} height={r.h + 12} fill="transparent" {...hitProps(o.id, `${o.kind} ${o.id}`, interact, "openings")} />;
          })
        : null}

      {rev >= 3 ? (
        <g stroke={BLUE} strokeWidth="1.4" fill="none" className="fade-in" style={vars({ "--d": "200ms" })}>
          <path d="M436 188c8 -10 20 -4 28 -10s20 4 24 12 14 4 18 12 -2 22 -8 28 2 14 -6 20 -14 4 -22 12 -22 -2 -30 4 -14 -6 -16 -16 -4 -10 -8 -20 8 -12 4 -22 6 -10 16 -20z" strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
}

/* ───────── ELEVATION (south) ───────── */

const G = 262, F1 = 172, F2 = 82;
export function ElevSvg({ band, hi = [], className, title, animate, onPickOpening }: { band?: [number, number] | null; hi?: string[]; className?: string; title: string; animate?: boolean; onPickOpening?: (id: string) => void }) {
  const uid = useId().replace(/:/g, "");
  const A = anim(animate);
  const on = (id: string) => hi.includes(id);
  const pick = (id: string) => (onPickOpening ? { role: "button" as const, tabIndex: 0, "aria-label": id, style: { cursor: "pointer", outline: "none" } as Css, onClick: () => onPickOpening(id), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPickOpening(id); } } } : {});
  return (
    <svg viewBox="0 0 640 300" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <defs>
        <pattern id={`${uid}-h`} width="8" height="6" patternUnits="userSpaceOnUse"><path d="M0 5.5H8" stroke={SOFT} strokeWidth="0.5" strokeOpacity="0.5" /></pattern>
      </defs>
      {[80, 300, 560].map((x, i) => <g key={x}><path d={`M${x} 24V${G + 20}`} stroke={SOFT} strokeWidth="0.6" strokeDasharray="10 3 2 3" /><Bubble x={x} y={14} t={["A", "B", "C"][i]} r={8} /></g>)}
      <g {...A.fade(0)}>
        <rect x={B.x0} y={F2} width={B.x1 - B.x0} height={G - F2} fill={`url(#${uid}-h)`} stroke={INK} strokeWidth="2.2" {...A.draw(0, 1.4)} />
        <path d={`M${B.x0} ${F1}H${B.x1}`} stroke={LINE} strokeWidth="0.8" />
        <path d={`M68 ${F2 + 2}L92 40H548L572 ${F2 + 2}Z`} fill="#F1F5F9" stroke={INK} strokeWidth="1.6" />
        <path d={`M92 46H548`} stroke={SOFT} strokeWidth="0.6" />
        <path d={`M40 ${G}H600`} stroke={INK} strokeWidth="2.6" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${46 + i * 26} ${G}l-6 8`} stroke={SOFT} strokeWidth="0.6" />)}
      </g>
      <g stroke={LINE} strokeWidth="1">
        {[[130, 220], [310, 380], [480, 530]].map(([a, b]) => <rect key={a} x={a} y={F1 - 70} width={b - a} height={40} fill="#EFF6FF" />)}
        {[[130, 220, "W-05"], [480, 530, "W-06"]].map(([a, b, id]) => (
          <g key={id as string} {...pick(id as string)}>
            <rect x={a as number} y={192} width={(b as number) - (a as number)} height={40} fill={on(id as string) ? "#BFDBFE" : "#EFF6FF"} stroke={on(id as string) ? BLUE : LINE} strokeWidth={on(id as string) ? 2.4 : 1} />
            <path d={`M${((a as number) + (b as number)) / 2} 192V232`} />
            <text x={((a as number) + (b as number)) / 2} y={247} textAnchor="middle" fontSize="7.5" fill={on(id as string) ? BLUE : LINE} stroke="none" style={mono}>{id as string}</text>
          </g>
        ))}
        <g {...pick("D-01")}>
          <rect x={325} y={192} width={30} height={70} fill={on("D-01") ? "#BFDBFE" : "#F8FAFC"} stroke={on("D-01") ? BLUE : LINE} strokeWidth={on("D-01") ? 2.4 : 1} />
          <circle cx={350} cy={228} r="1.6" fill={LINE} stroke="none" />
          <text x={340} y={186} textAnchor="middle" fontSize="7.5" fill={on("D-01") ? BLUE : LINE} stroke="none" style={mono}>D-01</text>
        </g>
      </g>
      {band ? (
        <g><rect x={band[0]} y={28} width={band[1] - band[0]} height={G - 28} fill={BLUE} fillOpacity="0.13" stroke={BLUE} strokeWidth="1" strokeDasharray="5 3" /></g>
      ) : null}
      <g {...A.fade(900)}>
        <VDim y1={F2} y2={F1} x={52} label="2700" /><VDim y1={F1} y2={G} x={52} label="2700" />
        {[[G, "±0.00"], [F1, "+2.70"], [F2, "+5.40"]].map(([y, t]) => (
          <g key={t as string}><path d={`M572 ${y}H592`} stroke={LINE} strokeWidth="0.8" /><path d={`M582 ${(y as number) - 8}l-5 -0.001`} /><path d={`M578 ${y}l4 -6 4 6z`} fill={INK} stroke="none" /><text x={596} y={(y as number) + 3} fontSize="8" fill={INK} stroke="none" style={mono}>{t as string}</text></g>
        ))}
      </g>
    </svg>
  );
}

/* ───────── SECTION B-B ───────── */

export const sx = (y: number) => y + 150;
const STAIR = (() => {
  const n = 14;
  const dx = (450 - 365) / n, dy = (G - F1) / n;
  let d = `M450 ${G}`;
  for (let i = 0; i < n; i++) d += `V${(G - dy * (i + 1)).toFixed(1)}H${(450 - dx * (i + 1)).toFixed(1)}`;
  return d;
})();

export function SectionSvg({ band, className, title, animate }: { band?: [number, number] | null; className?: string; title: string; animate?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const A = anim(animate);
  const cut = `url(#${uid}-p)`;
  return (
    <svg viewBox="100 0 455 300" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <defs>
        <pattern id={`${uid}-p`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke={INK} strokeWidth="1.1" /></pattern>
      </defs>
      {band ? <rect x={band[0]} y={28} width={band[1] - band[0]} height={G - 28} fill={BLUE} fillOpacity="0.13" stroke={BLUE} strokeWidth="1" strokeDasharray="5 3" /> : null}
      <g {...A.fade(0)}>
        <path d={`M120 ${G}H520`} stroke={INK} strokeWidth="2.6" />
        <rect x={204} y={G} width={292} height={8} fill={cut} stroke={INK} strokeWidth="1" />
        {/* floor slab with stair opening */}
        <rect x={204} y={F1 - 4} width={161} height={8} fill={cut} stroke={INK} strokeWidth="1" />
        <rect x={450} y={F1 - 4} width={46} height={8} fill={cut} stroke={INK} strokeWidth="1" />
        {/* walls: north, partition (door opening), south (door opening) */}
        <rect x={206} y={F2} width={8} height={G - F2} fill={cut} stroke={INK} strokeWidth="1" />
        <rect x={346} y={46} width={8} height={192 - 46 - 0} fill={cut} stroke={INK} strokeWidth="1" />
        <rect x={486} y={F2} width={8} height={192 - F2} fill={cut} stroke={INK} strokeWidth="1" />
        <path d="M350 190h-30M490 190h-30" stroke={LINE} strokeWidth="0.6" strokeDasharray="2 2" opacity="0" />
        {/* roof */}
        <path d={`M196 ${F2 + 4}L350 40L504 ${F2 + 4}`} stroke={INK} strokeWidth="2" />
        <path d={`M196 ${F2 + 10}L350 47L504 ${F2 + 10}`} stroke={LINE} strokeWidth="0.9" />
        {/* stair */}
        <path d={STAIR} stroke={LINE} strokeWidth="1.2" />
        <path d={`M450 ${G - 30}L365 ${F1 - 30}`} stroke={SOFT} strokeWidth="0.8" />
        <path d={`M450 ${G}L365 ${F1}`} stroke={SOFT} strokeWidth="0.6" strokeDasharray="3 2" />
        <g fill={INK} stroke="none" fontSize="8" textAnchor="middle" style={mono}>
          <text x={280} y={218} fill={SOFT}>KITCHEN</text><text x={420} y={282} fill={SOFT}>HALL</text><text x={280} y={130} fill={SOFT}>FIRST FLOOR</text>
          <text x={350} y={290} fill={INK} fontSize="9" letterSpacing="1.4">SECTION B-B</text>
        </g>
      </g>
      <g {...A.fade(800)}>
        <VDim y1={F2} y2={F1} x={186} label="2700" /><VDim y1={F1} y2={G} x={186} label="2700" />
        {[[G, "±0.00"], [F1, "+2.70"], [F2, "+5.40"]].map(([y, t]) => (
          <g key={t as string}><path d={`M496 ${y}H508`} stroke={LINE} strokeWidth="0.8" /><path d={`M501 ${y}l4 -6 4 6z`} transform="translate(-3 0)" fill={INK} stroke="none" /><text x={512} y={(y as number) + 3} fontSize="8" fill={INK} stroke="none" style={mono}>{t as string}</text></g>
        ))}
      </g>
    </svg>
  );
}

/* ───────── 3D MASSING ───────── */

export function MassSvg({ rise = 1, hi = [], cut, className, title }: { rise?: number; hi?: string[]; cut?: boolean; className?: string; title: string }) {
  const s = 0.7;
  const p = makeIso(247, 118, s);
  const h = Math.max(0, Math.min(1, rise));
  const zt = B.storey * 2 * h;
  const ym = (B.y0 + B.y1) / 2;
  const rr = B.roof * h;
  const south = (a: number, b: number, z0: number, z1: number) => loop(p(a, B.y1, z0 * h), p(b, B.y1, z0 * h), p(b, B.y1, z1 * h), p(a, B.y1, z1 * h));
  const east = (a: number, b: number, z0: number, z1: number) => loop(p(B.x1, a, z0 * h), p(B.x1, b, z0 * h), p(B.x1, b, z1 * h), p(B.x1, a, z1 * h));
  const [fl, fr, ft] = boxFaces(p, B.x0, B.y0, 0, B.x1, B.y1, zt);
  const fp = loop(p(B.x0, B.y0, 0), p(B.x1, B.y0, 0), p(B.x1, B.y1, 0), p(B.x0, B.y1, 0));
  const detail = h > 0.7;
  return (
    <svg viewBox="0 0 640 450" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <path d={loop(p(B.x0 - 20, B.y0 - 20, 0), p(B.x1 + 20, B.y0 - 20, 0), p(B.x1 + 20, B.y1 + 20, 0), p(B.x0 - 20, B.y1 + 20, 0))} fill="#F1F5F9" stroke={FAINT} strokeWidth="1" />
      <path d={fp} fill="#FFFFFF" stroke={INK} strokeWidth="1.6" />
      {h < 0.05 ? [300].map((x) => <path key={x} d={seg(p(x, B.y0, 0), p(x, B.y1, 0)) + seg(p(B.x0, 230, 0), p(300, 230, 0)) + seg(p(300, 200, 0), p(B.x1, 200, 0))} stroke={LINE} strokeWidth="1.2" />) : null}
      {h > 0 ? (
        <g stroke={INK} strokeWidth="1.4">
          <path d={fl} fill="#FFFFFF" /><path d={fr} fill="#E2E8F0" />
          <path d={seg(p(B.x0, B.y1, zt / 2), p(B.x1, B.y1, zt / 2)) + seg(p(B.x1, B.y1, zt / 2), p(B.x1, B.y0, zt / 2))} stroke={SOFT} strokeWidth="0.8" />
          {detail ? (
            <g stroke={LINE} strokeWidth="1" strokeOpacity={Math.min(1, (h - 0.7) * 3.4)}>
              <path d={south(130, 220, 30, 70)} fill="#DBEAFE" /><path d={south(480, 530, 30, 70)} fill="#DBEAFE" /><path d={south(325, 355, 0, 70)} fill="#F8FAFC" />
              {[[130, 220], [310, 380], [480, 530]].map(([a, b]) => <path key={a} d={south(a, b, 112, 148)} fill="#DBEAFE" />)}
              <path d={east(95, 165, 30, 70)} fill="#DBEAFE" /><path d={east(260, 310, 112, 148)} fill="#DBEAFE" />
            </g>
          ) : null}
          {/* gable roof, south slope + east gable */}
          <path d={loop(p(B.x0 - 12, B.y1 + 12, zt), p(B.x1 + 12, B.y1 + 12, zt), p(B.x1 + 12, ym, zt + rr), p(B.x0 - 12, ym, zt + rr))} fill="#CBD5E1" />
          <path d={loop(p(B.x1, B.y0, zt), p(B.x1, B.y1, zt), p(B.x1, ym, zt + rr))} fill="#E2E8F0" />
          <path d={ft} fill="none" strokeOpacity="0" />
        </g>
      ) : null}
      {ROOMS.filter((r) => hi.includes(r.id)).map((r) => {
        const [a, b, c] = boxFaces(p, r.x0, r.y0, 0, r.x1, r.y1, B.storey * h);
        return (
          <g key={r.id} fill={BLUE} fillOpacity="0.28" stroke={BLUE} strokeWidth="1.4">
            <path d={a} /><path d={b} /><path d={c} />
          </g>
        );
      })}
      {cut && h > 0.3 ? (
        <g><path d={loop(p(CUT_X, B.y0 - 14, 0), p(CUT_X, B.y1 + 14, 0), p(CUT_X, B.y1 + 14, zt + rr + 10), p(CUT_X, B.y0 - 14, zt + rr + 10))} fill={SAND} fillOpacity="0.22" stroke={SAND} strokeWidth="1.4" strokeDasharray="6 3" /></g>
      ) : null}
    </svg>
  );
}

/* ───────── REFLECTED CEILING PLAN ───────── */

export function RcpSvg({ className, title, animate, hi = [] }: { className?: string; title: string; animate?: boolean; hi?: string[] }) {
  const uid = useId().replace(/:/g, "");
  const A = anim(animate);
  const ext = `M${B.x0} ${B.y0}H${B.x1}V${B.y1}H${B.x0}Z`;
  const inner = `M300 ${B.y0}V${B.y1}M${B.x0} 230H300M300 200H${B.x1}M380 200V${B.y1}M450 200V${B.y1}`;
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <defs>
        <pattern id={`${uid}-g`} width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" stroke={SOFT} strokeWidth="0.4" strokeOpacity="0.8" /></pattern>
        <pattern id={`${uid}-d`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke={SAND} strokeWidth="0.8" /></pattern>
      </defs>
      <path d={ext} stroke={INK} strokeWidth="6" opacity="0.25" />
      <path d={inner} stroke={INK} strokeWidth="3" opacity="0.2" />
      <g {...A.fade(200)}>
        <rect x="86" y="66" width="208" height="158" fill={`url(#${uid}-g)`} stroke={LINE} strokeWidth="0.9" strokeDasharray="5 3" />
        <rect x="306" y="66" width="248" height="128" stroke={LINE} strokeWidth="0.9" strokeDasharray="5 3" />
        <rect x="386" y="206" width="58" height="128" fill={`url(#${uid}-d)`} stroke={SAND} strokeWidth="0.9" />
        <rect x="456" y="206" width="98" height="128" stroke={LINE} strokeWidth="0.9" strokeDasharray="5 3" />
        <rect x="86" y="236" width="208" height="98" stroke={LINE} strokeWidth="0.9" strokeDasharray="5 3" />
        <rect x="306" y="206" width="68" height="128" stroke={LINE} strokeWidth="0.9" strokeDasharray="5 3" />
        <rect x="390" y="76" width="92" height="46" stroke={BLUE} strokeWidth="1" strokeDasharray="2 3" fill={BLUE} fillOpacity="0.05" />
        <text x="436" y="102" textAnchor="middle" fontSize="7.5" fill={BLUE} style={mono}>SERVICES ZONE</text>
      </g>
      <g {...A.fade(900)}>
        {ceilingFixtures.map((f) => (
          <g key={f.id}>
            <circle cx={f.x} cy={f.y} r="7" fill={hi.includes(f.id) ? "#DBEAFE" : PAPER} stroke={hi.includes(f.id) ? BLUE : INK} strokeWidth="1.2" />
            <path d={`M${f.x - 5} ${f.y}H${f.x + 5}M${f.x} ${f.y - 5}V${f.y + 5}`} stroke={hi.includes(f.id) ? BLUE : INK} strokeWidth="0.8" />
            <text x={f.x} y={f.y + 18} textAnchor="middle" fontSize="7.5" fill={LINE} style={mono}>{f.id}</text>
          </g>
        ))}
      </g>
      <g fontSize="8" fill={INK} textAnchor="middle" style={mono} {...A.fade(1100)}>
        <text x="190" y="205">CLG-1 · PLASTERBOARD</text><text x="415" y="188">CLG-1</text><text x="415" y="354" fill={SAND}>CLG-2 · WET AREA</text>
        <text x="505" y="196" fill={SOFT}>BULKHEAD LINE</text>
      </g>
      <g stroke={LINE} fill="none" strokeWidth="0.8" {...A.fade(1300)}>
        <path d="M456 206V334" strokeDasharray="1 3" />
        <text x="505" y="350" fontSize="8" fill={LINE} stroke="none" textAnchor="middle" style={mono}>BOUNDARY</text>
      </g>
    </svg>
  );
}

/* ───────── SITE & SETBACK ───────── */

const sp = (x: number, y: number): [number, number] => [170 + (x - 80) * 0.62, 120 + (y - 60) * 0.62];
export type SetbackId = "front" | "rear" | "left" | "right";
const BOUND: [number, number][] = [[60, 48], [584, 40], [592, 380], [52, 388]];
const EDGE: Record<SetbackId, { sb: string; bld: string; bnd: string; label: string; lx: number; ly: number; an: "start" | "end" }> = {
  front: { sb: "M92 318L548 312", bld: `M${sp(80, 340).join(" ")}L${sp(560, 340).join(" ")}`, bnd: "M52 388L592 380", label: "FRONT SETBACK", lx: 100, ly: 334, an: "start" },
  rear: { sb: "M72 104L572 100", bld: `M${sp(80, 60).join(" ")}L${sp(560, 60).join(" ")}`, bnd: "M60 48L584 40", label: "REAR SETBACK", lx: 100, ly: 92, an: "start" },
  left: { sb: "M124 100L120 318", bld: `M${sp(80, 60).join(" ")}L${sp(80, 340).join(" ")}`, bnd: "M60 48L52 388", label: "SIDE", lx: 132, ly: 210, an: "start" },
  right: { sb: "M522 100L518 312", bld: `M${sp(560, 60).join(" ")}L${sp(560, 340).join(" ")}`, bnd: "M584 40L592 380", label: "SIDE", lx: 510, ly: 210, an: "end" },
};
export const SETBACKS = (Object.keys(EDGE) as SetbackId[]).map((id) => ({ id, label: EDGE[id].label }));

export function SiteSvg({ active, onActive, className, title }: { active?: SetbackId | null; onActive?: (id: SetbackId | null) => void; className?: string; title: string }) {
  const [x0, y0] = sp(B.x0, B.y0);
  const [x1, y1] = sp(B.x1, B.y1);
  const [dx] = sp(340, 340);
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <path d={`M${BOUND.map((q) => q.join(" ")).join("L")}Z`} fill="#FAFAF9" stroke={INK} strokeWidth="1.6" strokeDasharray="14 4 2 4" />
      <path d={`M${x0} ${y0}H${x1}V${y1}H${x0}Z`} fill="#E2E8F0" stroke={INK} strokeWidth="3" />
      <path d={`M${sp(300, 60).join(" ")}V${y1}M${x0} ${sp(80, 230)[1]}H${sp(300, 230)[0]}M${sp(300, 200).join(" ")}H${x1}`} stroke={LINE} strokeWidth="1.2" />
      <text x={x0 + 8} y={y0 + 16} fontSize="8" fontWeight="600" letterSpacing="1" fill={INK}>BUILDING FOOTPRINT</text>
      <path d={`M${dx - 12} ${y1}V400h24V${y1}`} fill="#F1F5F9" stroke={SOFT} strokeWidth="1" />
      <text x={dx + 18} y="352" fontSize="7.5" fill={LINE} style={mono}>ACCESS</text>
      <rect x="40" y="404" width="560" height="26" fill="#F1F5F9" stroke={FAINT} /><text x="320" y="421" textAnchor="middle" fontSize="8" letterSpacing="2" fill={SOFT} style={mono}>STREET</text>
      {(Object.keys(EDGE) as SetbackId[]).map((id) => {
        const e = EDGE[id];
        const on = active === id;
        return (
          <g key={id}>
            {on ? <><path d={e.bld} stroke={BLUE} strokeWidth="5" /><path d={e.bnd} stroke={BLUE} strokeWidth="3" /></> : null}
            <path d={e.sb} stroke={on ? BLUE : SAND} strokeWidth="1.6" strokeDasharray="7 4" />
            <path d={e.sb} stroke="transparent" strokeWidth="18"
              role="button" tabIndex={0} aria-label={`${e.label} line`} style={{ cursor: "pointer", outline: "none" }}
              onPointerEnter={() => onActive?.(id)} onPointerLeave={() => onActive?.(null)} onFocus={() => onActive?.(id)} onBlur={() => onActive?.(null)} />
            <text x={e.lx} y={e.ly} textAnchor={e.an} fontSize="7.5" fill={on ? BLUE : "#9A7B43"} style={mono}>{e.label}</text>
          </g>
        );
      })}
      <g transform="translate(612 76)"><circle r="14" fill={PAPER} stroke={LINE} /><path d="M0 -10L5 8L0 4L-5 8Z" fill={INK} /><text y="-17" textAnchor="middle" fontSize="8" fill={INK} style={mono}>N</text></g>
      <HDim x1={52} x2={592} y={16} label="SITE WIDTH · ILLUSTRATIVE" up />
    </svg>
  );
}

/* ───────── JOINERY ───────── */

export function JoinerySvg({ stage, className, title }: { stage: 0 | 1 | 2 | 3; className?: string; title: string }) {
  const uid = useId().replace(/:/g, "");
  const f = (d: number) => ({ className: "fade-in", style: vars({ "--d": `${d}ms` }) });
  return (
    <svg viewBox="0 0 640 380" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <defs>
        <pattern id={`${uid}-p`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke={INK} strokeWidth="1" /></pattern>
        <pattern id={`${uid}-w`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke={SOFT} strokeWidth="0.7" /></pattern>
      </defs>
      {stage === 0 ? (
        <g>
          <path d="M60 60H580M60 60V320H580V60" stroke={SOFT} strokeWidth="5" strokeOpacity="0.5" />
          <rect x="180" y="70" width="280" height="64" fill={`url(#${uid}-w)`} stroke={INK} strokeWidth="2" className="fade-in" />
          <path d="M180 70L460 134M460 70L180 134" stroke={SOFT} strokeWidth="0.8" />
          <text x="320" y="156" textAnchor="middle" fontSize="11" fontWeight="600" fill={INK}>J-01 · COUNTER UNIT</text>
          <g {...f(500)}><HDim x1={180} x2={460} y={52} label="1800" up /><VDim y1={70} y2={134} x={166} label="600" /></g>
          <text x="320" y="230" textAnchor="middle" fontSize="9" fill={SOFT} style={mono}>PLAN SYMBOL · WHERE IT SITS IN THE LAYOUT</text>
        </g>
      ) : null}
      {stage === 1 ? (
        <g>
          <path d="M60 300H580" stroke={INK} strokeWidth="2.4" />
          <rect x="120" y="150" width="400" height="14" fill={`url(#${uid}-w)`} stroke={INK} strokeWidth="1.6" />
          <rect x="130" y="164" width="380" height="124" stroke={INK} strokeWidth="2" />
          <rect x="130" y="288" width="380" height="12" stroke={LINE} fill="#F1F5F9" />
          {[0, 1, 2].map((i) => <rect key={i} x={138 + i * 124} y={172} width={118} height={108} stroke={LINE} strokeWidth="1.2" />)}
          {[0, 1, 2].map((i) => <path key={i} d={`M${242 + i * 124} 214v24`} stroke={INK} strokeWidth="2.4" />)}
          <g {...f(300)}><HDim x1={130} x2={510} y={330} label="1800" /><VDim y1={150} y2={300} x={90} label="900" /><VDim y1={164} y2={288} x={540} label="780" left={false} /></g>
          <Bubble x={190} y={126} t="M1" fill="#FEF3C7" /><Bubble x={450} y={126} t="H1" fill="#FEF3C7" />
          <path d="M190 135V172M450 135V218" stroke={SAND} strokeWidth="0.8" />
          <text x="320" y="364" textAnchor="middle" fontSize="9" fill={SOFT} style={mono}>ELEVATION · PANELS, DOORS, HARDWARE REFERENCE</text>
        </g>
      ) : null}
      {stage === 2 ? (
        <g>
          <path d="M80 330H560" stroke={INK} strokeWidth="2.4" />
          <rect x="200" y="300" width="260" height="30" fill="#F1F5F9" stroke={LINE} />
          <rect x="196" y="80" width="10" height="220" fill={`url(#${uid}-p)`} stroke={INK} />
          <rect x="454" y="80" width="10" height="220" fill={`url(#${uid}-p)`} stroke={INK} />
          <rect x="196" y="70" width="268" height="16" fill={`url(#${uid}-p)`} stroke={INK} />
          <rect x="206" y="180" width="248" height="10" fill={`url(#${uid}-p)`} stroke={INK} />
          <rect x="206" y="288" width="248" height="12" fill={`url(#${uid}-p)`} stroke={INK} />
          <rect x="454" y="86" width="6" height="214" stroke={LINE} fill="#F8FAFC" />
          <circle cx="470" cy="200" r="3" fill={INK} />
          <g {...f(200)}>
            <VDim y1={70} y2={300} x={150} label="900" /><HDim x1={196} x2={464} y={52} label="600" up />
            <VDim y1={180} y2={190} x={510} label="18" left={false} /><VDim y1={86} y2={180} x={150 + 20} label="" />
          </g>
          <Bubble x={560} y={140} t="M1" fill="#FEF3C7" /><path d="M551 140H462" stroke={SAND} strokeWidth="0.8" />
          <Bubble x={560} y={200} t="H1" fill="#FEF3C7" /><path d="M551 200H474" stroke={SAND} strokeWidth="0.8" />
          <text x="330" y="364" textAnchor="middle" fontSize="9" fill={SOFT} style={mono}>SECTION · PANEL THICKNESS, SHELF, KICKBOARD</text>
        </g>
      ) : null}
      {stage === 3 ? (
        <g>
          <rect x="130" y="50" width="380" height="270" fill="#FFFFFF" stroke={LINE} strokeWidth="0.8" strokeDasharray="5 3" />
          <rect x="160" y="80" width="150" height="200" fill={`url(#${uid}-p)`} stroke={INK} strokeWidth="2" />
          <rect x="330" y="80" width="18" height="200" fill="#F8FAFC" stroke={INK} strokeWidth="2" />
          <rect x="316" y="120" width="14" height="22" stroke={LINE} fill="#F1F5F9" strokeWidth="1.4" />
          <path d="M330 126H348" stroke={LINE} strokeWidth="1.4" /><circle cx="324" cy="131" r="2.4" fill={INK} />
          <g {...f(100)}>
            <HDim x1={160} x2={310} y={300} label="150" /><HDim x1={310} x2={330} y={316} label="3" /><HDim x1={330} x2={348} y={332} label="18" />
            <VDim y1={80} y2={280} x={134} label="760" />
          </g>
          <Bubble x={420} y={110} t="H1" fill="#FEF3C7" /><path d="M411 110H333" stroke={SAND} strokeWidth="0.8" />
          <Bubble x={420} y={180} t="M1" fill="#FEF3C7" /><path d="M411 180H312" stroke={SAND} strokeWidth="0.8" />
          <text x="130" y="42" fontSize="11" fontWeight="600" fill={INK} letterSpacing="1">DETAIL A</text><text x="214" y="42" fontSize="8" fill={SOFT} style={mono}>DOOR TO FIXED PANEL JUNCTION</text>
        </g>
      ) : null}
    </svg>
  );
}

/* ───────── TITLE BLOCK ───────── */

export function TitleBlock({ className, status = "FOR REVIEW", rev = "B" }: { className?: string; status?: string; rev?: string }) {
  return (
    <svg viewBox="0 0 400 120" className={className} role="img" aria-label="Illustrative architectural drawing title block" fill="none">
      <rect x="1" y="1" width="398" height="118" stroke={INK} strokeWidth="1.6" />
      <path d="M1 40H399M1 80H399M260 40V119M330 40V119" stroke={LINE} strokeWidth="0.8" />
      <text x="14" y="26" fontSize="12" fontWeight="700" fill={INK} letterSpacing="1">ILLUSTRATIVE RESIDENCE</text>
      <text x="14" y="62" fontSize="9" fill={LINE} style={mono}>GROUND FLOOR PLAN</text>
      <text x="14" y="102" fontSize="9" fill={LINE} style={mono}>SCALE: ILLUSTRATIVE</text>
      {[["DRAWING", "A-101", 270, 54], ["REV", rev, 340, 54], ["SHEET", "A-03", 270, 94], ["STATUS", status, 340, 94]].map(([k, v, x, y]) => (
        <g key={k as string}><text x={x as number} y={(y as number) - 8} fontSize="6.5" fill={SOFT} style={mono}>{k as string}</text><text x={x as number} y={(y as number) + 4} fontSize={(v as string).length > 5 ? 7.5 : 11} fontWeight="600" fill={INK} style={mono}>{v as string}</text></g>
      ))}
    </svg>
  );
}

export { DOORS, WINDOWS };
