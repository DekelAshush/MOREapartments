"use client";

import { useTranslations } from "next-intl";
import PropertyList from "@/_components/properties/PropertyList";

function Properties() {
  const t = useTranslations("Properties");

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
          {t("title")}
        </h1>
        <h2 className="mb-8 text-xl italic text-slate-600 md:text-2xl">
          {t("subtitle")}
        </h2>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="glass-card mb-12 p-8">
          <p className="text-center text-lg leading-relaxed text-slate-600">
            {t("description")}
          </p>
        </div>

        <h3 className="mb-8 text-center text-2xl font-semibold text-brand-blue-dark">
          {t("listTitle")}
        </h3>

        <PropertyList />
      </div>
    </div>
  );
}

export default Properties;
