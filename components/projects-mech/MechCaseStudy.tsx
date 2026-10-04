"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const TABS = ["Challenge", "Scope", "Process", "Deliverables", "Key considerations", "Outcome"] as const;

/** Case-study card: the project's own data in the challenge → outcome structure, condensed. */
export function MechCaseStudy({ project, visual }: { project: Project; visual: React.ReactNode }) {
  const [t, setT] = useState(0);
  const lists: string[][] = [project.challenge.slice(0, 3), project.scope, project.process.slice(0, 4), project.deliverables, project.considerations.slice(0, 5), project.outcome.slice(0, 3)];
  const bullets = t === 1 || t === 3 || t === 4;
  const id = `cs-${project.slug}`;
  return (
    <article className="grid overflow-hidden border border-slate-300 bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative flex items-center border-b border-slate-200 bg-[#0F172A] lg:border-b-0 lg:border-r">
        {visual}
        {project.isPlaceholder ? <span className="absolute left-3 top-3 border border-amber-400 bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-amber-800">Illustrative example</span> : null}
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper-600">{project.discipline} · {project.industry}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.summary}</p>
        <div role="tablist" aria-label={`${project.title} case study sections`} className="-mx-1 mt-5 flex gap-1 overflow-x-auto px-1 pb-1">
          {TABS.map((x, k) => <button key={x} role="tab" type="button" id={`${id}-t${k}`} aria-selected={t === k} aria-controls={`${id}-p`} onClick={() => setT(k)} onKeyDown={(e) => { if (e.key === "ArrowRight") setT((k + 1) % TABS.length); if (e.key === "ArrowLeft") setT((k + TABS.length - 1) % TABS.length); }} className={cn("min-h-[38px] shrink-0 border px-3 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors", t === k ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600 hover:border-slate-900")}>{x}</button>)}
        </div>
        <div id={`${id}-p`} role="tabpanel" aria-labelledby={`${id}-t${t}`} className="mt-4 min-h-[180px] flex-1">
          {bullets ? (
            <ul className="grid gap-x-6 gap-y-1.5 text-sm text-slate-700 sm:grid-cols-2">{lists[t].map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-copper-500" />{x}</li>)}</ul>
          ) : (
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">{lists[t].map((x) => <p key={x}>{x}</p>)}</div>
          )}
        </div>
        <Link href={`/projects/${project.discipline}/${project.slug}`} className="mt-6 inline-flex items-center gap-1.5 self-start bg-copper-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-copper-600">View full project <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </article>
  );
}
