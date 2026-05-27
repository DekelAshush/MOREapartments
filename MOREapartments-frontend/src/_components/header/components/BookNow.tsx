"use client";

import { useTranslations } from "next-intl";

function BookNow() {
  const t = useTranslations("BookNow");

  return (
    <div className="mx-auto min-h-[30vh] max-w-3xl px-4 py-8 text-center">
      <h1 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
        {t("title")}
      </h1>
      <p className="mb-2 text-lg leading-relaxed text-slate-600">{t("body")}</p>
      <p className="text-base text-brand">{t("trustLine")}</p>
    </div>
  );
}

export default BookNow;
