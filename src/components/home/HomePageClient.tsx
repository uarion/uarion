"use client";

import Link from "next/link";
import Image from "next/image";
import HeroPlanetVisual from "@/components/home/HeroPlanetVisual";
import { FounderIcon, GlowingStatIcon, ServiceIconBox } from "@/components/home/FounderIcons";
import { useLanguage } from "@/components/LanguageProvider";
import {
  ecosystemPartners,
  founderBenefitIds,
  founderCtaCardIds,
  founderCtaHref,
  notificationHref,
  roadmapSteps,
  serviceItems,
  socialProof,
  statKeys,
  stats,
} from "@/lib/home-content";
import { i18n } from "@/lib/i18n";

const statLabelMap = {
  registered: i18n.stats.registered,
  founders: i18n.stats.founders,
  beta: i18n.stats.beta,
  pending: i18n.stats.pending,
} as const;

const benefitMap = {
  fee: i18n.founderBenefits.fee,
  exposure: i18n.founderBenefits.exposure,
  badge: i18n.founderBenefits.badge,
} as const;

const serviceMap = {
  register: i18n.services.register,
  verify: i18n.services.verify,
  trade: i18n.services.trade,
  grow: i18n.services.grow,
} as const;

const roadmapTitleMap = {
  step1: i18n.roadmap.step1,
  step2: i18n.roadmap.step2,
  step3: i18n.roadmap.step3,
  step4: i18n.roadmap.step4,
} as const;

const ctaCardMap = {
  badge: { ...i18n.founderCta.cards.badge, icon: "shield" as const },
  benefits: { ...i18n.founderCta.cards.benefits, icon: "star" as const },
  history: { ...i18n.founderCta.cards.history, icon: "hex" as const },
} as const;

function Arrow() {
  return <span className="ml-1.5" aria-hidden>→</span>;
}

export default function HomePageClient() {
  const { t } = useLanguage();

  return (
    <div className="home-page overflow-x-hidden bg-[#000510] text-slate-100">
      <section className="relative">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_75%_20%,rgba(0,133,255,0.08),transparent_70%)]"
          aria-hidden
        />
        <div className="page-container relative grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-16 xl:py-20">
          <div className="relative z-10 max-w-2xl xl:max-w-3xl">
            <p className="text-sm font-semibold tracking-wider text-[#0085FF] sm:text-base lg:text-lg">
              {t(i18n.hero.label)}
            </p>
            <h1 className="mt-4 text-[1.65rem] font-bold leading-[1.25] tracking-tight text-white sm:text-[1.85rem] lg:text-4xl xl:text-[2.75rem]">
              <span className="block">{t(i18n.hero.titleLine1)}</span>
              <span className="block">{t(i18n.hero.titleLine2)}</span>
            </h1>
            <p className="text-body mt-4 max-w-2xl lg:leading-relaxed">
              {t(i18n.hero.description)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <Link
                href="/sell"
                className="inline-flex items-center rounded-lg bg-[#0085FF] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#0070d6] lg:px-8 lg:py-4 lg:text-lg"
              >
                {t(i18n.hero.ctaFounder)}
                <Arrow />
              </Link>
              <Link
                href="/certification"
                className="inline-flex items-center rounded-lg border-2 border-white/25 bg-transparent px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-[#0085FF]/60 hover:text-[#0085FF] lg:px-8 lg:py-4 lg:text-lg"
              >
                {t(i18n.hero.ctaCertStandards)}
                <Arrow />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 sm:mt-10">
              <div className="flex -space-x-3">
                {socialProof.avatars.map((initial, i) => (
                  <span
                    key={initial}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#000510] bg-gradient-to-br from-[#0085FF] to-violet-600 text-xs font-bold text-white sm:h-10 sm:w-10"
                    style={{ zIndex: 10 - i }}
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
                {t(i18n.hero.socialProof)}
              </p>
            </div>
          </div>
          <div className="relative lg:pl-4">
            <HeroPlanetVisual />
          </div>
        </div>
      </section>

      <section className="page-container pb-8">
        <div className="home-card flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <FounderIcon name="bell" className="h-6 w-6 shrink-0 text-[#0085FF]" />
            <p className="text-base text-slate-200 sm:text-lg lg:text-xl">{t(i18n.notification.message)}</p>
          </div>
          <Link
            href={notificationHref}
            className="shrink-0 text-base font-semibold text-[#0085FF] hover:underline lg:text-lg"
          >
            {t(i18n.notification.link)}
          </Link>
        </div>
      </section>

      <section className="page-container pb-12 sm:pb-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {statKeys.map((key) => {
            const stat = stats[key];
            return (
              <div key={key} className="home-card p-6 sm:p-7 lg:p-8">
                <GlowingStatIcon name={stat.icon} />
                <p className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                  {stat.value}
                </p>
                <p className="text-body-card mt-2 font-medium leading-snug">
                  {t(statLabelMap[key])}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-body-muted mt-4 text-center">{t(i18n.stats.disclaimer)}</p>
      </section>

      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#0085FF] sm:text-base lg:text-lg">
          {t(i18n.founderBenefits.sectionTitle)}
        </h2>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {founderBenefitIds.map((id) => {
            const b = benefitMap[id];
            return (
              <div key={id} className="home-card p-7 transition-colors hover:border-[#0085FF]/40 lg:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0085FF]/15 ring-1 ring-[#0085FF]/30">
                  <FounderIcon name={id} className="h-7 w-7 text-[#0085FF]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white lg:text-2xl">{t(b.title)}</h3>
                <p className="text-body-card mt-2">{t(b.desc)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-container pb-14 sm:pb-20">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          {t(i18n.services.sectionTitle)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {serviceItems.map((svc) => {
            const copy = serviceMap[svc.id];
            return (
              <div key={svc.id} className="home-card flex flex-col p-7 hover:border-[#0085FF]/40 lg:p-8">
                <ServiceIconBox name={svc.icon} />
                <h3 className="text-xl font-semibold text-white lg:text-2xl">{t(copy.title)}</h3>
                <p className="text-body-card mt-2 flex-1">{t(copy.desc)}</p>
                <Link
                  href={svc.href}
                  className="mt-5 text-base font-medium text-[#0085FF] hover:underline lg:text-lg"
                >
                  {t(i18n.services.learnMore)}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-container pb-16 sm:pb-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {t(i18n.roadmap.sectionTitle)}
          </h2>
          <Link href="/certification" className="text-base font-medium text-[#0085FF] hover:underline lg:text-lg">
            {t(i18n.roadmap.viewAll)}
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr] xl:gap-10">
          <div className="home-card rounded-2xl p-6 sm:p-8">
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-[560px] items-start justify-between gap-2">
                {roadmapSteps.map((step, i) => (
                  <div key={step.step} className="relative flex flex-1 flex-col items-center text-center">
                    {i < roadmapSteps.length - 1 && (
                      <div
                        className="absolute left-[58%] top-5 h-0.5 w-full bg-gradient-to-r from-[#0085FF] to-white/10"
                        aria-hidden
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-base font-bold lg:h-12 lg:w-12 lg:text-lg ${
                        step.active
                          ? "bg-[#0085FF] text-white"
                          : "border border-white/25 bg-[#0c1528] text-slate-400"
                      }`}
                    >
                      {step.step}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#0085FF] lg:text-base">{step.period}</p>
                    <p className="mt-1 text-base font-medium text-white lg:text-lg">
                      {t(roadmapTitleMap[step.titleKey])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="home-card flex flex-col overflow-hidden rounded-2xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">{t(i18n.founderCta.title)}</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
              {t(i18n.founderCta.desc)}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {founderCtaCardIds.map((id) => {
                const card = ctaCardMap[id];
                return (
                  <div
                    key={id}
                    className="rounded-lg border border-white/[0.14] bg-[#080f1c] px-4 py-3"
                  >
                    <p className="text-xs font-bold tracking-wider text-[#0085FF] lg:text-sm">{t(card.tag)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <FounderIcon name={card.icon} className="h-5 w-5 shrink-0 text-[#0085FF]" />
                      <p className="text-sm font-medium text-slate-200 sm:text-base lg:text-lg">{t(card.title)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col items-center gap-8 text-center">
              <Link
                href={founderCtaHref}
                className="inline-flex items-center rounded-lg bg-[#0085FF] px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-[#0070d6] sm:px-10 sm:py-4 sm:text-xl"
              >
                {t(i18n.founderCta.apply)}
                <Arrow />
              </Link>
              <Image
                src="/badges/uarion_verified_shield.png"
                alt="UARION VERIFIED"
                width={400}
                height={400}
                className="h-[280px] w-[280px] object-contain sm:h-[340px] sm:w-[340px] xl:h-[400px] xl:w-[400px]"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-container border-t border-white/5 py-12 sm:py-16">
        <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-400 lg:text-base">
          {t(i18n.ecosystem.title)}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:gap-x-16">
          {ecosystemPartners.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.14] bg-[#0c1528] text-sm font-bold text-[#0085FF] lg:h-11 lg:w-11 lg:text-base">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="text-base font-semibold tracking-tight sm:text-lg lg:text-xl">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
