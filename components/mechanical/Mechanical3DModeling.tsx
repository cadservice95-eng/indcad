import Link from "next/link";
import { SplitSection, Chips } from "./SplitSection";
import { CadTo3D } from "@/components/svg/CadTo3D";

export function Mechanical3DModeling() {
  return (
    <SplitSection
      id="modelling-3d"
      eyebrow="3D CAD"
      heading="3D CAD Modelling"
      flip
      visual={<CadTo3D className="h-auto w-full" />}
    >
      <p>
        3D CAD models for design validation and downstream use, built as solid and surface models in your native CAD
        format, with STEP and IGES neutral exports for supplier handover.
      </p>
      <p>
        A 2D outline becomes a solid by extrusion, then picks up its features — boss, bore, holes and fillets — so the
        model can be checked, revised and used for drawings.
      </p>
      <Chips items={["Solid Modelling", "Surface Modelling", "Assembly Modelling"]} />
      <p>
        <Link href="/services/mechanical/3d-cad-modelling" className="text-sm font-semibold text-navy-900 underline-offset-4 hover:text-copper-600 hover:underline">
          See the dedicated 3D CAD Modelling service →
        </Link>
      </p>
    </SplitSection>
  );
}
