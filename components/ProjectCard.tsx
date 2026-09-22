import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.discipline}/${project.slug}`} className="group flex flex-col border border-neutral-200 bg-white">
      <ImagePlaceholder alt={project.gallery[0]?.alt ?? project.title} />
      <div className="flex flex-1 flex-col p-6">
        {project.isPlaceholder ? (
          <span className="mb-2 inline-flex w-fit items-center border border-neutral-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
            Placeholder example
          </span>
        ) : null}
        <span className="font-mono text-xs uppercase tracking-wide text-copper-600">{project.discipline}</span>
        <h3 className="mt-1.5 text-base font-semibold text-navy-900">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{project.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:text-copper-600">
          View project
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
