import type { Metadata } from "next";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE, SERVICE_AREAS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us | IndCAD",
  description: "Get in touch with IndCAD for CAD drafting, BIM and engineering design enquiries across India.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <PageHero
        eyebrow="Contact"
        heading="Contact Us"
        description="Have a question before requesting a quote? Send us a message and we'll get back to you."
        primaryLabel="Get a Free Quote"
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <ContactForm />
          <aside className="space-y-6">
            <ContactDetail icon={Mail} label="Email" value={SITE.email} />
            <ContactDetail icon={Phone} label="Phone" value={SITE.phone} />
            <ContactDetail icon={Clock} label="Business hours" value={SITE.hours} />
            <ContactDetail icon={MapPin} label="Service areas" value={SERVICE_AREAS.join(", ")} />
            <div className="border-t border-neutral-200 pt-6">
              <Button href="/get-a-quote" className="w-full">
                Get a Free Quote
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

function ContactDetail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border border-neutral-200 p-5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" aria-hidden />
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-neutral-500">{label}</p>
        <p className="mt-1 text-sm text-navy-900">{value}</p>
      </div>
    </div>
  );
}
