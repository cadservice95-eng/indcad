import { Info } from "lucide-react";

export function PlaceholderBanner() {
  return (
    <div className="flex items-start gap-3 border border-copper-400 bg-copper-50 px-5 py-4 text-sm text-copper-700">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        This is an illustrative placeholder case study used to demonstrate the project page format. It will be
        replaced with a verified project write-up, real photography and confirmed outcomes as that information
        becomes available.
      </p>
    </div>
  );
}
