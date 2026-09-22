import Link from "next/link";
import { cn } from "@/lib/utils";
import { btn, inputClass } from "./ui";

const PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "7 days" },
  { value: "last30", label: "30 days" },
  { value: "month", label: "This month" },
  { value: "all", label: "All time" },
] as const;

/** Date-range switcher: plain links plus a GET form for custom ranges (no client JS needed). */
export function RangeSelector({ basePath, active, from, to, extra }: { basePath: string; active: string; from?: string; to?: string; extra?: Record<string, string | undefined> }) {
  const hrefFor = (range: string) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extra ?? {})) if (value) params.set(key, value);
    params.set("range", range);
    return `${basePath}?${params.toString()}`;
  };
  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      <div role="group" aria-label="Date range" className="flex flex-wrap border border-neutral-300 bg-white">
        {PRESETS.map((preset) => (
          <Link
            key={preset.value}
            href={hrefFor(preset.value)}
            aria-current={active === preset.value ? "true" : undefined}
            className={cn("border-r border-neutral-200 px-3 py-1.5 text-sm last:border-r-0", active === preset.value ? "bg-navy-900 font-medium text-white" : "text-neutral-700 hover:bg-neutral-50")}
          >
            {preset.label}
          </Link>
        ))}
      </div>
      <form method="get" action={basePath} className="flex flex-wrap items-end gap-2">
        {Object.entries(extra ?? {}).map(([key, value]) => (value ? <input key={key} type="hidden" name={key} value={value} /> : null))}
        <input type="hidden" name="range" value="custom" />
        <label className="text-xs text-neutral-500">
          From
          <input type="date" name="from" defaultValue={from} required className={cn(inputClass, "mt-0.5 block w-auto py-1.5")} />
        </label>
        <label className="text-xs text-neutral-500">
          To
          <input type="date" name="to" defaultValue={to} required className={cn(inputClass, "mt-0.5 block w-auto py-1.5")} />
        </label>
        <button type="submit" className={cn(btn.outline, active === "custom" && "border-navy-900")}>
          Apply
        </button>
      </form>
    </div>
  );
}
