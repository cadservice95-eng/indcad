import {
  Cog,
  Building2,
  Ruler,
  Map,
  Zap,
  Boxes,
  FileInput,
  DraftingCompass,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  cog: Cog,
  "building-2": Building2,
  ruler: Ruler,
  map: Map,
  zap: Zap,
  boxes: Boxes,
  "file-input": FileInput,
  "drafting-compass": DraftingCompass,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Cog;
  return <Icon className={className} aria-hidden />;
}
