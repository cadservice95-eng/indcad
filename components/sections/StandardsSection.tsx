import { FileCheck2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function StandardsSection() {
  return (
    <section className="border-t border-neutral-200 py-16 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Eyebrow>Drawing standards</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl">
            Drafted to your standard, and aware of the ones that govern your project
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            We draft to your supplied title blocks, layer standards and drawing conventions, and work with
            awareness of the Indian Standards (IS codes) commonly referenced in your discipline. Final compliance
            sign-off always sits with your engineer, architect or certifying authority.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FileCheck2 className="hidden h-8 w-8 text-copper-500 sm:block" aria-hidden />
          <Button href="/standards" variant="ghost">
            Browse standards resources
          </Button>
        </div>
      </Container>
    </section>
  );
}
