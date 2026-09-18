import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckList({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={cn("grid gap-x-8 gap-y-3", columns === 2 && "sm:grid-cols-2")}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
