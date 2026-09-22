import { ServiceCard } from "@/components/ServiceCard";
import { serviceCategories } from "@/data/service-categories";
import { getServiceBySlug } from "@/data/services";

export function ServiceGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {serviceCategories.map((category) => {
        const flagship = getServiceBySlug(category.services[0].slug);
        if (!flagship) return null;
        return (
          <ServiceCard
            key={category.slug}
            href={`/services/${category.slug}/${flagship.slug}`}
            icon={category.icon}
            name={category.name}
            description={category.shortDescription}
            deliverables={flagship.deliverables}
          />
        );
      })}
    </div>
  );
}
