import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";

const links = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Locations", href: "/locations" },
  { label: "Resources", href: "/resources" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center border-b border-neutral-200 bg-neutral-50">
      <Container className="py-20 text-center">
        <Eyebrow className="justify-center">404</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-navy-900">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Try one of the links below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <Button key={link.href} href={link.href} variant="ghost">
              {link.label}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <Button href="/get-a-quote">Get a Free Quote</Button>
        </div>
      </Container>
    </section>
  );
}
