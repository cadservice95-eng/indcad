import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        dark ? "text-white" : "text-navy-900",
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center border border-copper-500 font-mono text-sm text-copper-500">
        ic
      </span>
      <span>
        Ind<span className="text-copper-500">CAD</span>
      </span>
    </Link>
  );
}
