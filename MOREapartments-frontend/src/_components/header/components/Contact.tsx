"use client";

import { useTranslations } from "next-intl";

function Contact() {
  const t = useTranslations("Contact");

  return (
    <div className="mx-auto min-h-[40vh] max-w-3xl px-4 py-8 text-center">
      <h1 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
        {t("title")}
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-slate-600">{t("body")}</p>

      <div className="glass-card mx-auto max-w-md space-y-6 p-8 text-start">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand">
            {t("emailLabel")}
          </p>
          <a
            href={`mailto:${t("email")}`}
            className="text-lg text-brand-blue-dark hover:underline"
          >
            {t("email")}
          </a>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand">
            {t("phoneLabel")}
          </p>
          <a
            href={`tel:${t("phone").replace(/\s/g, "")}`}
            className="text-lg text-brand-blue-dark hover:underline"
          >
            {t("phone")}
          </a>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand">
            {t("addressLabel")}
          </p>
          <p className="text-lg text-slate-600">{t("address")}</p>
        </div>
      </div>

      <p className="mt-8 text-base text-brand">{t("trustLine")}</p>
    </div>
  );
}

export default Contact;
