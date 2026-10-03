import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";

// Order and display names follow the brief; slugs map to existing /software pages.
const tools: { slug: string; name: string; note: string }[] = [
  { slug: "autocad", name: "AutoCAD", note: "2D drafting & DWG" },
  { slug: "revit", name: "Revit", note: "BIM modelling" },
  { slug: "solidworks", name: "SolidWorks", note: "Mechanical 3D CAD" },
  { slug: "inventor", name: "Autodesk Inventor", note: "Mechanical 3D CAD" },
  { slug: "tekla", name: "Tekla", note: "Structural detailing" },
  { slug: "civil-3d", name: "Civil 3D", note: "Civil & site design" },
  { slug: "navisworks", name: "Navisworks", note: "Model coordination" },
  { slug: "archicad", name: "ArchiCAD", note: "Architectural BIM" },
  { slug: "fusion-360", name: "Fusion 360", note: "Mechanical CAD" },
  { slug: "microstation", name: "MicroStation", note: "2D / 3D CAD" },
];

export function SoftwareSection() {
  return (
    <section className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Software"
            heading="Tools & Technologies We Work With"
            description="We deliver in the platform your team or consultant already uses, in native and neutral formats."
          />
          <Link
            href="/software"
            className="text-sm font-semibold text-navy-900 underline-offset-4 transition-colors hover:text-copper-600 hover:underline"
          >
            Software expertise →
          </Link>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-3 lg:grid-cols-5">
          {tools.map((tool, i) => (
            <li key={tool.slug} className="bg-white">
              <Reveal delay={(i % 5) * 50} className="h-full">
                <Link
                  href={`/software/${tool.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors duration-300 hover:bg-navy-900"
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-neutral-400 transition-colors group-hover:text-sky-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-base font-semibold tracking-tight text-neutral-500 transition-colors duration-300 group-hover:text-white">
                      {tool.name}
                    </span>
                    <span className="mt-1 block text-xs text-neutral-400 transition-colors group-hover:text-neutral-300">
                      {tool.note}
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-neutral-500">
          Product names are trademarks of their respective owners and are listed to show file-format and platform
          compatibility only.
        </p>
      </Container>
    </section>
  );
}
