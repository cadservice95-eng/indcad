import { SplitSection, Chips } from "./SplitSection";
import { Mechanical2DDrawing } from "@/components/svg/Mechanical2DDrawing";

export function Mechanical2DDrafting() {
  return (
    <SplitSection
      id="drafting-2d"
      tone="dark"
      eyebrow="2D drafting"
      heading="2D Mechanical Drafting"
      visual={<Mechanical2DDrawing className="h-auto w-full" />}
    >
      <p>
        2D mechanical drafting for parts and assemblies, dimensioned and toleranced to a working drawing standard rather
        than a generic default that ignores how the part is actually made.
      </p>
      <p>
        We work from your existing standards and title blocks where they exist, or set up a clean, consistent drawing
        standard where they don&apos;t. Drawings arrive in the native format your team uses, so they slot into your CAD
        environment instead of sitting outside it as an orphaned file.
      </p>
      <Chips dark items={["Part drawings", "Assembly drawings", "GA drawings", "Dimensioning & tolerancing", "Native formats"]} />
    </SplitSection>
  );
}
