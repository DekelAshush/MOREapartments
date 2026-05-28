"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Apartment } from "@/data/properties";

type Props = {
  apartment: Apartment;
  title: string;
  propertyAddress: string;
};

function ApartmentGallery({ apartment, title, propertyAddress }: Props) {
  const t = useTranslations("Properties");
  const [activeImage, setActiveImage] = useState(apartment.coverImage);

  return (
    <section>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={activeImage}
          alt={`${propertyAddress} — ${title}`}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
      </div>

      {apartment.images.length > 1 ? (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {apartment.images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors ${
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
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ApartmentGallery;
