import { IsometricBuilding } from "./IsometricBuilding";
import { makeIso, seg, loop } from "./iso";

const W = 24.8;
const D = 12;
const H = 8.4;
const S = 5.4;
const OX = 190;
const LAYERS = [
  { oy: 80, label: "BIM MODEL", n: "03" },
  { oy: 262, label: "3D MODEL", n: "02" },
  { oy: 444, label: "2D DRAWING", n: "01" },
] as const;

const d = (ms: number, extra?: Record<string, string>) =>
  ({ "--d": `${ms}ms`, ...extra }) as React.CSSProperties;

/**
 * Exploded isometric stack: 2D drawing → 3D model → BIM model, joined by
 * animated flow lines. Decorative; the same story is told in HTML beside it.
 */
export function LayerStack({ className }: { className?: string }) {
  const pts = LAYERS.map((l) => makeIso(OX, l.oy, S));
  const slab = (p: ReturnType<typeof makeIso>) =>
    loop(p(-3, -3, 0), p(W + 3, -3, 0), p(W + 3, D + 3, 0), p(-3, D + 3, 0));

  const plan = (p: ReturnType<typeof makeIso>) =>
    [
      loop(p(0, 0, 0), p(W, 0, 0), p(W, D, 0), p(0, D, 0)),
      seg(p(W * 0.28, 0, 0), p(W * 0.28, D, 0)),
      seg(p(W * 0.28, D * 0.5, 0), p(W, D * 0.5, 0)),
      seg(p(W * 0.64, D * 0.5, 0), p(W * 0.64, D, 0)),
    ].join("");

  // Connectors between layers, at three slab corners
  const corners: [number, number][] = [
    [W + 3, D + 3],
    [-3, D + 3],
    [W + 3, -3],
  ];


  return (
    <svg
      viewBox="0 0 560 580"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Exploded isometric view showing a 2D drawing, a 3D wireframe model and a BIM model stacked in sequence"
    >
      <path d="M0 22V0h22M538 0h22v22M560 558v22h-22M22 580H0v-22" stroke="#38bdf8" strokeWidth="2" />

      {/* connectors */}
      <g className="text-copper-400">
        {[0, 1].map((k) =>
          corners.map(([x, y], ci) => {
            const lower = pts[k + 1](x, y, 0);
            const upper = pts[k](x, y, 0);
            return (
              <g key={`${k}-${ci}`} className="fade-in" style={d(k === 1 ? 700 : 1900)}>
                <path d={seg(lower, upper)} stroke="currentColor" strokeWidth="1" className="rch-flow" opacity="0.7" />
                <path
                  d={`M${upper[0]} ${upper[1] + 12}l-3.2 6h6.4z`}
                  fill="currentColor"
                  opacity="0.9"
                />
              </g>
            );
          }),
        )}
      </g>

      {LAYERS.map((layer, i) => {
        const p = pts[i];
        const order = 2 - i; // bottom layer enters first
        const t = order * 1200;
        return (
          <g key={layer.label} className="text-sky-300">
            <path
              d={slab(p)}
              className="draw fill-sky-400/5"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1"
              pathLength={1}
              style={d(t, { "--t": "1.2s" })}
            />
            {i === 2 ? (
              <path d={plan(p)} stroke="currentColor" strokeWidth="1.6" pathLength={1} className="draw" style={d(t + 500, { "--t": "1.6s" })} />
            ) : (
              <IsometricBuilding
                ox={OX}
                oy={layer.oy}
                s={S}
                W={W}
                D={D}
                H={H}
                detail={i === 0 ? "bim" : "wire"}
                delay={t + 400}
              />
            )}
            {i === 0 ? (
              <path
                d={seg(p(2, 2, H + 0.02), p(W * 0.5, 2, H + 0.02), p(W * 0.5, D - 2, H + 0.02), p(W - 3, D - 2, H + 0.02))}
                stroke="#d68a51"
                strokeWidth="1.6"
                strokeDasharray="1 0"
                pathLength={1}
                className="draw"
                style={d(t + 2200, { "--t": "1.4s" })}
              />
            ) : null}

            {/* label */}
            <g className="fade-in" style={d(t + 900)}>
              <path d={`M${p(W + 3, D / 2, 0)[0] + 6} ${p(W + 3, D / 2, 0)[1]}H400`} stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
              <rect x="400" y={p(W + 3, D / 2, 0)[1] - 11} width="132" height="22" className="fill-ink-950" stroke="currentColor" strokeWidth="0.9" />
              <text x="410" y={p(W + 3, D / 2, 0)[1] + 4} fill="currentColor" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.4">
                {layer.n} · {layer.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
