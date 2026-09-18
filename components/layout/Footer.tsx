import Link from "next/link";
import { Mail, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { SITE, SERVICE_AREAS } from "@/lib/constants";
import { serviceCategories } from "@/data/service-categories";
import { industries } from "@/data/industries";
import { locations } from "@/data/locations";
import { projectCategories } from "@/data/project-categories";

const flagshipServices = serviceCategories.map((c) => c.services[0]);

export function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-neutral-300">
      <Container className="py-14">
        <div className="mb-12 max-w-sm">
          <Logo dark />
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">{SITE.shortDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          <FooterColumn title="Services">
            {flagshipServices.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.name}
              </FooterLink>
            ))}
            <FooterLink href="/services">View all services</FooterLink>
          </FooterColumn>

          <FooterColumn title="Industries">
            {industries.map((i) => (
              <FooterLink key={i.slug} href={`/industries/${i.slug}`}>
                {i.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Locations">
            {locations.map((l) => (
              <FooterLink key={l.slug} href={`/locations/${l.slug}`}>
                {l.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Projects">
            {projectCategories.map((p) => (
              <FooterLink key={p.slug} href={`/projects/${p.slug}`}>
                {p.name}
              </FooterLink>
            ))}
            <FooterLink href="/projects">View all projects</FooterLink>
          </FooterColumn>

          <FooterColumn title="Resources">
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/guides">Guides</FooterLink>
            <FooterLink href="/standards">Standards</FooterLink>
            <FooterLink href="/software">Software</FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/get-a-quote">Get a Free Quote</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms-and-conditions">Terms &amp; Conditions</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 grid gap-8 border-t border-navy-800 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" aria-hidden />
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Email</p>
              <p className="text-sm text-neutral-200">{SITE.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" aria-hidden />
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Phone</p>
              <p className="text-sm text-neutral-200">{SITE.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" aria-hidden />
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Business hours</p>
              <p className="text-sm text-neutral-200">{SITE.hours}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-navy-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">Service areas</p>
            <p className="mt-1 text-sm text-neutral-300">{SERVICE_AREAS.join(" · ")}</p>
          </div>
          <Button href="/get-a-quote" variant="primary">
            Get a Free Quote
          </Button>
        </div>
      </Container>

      <div className="border-t border-navy-800">
        <Container className="flex flex-col gap-3 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. Trading as {SITE.name}. GSTIN {SITE.gstin}.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-neutral-300">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-neutral-300">
              Terms &amp; Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">{title}</p>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-neutral-300 transition-colors hover:text-copper-400">
        {children}
      </Link>
    </li>
  );
}
