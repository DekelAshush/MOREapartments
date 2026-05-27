"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LOGO_SRC } from "@/generated/logo";

function Home() {
  const t = useTranslations("Home");
  const router = useRouter();
  const introParagraphs = t.raw("introParagraphs") as string[];
  const hostingPolicyItems = t.raw("hostingPolicyItems") as string[];
  const cancellationPolicyItems = t.raw("cancellationPolicyItems") as string[];

  return (
    <div className="min-h-screen py-8">
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-[90rem] items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
          <div className="z-[2] text-center md:text-start">
            <h1 className="gradient-text mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {t("welcomeTitle")}
            </h1>
            <div className="mb-8 space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <button
                type="button"
                className="btn-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(30,64,175,0.3)]"
                onClick={() => router.push("/properties")}
              >
                {t("viewProperties")}
              </button>
              <button
                type="button"
                className="btn-secondary transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-md"
                onClick={() => router.push("/book-now")}
              >
                {t("bookNow")}
              </button>
            </div>
            <p className="mt-6 text-sm text-brand md:text-base">{t("trustLine")}</p>
          </div>

          <div className="flex w-full justify-center md:justify-end">
            <div className="relative w-full max-w-[420px] sm:max-w-[520px] md:max-w-[620px] lg:max-w-[720px]">
              <div className="relative aspect-[5/3.5] w-full overflow-hidden rounded-[2rem] border border-blue-200 bg-white shadow-xl md:rounded-[2.5rem]">
                <Image
                  src={LOGO_SRC}
                  alt={t("heroAlt")}
                  fill
                  unoptimized
                  className="z-[2] object-contain p-12"
                  sizes="(max-width: 640px) 420px, (max-width: 768px) 520px, (max-width: 1024px) 620px, 720px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 px-4 pb-16">
        <section className="glass-card p-8">
          <h2 className="mb-6 text-2xl font-semibold text-brand-blue-dark">
            {t("hostingPolicyTitle")}
          </h2>
          <ul className="list-disc space-y-3 ps-5 text-slate-600 leading-relaxed">
            {hostingPolicyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="glass-card p-8">
          <h2 className="mb-6 text-2xl font-semibold text-brand-blue-dark">
            {t("cancellationPolicyTitle")}
          </h2>
          <ul className="list-disc space-y-3 ps-5 text-slate-600 leading-relaxed">
            {cancellationPolicyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Home;
