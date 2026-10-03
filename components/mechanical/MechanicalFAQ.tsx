import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";

export function MechanicalFAQ({ service }: { service: Service }) {
  return <FAQ items={service.faqs} heading="Mechanical Drafting FAQs" />;
}
