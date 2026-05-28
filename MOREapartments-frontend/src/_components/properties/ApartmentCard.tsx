"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Apartment } from "@/data/properties";
import ApartmentAvailability from "./ApartmentAvailability";

type Props = {
  apartment: Apartment;
  propertyId: string;
  propertyAddress: string;
};

function ApartmentCard({ apartment, propertyId, propertyAddress }: Props) {
  const t = useTranslations("Properties");
  const [activeImage, setActiveImage] = useState(apartment.coverImage);
  const detailHref = `/properties/${propertyId}/${apartment.id}`;

  const label = apartment.labelKey
    ? t(`apartmentLabels.${apartment.labelKey}` as never)
    : "";

  const title = label
    ? t("apartmentNamed", { number: apartment.number, label })
    : t("apartmentNumber", { number: apartment.number });

  return (
    <article className="overflow-hidden rounded-xl border border-blue-100 bg-white">
      <Link href={detailHref} className="block">
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={activeImage}
            alt={`${propertyAddress} — ${title}`}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Link href={detailHref} className="text-lg font-semibold text-brand-blue-dark hover:underline">
            {title}
          </Link>
          <span className="rounded-full bg-brand-blue-soft px-2.5 py-1 text-xs font-medium text-brand-blue">
            {t("photoCount", { count: apartment.imageCount })}
          </span>
        </div>

        {apartment.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {apartment.images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  activeImage === image
                    ? "border-brand-blue"
                    : "border-transparent hover:border-blue-200"
                }`}
                aria-label={t("viewPhoto")}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        ) : null}

        <Link
          href={detailHref}
          className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
        >
          {t("viewUnit")}
        </Link>

        <ApartmentAvailability apartmentId={apartment.id} />
      </div>
    </article>
  );
}

export default ApartmentCard;
