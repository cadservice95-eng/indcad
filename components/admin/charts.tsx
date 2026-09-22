import { STATUS_CHART_COLORS, STATUS_LABELS } from "@/lib/enquiry-meta";

/**
 * Dependency-free SVG charts rendered on the server. Every mark carries a
 * <title> so values are available on hover and to screen readers.
 */

type Point = { key: string; label: string; quotes: number; contacts: number; total: number };

function niceMax(value: number): number {
  // Four equal gridline steps that are whole numbers (…, 1, 2, 5, 10, 20, 50 …) so the axis reads cleanly.
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, value / 4)));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((candidate) => candidate * 4 >= value) ?? magnitude * 10;
  return step * 4;
}

export function EnquiriesOverTime({ points }: { points: Point[] }) {
  const width = 720;
  const height = 240;
  const pad = { top: 12, right: 12, bottom: 34, left: 34 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(1, ...points.map((p) => p.total)));
  const slot = innerW / Math.max(1, points.length);
  const barW = Math.max(2, Math.min(28, slot * 0.68));
  const labelEvery = Math.max(1, Math.ceil(points.length / 10));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);

  if (points.every((p) => p.total === 0)) {
    return <p className="flex h-60 items-center justify-center text-sm text-neutral-500">No enquiries in this period.</p>;
  }

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Enquiries over time, stacked by quote requests and contact messages">
        {ticks.map((tick) => {
          const y = pad.top + innerH - (tick / max) * innerH;
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#e5e5e5" strokeWidth="1" />
              <text x={pad.left - 6} y={y + 3.5} textAnchor="end" fontSize="10" fill="#737373">
                {tick}
              </text>
            </g>
          );
        })}
        {points.map((p, i) => {
          const x = pad.left + i * slot + (slot - barW) / 2;
          const quotesH = (p.quotes / max) * innerH;
          const contactsH = (p.contacts / max) * innerH;
          const baseY = pad.top + innerH;
          return (
            <g key={p.key}>
              <title>{`${p.label}: ${p.total} enquiries (${p.quotes} quote requests, ${p.contacts} contact messages)`}</title>
              {p.quotes > 0 ? <rect x={x} y={baseY - quotesH} width={barW} height={quotesH} fill="#c16a2f" /> : null}
              {p.contacts > 0 ? <rect x={x} y={baseY - quotesH - contactsH} width={barW} height={contactsH} fill="#2b699f" /> : null}
              {i % labelEvery === 0 ? (
                <text x={x + barW / 2} y={height - 14} textAnchor="middle" fontSize="10" fill="#737373">
                  {p.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-4 text-xs text-neutral-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-copper-500" aria-hidden /> Quote requests
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-steel-500" aria-hidden /> Contact messages
        </span>
      </div>
    </div>
  );
}

export function StatusDonut({ rows }: { rows: { status: string; count: number }[] }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  if (total === 0) return <p className="flex h-40 items-center justify-center text-sm text-neutral-500">No data for this period.</p>;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = rows.map((row, index) => ({ row, length: (row.count / total) * circumference, offset: rows.slice(0, index).reduce((sum, r) => sum + (r.count / total) * circumference, 0) }));
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label="Enquiries by status">
        {segments.map(({ row, length, offset }) => (
          <circle key={row.status} cx="70" cy="70" r={radius} fill="none" stroke={STATUS_CHART_COLORS[row.status] ?? "#a3a3a3"} strokeWidth="20" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset}>
            <title>{`${STATUS_LABELS[row.status] ?? row.status}: ${row.count}`}</title>
          </circle>
        ))}
        <text x="70" y="70" transform="rotate(90 70 70)" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="600" fill="#0b121c">
          {total}
        </text>
      </svg>
      <ul className="min-w-40 flex-1 space-y-1.5 text-sm">
        {rows.map((row) => (
          <li key={row.status} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0" style={{ background: STATUS_CHART_COLORS[row.status] ?? "#a3a3a3" }} aria-hidden />
            <span className="flex-1 text-neutral-700">{STATUS_LABELS[row.status] ?? row.status}</span>
            <span className="tabular-nums text-neutral-500">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({ rows, color = "bg-copper-500", empty = "No data for this period.", format }: { rows: { name: string; count: number }[]; color?: string; empty?: string; format?: (name: string) => string }) {
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-neutral-500">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.name} title={`${format ? format(row.name) : row.name}: ${row.count}`}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate text-neutral-700">{format ? format(row.name) : row.name}</span>
            <span className="shrink-0 tabular-nums text-neutral-500">{row.count}</span>
          </div>
          <div className="h-1.5 bg-neutral-100">
            <div className={`h-full ${color}`} style={{ width: `${Math.max(3, (row.count / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
