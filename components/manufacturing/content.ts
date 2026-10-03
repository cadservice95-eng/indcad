import type { Industry } from "@/lib/types";

/** Paragraphs of the description section whose heading starts with `prefix`. */
export function descriptionParagraphs(industry: Industry, prefix: string): string[] {
  return industry.description.find((s) => s.heading?.startsWith(prefix))?.paragraphs ?? [];
}
