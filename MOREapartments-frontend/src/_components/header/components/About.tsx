"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function About() {
  const t = useTranslations("About");
  const router = useRouter();

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="gradient-text-about mb-4 text-4xl font-bold md:text-5xl">
          {t("title")}
        </h1>
        <h2 className="mb-6 text-xl italic text-slate-600 md:text-2xl">
          {t("subtitle")}
        </h2>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600">
          {t("introduction")}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl space-y-8 px-4">
        <section className="glass-card p-8">
          <h3 className="mb-4 text-2xl font-semibold text-brand-blue-dark">
            {t("storyTitle")}
          </h3>
          <p className="whitespace-pre-line leading-relaxed text-slate-600">
            {t("storyContent")}
          </p>
        </section>

        <section className="glass-card p-8">
          <h3 className="mb-4 text-2xl font-semibold text-brand-blue-dark">
            {t("approachTitle")}
          </h3>
          <p className="leading-relaxed text-slate-600">{t("approachContent")}</p>
        </section>

        <section className="glass-card p-8">
          <h3 className="mb-4 text-2xl font-semibold text-brand-blue-dark">
            {t("credentialsTitle")}
          </h3>
          <p className="whitespace-pre-line leading-relaxed text-slate-600">
            {t("credentialsContent")}
          </p>
        </section>
      </div>

      <div className="mx-auto mt-12 max-w-2xl px-4 text-center">
        <h3 className="mb-4 text-2xl font-semibold text-brand-blue-dark">
          {t("ctaTitle")}
        </h3>
        <p className="mb-6 text-slate-600">{t("ctaBody")}</p>
        <button
          type="button"
          className="btn-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(30,64,175,0.3)]"
          onClick={() => router.push("/book-now")}
        >
          {t("ctaButton")}
        </button>
      </div>
    </div>
  );
}

export default About;
