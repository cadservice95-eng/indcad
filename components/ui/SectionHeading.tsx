import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-copper-600",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-copper-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={cn(align === "center" && "justify-center", tone === "dark" && "text-copper-400")}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          "mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl",
          tone === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {heading}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed", tone === "dark" ? "text-neutral-300" : "text-neutral-600")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
