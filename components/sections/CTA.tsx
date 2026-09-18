import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function CTA({
  heading = "Get a Free Quote",
  description = "Tell us what you need and our team can review the project requirements.",
  variant = "dark",
  primaryLabel = "Request a Quote",
  primaryHref = "/get-a-quote",
  secondaryLabel,
  secondaryHref,
}: {
  heading?: string;
  description?: string;
  variant?: "dark" | "light" | "copper";
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section
      className={cn(
        "border-t py-16 sm:py-20",
        variant === "dark" && "border-navy-800 bg-navy-950",
        variant === "light" && "border-neutral-200 bg-neutral-50",
        variant === "copper" && "border-copper-700 bg-copper-600",
      )}
    >
      <Container className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2
            className={cn(
              "text-balance text-2xl font-semibold tracking-tight sm:text-3xl",
              variant === "light" ? "text-navy-900" : "text-white",
            )}
          >
            {heading}
          </h2>
          <p className={cn("mt-3 text-base leading-relaxed", variant === "light" ? "text-neutral-600" : "text-neutral-300")}>
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={primaryHref} size="lg" variant={variant === "light" ? "primary" : "primary"}>
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref ? (
            <Button href={secondaryHref} size="lg" variant={variant === "light" ? "ghost" : "outline-light"}>
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
