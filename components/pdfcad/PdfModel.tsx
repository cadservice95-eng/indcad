import { useId } from "react";

export const mono = { fontFamily: "var(--font-mono)" } as const;
export const Z = { navy: "#0B1220", surf: "#101A2E", blue: "#2563EB", cyan: "#38BDF8", ink: "#1F2937", amber: "#F59E0B", green: "#22C55E", red: "#EF4444" };

export type Disc = "arch" | "struct" | "mech" | "civil" | "elec";
type Kind = "line" | "poly" | "arc" | "circle" | "hatch" | "text" | "dim" | "block";
export type Ent = { id: string; kind: Kind; layer: string; d?: string; t?: string; x?: number; y?: number; r?: number; s?: number };

const L = (id: string, kind: Kind, layer: string, d: string): Ent => ({ id, kind, layer, d });
const T = (id: string, layer: string, t: string, x: number, y: number, s = 12): Ent => ({ id, kind: "text", layer, t, x, y, s });
const C = (id: string, layer: string, x: number, y: number, r: number): Ent => ({ id, kind: "circle", layer, x, y, r });

export const DRAW: Record<Disc, { name: string; ents: Ent[] }> = {
  arch: {
    name: "Architectural plan",
    ents: [
      L("w1", "poly", "A-WALL", "M90 120H510V330H90Z"), L("w2", "line", "A-WALL", "M300 120V240"), L("w3", "line", "A-WALL", "M300 290V330"), L("w4", "line", "A-WALL", "M90 220H300"), L("w5", "line", "A-WALL", "M300 210H510"),
      L("d1", "arc", "A-DOOR", "M300 240V290M300 240A50 50 0 0 1 350 290"), L("d2", "arc", "A-DOOR", "M170 330V300M170 300A30 30 0 0 1 200 330"),
      L("win1", "line", "A-WIND", "M140 116H230M140 124H230"), L("win2", "line", "A-WIND", "M390 116H470M390 124H470"),
      { id: "h1", kind: "hatch", layer: "A-HATCH", d: "M296 120h8v120h-8z" }, { id: "h2", kind: "hatch", layer: "A-HATCH", d: "M396 250h74v56h-74z" },
      C("c1", "A-WALL", 140, 280, 9),
      L("dim1", "dim", "A-DIMS", "M90 86H300M90 78V94M300 78V94M85 91l10 -10M295 91l10 -10"), L("dim2", "dim", "A-DIMS", "M300 86H510M510 78V94M505 91l10 -10"), L("dim3", "dim", "A-DIMS", "M548 120V330M540 120H556M540 330H556M543 125l10 -10M543 335l10 -10"),
      T("t1", "A-DIMS", "3500", 195, 80, 10), T("t2", "A-DIMS", "3500", 405, 80, 10), T("t3", "A-DIMS", "4200", 568, 228, 10),
      T("t4", "A-TEXT", "OFFICE", 195, 175, 13), T("t5", "A-TEXT", "WORKSHOP", 405, 165, 13), T("t6", "A-TEXT", "STORE", 195, 280, 13), T("t7", "A-TEXT", "GROUND FLOOR PLAN", 90, 372, 12),
    ],
  },
  struct: {
    name: "Structural framing plan",
    ents: [
      ...[120, 300, 480].map((x) => L(`g${x}`, "line", "S-GRID", `M${x} 90V350`)), ...[140, 240, 330].map((y) => L(`gy${y}`, "line", "S-GRID", `M80 ${y}H520`)),
      ...[120, 300, 480].flatMap((x) => [140, 240, 330].map((y) => L(`c${x}${y}`, "block", "S-COLS", `M${x - 8} ${y - 8}h16v16h-16z`))),
      L("b1", "poly", "S-BEAM", "M128 140H292M308 140H472"), L("b2", "poly", "S-BEAM", "M128 240H292M308 240H472"), L("b3", "poly", "S-BEAM", "M128 330H292M308 330H472"),
      L("b4", "poly", "S-BEAM", "M120 148V232M120 248V322"), L("b5", "poly", "S-BEAM", "M300 148V232M300 248V322"), L("b6", "poly", "S-BEAM", "M480 148V232M480 248V322"),
      { id: "h1", kind: "hatch", layer: "S-HATCH", d: "M308 148h164v84h-164z" },
      L("dim1", "dim", "S-DIMS", "M120 66H300M120 58V74M300 58V74M115 71l10 -10M295 71l10 -10"), L("dim2", "dim", "S-DIMS", "M300 66H480M480 58V74M475 71l10 -10"),
      T("t1", "S-DIMS", "6000", 210, 60, 10), T("t2", "S-DIMS", "6000", 390, 60, 10), T("t3", "S-TEXT", "B1 · 250UB", 210, 134, 10), T("t4", "S-TEXT", "C1", 120, 118, 11), T("t5", "S-TEXT", "ROOF FRAMING PLAN", 90, 385, 12),
    ],
  },
  mech: {
    name: "Mechanical part",
    ents: [
      L("p1", "poly", "M-PART", "M130 120H490a20 20 0 0 1 20 20V300a20 20 0 0 1 -20 20H130a20 20 0 0 1 -20 -20V140a20 20 0 0 1 20 -20Z"),
      C("o1", "M-PART", 170, 170, 14), C("o2", "M-PART", 450, 170, 14), C("o3", "M-PART", 170, 270, 14), C("o4", "M-PART", 450, 270, 14), C("o5", "M-PART", 310, 220, 44), C("o6", "M-PART", 310, 220, 24),
      L("cl1", "line", "M-CENT", "M310 110V330M100 220H520M170 150V290M450 150V290"),
      L("hid", "line", "M-HIDDEN", "M200 120V60M420 120V60"),
      { id: "h1", kind: "hatch", layer: "M-HATCH", d: "M290 160h40v8h-40z" },
      L("dim1", "dim", "M-DIMS", "M110 92H510M110 84V100M510 84V100M105 97l10 -10M505 97l10 -10"), L("dim2", "dim", "M-DIMS", "M560 120V320M552 120H568M552 320H568M555 125l10 -10M555 325l10 -10"),
      T("t1", "M-DIMS", "400", 310, 86, 10), T("t2", "M-DIMS", "200", 582, 224, 10), T("t3", "M-TEXT", "Ø88", 360, 160, 10), T("t4", "M-TEXT", "4× Ø28", 170, 140, 10), T("t5", "M-TEXT", "MOUNTING PLATE", 110, 372, 12),
    ],
  },
  civil: {
    name: "Civil site plan",
    ents: [
      L("s1", "poly", "C-SITE", "M100 110L500 100L520 320L90 335Z"), L("r1", "arc", "C-ROAD", "M60 380Q250 330 330 360T580 340"), L("r2", "arc", "C-ROAD", "M60 400Q250 350 330 380T580 360"),
      L("ct1", "arc", "C-CONT", "M110 150Q260 130 400 160T510 150"), L("ct2", "arc", "C-CONT", "M105 200Q260 180 410 215T515 200"), L("ct3", "arc", "C-CONT", "M100 260Q260 240 420 270T518 260"),
      L("dr1", "line", "C-DRAN", "M300 340V230L220 190L220 130"), L("dr2", "line", "C-DRAN", "M300 230L400 200"),
      C("mh1", "C-DRAN", 300, 230, 7), C("mh2", "C-DRAN", 220, 190, 7),
      L("bld", "block", "C-SITE", "M330 150h100v70h-100z"), { id: "h1", kind: "hatch", layer: "C-HATCH", d: "M330 150h100v70h-100z" },
      L("dim1", "dim", "C-DIMS", "M100 82H500M100 74V90M500 74V90M95 87l10 -10M495 87l10 -10"), T("t1", "C-DIMS", "BOUNDARY", 300, 76, 10),
      T("t2", "C-TEXT", "PROPOSED BUILDING", 380, 190, 10), T("t3", "C-TEXT", "STORMWATER", 262, 250, 10), T("t4", "C-TEXT", "SITE PLAN", 90, 392, 12), T("t5", "C-TEXT", "ACCESS ROAD", 440, 395, 10),
    ],
  },
  elec: {
    name: "Electrical single-line / panel",
    ents: [
      L("pn", "block", "E-PANEL", "M90 110h120v220h-120z"), L("pn2", "line", "E-PANEL", "M90 150H210"),
      ...[0, 1, 2, 3].map((i) => L(`ck${i}`, "line", "E-CIRC", `M210 ${180 + i * 38}H340`)),
      ...[0, 1, 2, 3].map((i) => C(`lm${i}`, "E-SYMB", 360, 180 + i * 38, 14)), ...[0, 1, 2, 3].map((i) => L(`lx${i}`, "line", "E-SYMB", `M${350} ${170 + i * 38}l20 20M${370} ${170 + i * 38}l-20 20`)),
      L("sw", "line", "E-SYMB", "M400 180H470M470 180l12 -10"), L("mt", "block", "E-SYMB", "M440 250h60v50h-60z"),
      { id: "h1", kind: "hatch", layer: "E-HATCH", d: "M444 254h52v10h-52z" },
      L("dim1", "dim", "E-DIMS", "M90 90H210M90 82V98M210 82V98M85 95l10 -10M205 95l10 -10"), T("t1", "E-DIMS", "600", 150, 84, 10),
      T("t2", "E-TEXT", "DB-1", 150, 135, 13), ...[0, 1, 2, 3].map((i) => T(`tc${i}`, "E-TEXT", `C${i + 1}`, 275, 174 + i * 38, 10)), T("t3", "E-TEXT", "METER", 470, 322, 10), T("t4", "E-TEXT", "MAIN SWITCHBOARD", 90, 372, 12),
    ],
  },
};

const LC: Record<string, string> = { WALL: "#E2E8F0", PART: "#E2E8F0", SITE: "#E2E8F0", COLS: "#E2E8F0", PANEL: "#E2E8F0", DOOR: "#38BDF8", WIND: "#60A5FA", BEAM: "#38BDF8", ROAD: "#38BDF8", SYMB: "#38BDF8", DIMS: "#4ADE80", TEXT: "#C4B5FD", HATCH: "#F472B6", CIRC: "#2DD4BF", DRAN: "#2DD4BF", CONT: "#2DD4BF", GRID: "#94A3B8", CENT: "#94A3B8", HIDDEN: "#94A3B8" };
export const layerColor = (layer: string) => LC[layer.split("-")[1]] ?? "#E2E8F0";
export const layersOf = (d: Disc) => [...new Set(DRAW[d].ents.map((e) => e.layer))];

export type DrawMode = "pdf" | "scan" | "cad" | "trace" | "mono";
export const KIND_LABEL: Record<Kind, string> = { line: "LINE", poly: "POLYLINE", arc: "ARC", circle: "CIRCLE", hatch: "HATCH", text: "TEXT", dim: "DIMENSION", block: "BLOCK" };

export function DrawingSvg({
  disc = "arch", mode, hidden = [], sel = null, onSel, phase, title, titleBlock = true, flag, className,
}: {
  disc?: Disc; mode: DrawMode; hidden?: string[]; sel?: string | null; onSel?: (id: string) => void; phase?: number; title: string; titleBlock?: boolean;
  flag?: "dim" | "text" | null; className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const ents = DRAW[disc].ents.filter((e) => !hidden.includes(e.layer));
  const cad = mode === "cad" || mode === "mono";
  const ph = phase ?? 9;
  const colored = mode === "cad" && ph >= 3;
  const stroke = (e: Ent) => (cad ? (colored ? layerColor(e.layer) : "#E2E8F0") : mode === "trace" ? "#475569" : "#1F2937");
  const sw = (e: Ent) => (e.kind === "dim" ? 0.9 : e.layer.endsWith("WALL") || e.layer.endsWith("PART") || e.layer.endsWith("SITE") ? 2.2 : e.kind === "hatch" ? 0.8 : 1.2);
  const vis = (e: Ent) => (e.kind === "text" ? ph >= 4 : e.kind === "dim" ? ph >= 5 : e.kind === "hatch" ? ph >= 6 : ph >= 2);
  const draw = (on: boolean) => ({ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: "stroke-dashoffset 1s ease, stroke .6s" }) as React.CSSProperties;
  const bg = cad ? Z.navy : mode === "scan" ? "#E8E0CC" : mode === "trace" ? "#EEF0F4" : "#FFFFFF";
  const body = (kind: "pdf" | "trace-bg" | "cad", e: Ent) => {
    const pdfy = kind !== "cad";
    const st = kind === "cad" ? stroke(e) : "#1F2937";
    if (e.kind === "text") return <text key={e.id} x={e.x} y={e.y} fontSize={e.s} fill={st} stroke="none" textAnchor={e.t!.length > 10 && e.x! < 120 ? "start" : "middle"} style={mono}>{e.t}</text>;
    if (e.kind === "circle") return <circle key={e.id} cx={e.x} cy={e.y} r={e.r} stroke={st} strokeWidth={sw(e)} />;
    if (e.kind === "hatch") return <path key={e.id} d={e.d} stroke={st} strokeWidth={0.8} fill={`url(#${uid}-${pdfy ? "hp" : "hc"}-${e.layer})`} />;
    return <path key={e.id} d={e.d} stroke={st} strokeWidth={sw(e)} strokeDasharray={e.layer.endsWith("GRID") || e.layer.endsWith("CENT") || e.layer.endsWith("HIDDEN") ? "8 4" : undefined} />;
  };
  const layers = layersOf(disc);
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <defs>
        {layers.map((l) => <pattern key={l} id={`${uid}-hp-${l}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="#64748B" strokeWidth="0.8" /></pattern>)}
        {layers.map((l) => <pattern key={`c${l}`} id={`${uid}-hc-${l}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke={colored ? layerColor(l) : "#94A3B8"} strokeWidth="0.9" /></pattern>)}
        <filter id={`${uid}-n`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="t" /><feColorMatrix in="t" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.35 0" /></filter>
        <filter id={`${uid}-w`}><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="w" /><feDisplacementMap in="SourceGraphic" in2="w" scale="3" /><feGaussianBlur stdDeviation="0.5" /></filter>
        <filter id={`${uid}-b`}><feGaussianBlur stdDeviation="1.1" /></filter>
      </defs>
      <rect width="640" height="440" fill={bg} />
      {mode === "scan" ? <rect width="640" height="440" filter={`url(#${uid}-n)`} /> : null}
      {!cad ? <rect x="16" y="16" width="608" height="408" stroke={mode === "scan" ? "#6B6252" : "#94A3B8"} strokeWidth="1.2" /> : null}

      {mode === "pdf" || mode === "scan" ? <g filter={mode === "scan" ? `url(#${uid}-w)` : undefined} opacity={mode === "scan" ? 0.65 : 1}>{ents.map((e) => body("pdf", e))}</g> : null}

      {mode === "trace" ? (
        <g>
          <g filter={`url(#${uid}-b)`} opacity="0.55">{ents.map((e) => body("trace-bg", e))}</g>
          <g stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="22 5 9 4" transform="translate(1.6 1.2)" opacity="0.9">{ents.filter((e) => e.kind !== "text" && e.kind !== "hatch").map((e) => (e.kind === "circle" ? <circle key={e.id} cx={e.x} cy={e.y} r={e.r} /> : <path key={e.id} d={e.d} />))}</g>
          <g fill="#F59E0B">{ents.filter((e) => e.kind === "line" || e.kind === "poly").slice(0, 5).map((e, i) => { const m = /M(\d+) (\d+)/.exec(e.d ?? ""); return m ? <rect key={e.id} x={Number(m[1]) - 2.5 + i} y={Number(m[2]) - 2.5} width="5" height="5" /> : null; })}</g>
        </g>
      ) : null}

      {cad ? (
        <g>
          {ents.map((e) => {
            const on = vis(e);
            const selected = sel === e.id;
            const inner = e.kind === "text" ? (
              <text x={e.x} y={e.y} fontSize={e.s} fill={selected ? Z.cyan : stroke(e)} stroke="none" textAnchor={e.t!.length > 10 && e.x! < 120 ? "start" : "middle"} style={{ ...mono, opacity: on ? 1 : 0, transition: "opacity .7s, fill .6s" }}>{e.t}</text>
            ) : e.kind === "circle" ? (
              <circle cx={e.x} cy={e.y} r={e.r} stroke={selected ? Z.cyan : stroke(e)} strokeWidth={selected ? 3 : sw(e)} style={{ opacity: on ? 1 : 0, transition: "opacity .7s, stroke .6s" }} />
            ) : e.kind === "hatch" ? (
              <path d={e.d} stroke={selected ? Z.cyan : stroke(e)} strokeWidth={0.9} fill={`url(#${uid}-hc-${e.layer})`} style={{ opacity: on ? 1 : 0, transition: "opacity .7s" }} />
            ) : (
              <path d={e.d} pathLength={1} stroke={selected ? Z.cyan : stroke(e)} strokeWidth={selected ? sw(e) + 1.6 : sw(e)} strokeDasharray={e.layer.endsWith("GRID") || e.layer.endsWith("CENT") || e.layer.endsWith("HIDDEN") ? undefined : 1} style={e.layer.endsWith("GRID") || e.layer.endsWith("CENT") || e.layer.endsWith("HIDDEN") ? { opacity: on ? 1 : 0, transition: "opacity .7s", strokeDasharray: "8 4" } : draw(on)} />
            );
            return onSel ? (
              <g key={e.id} role="button" tabIndex={0} aria-label={`${KIND_LABEL[e.kind]} on layer ${e.layer}`} style={{ cursor: "pointer", outline: "none" }} onClick={() => onSel(e.id)} onPointerEnter={() => onSel(e.id)} onFocus={() => onSel(e.id)} onKeyDown={(k) => { if (k.key === "Enter" || k.key === " ") { k.preventDefault(); onSel(e.id); } }}>
                {e.d ? <path d={e.d} stroke="transparent" strokeWidth="12" /> : null}{inner}
              </g>
            ) : <g key={e.id}>{inner}</g>;
          })}
          {phase !== undefined && ph >= 7 ? <g fill="#fff" stroke={Z.cyan} strokeWidth="1" opacity="0.9">{[[90, 120], [300, 120], [510, 120], [90, 330], [510, 330]].map(([x, y], i) => <rect key={i} x={x - 3} y={y - 3} width="6" height="6" />)}</g> : null}
        </g>
      ) : null}

      {flag === "dim" ? <g><circle cx="300" cy="86" r="16" stroke={Z.amber} strokeWidth="2" /><text x="300" y="91" textAnchor="middle" fontSize="14" fill={Z.amber} stroke="none" style={mono}>!</text></g> : null}

      {titleBlock && (mode !== "cad" || ph >= 6) ? (
        <g style={{ opacity: 1, transition: "opacity .7s" }}>
          <rect x="420" y="376" width="196" height="40" stroke={cad ? "#64748B" : "#1F2937"} strokeWidth="1" /><path d="M420 396H616M520 376V416" stroke={cad ? "#64748B" : "#1F2937"} strokeWidth="0.8" />
          <text x="428" y="389" fontSize="8" fill={cad ? "#CBD5E1" : "#1F2937"} stroke="none" style={mono}>{cad ? "CONVERTED · DWG" : "SOURCE · PDF"}</text>
          <text x="428" y="409" fontSize="8" fill={cad ? "#94A3B8" : "#475569"} stroke="none" style={mono}>SCALE: ILLUSTRATIVE</text><text x="528" y="389" fontSize="8" fill={cad ? "#CBD5E1" : "#1F2937"} stroke="none" style={mono}>SHEET 01</text>
        </g>
      ) : null}
      {mode === "pdf" || mode === "scan" ? <g><rect x="552" y="26" width="58" height="18" fill="#E11D48" fillOpacity="0.9" stroke="none" /><text x="581" y="38.5" textAnchor="middle" fontSize="10" fill="#fff" stroke="none" style={mono}>PDF</text></g> : null}
    </svg>
  );
}

/* ───────── icons ───────── */

export function PdfIcon({ k, className }: { k: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {k === 0 ? <><path d="M14 8h26l10 10v38H14z" /><path d="M40 8v10h10M22 40l6 -8 6 6 8 -10" /></> : null}
      {k === 1 ? <><rect x="10" y="14" width="44" height="10" /><rect x="10" y="28" width="44" height="10" /><rect x="10" y="42" width="44" height="10" /></> : null}
      {k === 2 ? <><path d="M12 20h22M12 32h22M12 44h14" /><path d="M42 18v28" strokeDasharray="3 3" /><path d="M46 40l6 -6 -6 -6" /></> : null}
      {k === 3 ? <><rect x="8" y="14" width="22" height="30" /><rect x="22" y="22" width="22" height="30" /><rect x="36" y="30" width="20" height="26" /></> : null}
      {k === 4 ? <><path d="M10 40H54M10 32V48M54 32V48" /><path d="M22 28l8 -8 8 8" /><path d="M26 22h12" /></> : null}
      {k === 5 ? <><path d="M10 50V14h14l6 6h24v30z" /><path d="M10 28h44" /></> : null}
      {k === 6 ? <><path d="M10 20h44M10 32h44M10 44h44M22 12v40M42 12v40" /></> : null}
      {k === 7 ? <><circle cx="32" cy="32" r="20" /><path d="M32 18v14l9 6" /></> : null}
    </svg>
  );
}
