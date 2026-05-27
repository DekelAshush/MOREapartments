"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Property } from "@/data/properties";
import ApartmentCard from "./ApartmentCard";

type Props = {
  property: Property;
};

function PropertyCard({ property }: Props) {
  const t = useTranslations("Properties");
  const streetAddress = t(`addresses.${property.id}` as never);
  const address = t("addressWithCity", {
    address: streetAddress,
    city: t("city"),
  });

  return (
    <article className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/9] w-full bg-slate-100">
        <Image
          src={property.coverImage}
          alt={address}
          fill
          unoptimized
          priority={false}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
        <div className="absolute start-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {t("unitsBadge", { count: property.apartmentCount })}
          </span>
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-blue-dark shadow-sm">
            {t(`classification.${property.apartmentCount}` as never)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-brand-blue-dark">
              {address}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {t("addressSummary", { count: property.apartmentCount })}
            </p>
          </div>
          <Link
            href="/book-now"
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light"
          >
            {t("bookProperty")}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {property.apartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              propertyAddress={address}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
