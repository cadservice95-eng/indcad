"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/lib/types";

export function FAQ({ items, heading = "Frequently Asked Questions" }: { items: FAQItem[]; heading?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const uid = useId();

  if (items.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 py-16 sm:py-20">
      <JsonLd data={faqJsonLd(items)} />
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQs" heading={heading} align="left" />
        <dl className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${uid}-panel-${index}`;
            const buttonId = `${uid}-button-${index}`;
            return (
              <div key={item.question}>
                <dt>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium transition-colors hover:text-copper-600",
                      isOpen ? "text-copper-600" : "text-navy-900",
                    )}
                  >
                    {item.question}
                    <Plus className={cn("h-4 w-4 shrink-0 text-copper-500 transition-transform duration-300", isOpen && "rotate-45")} aria-hidden />
                  </button>
                </dt>
                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-8 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
