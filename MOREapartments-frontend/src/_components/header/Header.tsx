"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import WhatsAppContactForm from "@/_components/WhatsAppContactForm/WhatsAppContactForm";
import WhatsAppFloatingButton from "@/_components/WhatsAppContactForm/WhatsAppFloatingButton";
import Logo from "./components/Logo";
import Home from "./components/Home";
import Properties from "./components/Properties";
import About from "./components/About";
import Contact from "./components/Contact";
import BookNow from "./components/BookNow";

const navItems = [
  { href: "/", key: "home" as const, cta: false },
  { href: "/properties", key: "properties" as const, cta: false },
  { href: "/about", key: "aboutUs" as const, cta: false },
  { href: "/contact", key: "contact" as const, cta: false },
  { href: "/book-now", key: "bookNow" as const, cta: true },
];

function PageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case "/properties":
      return <Properties />;
    case "/about":
      return <About />;
    case "/contact":
      return <Contact />;
    case "/book-now":
      return <BookNow />;
    case "/":
    default:
      return <Home />;
  }
}

function NavLink({
  href,
  label,
  isActive,
  isCta,
  onNavigate,
  className = "",
}: {
  href: string;
  label: string;
  isActive: boolean;
  isCta?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  if (isCta) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={`rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md md:px-5 md:py-2.5 md:text-base ${className}`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-lg px-4 py-2 font-medium text-white/90 transition-all duration-300 hover:bg-white/15 hover:text-white ${className} ${
        isActive
          ? "border-b-2 border-white bg-white/20 font-bold text-white"
          : ""
      }`}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "he" : "en";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, locale]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMenuOpen(false);
      }
    };

    closeOnDesktop();
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-[1000] w-full min-h-[60px] border-b border-blue-400/30 bg-brand-blue px-2.5 shadow-md md:px-4">
        <nav className="relative flex h-[60px] items-center justify-between px-3 md:px-5">
          <Logo />

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 md:flex md:gap-3">
            {navItems.map(({ href, key, cta }) => (
              <NavLink
                key={key}
                href={href}
                label={t(key)}
                isActive={pathname === href}
                isCta={cta}
                className="px-2 py-1.5 text-xs md:px-3 md:py-2 md:text-base"
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={pathname}
              locale={otherLocale}
              className="rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs text-white/90 transition-all duration-300 hover:bg-white/20 hover:text-white md:px-3 md:py-1.5 md:text-sm"
              aria-label="Switch language"
            >
              {locale === "en" ? t("switchToHebrew") : t("switchToEnglish")}
            </Link>

            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/30 bg-white/10 text-white"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              >
                {menuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {menuOpen ? (
          <div className="border-t border-white/20 bg-brand-blue px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map(({ href, key, cta }) => (
                <NavLink
                  key={key}
                  href={href}
                  label={t(key)}
                  isActive={pathname === href}
                  isCta={cta}
                  onNavigate={closeMenu}
                  className="py-3 text-base"
                />
              ))}
              <Link
                href={pathname}
                locale={otherLocale}
                onClick={closeMenu}
                className="mt-2 rounded-lg border-t border-white/20 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                {locale === "en" ? t("switchToHebrew") : t("switchToEnglish")}
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-[1] flex-1 p-8 pb-4">
        <PageContent pathname={pathname} />
        {pathname === "/book-now" ? <WhatsAppContactForm /> : null}
      </main>

      {pathname !== "/book-now" ? <WhatsAppFloatingButton /> : null}
    </>
  );
}
