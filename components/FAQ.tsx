"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/lib/types";

export function FAQ({ items, heading = "Frequently Asked Questions" }: { items: FAQItem[]; heading?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 py-16 sm:py-20">
      <JsonLd data={faqJsonLd(items)} />
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQs" heading={heading} align="left" />
        <dl className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium text-navy-900"
                  >
                    {item.question}
                    <Plus className={cn("h-4 w-4 shrink-0 text-copper-500 transition-transform", isOpen && "rotate-45")} aria-hidden />
                  </button>
                </dt>
                <dd className={cn("overflow-hidden text-sm leading-relaxed text-neutral-600 transition-all", isOpen ? "max-h-64 pb-5" : "max-h-0")}>
                  {item.answer}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
