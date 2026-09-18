import { FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stand-in for a real project photo/drawing extract. Keeps the visual
 * language (blueprint grid, corner marks) consistent with the rest of the
 * site instead of falling back to a generic stock image.
 */
export function ImagePlaceholder({
  alt,
  className,
  ratio = "aspect-[4/3]",
}: {
  alt: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-neutral-200 bg-neutral-50 bg-blueprint-grid-light",
        ratio,
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <FileImage className="h-6 w-6 text-neutral-400" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          Image placeholder
        </span>
      </div>
    </div>
  );
}
