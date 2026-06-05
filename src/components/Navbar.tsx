"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeaderAuth from "@/components/HeaderAuth";
import { useLanguage } from "@/components/LanguageProvider";
import { HOME_ASSETS } from "@/lib/home-content";
import { i18n } from "@/lib/i18n";

const navLinkConfig = [
  { href: "/", label: i18n.nav.home, badge: null },
  { href: "/market", label: i18n.nav.market, badge: "beta" as const },
  { href: "/registry", label: i18n.nav.registry, badge: null },
  { href: "/certification", label: i18n.nav.certification, badge: null },
  { href: "/playbook", label: i18n.nav.playbook, badge: null },
  { href: "/creators", label: i18n.nav.creators, badge: null },
  { href: "/community", label: i18n.nav.community, badge: "soon" as const },
] as const;

function navLinkClass(isActive: boolean) {
  return `flex items-center gap-2 rounded-md px-3 py-2 text-base font-semibold transition-colors lg:px-4 lg:py-2.5 lg:text-xl xl:text-[1.35rem] ${
    isActive ? "text-[#0085FF]" : "text-slate-300 hover:text-white"
  }`;
}

function LanguageDropdown() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const display = locale === "ko" ? t(i18n.nav.langKo) : t(i18n.nav.langEn);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0a1220] px-4 py-2.5 text-sm font-semibold text-white hover:border-[#0085FF]/40 lg:px-5 lg:py-3 lg:text-base"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {display}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-[6.5rem] rounded-lg border border-white/10 bg-[#0a1220] py-1 shadow-xl"
        >
          {(["ko", "en"] as const).map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                className={`block w-full px-4 py-2.5 text-left text-sm font-medium lg:text-base ${
                  locale === code ? "text-[#0085FF]" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
              >
                {code === "ko" ? t(i18n.nav.langKo) : t(i18n.nav.langEn)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function badgeLabel(badge: "beta" | "soon") {
    return badge === "beta" ? t(i18n.nav.badgeBeta) : t(i18n.nav.badgeSoon);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.12] bg-[#000510]">
      <nav
        className="page-container grid h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-20 lg:gap-8 xl:h-[5.25rem]"
        aria-label="주요 메뉴"
      >
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 transition-opacity hover:opacity-95">
          <img
            src={HOME_ASSETS.logo}
            alt=""
            aria-hidden
            className="h-14 w-auto shrink-0 sm:h-16 lg:h-[4.5rem] xl:h-20"
          />
          <span className="truncate text-lg font-bold tracking-wide text-white sm:text-xl lg:text-2xl">
            UARION
          </span>
        </Link>

        <ul className="hidden items-center justify-center gap-0.5 xl:flex">
          {navLinkConfig.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={navLinkClass(isActive(link.href))}>
                {t(link.label)}
                {link.badge && (
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold lg:text-sm ${
                      link.badge === "beta"
                        ? "bg-[#0085FF]/20 text-[#0085FF]"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {badgeLabel(link.badge)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <LanguageDropdown />
          <Link
            href="/sell"
            className="hidden rounded-lg bg-[#0085FF] px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#0070d6] sm:inline-block lg:px-6 lg:py-3 lg:text-lg"
          >
            {t(i18n.nav.founderApply)}
          </Link>
          <HeaderAuth />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t(i18n.nav.menuClose) : t(i18n.nav.menuOpen)}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-white/10 bg-[#000510] xl:hidden">
          <ul className="page-container space-y-1 py-4">
            {navLinkConfig.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={navLinkClass(isActive(link.href))}>
                  {t(link.label)}
                  {link.badge && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-400">
                      {badgeLabel(link.badge)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sell" className={navLinkClass(pathname === "/sell")}>
                {t(i18n.nav.founderApply)}
              </Link>
            </li>
            <li className="flex gap-2 px-3 pt-2">
              {(["ko", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                    locale === code
                      ? "border-[#0085FF] text-[#0085FF]"
                      : "border-white/10 text-slate-400"
                  }`}
                >
                  {code === "ko" ? t(i18n.nav.langKo) : t(i18n.nav.langEn)}
                </button>
              ))}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
