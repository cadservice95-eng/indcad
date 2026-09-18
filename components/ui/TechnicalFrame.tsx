import { cn } from "@/lib/utils";

const cornerBase = "absolute h-4 w-4 border-copper-500/80";

/**
 * Wraps content with viewport-style corner brackets, echoing a CAD/technical
 * drawing frame rather than a generic rounded card.
 */
export function TechnicalFrame({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <span aria-hidden className={cn(cornerBase, "left-0 top-0 border-l-2 border-t-2")} />
      <span aria-hidden className={cn(cornerBase, "right-0 top-0 border-r-2 border-t-2")} />
      <span aria-hidden className={cn(cornerBase, "bottom-0 left-0 border-b-2 border-l-2")} />
      <span aria-hidden className={cn(cornerBase, "bottom-0 right-0 border-b-2 border-r-2")} />
      <div className={cn("p-4", dark ? "bg-navy-900" : "bg-white")}>{children}</div>
    </div>
  );
}
