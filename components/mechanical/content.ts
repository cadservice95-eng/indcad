import type { Service } from "@/lib/types";

/** Paragraphs of the overview section whose heading starts with `prefix`. */
export function overviewParagraphs(service: Service, prefix: string): string[] {
  return service.overview.find((s) => s.heading?.startsWith(prefix))?.paragraphs ?? [];
}
