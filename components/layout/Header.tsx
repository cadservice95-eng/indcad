"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Container } from "@/components/ui/Container";
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

type NavKey = "services" | "industries" | "projects" | "locations" | "resources";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  function toggle(key: NavKey) {
    setOpenMenu((current) => (current === key ? null : key));
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "border-neutral-200 shadow-sm" : "border-transparent",
      )}
    >
      <Container className={cn("flex items-center justify-between transition-[padding] duration-150", scrolled ? "py-3" : "py-5")}>
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <NavMenuButton label="Services" active={openMenu === "services"} onClick={() => toggle("services")} />
          <NavMenuButton label="Industries" active={openMenu === "industries"} onClick={() => toggle("industries")} />
          <NavMenuButton label="Projects" active={openMenu === "projects"} onClick={() => toggle("projects")} />
          <NavMenuButton label="Locations" active={openMenu === "locations"} onClick={() => toggle("locations")} />
          <Link href="/software" className="px-3 py-2 text-sm font-medium text-navy-800 transition-colors hover:text-copper-600">
            Software
          </Link>
          <NavMenuButton label="Resources" active={openMenu === "resources"} onClick={() => toggle("resources")} />
          <Link href="/about" className="px-3 py-2 text-sm font-medium text-navy-800 transition-colors hover:text-copper-600">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/get-a-quote" size="md" className="hidden sm:inline-flex">
            Get a Free Quote
          </Button>
          <MobileNavigation />
        </div>
      </Container>

      {openMenu === "services" ? (
        <MegaMenuServices onNavigate={() => setOpenMenu(null)} />
      ) : null}
      {openMenu === "industries" ? (
        <SimpleDropdown items={industryLinks} viewAllHref="/industries" viewAllLabel="View all industries" onNavigate={() => setOpenMenu(null)} />
      ) : null}
      {openMenu === "projects" ? (
        <SimpleDropdown items={projectLinks} viewAllHref="/projects" viewAllLabel="View all projects" onNavigate={() => setOpenMenu(null)} />
      ) : null}
      {openMenu === "locations" ? (
        <SimpleDropdown items={locationLinks} viewAllHref="/locations" viewAllLabel="View all locations" onNavigate={() => setOpenMenu(null)} />
      ) : null}
      {openMenu === "resources" ? (
        <SimpleDropdown items={resourceLinks} viewAllHref="/resources" viewAllLabel="Resource hub" onNavigate={() => setOpenMenu(null)} />
      ) : null}
    </header>
  );
}

function NavMenuButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
        active ? "text-copper-600" : "text-navy-800 hover:text-copper-600",
      )}
    >
      {label}
      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", active && "rotate-180")} aria-hidden />
    </button>
  );
}

function MegaMenuServices({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="absolute inset-x-0 top-full border-b border-neutral-200 bg-white shadow-lg">
      <Container className="grid grid-cols-2 gap-x-8 gap-y-6 py-8 md:grid-cols-4">
        {serviceCategories.map((category) => (
          <div key={category.slug}>
            <div className="flex items-center gap-2 text-navy-900">
              <CategoryIcon name={category.icon} className="h-4 w-4 text-copper-500" />
              <span className="text-sm font-semibold">{category.name}</span>
            </div>
            <ul className="mt-3 space-y-2">
              {category.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={onNavigate}
                    className="text-sm text-neutral-600 transition-colors hover:text-copper-600"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-neutral-100 bg-neutral-50 py-3">
        <Container>
          <Link href="/services" onClick={onNavigate} className="text-sm font-medium text-navy-900 hover:text-copper-600">
            View all services →
          </Link>
        </Container>
      </div>
    </div>
  );
}

function SimpleDropdown({
  items,
  viewAllHref,
  viewAllLabel,
  onNavigate,
}: {
  items: { name: string; href: string }[];
  viewAllHref: string;
  viewAllLabel: string;
  onNavigate: () => void;
}) {
  return (
    <div className="absolute inset-x-0 top-full border-b border-neutral-200 bg-white shadow-lg">
      <Container className="grid grid-cols-2 gap-x-8 gap-y-2 py-6 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="py-1 text-sm text-neutral-700 transition-colors hover:text-copper-600"
          >
            {item.name}
          </Link>
        ))}
      </Container>
      <div className="border-t border-neutral-100 bg-neutral-50 py-3">
        <Container>
          <Link href={viewAllHref} onClick={onNavigate} className="text-sm font-medium text-navy-900 hover:text-copper-600">
            {viewAllLabel} →
          </Link>
        </Container>
      </div>
    </div>
  );
}
