"use client";

import { useState } from "react";
import { SteelFrame } from "./SteelFrame";
import { SCHEDULE, BOLTS, REVISIONS } from "./steel";
import { cn } from "@/lib/utils";

/** Model ↔ schedule: hover a take-off row and the members it counts light up. Illustrative values. */
export function TakeoffLinked({ className }: { className?: string }) {
  const [row, setRow] = useState<number | null>(null);
  const ids = row === null ? undefined : SCHEDULE[row].ids;
  return (
    <div className={cn("space-y-4", className)}>
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300 sm:text-[11px]">
        {["3D structural model", "Model elements", "Material take-off", "Bolt list"].map((t, i) => (
          <li key={t} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden className="text-copper-400">→</span> : null}
            <span className="border border-steel-300/30 px-2 py-1">{t}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="border border-steel-300/25 bg-ink-950 p-2">
          <SteelFrame highlightIds={ids} detail={1} className="h-auto w-full" viewBox="40 60 600 440" />
        </div>
        <div className="space-y-4">
          <div className="border border-steel-300/20 bg-ink-900/70">
            <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Material take-off</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative</p>
            </div>
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-neutral-500">
                <tr>{["Piece mark", "Member", "Qty", "Material", "Length"].map((h) => <th key={h} className="px-4 py-2 font-normal uppercase tracking-[0.1em]">{h}</th>)}</tr>
              </thead>
              <tbody>
                {SCHEDULE.map((r, i) => (
                  <tr
                    key={r.mark}
                    tabIndex={0}
                    onMouseEnter={() => setRow(i)}
                    onMouseLeave={() => setRow(null)}
                    onFocus={() => setRow(i)}
                    onBlur={() => setRow(null)}
                    className={cn("cursor-default border-t border-steel-300/10 outline-none transition-colors", row === i ? "bg-copper-500/10 text-white" : "text-neutral-300 hover:bg-white/5")}
                  >
                    <td className="px-4 py-2.5 text-sky-300">{r.mark}</td><td className="px-4 py-2.5">{r.member}</td><td className="px-4 py-2.5">{r.qty}</td><td className="px-4 py-2.5">{r.material}</td><td className="px-4 py-2.5">{r.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border border-steel-300/20 bg-ink-900/70">
            <div className="border-b border-steel-300/20 px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Bolt list</p>
            </div>
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-neutral-500">
                <tr>{["Mark", "Size", "Qty", "Connection"].map((h) => <th key={h} className="px-4 py-2 font-normal uppercase tracking-[0.1em]">{h}</th>)}</tr>
              </thead>
              <tbody>
                {BOLTS.map((b) => (
                  <tr key={b.mark} className="border-t border-steel-300/10 text-neutral-300">
                    <td className="px-4 py-2.5 text-sky-300">{b.mark}</td><td className="px-4 py-2.5">{b.size}</td><td className="px-4 py-2.5">{b.qty}</td><td className="px-4 py-2.5">{b.connection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Switch between issues A–D: new members appear, removed ones ghost out and changes are clouded. */
export function RevisionViewer({ className }: { className?: string }) {
  const [rev, setRev] = useState(1);
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[260px_1fr]", className)}>
      <div role="tablist" aria-label="Drawing issues" className="grid auto-rows-min grid-cols-2 content-start gap-2 lg:grid-cols-1">
        {REVISIONS.map((r, i) => (
          <button
            key={r.code}
            type="button"
            role="tab"
            aria-selected={rev === i}
            onClick={() => setRev(i)}
            className={cn("relative border px-4 py-3 text-left transition-colors", rev === i ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}
          >
            <span className="block font-mono text-xs uppercase tracking-[0.14em]">{r.code}</span>
            <span className="mt-0.5 block text-xs text-neutral-400">{r.stage}</span>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="border border-steel-300/25 bg-ink-950 p-2">
          <SteelFrame revision={rev} detail={1} className="mx-auto h-auto w-full max-w-3xl" viewBox="40 60 600 440" />
        </div>
        <div className="border border-steel-300/20 bg-ink-900/70">
          <table className="w-full text-left font-mono text-xs">
            <thead className="text-neutral-500">
              <tr>{["Revision", "Description", "Status"].map((h) => <th key={h} className="px-4 py-2 font-normal uppercase tracking-[0.1em]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {REVISIONS.map((r, i) => (
                <tr key={r.code} className={cn("border-t border-steel-300/10 transition-colors", rev === i ? "bg-copper-500/10 text-white" : "text-neutral-400")}>
                  <td className="px-4 py-2.5 text-sky-300">{r.code}</td>
                  <td className="px-4 py-2.5 font-sans text-[13px]">{r.note}</td>
                  <td className="px-4 py-2.5">{i === rev ? "Viewing" : r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
