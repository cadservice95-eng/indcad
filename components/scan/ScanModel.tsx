import { makeIso, boxFaces, loop, seg } from "@/components/svg/iso";

/* One illustrative existing building. Point cloud, registration, model and labels are all derived from the same geometry,
   so the page never shows the scan and the model as unrelated graphics. All values illustrative. */

export const mono = { fontFamily: "var(--font-mono)" } as const;
export const K = { navy: "#0B1B33", cloud: "#7DD3FC", model: "#BAE6FD", amber: "#F59E0B", green: "#22C55E", teal: "#2DD4BF", blue: "#60A5FA" };

const W = 300, D = 200, H = 150, R = 55, FL = 75;
const P = makeIso(268, 190, 0.8);

function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

type Rect = [number, number, number, number];
const SWIN: Rect[] = [[30, 80, 20, 60], [220, 270, 20, 60], [30, 80, 95, 135], [125, 175, 95, 135], [220, 270, 95, 135]];
const SDOOR: Rect = [125, 165, 0, 58];
const EWIN: Rect[] = [[40, 90, 20, 60], [120, 170, 20, 60], [40, 90, 95, 135], [120, 170, 95, 135]];
const inRect = (a: number, z: number, rs: Rect[]) => rs.some((r) => a >= r[0] - 2 && a <= r[1] + 2 && z >= r[2] - 2 && z <= r[3] + 2);
const COLS: [number, number][] = [[100, 70], [200, 70], [100, 150], [200, 150]];

type Parts = Record<"wall" | "roof" | "floor" | "column" | "opening" | "mep", string>;
function cloud(jit: number, outliers: number): Parts {
  const r = rng(11);
  const out: Record<keyof Parts, string[]> = { wall: [], roof: [], floor: [], column: [], opening: [], mep: [] };
  const add = (k: keyof Parts, x: number, y: number, z: number) => { const q = P(x, y, z); out[k].push(`M${(q[0] + (r() - 0.5) * jit).toFixed(1)} ${(q[1] + (r() - 0.5) * jit).toFixed(1)}h0.1`); };
  for (let x = 0; x <= W; x += 10) for (let z = 0; z <= H; z += 10) if (!inRect(x, z, [...SWIN, SDOOR])) add("wall", x, D, z);
  for (let y = 0; y <= D; y += 10) for (let z = 0; z <= H; z += 10) if (!inRect(y, z, EWIN)) add("wall", W, y, z);
  for (let x = 0; x <= W; x += 10) for (let s = 0; s <= 1; s += 0.1) add("roof", x, D - s * (D / 2), H + s * R);
  for (let y = 0; y <= D; y += 10) { const t = y <= D / 2 ? y / (D / 2) : (D - y) / (D / 2); for (let z = H; z <= H + R * t; z += 10) add("roof", W, y, z); }
  for (let x = 0; x <= W; x += 14) for (let y = 0; y <= D; y += 14) { add("floor", x, y, 0); if (x % 28 === 0 && y % 28 === 0) add("floor", x, y, FL); }
  for (const [cx, cy] of COLS) for (let z = 0; z <= H; z += 5) add("column", cx, cy, z);
  for (const rc of [...SWIN, SDOOR]) for (let t = 0; t <= 1; t += 0.06) { add("opening", rc[0] + (rc[1] - rc[0]) * t, D, rc[2]); add("opening", rc[0] + (rc[1] - rc[0]) * t, D, rc[3]); }
  for (const rc of EWIN) for (let t = 0; t <= 1; t += 0.08) { add("opening", W, rc[0] + (rc[1] - rc[0]) * t, rc[2]); add("opening", W, rc[0] + (rc[1] - rc[0]) * t, rc[3]); }
  for (let x = 20; x <= 280; x += 5) add("mep", x, 100, 62);
  for (let z = 0; z <= H; z += 5) add("mep", 260, 60, z);
  if (outliers) for (let i = 0; i < outliers; i++) out.wall.push(`M${(70 + r() * 500).toFixed(1)} ${(20 + r() * 400).toFixed(1)}h0.1`);
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join("")])) as Parts;
}
const RAW = cloud(4.5, 70);
const CLEAN = cloud(0.9, 0);
const ALLP = (p: Parts) => Object.values(p).join("");

export type ScanLayers = {
  existing?: boolean; cloud?: "off" | "raw" | "clean" | "faint"; scanner?: boolean; markers?: boolean; model?: boolean; labels?: boolean;
  parts?: { arch?: boolean; struct?: boolean; mep?: boolean }; proposed?: boolean;
};
export type ScanFocus = "wall" | "floor" | "column" | "opening" | "mep" | null;

const STAGE: ScanLayers[] = [
  { existing: true },
  { cloud: "raw", scanner: true },
  { cloud: "clean", markers: true },
  { cloud: "faint", model: true, parts: { arch: true, struct: true, mep: true } },
  { cloud: "off", model: true, labels: true, parts: { arch: true, struct: true, mep: true } },
];
export const stageLayers = (s: number): ScanLayers => STAGE[Math.max(0, Math.min(4, s))];

const q = (x: number, y: number, z: number) => P(x, y, z);
const rectS = (r: Rect, plane: "S" | "E") => (plane === "S" ? loop(q(r[0], D, r[2]), q(r[1], D, r[2]), q(r[1], D, r[3]), q(r[0], D, r[3])) : loop(q(W, r[0], r[2]), q(W, r[1], r[2]), q(W, r[1], r[3]), q(W, r[0], r[3])));

export function ScanScene({ L, focus = null, className, title }: { L: ScanLayers; focus?: ScanFocus; className?: string; title: string }) {
  const o = (on?: boolean) => ({ opacity: on ? 1 : 0, transition: "opacity 0.9s ease" }) as React.CSSProperties;
  const cl = L.cloud ?? "off";
  const fp = L.parts ?? {};
  const south = loop(q(0, D, 0), q(W, D, 0), q(W, D, H), q(0, D, H));
  const east = loop(q(W, D, 0), q(W, 0, 0), q(W, 0, H), q(W, D, H));
  const roofS = loop(q(-8, D + 8, H - 4), q(W + 8, D + 8, H - 4), q(W + 8, D / 2, H + R), q(-8, D / 2, H + R));
  const gable = loop(q(W, 0, H), q(W, D, H), q(W, D / 2, H + R));
  const slab = (z: number) => loop(q(0, 0, z), q(W, 0, z), q(W, D, z), q(0, D, z));
  const fo = focus ? 0.22 : cl === "faint" ? 0.3 : 0.9;
  const focusPts = focus ? CLEAN_PARTS[focus] : "";
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="640" height="440" fill={K.navy} />
      <path d={loop(q(-60, -60, 0), q(W + 70, -60, 0), q(W + 70, D + 70, 0), q(-60, D + 70, 0))} fill="#0F2442" stroke="#1D3A63" />

      {/* existing building (solid) */}
      <g style={o(L.existing)}>
        <path d={south} fill="#8C8579" fillOpacity="0.7" stroke="#B8B0A3" /><path d={east} fill="#6F695F" fillOpacity="0.75" stroke="#B8B0A3" />
        <path d={roofS} fill="#4B5563" fillOpacity="0.9" stroke="#9CA3AF" /><path d={gable} fill="#7A736A" fillOpacity="0.8" stroke="#B8B0A3" />
        {[...SWIN, SDOOR].map((r, i) => <path key={i} d={rectS(r, "S")} fill={i === 5 ? "#5B4636" : "#1F3A5F"} fillOpacity="0.9" stroke="#CBD5E1" strokeWidth="0.8" />)}
        {EWIN.map((r, i) => <path key={i} d={rectS(r, "E")} fill="#1F3A5F" fillOpacity="0.9" stroke="#CBD5E1" strokeWidth="0.8" />)}
      </g>

      {/* scanner */}
      <g style={o(L.scanner)}>
        {(() => { const s = q(W + 70, D + 70, 0); const t = q(W / 2, D, 40); return <g><path d={`M${s[0]} ${s[1]}L${t[0]} ${t[1]}`} stroke={K.amber} strokeDasharray="4 4" /><path d={`M${s[0] - 8} ${s[1]}L${s[0]} ${s[1] - 22}L${s[0] + 8} ${s[1]}M${s[0]} ${s[1] - 22}V${s[1] - 30}`} stroke="#E2E8F0" strokeWidth="1.6" /><rect x={s[0] - 8} y={s[1] - 40} width="16" height="12" fill={K.amber} fillOpacity="0.3" stroke={K.amber} />{[18, 30, 42].map((r) => <path key={r} d={`M${s[0] - r} ${s[1] - 34 - r * 0.2}A${r} ${r} 0 0 1 ${s[0] - r} ${s[1] - 34 + r * 0.7}`} stroke={K.amber} strokeOpacity={1 - r / 60} />)}<text x={s[0] - 40} y={s[1] + 16} fontSize="9" fill={K.amber} style={mono}>SCAN POSITION</text></g>; })()}
      </g>

      {/* point cloud */}
      <path d={ALLP(RAW)} stroke={K.cloud} strokeWidth="2.2" style={{ opacity: cl === "raw" ? 0.9 : 0, transition: "opacity .8s" }} />
      <path d={ALLP(CLEAN)} stroke={K.cloud} strokeWidth="2.2" style={{ opacity: cl === "clean" || cl === "faint" ? fo : focus ? 0.22 : 0, transition: "opacity .8s" }} />
      {focus ? <path d={focusPts} stroke={K.amber} strokeWidth="3.2" /> : null}

      {/* registration markers */}
      <g style={o(L.markers)}>
        <g stroke={K.amber} fill={K.navy} strokeWidth="1.4">
          {[q(0, D, 0), q(W, D, 0), q(W, 0, 0), q(0, D, H), q(W, D, H)].map((t, i) => <g key={i}><circle cx={t[0]} cy={t[1]} r="8" /><path d={`M${t[0] - 8} ${t[1]}H${t[0] + 8}M${t[0]} ${t[1] - 8}V${t[1] + 8}`} /></g>)}
          <path d={seg(q(0, D, 0), q(W, D, 0), q(W, 0, 0))} strokeDasharray="6 4" />
        </g>
        <text x={q(0, D, 0)[0] - 30} y={q(0, D, 0)[1] + 26} fontSize="9" fill={K.amber} style={mono}>SHARED REFERENCE</text>
      </g>

      {/* BIM model */}
      <g style={o(L.model)}>
        <g style={o(fp.arch)}>
          <path d={south} fill={K.model} fillOpacity="0.07" stroke={K.model} strokeWidth="1.3" /><path d={east} fill={K.model} fillOpacity="0.05" stroke={K.model} strokeWidth="1.3" />
          <path d={roofS} fill={K.model} fillOpacity="0.1" stroke={K.model} strokeWidth="1.3" /><path d={gable} fill={K.model} fillOpacity="0.06" stroke={K.model} strokeWidth="1.3" />
          {[...SWIN, SDOOR].map((r, i) => <path key={i} d={rectS(r, "S")} fill={K.blue} fillOpacity="0.22" stroke={K.model} />)}{EWIN.map((r, i) => <path key={i} d={rectS(r, "E")} fill={K.blue} fillOpacity="0.22" stroke={K.model} />)}
          <path d={slab(FL)} fill={K.model} fillOpacity="0.06" stroke={K.model} strokeWidth="1" /><path d={slab(0)} stroke={K.model} strokeWidth="1" />
        </g>
        <g style={o(fp.struct)}>{COLS.map(([cx, cy]) => { const [l, r2, t] = boxFaces(P, cx - 6, cy - 6, 0, cx + 6, cy + 6, H); return <g key={`${cx}${cy}`} stroke={K.green} strokeWidth="0.9" fill={K.green} fillOpacity="0.15"><path d={l} /><path d={r2} /><path d={t} /></g>; })}</g>
        <g style={o(fp.mep)} stroke={K.teal} strokeWidth="2.4"><path d={seg(q(20, 100, 62), q(280, 100, 62))} /><path d={seg(q(260, 60, 0), q(260, 60, H))} /></g>
      </g>

      {/* proposed intervention */}
      <g style={o(L.proposed)} stroke={K.blue} strokeWidth="1.4" strokeDasharray="6 4" fill={K.blue} fillOpacity="0.06">
        {(() => { const [a, b, c] = boxFaces(P, W, 40, 0, W + 120, D - 10, 110); return <g><path d={a} /><path d={b} /><path d={c} /></g>; })()}
        <text x={q(W + 60, D - 10, 118)[0] - 30} y={q(W + 60, D - 10, 118)[1] - 6} fontSize="9" fill={K.blue} stroke="none" style={mono}>PROPOSED</text>
      </g>

      {/* labels */}
      <g style={o(L.labels)} fontSize="9" fill="#E2E8F0">
        {([["WALL", q(60, D, 100), 60, -34], ["WINDOW", q(250, D, 115), 40, -50], ["ROOF", q(150, D / 2 + 20, H + 40), -70, -30], ["COLUMN", q(100, 70, 110), -90, -4], ["FLOOR", q(250, 100, FL), 50, 24]] as [string, readonly number[], number, number][]).map(([t, a, dx, dy]) => (
          <g key={t}><path d={`M${a[0]} ${a[1]}L${a[0] + dx} ${a[1] + dy}`} stroke="#94A3B8" /><circle cx={a[0]} cy={a[1]} r="2.5" fill={K.green} /><rect x={a[0] + dx - 2} y={a[1] + dy - 11} width={t.length * 7 + 10} height="16" fill={K.navy} stroke="#2F5C94" /><text x={a[0] + dx + 3} y={a[1] + dy} style={mono}>{t}</text></g>
        ))}
        <g transform="translate(24 30)"><rect width="150" height="22" fill={K.navy} stroke={K.green} /><text x="8" y="15" fill={K.green} style={mono}>✓ AS-BUILT MODEL</text></g>
      </g>
    </svg>
  );
}

const CLEAN_PARTS: Parts = CLEAN;

/* ───────── multi-floor registration ───────── */

const SESS = [K.cloud, K.amber, "#A78BFA", K.green];
export function FloorsStack({ n = 3, off, className, title }: { n?: number; off: number; className?: string; title: string }) {
  const p = makeIso(273, 175, 0.9);
  const dx = [0, 14, -12, 16], dy = [0, -5, 7, -4];
  const w = 220, d = 150;
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="640" height="420" fill={K.navy} />
      {Array.from({ length: n }, (_, i) => {
        const z = i * 62;
        const sx = dx[i] * off, sy = dy[i] * off;
        const c = SESS[i];
        return (
          <g key={i} style={{ transform: `translate(${sx}px, ${sy}px)`, transition: "transform 0.8s ease" }}>
            <path d={loop(p(0, 0, z), p(w, 0, z), p(w, d, z), p(0, d, z))} fill={c} fillOpacity="0.07" stroke={c} strokeWidth="1.4" strokeDasharray="1 4" />
            <path d={seg(p(0, d, z), p(0, d, z + 40), p(w, d, z + 40), p(w, d, z))} stroke={c} strokeWidth="1.2" strokeDasharray="1 5" />
            <path d={seg(p(w, d, z + 40), p(w, 0, z + 40), p(w, 0, z))} stroke={c} strokeWidth="1.2" strokeDasharray="1 5" />
            {(() => { const m = p(0, d, z); return <g stroke={K.amber} fill={K.navy} strokeWidth="1.4"><circle cx={m[0]} cy={m[1]} r="7" /><path d={`M${m[0] - 7} ${m[1]}H${m[0] + 7}M${m[0]} ${m[1] - 7}V${m[1] + 7}`} /></g>; })()}
            <text x={p(w, 0, z)[0] + 14} y={p(w, 0, z)[1] + 4} fontSize="10" fill={c} style={mono}>SESSION 0{i + 1} · FLOOR 0{i + 1}</text>
          </g>
        );
      })}
      <path d={seg(p(0, d, -20), p(0, d, (n - 1) * 62 + 70))} stroke={K.amber} strokeWidth="1.2" strokeDasharray="6 4" />
      <text x={p(0, d, -20)[0] - 10} y={p(0, d, -20)[1] + 20} fontSize="10" fill={K.amber} textAnchor="middle" style={mono}>SHARED REFERENCE</text>
    </svg>
  );
}

/* ───────── as-built fidelity (wall) ───────── */

const nz = (x: number) => Math.sin(x * 0.045) * 1.4 + Math.sin(x * 0.13 + 1) * 0.9 + Math.sin(x * 0.31) * 0.4;
function wallPath(x0: number, amp: number) {
  const top = (x: number) => 70 + nz(x) * amp;
  const bot = (x: number) => 230 + nz(x + 40) * amp * 0.8;
  let d = `M${x0 + 6 * amp * 0.4} ${top(0)}`;
  for (let x = 0; x <= 260; x += 10) d += `L${x0 + x + amp * 0.35} ${top(x).toFixed(1)}`;
  d += `L${x0 + 260 - amp * 0.2} ${bot(260).toFixed(1)}`;
  for (let x = 260; x >= 0; x -= 10) d += `L${x0 + x} ${bot(x).toFixed(1)}`;
  return d + "Z";
}
export function WallFidelity({ v, className }: { v: number; className?: string }) {
  const A = 5.5;
  const deco = Math.max(0, (v - 0.55) / 0.45);
  const f = (x0: number, amp: number, dotted: boolean) => (
    <g>
      <path d={wallPath(x0, amp)} stroke={dotted ? K.cloud : K.model} strokeWidth={dotted ? 2.4 : 1.6} strokeDasharray={dotted ? "0.1 5" : undefined} fill={dotted ? "none" : K.model} fillOpacity={dotted ? 0 : 0.06} />
      <path d={`M${x0 + 70} ${100 + nz(70) * amp}L${x0 + 130} ${100 + nz(130) * amp}L${x0 + 132 + amp * 0.3} ${170 + nz(130) * amp}L${x0 + 70} ${170 + nz(70) * amp}Z`} stroke={dotted ? K.cloud : K.model} strokeWidth={dotted ? 2.4 : 1.4} strokeDasharray={dotted ? "0.1 5" : undefined} fill="none" />
      <path d={`M${x0} ${150 + nz(0) * amp}Q${x0 + 130} ${150 + nz(60) * amp * 1.3} ${x0 + 260} ${150 + nz(200) * amp}`} stroke={dotted ? K.cloud : K.model} strokeWidth={dotted ? 2 : 1} strokeDasharray={dotted ? "0.1 6" : "4 4"} opacity={0.7} />
      {!dotted ? <g stroke={K.model} strokeWidth="1" opacity={deco}>{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${x0 + 10 + i * 30} ${72 + nz(i * 30) * amp}v10h12v-10`} />)}</g> : null}
    </g>
  );
  return (
    <svg viewBox="0 0 640 300" className={className} role="img" aria-label="A scanned wall with its irregularities beside the modelled wall, simplified according to the slider" fill="none" strokeLinecap="round">
      <title>As-built wall and modelled wall</title>
      <rect width="640" height="300" fill={K.navy} />
      {f(20, A, true)}
      {f(360, A * v, false)}
      <text x="20" y="40" fontSize="11" fill={K.cloud} style={mono}>SCANNED WALL · AS BUILT</text>
      <text x="360" y="40" fontSize="11" fill={K.model} style={mono}>MODELLED WALL · {v > 0.66 ? "HIGHER FIDELITY" : v > 0.33 ? "BALANCED" : "IDEALISED"}</text>
      <path d="M300 150h40m-8 -6l8 6-8 6" stroke="#64748B" />
    </svg>
  );
}

/* ───────── heritage facade / detail ───────── */

export function HeritageSvg({ view, fid, className, title }: { view: "building" | "scan" | "cloud" | "model"; fid: 0 | 1; className?: string; title: string }) {
  const dots = view === "cloud";
  const st = view === "cloud" ? K.cloud : view === "scan" ? "#CBD5E1" : K.model;
  const sw = dots ? 2.4 : 1.4;
  const da = dots ? "0.1 5" : undefined;
  const j = view === "scan" || dots ? 1.4 : 0;
  const jx = (n: number, a = 1) => n + Math.sin(n * 0.7 + a) * j;
  if (view === "building") {
    return (
      <svg viewBox="0 0 640 380" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round">
        <title>{title}</title><rect width="640" height="380" fill={K.navy} /><path d="M40 340H600" stroke="#64748B" strokeWidth="2" />
        <path d="M80 340V120L320 60L560 120V340" fill="#8C8579" fillOpacity="0.5" stroke="#B8B0A3" /><path d="M80 120H560" stroke="#B8B0A3" /><path d="M70 130H570" stroke="#B8B0A3" strokeWidth="2" />
        {[150, 260, 370, 480].map((x) => <g key={x}><path d={`M${x - 24} 260V190a24 24 0 0 1 48 0V260Z`} fill="#1F3A5F" stroke="#E2E8F0" /><path d={`M${x - 24} 340V300h48v40`} stroke="#B8B0A3" /></g>)}
        <rect x="236" y="168" width="62" height="100" stroke={K.amber} strokeDasharray="5 3" strokeWidth="1.6" /><text x="236" y="160" fontSize="10" fill={K.amber} style={mono}>ZOOM</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="400" height="320" fill={K.navy} />
      {view === "scan" ? <rect x="120" y="40" width="160" height="250" fill="#8C8579" fillOpacity="0.5" /> : null}
      <g stroke={st} strokeWidth={sw} strokeDasharray={da}>
        <path d={`M${jx(130)} 290V150a${70 + j} ${70 + j} 0 0 1 ${140 + 2 * j} 0V290Z`} />
        {fid === 1 ? <>
          <path d={`M${jx(118, 2)} 290V150a${82} ${82} 0 0 1 164 0V290`} /><path d={`M${jx(106, 3)} 290V150a${94} ${94} 0 0 1 188 0V290`} strokeOpacity="0.8" />
          <path d={`M${jx(188, 4)} 44l12 -14l12 14l-6 24h-12Z`} /><path d="M118 150h-14v-14h14M282 150h14v-14h-14" />
          <path d={`M${jx(100, 5)} 292h200v10H100z`} /><path d="M140 292v-12h20v12M240 292v-12h20v12" />
          <path d="M150 190q50 -20 100 0M150 205q50 -16 100 0" strokeOpacity="0.7" />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={152 + i * 24} cy={120 - Math.sin(i * 0.9) * 10} r="5" />)}
        </> : <path d="M110 292h180v6H110z" />}
      </g>
      <text x="16" y="28" fontSize="11" fill={st} style={mono}>{view === "scan" ? "SCAN" : view === "cloud" ? "POINT CLOUD" : fid ? "DETAILED BIM ELEMENT" : "STANDARD AS-BUILT ELEMENT"}</text>
    </svg>
  );
}

/* ───────── column measurement ───────── */

export function ColumnMeasure({ step, className }: { step: 0 | 1 | 2 | 3; className?: string }) {
  const tilt = 3.2;
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="An existing column compared with its ideal vertical axis, shown as illustrative geometry" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>Column measurement</title>
      <rect width="400" height="320" fill={K.navy} />
      <path d="M60 280H340" stroke="#64748B" strokeWidth="2.4" /><path d="M60 40H340" stroke="#64748B" strokeWidth="2.4" />
      <g transform={`rotate(${tilt} 200 280)`}>
        <rect x="182" y="40" width="36" height="240" stroke={step === 1 ? K.cloud : "#CBD5E1"} strokeWidth={step === 1 ? 2.4 : 1.4} strokeDasharray={step === 1 ? "0.1 5" : undefined} fill={step === 0 ? "#8C8579" : "none"} fillOpacity="0.55" />
        {step >= 2 ? <path d="M200 40V280" stroke={K.amber} strokeWidth="1.8" /> : null}
      </g>
      {step >= 2 ? <g>
        <path d="M200 40V280" stroke="#94A3B8" strokeDasharray="6 4" /><text x="206" y="300" fontSize="10" fill="#94A3B8" style={mono}>IDEAL AXIS</text>
        <path d="M200 120A160 160 0 0 1 209 120.5" stroke={K.amber} /><path d="M200 60H236" stroke={K.amber} /><text x="244" y="64" fontSize="11" fill={K.amber} style={mono}>Δ</text>
        <text x="236" y="86" fontSize="10" fill={K.amber} style={mono}>SCANNED AXIS</text>
        <text x="20" y="28" fontSize="11" fill="#E2E8F0" style={mono}>EXISTING CONDITION</text>
      </g> : null}
      {step === 3 ? <g><rect x="248" y="150" width="130" height="64" fill={K.navy} stroke={K.green} /><text x="258" y="172" fontSize="10" fill={K.green} style={mono}>MEASUREMENT FOR</text><text x="258" y="188" fontSize="10" fill={K.green} style={mono}>ENGINEER REVIEW</text><text x="258" y="204" fontSize="9" fill="#94A3B8" style={mono}>no values assumed</text></g> : null}
    </svg>
  );
}

/* ───────── industrial plant ───────── */

type Seg = [number, number, number, number, number, number, "s" | "p" | "e"];
const PBX = 90, PBY = 80;
const PSEG: Seg[] = (() => {
  const s: Seg[] = [];
  for (let i = 0; i <= 4; i++) for (let j = 0; j <= 2; j++) s.push([i * PBX, j * PBY, 0, i * PBX, j * PBY, 140, "s"]);
  for (const z of [70, 140]) { for (let j = 0; j <= 2; j++) s.push([0, j * PBY, z, 4 * PBX, j * PBY, z, "s"]); for (let i = 0; i <= 4; i++) s.push([i * PBX, 0, z, i * PBX, 2 * PBY, z, "s"]); }
  s.push([0, 40, 100, 4 * PBX, 40, 100, "p"], [0, 120, 50, 4 * PBX, 120, 50, "p"], [270, 40, 0, 270, 40, 100, "p"], [270, 40, 100, 270, 120, 100, "p"], [90, 120, 50, 90, 120, 140, "p"]);
  for (let i = 0; i < 4; i++) { s.push([i * PBX + 10, 10, 70, i * PBX + 80, 10, 70, "e"], [i * PBX + 10, 150, 70, i * PBX + 80, 150, 70, "e"]); }
  return s;
})();
function plantPts() {
  const r = rng(5);
  const pp = makeIso(250, 230, 0.78);
  const pts: string[] = [];
  for (const [a, b, c, d, e, f] of PSEG) {
    const len = Math.hypot(d - a, e - b, f - c);
    for (let t = 0; t <= len; t += 5) { const k = t / len; const x = pp(a + (d - a) * k, b + (e - b) * k, c + (f - c) * k); pts.push(`M${(x[0] + (r() - 0.5) * 2).toFixed(1)} ${(x[1] + (r() - 0.5) * 2).toFixed(1)}h0.1`); }
  }
  for (const [cx, cy] of [[60, 40], [200, 130]] as const) for (let a = 0; a < 6.28; a += 0.18) for (let z = 0; z <= 90; z += 18) { const x = pp(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26, z); pts.push(`M${(x[0] + (r() - 0.5) * 2).toFixed(1)} ${(x[1] + (r() - 0.5) * 2).toFixed(1)}h0.1`); }
  return pts.join("");
}
const PLANT_PTS = plantPts();

export function PlantScene({ mode, className, title }: { mode: "cloud" | "model" | "both"; className?: string; title: string }) {
  const pp = makeIso(250, 230, 0.78);
  const col = { s: K.cloud, p: K.teal, e: K.blue } as const;
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round">
      <title>{title}</title>
      <rect width="640" height="440" fill={K.navy} />
      <path d={PLANT_PTS} stroke={K.cloud} strokeWidth="2" style={{ opacity: mode === "model" ? 0 : mode === "both" ? 0.35 : 0.9, transition: "opacity .8s" }} />
      <g style={{ opacity: mode === "cloud" ? 0 : 1, transition: "opacity .8s" }}>
        {PSEG.map((sg, i) => { const a = pp(sg[0], sg[1], sg[2]), b = pp(sg[3], sg[4], sg[5]); return <path key={i} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={col[sg[6]]} strokeWidth={sg[6] === "s" ? 1.4 : 2.6} />; })}
        {([[60, 40], [200, 130]] as const).map(([cx, cy], i) => { const t = pp(cx, cy, 90), bt = pp(cx, cy, 0); return <g key={i} stroke={K.blue} strokeWidth="1.4"><path d={`M${t[0] - 32} ${t[1]}V${bt[1]}M${t[0] + 32} ${t[1]}V${bt[1]}`} /><ellipse cx={t[0]} cy={t[1]} rx="32" ry="15" /><path d={`M${bt[0] - 32} ${bt[1]}A32 15 0 0 0 ${bt[0] + 32} ${bt[1]}`} /></g>; })}
      </g>
    </svg>
  );
}

/* ───────── icons ───────── */

export function ScanIcon({ k, className }: { k: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {k === 0 ? <><path d="M10 40l22 -10 22 10 -22 12z" /><path d="M10 40V24l22 -10 22 10v16M32 30v22" /><path d="M8 12h2M16 8h2M52 10h2M58 18h2" strokeWidth="3" /></> : null}
      {k === 1 ? <><path d="M10 52V24l22 -10 22 10v28z" /><rect x="22" y="32" width="8" height="10" /><rect x="36" y="32" width="8" height="10" /></> : null}
      {k === 2 ? <><path d="M14 54V10M50 54V10M14 22h36M14 38h36" /></> : null}
      {k === 3 ? <><path d="M8 24h48v8H8zM8 42h30" /><circle cx="48" cy="46" r="6" /></> : null}
      {k === 4 ? <><rect x="10" y="10" width="44" height="44" /><path d="M10 34h28V10M38 34v20M20 44h10" /></> : null}
      {k === 5 ? <><rect x="8" y="14" width="26" height="22" /><rect x="26" y="26" width="26" height="22" strokeDasharray="4 3" /></> : null}
      {k === 6 ? <><path d="M14 12h30l8 8v32H14z" /><path d="M24 30h18M24 38h18M24 46h10" /><circle cx="22" cy="22" r="3" /></> : null}
      {k === 7 ? <><path d="M10 54V30l12 -8 12 8v24M34 54V34h20v20M14 54h40" /><path d="M22 14v8M44 22v12" /></> : null}
      {k === 8 ? <><rect x="10" y="14" width="44" height="34" /><path d="M10 26h44M22 14v34M10 48h44" /></> : null}
      {k === 9 ? <><path d="M32 8l22 12v24L32 56 10 44V20z" /><path d="M10 20l22 12 22 -12M32 32v24" /></> : null}
    </svg>
  );
}
