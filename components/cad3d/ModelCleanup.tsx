import { InView } from "@/components/motion/InView";
import { cn } from "@/lib/utils";

const before = ["Feature 1", "Copy 2", "Fix", "Patch", "Temp", "Copy", "Boss???"];
const after = ["Base Sketch", "Extrusion", "Fillet", "Hole Pattern", "Chamfer", "Configuration"];

function Tree({ title, items, tone }: { title: string; items: string[]; tone: "before" | "after" }) {
  return (
    <div className={cn("border bg-ink-950", tone === "before" ? "border-copper-500/40" : "border-emerald-400/40")}>
      <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
        <p className={cn("font-mono text-[11px] uppercase tracking-[0.16em]", tone === "before" ? "text-copper-400" : "text-emerald-400")}>{title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative tree</p>
      </div>
      <ul className="py-2 font-mono text-[13px]">
        {items.map((item, i) => (
          <li
            key={item}
            style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
            className={cn("reveal flex items-center gap-3 px-4 py-2", tone === "before" ? "text-neutral-400" : "text-neutral-200")}
          >
            <span aria-hidden className="text-neutral-600">{i === items.length - 1 ? "└─" : "├─"}</span>
            <span aria-hidden className={cn("h-2 w-2", tone === "before" ? (i % 2 ? "bg-copper-500/80" : "bg-neutral-500") : "bg-sky-400")} />
            {item}
            {tone === "before" && (item === "Fix" || item === "Boss???" || item === "Temp") ? (
              <span aria-hidden className="ml-auto text-copper-400">⚠</span>
            ) : null}
            {tone === "after" ? (
              <svg aria-hidden viewBox="0 0 12 12" className="ml-auto h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6.5l2.5 2.5L10 3.5" />
              </svg>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Before / after feature-tree structure. */
export function ModelCleanup({ className }: { className?: string }) {
  return (
    <InView threshold={0.25} className={cn("grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]", className)}>
      <Tree title="Before · unclear history" items={before} tone="before" />
      <div aria-hidden className="mx-auto flex h-10 w-10 rotate-90 items-center justify-center text-copper-400 md:rotate-0">
        <svg viewBox="0 0 40 20" className="h-5 w-10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 10h30M26 4l7 6-7 6" className="rch-flow" />
        </svg>
      </div>
      <Tree title="After · structured intent" items={after} tone="after" />
    </InView>
  );
}
