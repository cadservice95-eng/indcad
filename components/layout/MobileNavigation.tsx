"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { serviceCategories } from "@/data/service-categories";
import { industries } from "@/data/industries";
import { locations } from "@/data/locations";
import { projectCategories } from "@/data/project-categories";

const industryLinks = industries.map((i) => ({ name: i.name, href: `/industries/${i.slug}` }));
const locationLinks = locations.map((l) => ({ name: l.name, href: `/locations/${l.slug}` }));
const projectLinks = projectCategories.map((p) => ({ name: p.name, href: `/projects/${p.slug}` }));
const resourceLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Guides", href: "/guides" },
  { name: "Standards", href: "/standards" },
];

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setOpenSection(null);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center text-navy-900"
      >
        <Menu className="h-6 w-6" aria-hidden />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex flex-col bg-white">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <Logo />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center text-navy-900"
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
                <AccordionSection
                  title="Services"
                  open={openSection === "services"}
                  onToggle={() => setOpenSection((s) => (s === "services" ? null : "services"))}
                >
                  <div className="space-y-4 pb-2 pl-1">
                    {serviceCategories.map((category) => (
                      <div key={category.slug}>
                        <Link href={`/services/${category.slug}`} onClick={close} className="text-xs font-semibold uppercase tracking-wide text-neutral-400 hover:text-copper-600">
                          {category.name}
                        </Link>
                        <ul className="mt-1.5 space-y-1.5">
                          {category.services.map((service) => (
                            <li key={service.slug}>
                              <Link href={`/services/${category.slug}/${service.slug}`} onClick={close} className="block py-1 text-sm text-neutral-700">
                                {service.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link href="/services" onClick={close} className="block py-1 text-sm font-medium text-copper-600">
                      View all services →
                    </Link>
                  </div>
                </AccordionSection>

                <AccordionSection
                  title="Industries"
                  open={openSection === "industries"}
                  onToggle={() => setOpenSection((s) => (s === "industries" ? null : "industries"))}
                >
                  <LinkList items={industryLinks} onNavigate={close} viewAllHref="/industries" viewAllLabel="View all industries" />
                </AccordionSection>

                <AccordionSection
                  title="Projects"
                  open={openSection === "projects"}
                  onToggle={() => setOpenSection((s) => (s === "projects" ? null : "projects"))}
                >
                  <LinkList items={projectLinks} onNavigate={close} viewAllHref="/projects" viewAllLabel="View all projects" />
                </AccordionSection>

                <AccordionSection
                  title="Locations"
                  open={openSection === "locations"}
                  onToggle={() => setOpenSection((s) => (s === "locations" ? null : "locations"))}
                >
                  <LinkList items={locationLinks} onNavigate={close} viewAllHref="/locations" viewAllLabel="View all locations" />
                </AccordionSection>

                <Link href="/software" onClick={close} className="block border-b border-neutral-100 py-4 text-base font-medium text-navy-900">
                  Software
                </Link>

                <AccordionSection
                  title="Resources"
                  open={openSection === "resources"}
                  onToggle={() => setOpenSection((s) => (s === "resources" ? null : "resources"))}
                >
                  <LinkList items={resourceLinks} onNavigate={close} viewAllHref="/resources" viewAllLabel="Resource hub" />
                </AccordionSection>

                <Link href="/about" onClick={close} className="block py-4 text-base font-medium text-navy-900">
                  About
                </Link>
              </nav>

              <div className="border-t border-neutral-200 p-5">
                <Button href="/get-a-quote" size="lg" className="w-full" onClick={close}>
                  Get a Free Quote
                </Button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-neutral-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-base font-medium text-navy-900"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? <div className="pb-2">{children}</div> : null}
    </div>
  );
}

function LinkList({
  items,
  onNavigate,
  viewAllHref,
  viewAllLabel,
}: {
  items: { name: string; href: string }[];
  onNavigate: () => void;
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <div className="space-y-1.5 pb-2 pl-1">
      {items.map((item) => (
        <Link key={item.href} href={item.href} onClick={onNavigate} className="block py-1 text-sm text-neutral-700">
          {item.name}
        </Link>
      ))}
      <Link href={viewAllHref} onClick={onNavigate} className="block py-1 text-sm font-medium text-copper-600">
        {viewAllLabel} →
      </Link>
    </div>
  );
}
