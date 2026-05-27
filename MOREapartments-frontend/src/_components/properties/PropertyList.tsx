"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { properties } from "@/data/properties";
import PropertyCard from "./PropertyCard";

function PropertyList() {
  const t = useTranslations("Properties");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | "all">("all");

  const filteredProperties = useMemo(
    () =>
      selectedPropertyId === "all"
        ? properties
        : properties.filter((property) => property.id === selectedPropertyId),
    [selectedPropertyId],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedPropertyId("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            selectedPropertyId === "all"
              ? "bg-brand-blue text-white"
              : "bg-white text-brand-blue-dark ring-1 ring-blue-200 hover:bg-blue-50"
          }`}
        >
          {t("filterAll")}
        </button>
        {properties.map((property) => {
          const tabLabel = t.has(`addressTabs.${property.id}` as never)
            ? t(`addressTabs.${property.id}` as never)
            : t(`addresses.${property.id}` as never);

          return (
          <button
            key={property.id}
            type="button"
            onClick={() => setSelectedPropertyId(property.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              selectedPropertyId === property.id
                ? "bg-brand-blue text-white"
                : "bg-white text-brand-blue-dark ring-1 ring-blue-200 hover:bg-blue-50"
            }`}
          >
            {tabLabel}
          </button>
          );
        })}
      </div>

      <div className="grid gap-8">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
