import type { ReactNode } from "react";
import { M, T, Fade, Grid, ln } from "./PlantModel";

/* ───────── shutdown: transfer-tower elevation ───────── */
export const SD = ["Before shutdown", "During shutdown", "Commissioning"] as const;
export function ShutdownVisual({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 520 300" className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={`Illustrative shutdown workflow — ${SD[s]}`}>
      <title>{`Illustrative shutdown workflow: ${SD[s]}`}</title>
      <rect width="520" height="300" fill={M.bg} /><Grid w={520} h={300} />
      <path d="M0 262H520" {...ln(M.mute, 1.2)} />
      {/* tower */}
      <g {...ln(M.steel, 1.8)}><path d="M260 262V80M330 262V80M260 80H330M260 140H330M260 200H330M260 262L330 200M330 200L260 140M260 140L330 80" /></g>
      {/* existing conveyor (left) */}
      <path d="M20 240L260 150" {...ln(M.equip, 5)} strokeOpacity="0.45" />
      {/* section being replaced (right) */}
      <Fade on={s === 0}><path d="M330 100L500 40" {...ln(M.equip, 5)} strokeOpacity="0.45" /><T x="420" y="40" c={M.mute} size={8}>EXISTING SECTION</T></Fade>
      <Fade on={s === 1}>
        <path d="M330 100L500 40" {...ln(M.red, 2)} strokeDasharray="6 4" /><T x="404" y="36" c={M.red} size={8}>REMOVED</T>
        <path d="M420 10V64" {...ln(M.ink, 1)} /><path d="M414 64h12" {...ln(M.ink, 1.4)} />
        <path d="M340 110L500 52" {...ln(M.amber, 5)} transform="translate(0 6)" /><T x="350" y="150" c={M.amber} size={8}>NEW SECTION · INSTALL</T>
        <rect x="236" y="196" width="118" height="70" fillOpacity="0.08" {...ln(M.amber, 1)} fill={M.amber} strokeDasharray="4 3" /><T x="240" y="290" c={M.amber} size={8}>MAINTENANCE ACCESS ZONE</T>
      </Fade>
      <Fade on={s === 2}>
        <path d="M330 100L500 40" {...ln(M.sky, 5)} /><g {...ln(M.civil, 2)}><circle cx="470" cy="120" r="14" /><path d="M463 120l5 5l9 -10" /></g>
        <rect x="370" y="170" width="130" height="44" {...ln(M.sky, 1)} fill={M.bg} /><T x="378" y="188" c={M.sky} size={8}>AS-BUILT UPDATED</T><T x="378" y="204" c={M.mute} size={8}>DRAWINGS CURRENT</T>
      </Fade>
      {/* pre-shutdown laydown */}
      <Fade on={s === 0}>
        {[0, 1, 2].map((k) => <rect key={k} x={50 + k * 8} y={40 + k * 8} width="90" height="60" fill={M.paper} fillOpacity="0.95" stroke={M.mute} />)}
        <path d="M76 70h50M76 82h40M76 94h56" stroke="#334155" /><T x="50" y="128" c={M.ink} size={8}>FABRICATION DRAWINGS</T>
        <path d="M360 250L470 214" {...ln(M.amber, 5)} /><path d="M360 254h110" {...ln(M.mute, 1)} /><T x="360" y="280" c={M.amber} size={8}>FABRICATED · STAGED ON LAYDOWN</T>
      </Fade>
      <T x="20" y="24" c={M.ink} size={10}>{SD[s].toUpperCase()}</T>
      <T x="500" y="24" a="end" c={M.mute} size={8}>ILLUSTRATIVE SHUTDOWN WORKFLOW</T>
    </svg>
  );
}

/* ───────── platform elevation: access, maintenance, removal, mobile plant, egress, fall protection ───────── */
export type AccessMode = "access" | "maintenance" | "removal" | "mobile" | "egress" | "fall";
export function AccessVisual({ mode }: { mode: AccessMode }) {
  const on = (m: AccessMode) => mode === m;
  return (
    <svg viewBox="0 0 520 300" className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={`Illustrative platform elevation — ${mode}`}>
      <title>{`Illustrative platform elevation: ${mode}`}</title>
      <rect width="520" height="300" fill={M.bg} /><Grid w={520} h={300} />
      <path d="M0 262H520" {...ln(M.mute, 1.2)} />
      <g {...ln(M.steel, 1.8)}><path d="M150 262V140M380 262V140M150 140H380M150 150H380" /></g>
      {/* equipment on platform */}
      <g style={{ transform: on("removal") ? "translate(160px, -70px)" : "none", transition: "transform 1.4s ease" }}>
        <rect x="230" y="90" width="80" height="50" fillOpacity="0.3" {...ln(M.equip, 1.4)} fill={M.equip} /><circle cx="270" cy="115" r="12" {...ln(M.equip, 1)} /><T x="236" y="84" c={M.equip} size={8}>EQUIPMENT</T>
      </g>
      {/* stair + handrail */}
      <g {...ln(on("access") || on("egress") ? "#fff" : M.amber, on("access") || on("egress") ? 2 : 1.3)}>
        <path d="M60 262h12v-15h12v-15h12v-15h12v-15h12v-15h12v-15h12v-15h6" /><path d="M58 236L150 118" strokeWidth="1" />
      </g>
      <g {...ln(on("fall") ? "#fff" : M.amber, on("fall") ? 2.2 : 1.2)}><path d="M150 110H380M150 125H380" />{[150, 196, 242, 288, 334, 380].map((x) => <path key={x} d={`M${x} 140V110`} />)}<path d="M150 135H380" strokeWidth="0.8" /></g>
      <Fade on={on("maintenance")}><rect x="214" y="70" width="112" height="70" fillOpacity="0.12" {...ln(M.amber, 1.2)} fill={M.amber} strokeDasharray="5 3" /><T x="214" y="62" c={M.amber} size={9}>MAINTENANCE CLEARANCE</T></Fade>
      <Fade on={on("removal")}><path d="M270 115C330 60 380 40 430 45" {...ln(M.amber, 1.6)} strokeDasharray="5 4" className="rch-flow" /><T x="400" y="30" c={M.amber} size={9}>REMOVAL PATH</T><rect x="400" y="200" width="100" height="40" fillOpacity="0.08" {...ln(M.amber, 1)} fill={M.amber} strokeDasharray="4 3" /><T x="406" y="224" c={M.amber} size={8}>SERVICE AREA</T></Fade>
      <Fade on={on("mobile")}><g style={{ transform: on("mobile") ? "translateX(0)" : "translateX(120px)", transition: "transform 1.2s ease" }}><rect x="400" y="222" width="80" height="26" rx="3" fillOpacity="0.4" {...ln(M.ink, 1.2)} fill={M.mute} /><rect x="456" y="206" width="24" height="18" {...ln(M.ink, 1.2)} /><circle cx="416" cy="252" r="9" {...ln(M.ink, 1.2)} /><circle cx="464" cy="252" r="9" {...ln(M.ink, 1.2)} /></g><path d="M380 180h-50" {...ln(M.red, 1.2)} strokeDasharray="4 3" /><T x="196" y="200" c={M.red} size={8}>ILLUSTRATIVE MOBILE PLANT LOAD CONSIDERATION</T></Fade>
      <Fade on={on("egress")}><path d="M380 130H470V262" {...ln(M.civil, 1.6)} strokeDasharray="6 4" /><T x="404" y="122" c={M.civil} size={9}>EGRESS PATH</T></Fade>
      <T x="20" y="24" c={M.ink} size={10}>{({ access: "ACCESS", maintenance: "MAINTENANCE", removal: "REMOVAL PATH", mobile: "MOBILE PLANT", egress: "EGRESS", fall: "FALL PROTECTION" } as const)[mode]}</T>
      <T x="500" y="24" a="end" c={M.mute} size={8}>ILLUSTRATIVE · NO LOAD VALUES</T>
    </svg>
  );
}

/* ───────── harsh environment equipment cutaway ───────── */
export const HARSH = ["Access", "Component", "Clearance", "Documentation"] as const;
export function HarshVisual({ k, env }: { k: number; env: { dust: boolean; vib: boolean; abr: boolean } }) {
  return (
    <svg viewBox="0 0 520 300" className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={`Illustrative equipment cutaway — ${HARSH[k]}`}>
      <title>{`Illustrative equipment cutaway: ${HARSH[k]}`}</title>
      <rect width="520" height="300" fill={M.bg} /><Grid w={520} h={300} />
      <path d="M0 262H520" {...ln(M.mute, 1.2)} />
      <g className={env.vib ? "mn-vib" : undefined}>
        <path d="M150 90L250 60H300L330 90V230H150Z" fillOpacity="0.12" {...ln(M.equip, 1.6)} fill={M.equip} />
        <path d="M168 100L250 76H296L314 100V214H168Z" {...ln(k === 1 ? "#fff" : M.amber, k === 1 ? 2.4 : 1.4)} fill="none" strokeDasharray={k === 1 ? undefined : "5 3"} />
        <rect x="340" y="170" width="70" height="44" fillOpacity="0.25" {...ln(M.ink, 1.2)} fill={M.mute} /><path d="M330 192h10" {...ln(M.ink, 2)} /><T x="342" y="164" c={M.ink} size={8}>DRIVE</T>
        <path d="M140 230H420V262H140Z" fillOpacity="0.08" {...ln(M.steel, 1.4)} fill={M.steel} />
      </g>
      <Fade on={env.abr}><path d="M190 30L230 82" {...ln(M.amber, 2)} strokeDasharray="4 4" className="rch-flow" /><path d="M240 214L240 250" {...ln(M.amber, 2)} strokeDasharray="4 4" className="rch-flow" /><T x="150" y="24" c={M.amber} size={8}>ABRASIVE MATERIAL FLOW</T></Fade>
      <Fade on={env.dust}>{Array.from({ length: 26 }, (_, i) => <circle key={i} cx={130 + ((i * 47) % 300)} cy={40 + ((i * 29) % 180)} r={1 + (i % 3) * 0.6} fill="#94A3B8" fillOpacity="0.45" className="rch-pulse" style={{ "--d": `${(i % 7) * 300}ms` } as React.CSSProperties} />)}<T x="430" y="60" c="#94A3B8" size={8}>DUST</T></Fade>
      <Fade on={env.vib}><g {...ln(M.sky, 0.8)}>{[0, 1, 2].map((i) => <path key={i} d={`M${120 - i * 8} 140q-6 10 0 20q6 10 0 20`} />)}</g><T x="70" y="210" c={M.sky} size={8}>VIBRATION</T></Fade>
      <Fade on={k === 0}><rect x="330" y="96" width="80" height="60" fillOpacity="0.12" {...ln(M.amber, 1.2)} fill={M.amber} strokeDasharray="5 3" /><T x="330" y="90" c={M.amber} size={9}>MAINTENANCE ACCESS</T></Fade>
      <Fade on={k === 1}><T x="176" y="124" c="#fff" size={9}>REPLACEABLE LINER</T></Fade>
      <Fade on={k === 2}><rect x="120" y="40" width="320" height="214" {...ln(M.civil, 1.2)} fill="none" strokeDasharray="8 4" /><T x="124" y="34" c={M.civil} size={9}>CLEARANCE ENVELOPE</T></Fade>
      <Fade on={k === 3}><rect x="430" y="40" width="74" height="96" fill={M.paper} stroke={M.mute} /><path d="M440 56h40M440 68h54M440 80h30M440 104h54" stroke="#334155" /><T x="434" y="128" c="#334155" size={7}>LINER DWG</T><path d="M300 110L430 80" {...ln(M.sky, 0.8)} /></Fade>
      <T x="500" y="290" a="end" c={M.mute} size={8}>ILLUSTRATIVE EQUIPMENT</T>
    </svg>
  );
}

/* ───────── remote logistics route ───────── */
export const ROUTE = ["Engineering office", "Fabrication", "Transport", "Remote site", "Shutdown installation"];
const PTS: [number, number][] = [[70, 70], [170, 150], [290, 100], [380, 190], [440, 90]];
export function LogisticsMap({ k }: { k: number }) {
  return (
    <svg viewBox="0 0 520 260" className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={`Abstract route from engineering office to remote site — ${ROUTE[k]}`}>
      <title>Abstract logistics route (not a real location)</title>
      <rect width="520" height="260" fill={M.bg} />
      <g {...ln(M.mute, 0.7)} strokeOpacity="0.35">{[30, 55, 80, 105].map((r, i) => <ellipse key={r} cx="400" cy="170" rx={r * 1.5} ry={r} transform={`rotate(${-12 + i * 4} 400 170)`} />)}{[25, 45].map((r) => <ellipse key={r} cx="130" cy="190" rx={r * 1.8} ry={r} />)}</g>
      <path d={"M" + PTS.map((q) => q.join(" ")).join("L")} {...ln(M.sky, 1.4)} strokeDasharray="6 5" className="rch-flow" />
      {PTS.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={i === k ? 9 : 6} fillOpacity={i <= k ? 0.3 : 1} {...ln(i <= k ? M.sky : M.mute, 1.4)} fill={i <= k ? M.sky : M.bg} /><T x={x} y={y + 24} a="middle" c={i === k ? "#fff" : M.ink} size={8.5}>{ROUTE[i].toUpperCase()}</T></g>)}
      <g style={{ transform: `translate(${PTS[k][0] - 9}px, ${PTS[k][1] - 26}px)`, transition: "transform .9s ease" }}><rect width="18" height="14" fill={M.paper} stroke={M.amber} /><path d="M3 4h12M3 8h9" stroke="#334155" strokeWidth="0.8" /></g>
      <T x="20" y="248" c={M.mute} size={8}>ABSTRACT ROUTE · NOT A REAL LOCATION</T>
    </svg>
  );
}

/* ───────── mini glyphs ───────── */
export function Glyph({ k }: { k: string }) {
  const b: Record<string, ReactNode> = {
    frame: <g {...ln(M.steel, 1.4)}><path d="M40 85V30M80 85V30M120 85V30M40 30H120M40 55H120M40 85L80 55L120 85" /></g>,
    equip: <g {...ln(M.equip, 1.4)}><path d="M50 40L80 28H100L110 40V80H50Z" fill={M.equip} fillOpacity="0.15" /><rect x="114" y="58" width="22" height="16" /><path d="M40 84H140" stroke={M.mute} /></g>,
    platform: <g {...ln(M.amber, 1.3)}><path d="M20 85h8v-8h8v-8h8v-8h8v-8h8v-8h4" /><path d="M64 45H140M64 35H140" />{[64, 90, 116, 140].map((x) => <path key={x} d={`M${x} 45V35`} />)}<path d="M64 45V85M140 45V85" stroke={M.steel} /></g>,
    terrain: <g {...ln(M.civil, 1.2)}>{[10, 20, 30].map((r) => <ellipse key={r} cx="70" cy="55" rx={r * 1.8} ry={r} />)}<path d="M10 82C60 70 100 40 150 30" stroke={M.ink} strokeWidth="4" strokeOpacity="0.6" /></g>,
    legacy: <g><rect x="18" y="24" width="56" height="56" fill="#D9CDB4" /><path d="M26 38h36M26 50h28M26 62h40" stroke="#7C6A4B" /><path d="M82 52h12M90 48l5 4-5 4" {...ln(M.amber, 1.4)} /><rect x="104" y="24" width="40" height="56" {...ln(M.sky, 1.3)} /><path d="M112 38h24M112 50h18" {...ln(M.sky, 1)} /></g>,
    overlay: <g><rect x="30" y="26" width="80" height="50" {...ln("#CBD5E1", 1.2)} /><rect x="40" y="20" width="96" height="50" {...ln(M.sky, 1.3)} /><circle cx="128" cy="44" r="7" {...ln(M.amber, 1.2)} /></g>,
    harsh: <g><path d="M50 40L80 28H100L110 40V80H50Z" fillOpacity="0.15" {...ln(M.equip, 1.3)} fill={M.equip} />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={40 + ((i * 37) % 90)} cy={22 + ((i * 23) % 60)} r="1.4" fill="#94A3B8" />)}<path d="M126 40q-4 8 0 16q4 8 0 16" {...ln(M.sky, 0.9)} /></g>,
  };
  return <svg viewBox="0 0 160 100" className="block h-auto w-full" aria-hidden><rect width="160" height="100" fill={M.bg} />{b[k]}</svg>;
}
