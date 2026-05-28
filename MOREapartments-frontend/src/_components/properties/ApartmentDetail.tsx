"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Apartment, Property } from "@/data/properties";
import ApartmentAvailability from "./ApartmentAvailability";
import ApartmentCalendar from "./ApartmentCalendar";
import ApartmentGallery from "./ApartmentGallery";

type Props = {
  property: Property;
  apartment: Apartment;
};

function ApartmentDetail({ property, apartment }: Props) {
  const t = useTranslations("Properties");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const streetAddress = t(`addresses.${property.id}` as never);
  const address = t("addressWithCity", {
    address: streetAddress,
    city: t("city"),
  });

  const label = apartment.labelKey
    ? t(`apartmentLabels.${apartment.labelKey}` as never)
    : "";

  const title = label
    ? t("apartmentNamed", { number: apartment.number, label })
    : t("apartmentNumber", { number: apartment.number });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <nav className="text-sm text-slate-600">
        <Link href="/properties" className="hover:text-brand-blue">
          {t("title")}
        </Link>
        <span className="mx-2">/</span>
        <span>{address}</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand-blue-dark">{title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark">{title}</h1>
          <p className="mt-2 text-slate-600">{address}</p>
        </div>
        <Link
          href="/book-now"
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light"
        >
          {t("bookProperty")}
        </Link>
      </div>

      <ApartmentGallery
        apartment={apartment}
        title={title}
        propertyAddress={address}
      />

      <ApartmentCalendar
        apartmentId={apartment.id}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <ApartmentAvailability
        apartmentId={apartment.id}
        initialArrivalDate={selectedDate}
      />
    </div>
  );
}

export default ApartmentDetail;
