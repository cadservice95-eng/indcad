import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function PageHero({
  eyebrow,
  heading,
  description,
  primaryLabel = "Get a Free Quote",
  primaryHref = "/get-a-quote",
}: {
  eyebrow: string;
  heading: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-navy-950">
      <div className="absolute inset-0 bg-blueprint-grid opacity-50" aria-hidden />
      <Container className="relative py-14 sm:py-16">
        <Eyebrow className="text-copper-400">{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300">{description}</p>
        <div className="mt-8">
          <Button href={primaryHref} size="md">
            {primaryLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
