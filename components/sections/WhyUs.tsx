import { Layers, Boxes, SlidersHorizontal, FileText, MapPinned, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const points = [
  {
    icon: Layers,
    title: "Multidisciplinary capability",
    description: "Mechanical, structural, architectural, civil and electrical drafting under one point of contact.",
  },
  {
    icon: Boxes,
    title: "CAD and BIM expertise",
    description: "2D drafting, 3D modelling and coordinated BIM, delivered in the native format your team works in.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible project support",
    description: "Scoped as a single drawing, a full documentation set, or ongoing overflow capacity.",
  },
  {
    icon: FileText,
    title: "Technical documentation",
    description: "Drawings, models and schedules produced to a consistent, checkable standard.",
  },
  {
    icon: MapPinned,
    title: "India-wide service",
    description: "Remote drafting and design support for clients across every state and union territory.",
  },
  {
    icon: TrendingUp,
    title: "Scalable project capacity",
    description: "Capacity that flexes with a single small job or a multi-discipline project program.",
  },
];

export function WhyUs() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Why clients use us" heading="Built for how engineering and construction teams actually work" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="border border-neutral-200 bg-white p-6">
              <point.icon className="h-5 w-5 text-copper-500" aria-hidden />
              <h3 className="mt-4 text-sm font-semibold text-navy-900">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{point.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
