"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  HOME_ASSETS,
  footerCompanyLinks,
  footerServiceLinks,
  footerSocialLinks,
  footerSupportLinks,
} from "@/lib/home-content";
import { i18n } from "@/lib/i18n";

function SocialIcon({ label }: { label: string }) {
  const paths: Record<string, ReactNode> = {
    X: (
      <path
        fill="currentColor"
        d="M14.5 4h2.9l-6.4 7.3 7.5 10.2h-5.9l-4.6-6-5.3 6H4.4l6.8-7.8L4.4 4h6l4.2 5.5L14.5 4zm-1 16h1.6L7.2 5.6H5.4l8.1 14.4z"
      />
    ),
    GitHub: (
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.18-3.37-1.18-.45-1.2-1.12-1.52-1.12-1.52-.92-.65.07-.64.07-.64 1.02.07 1.55 1.08 1.55 1.08.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.03A9.2 9.2 0 0112 6.84c.85 0 1.71.12 2.51.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.81-4.58 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z"
      />
    ),
    Discord: (
      <path
        fill="currentColor"
        d="M18.59 5.89A15.4 15.4 0 0014.96 4c-.18.33-.39.77-.53 1.12a14.2 14.2 0 00-4.86 0C9.43 4.77 9.22 4.33 9.04 4a15.5 15.5 0 00-3.63 1.89C4.2 9.62 3.44 13.3 3.82 16.94a15.8 15.8 0 004.86 2.48c.39-.54.74-1.11 1.04-1.71-.57-.22-1.11-.5-1.62-.82.14-.1.27-.21.4-.32 3.13 1.46 6.52 1.46 9.62 0 .14.11.27.22.4.32-.51.32-1.05.6-1.62.82.3.6.65 1.17 1.04 1.71a15.8 15.8 0 004.86-2.48c.5-4.35-.84-8.08-3.35-11.05zM9.68 14.1c-.94 0-1.72-.88-1.72-1.96s.76-1.96 1.72-1.96c.96 0 1.72.88 1.72 1.96s-.76 1.96-1.72 1.96zm4.64 0c-.94 0-1.72-.88-1.72-1.96s.76-1.96 1.72-1.96c.96 0 1.72.88 1.72 1.96s-.76 1.96-1.72 1.96z"
      />
    ),
    YouTube: (
      <path
        fill="currentColor"
        d="M21.58 7.2a2.7 2.7 0 00-1.9-1.92C18.88 5 12 5 12 5s-6.88 0-7.68.28A2.7 2.7 0 002.42 7.2 28.2 28.2 0 002.14 12c-.03 1.67.03 3.35.28 4.8a2.7 2.7 0 001.9 1.92C5.12 19 12 19 12 19s6.88 0 7.68-.28a2.7 2.7 0 001.9-1.92c.3-1.58.36-3.26.28-4.8a28.2 28.2 0 00-.28-4.8zM10.2 15.42V8.58L15.94 12l-5.74 3.42z"
      />
    ),
    LinkedIn: (
      <path
        fill="currentColor"
        d="M6.5 8.5h3v11h-3v-11zm1.5-5c1 0 1.8.8 1.8 1.8S9 6.1 8 6.1 6.2 5.3 6.2 4.3 7 2.5 8 2.5s1.8.8 1.8 1.8S9 3.5 8 3.5zM18 19.5h-3v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.4h-3V8.5h2.9v1.5h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7v6.4z"
      />
    ),
  };
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      {paths[label] ?? <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.5" />}
    </svg>
  );
}

const footerLinkLabels = {
  market: i18n.footer.links.market,
  registry: i18n.footer.links.registry,
  certification: i18n.footer.links.certification,
  creators: i18n.footer.links.creators,
  about: i18n.footer.links.about,
  newsroom: i18n.footer.links.newsroom,
  contact: i18n.footer.links.contact,
  guide: i18n.footer.links.guide,
  faq: i18n.footer.links.faq,
  supportCenter: i18n.footer.links.supportCenter,
} as const;

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#000510]">
      <div className="page-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src={HOME_ASSETS.logo} alt="" aria-hidden className="h-11 w-auto sm:h-12 lg:h-14" />
              <span className="text-xl font-bold text-white lg:text-2xl">UARION</span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-300 lg:text-lg">
              {t(i18n.footer.tagline1)}
              <br />
              {t(i18n.footer.tagline2)}
            </p>
            <div className="mt-5 flex gap-2">
              {footerSocialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-[#0085FF]/40 hover:text-[#0085FF]"
                  aria-label={social.label}
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="mb-3 text-base font-semibold text-white lg:text-lg">{t(i18n.footer.service)}</h3>
              <ul className="space-y-2">
                {footerServiceLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1.5 text-base text-slate-400 hover:text-[#0085FF] lg:text-lg"
                    >
                      {t(footerLinkLabels[link.key])}
                      {"badge" in link && link.badge && (
                        <span className="rounded bg-[#0085FF]/20 px-1 py-0.5 text-[10px] font-semibold text-[#0085FF]">
                          {t(i18n.nav.badgeBeta)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold text-white lg:text-lg">{t(i18n.footer.company)}</h3>
              <ul className="space-y-2">
                {footerCompanyLinks.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} className="text-base text-slate-400 hover:text-[#0085FF] lg:text-lg">
                      {t(footerLinkLabels[link.key])}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold text-white lg:text-lg">{t(i18n.footer.support)}</h3>
              <ul className="space-y-2">
                {footerSupportLinks.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} className="text-base text-slate-400 hover:text-[#0085FF] lg:text-lg">
                      {t(footerLinkLabels[link.key])}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-3 text-base font-semibold text-white lg:text-lg">{t(i18n.footer.newsletter)}</h3>
            <p className="text-body-muted mb-3">{t(i18n.footer.newsletterNote)}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t(i18n.footer.emailPlaceholder)}
                className="min-w-0 flex-1 rounded-lg border border-white/[0.14] bg-[#0c1528] px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-[#0085FF] focus:outline-none"
              />
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0085FF] text-white hover:bg-[#0070d6]"
                aria-label={t(i18n.footer.subscribe)}
              >
                →
              </button>
            </form>
          </div>
        </div>

        <p className="text-body-muted mt-10 mx-auto max-w-4xl border-t border-white/5 pt-6 text-center">
          {t(i18n.footer.legalDisclaimer)}
        </p>
        <p className="mt-4 text-center text-xs text-slate-500">
          {t(i18n.footer.copyright)}
        </p>
      </div>
    </footer>
  );
}
