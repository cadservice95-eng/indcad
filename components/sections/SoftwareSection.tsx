import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { software as allSoftware } from "@/data/software";

export function SoftwareSection({ slugs }: { slugs?: string[] }) {
  const items = slugs
    ? allSoftware.filter((item) => slugs.includes(item.slug))
    : allSoftware;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Software"
          heading="CAD & BIM Platforms We Work In"
          description="We work in the platform your team already uses, and deliver native files ready to drop back into your workflow."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/software/${item.slug}`}
              className="flex flex-col items-start gap-1 border border-neutral-200 bg-white p-4 transition-colors hover:border-copper-400"
            >
              <span className="text-sm font-semibold text-navy-900">{item.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">{item.category}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
