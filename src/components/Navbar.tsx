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
  { href: "/authenticity", label: i18n.nav.authenticity, badge: null },
  { href: "/playbook", label: i18n.nav.playbook, badge: null },
  { href: "/creators", label: i18n.nav.creators, badge: null },
  { href: "/community", label: i18n.nav.community, badge: "soon" as const },
] as const;

const navTextClass = "text-base font-semibold";

function navLinkClass(isActive: boolean, variant: "desktop" | "mobile" = "mobile") {
  const sizeClass =
    variant === "desktop"
      ? "text-base font-semibold leading-none tracking-wide xl:text-lg 2xl:text-2xl"
      : navTextClass;
  const padClass = variant === "desktop" ? "px-1.5 py-2 xl:px-2.5 2xl:px-4" : "px-3 py-2";

  return `flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md transition-colors ${padClass} ${sizeClass} ${
    isActive ? "text-accent" : "text-slate-300 hover:text-white"
  }`;
}

function BrandLogo() {
  return (
    <Link
      href="/"
      className="relative z-10 flex shrink-0 items-center gap-2 transition-opacity hover:opacity-95 sm:gap-3"
    >
      <img
        src={HOME_ASSETS.logo}
        alt=""
        aria-hidden
        className="h-10 w-auto shrink-0 sm:h-11 lg:h-12 2xl:h-[5.25rem]"
      />
      <span className="text-lg font-bold tracking-wide text-white sm:text-xl lg:text-2xl 2xl:text-4xl">
        UARION
      </span>
    </Link>
  );
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-white hover:border-accent/40 ${navTextClass}`}
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
          className="absolute right-0 z-50 mt-1 min-w-[6.5rem] rounded-lg border border-white/10 bg-navy-900 py-1 shadow-xl"
        >
          {(["ko", "en"] as const).map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                className={`block w-full px-4 py-2 text-left text-sm font-medium ${
                  locale === code ? "text-accent" : "text-slate-400 hover:text-white"
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

function HeaderActions() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 flex shrink-0 items-center gap-2 lg:gap-2.5">
      <LanguageDropdown />
      <Link
        href="/sell"
        className={`inline-flex whitespace-nowrap rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-2 text-accent transition-colors hover:bg-accent/20 xl:px-4 ${navTextClass}`}
      >
        {t(i18n.nav.founderApply)}
      </Link>
      <HeaderAuth />
    </div>
  );
}

function HamburgerButton({
  open,
  onToggle,
  labelOpen,
  labelClose,
}: {
  open: boolean;
  onToggle: () => void;
  labelOpen: string;
  labelClose: string;
}) {
  return (
    <button
      type="button"
      className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
      aria-expanded={open}
      aria-controls="compact-nav"
      aria-label={open ? labelClose : labelOpen}
      onClick={onToggle}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        {open ? (
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [compactOpen, setCompactOpen] = useState(false);

  useEffect(() => {
    setCompactOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = compactOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [compactOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function badgeLabel(badge: "beta" | "soon") {
    return badge === "beta" ? t(i18n.nav.badgeBeta) : t(i18n.nav.badgeSoon);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-1000">
      <div className="header-container">
        <nav
          className="flex h-16 w-full items-center xl:h-[5.5rem]"
          aria-label="주요 메뉴"
        >
          <BrandLogo />

          {/* 로고↔메뉴 / 메뉴↔우측 그룹 간격을 동일하게 맞추는 좌우 스페이서 */}
          <div className="hidden min-w-0 flex-1 lg:block" aria-hidden="true" />

          <ul className="hidden shrink-0 flex-row flex-nowrap items-center gap-1 lg:flex xl:gap-2 2xl:gap-6">
            {navLinkConfig.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link href={link.href} className={navLinkClass(isActive(link.href), "desktop")}>
                  {t(link.label)}
                  {link.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                        link.badge === "beta"
                          ? "bg-accent/20 text-accent"
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

          <div className="hidden min-w-0 flex-1 lg:block" aria-hidden="true" />

          <div className="header-actions hidden shrink-0 lg:block">
            <HeaderActions />
          </div>

          <HamburgerButton
            open={compactOpen}
            onToggle={() => setCompactOpen((o) => !o)}
            labelOpen={t(i18n.nav.menuOpen)}
            labelClose={t(i18n.nav.menuClose)}
          />
        </nav>
      </div>

      {compactOpen && (
        <div id="compact-nav" className="border-t border-white/10 bg-navy-1000 lg:hidden">
          <div className="header-container space-y-4 py-4">
            <ul className="space-y-1">
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
            </ul>

            <div className="flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-4">
              <LanguageDropdown />
              <Link
                href="/sell"
                className={`inline-flex whitespace-nowrap rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-2 text-accent transition-colors hover:bg-accent/20 xl:px-4 ${navTextClass}`}
              >
                {t(i18n.nav.founderApply)}
              </Link>
              <HeaderAuth />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
