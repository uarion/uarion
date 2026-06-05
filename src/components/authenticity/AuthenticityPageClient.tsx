"use client";

import IntroCard from "@/components/IntroCard";
import { useLanguage } from "@/components/LanguageProvider";
import { i18n } from "@/lib/i18n";

function PrepButton({ label }: { label: string }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      disabled
      className="inline-flex cursor-not-allowed items-center rounded-lg border border-white/15 bg-navy-900 px-6 py-3 text-base font-semibold text-slate-400"
      title={t(i18n.authenticity.comingSoon)}
    >
      {label} ({t(i18n.authenticity.comingSoon)})
    </button>
  );
}

function InspectionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="home-card flex flex-col p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-body-card rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AuthenticityPageClient() {
  const { t } = useLanguage();
  const au = i18n.authenticity;

  const inspectionCards = [
    { title: t(au.inspection.deepfake.title), items: t(au.inspection.deepfake.items).split(" / ") },
    { title: t(au.inspection.voice.title), items: t(au.inspection.voice.items).split(" / ") },
    { title: t(au.inspection.image.title), items: t(au.inspection.image.items).split(" / ") },
    { title: t(au.inspection.video.title), items: t(au.inspection.video.items).split(" / ") },
    { title: t(au.inspection.illegal.title), items: t(au.inspection.illegal.items).split(" / ") },
    { title: t(au.inspection.report.title), items: t(au.inspection.report.items).split(" / ") },
  ];

  const reportRows = t(au.sampleReport.rows).split("|").map((row) => {
    const [label, value] = row.split(":");
    return { label: label.trim(), value: value.trim() };
  });

  const safetyCards = [
    au.safety.uploadGate,
    au.safety.zeroRetention,
    au.safety.isolated,
    au.safety.noConclusions,
    au.safety.permission,
    au.safety.reportBlock,
  ];

  const faqItems = [
    { q: au.faq.q1, a: au.faq.a1 },
    { q: au.faq.q2, a: au.faq.a2 },
    { q: au.faq.q3, a: au.faq.a3 },
  ];

  return (
    <div className="overflow-x-hidden bg-navy-950 text-slate-100">
      {/* 1. Hero */}
      <section className="page-container py-12 sm:py-16 lg:py-20">
        <p className="text-page-eyebrow mb-3 text-accent">{t(au.hero.label)}</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {t(au.hero.title)}
        </h1>
        <p className="text-body mt-4 max-w-3xl">{t(au.hero.description)}</p>
        <p className="text-body-muted mt-4 max-w-3xl">{t(au.hero.disclaimer)}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrepButton label={t(au.hero.btnStart)} />
          <PrepButton label={t(au.hero.btnSample)} />
        </div>
      </section>

      {/* 2. Trust Infrastructure */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">{t(au.trust.title)}</h2>
        <p className="text-body mb-8 max-w-3xl font-medium text-accent">{t(au.trust.emphasize)}</p>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="home-card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">{t(au.trust.cert.title)}</h3>
            <p className="text-body-card mt-3 text-slate-400">{t(au.trust.cert.desc)}</p>
          </div>
          <div className="home-card border-accent/40 bg-accent/5 p-6 ring-1 ring-accent/25 sm:p-8">
            <h3 className="text-xl font-semibold text-accent">{t(au.trust.authenticity.title)}</h3>
            <p className="text-body-card mt-3 text-slate-300">{t(au.trust.authenticity.desc)}</p>
          </div>
          <div className="home-card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">{t(au.trust.registry.title)}</h3>
            <p className="text-body-card mt-3 text-slate-400">{t(au.trust.registry.desc)}</p>
          </div>
        </div>
      </section>

      {/* 3. Inspection Items */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{t(au.inspection.title)}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inspectionCards.map((card) => (
            <InspectionCard key={card.title} title={card.title} items={card.items} />
          ))}
        </div>
      </section>

      {/* 4. Static Report Example */}
      <section className="page-container pb-12 sm:pb-16">
        <IntroCard title={t(au.sampleReport.title)}>
          <dl className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <dt className="text-body-card text-slate-500">{t(au.sampleReport.target)}</dt>
              <dd className="text-body-card font-semibold text-slate-200">
                {t(au.sampleReport.targetValue)}
              </dd>
            </div>
            {reportRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 last:border-0"
              >
                <dt className="text-body-card text-slate-500">{row.label}</dt>
                <dd className="text-body-card font-semibold text-accent">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <p className="text-body-card mb-2 font-semibold text-white">
              {t(au.sampleReport.actionsTitle)}
            </p>
            <ul className="flex flex-wrap gap-2">
              {t(au.sampleReport.actions).split(" / ").map((action) => (
                <li
                  key={action}
                  className="text-label rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-semibold text-amber-200"
                >
                  {action}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-body-muted mt-6 text-slate-400">{t(au.sampleReport.note)}</p>
        </IntroCard>
      </section>

      {/* 5. Badge System */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{t(au.badges.title)}</h2>
        <div className="flex flex-wrap gap-3">
          {t(au.badges.items).split("|").map((badge) => (
            <span
              key={badge}
              className="text-body-card rounded-lg border border-navy-700 bg-navy-900 px-4 py-2.5 font-medium text-slate-200"
            >
              {badge}
            </span>
          ))}
        </div>
        <p className="text-body-muted mt-4">{t(au.badges.note)}</p>
      </section>

      {/* 6. Safety Principles */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{t(au.safety.title)}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {safetyCards.map((card) => (
            <div key={t(card.title)} className="home-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">{t(card.title)}</h3>
              <p className="text-body-card mt-2 text-slate-400">{t(card.desc)}</p>
            </div>
          ))}
        </div>
        <div className="home-card mt-6 border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
          <p className="text-body leading-relaxed text-amber-100/90">{t(au.safety.importantNote)}</p>
        </div>
      </section>

      {/* 7. User Notice */}
      <section className="page-container pb-12 sm:pb-16">
        <IntroCard title={t(au.userNotice.title)}>
          <ul className="space-y-3">
            {t(au.userNotice.items).split("|").map((item) => (
              <li key={item} className="text-body flex gap-2 text-slate-300">
                <span className="shrink-0 text-accent" aria-hidden>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </IntroCard>
      </section>

      {/* 8. FAQ */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{t(au.faq.title)}</h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={t(item.q)} className="home-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">{t(item.q)}</h3>
              <p className="text-body mt-2 text-slate-400">{t(item.a)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Bottom Disclaimer */}
      <section className="page-container border-t border-white/5 pb-16 pt-12 sm:pb-24">
        <div className="home-card border-navy-700 p-6 sm:p-8">
          <p className="text-body leading-relaxed text-slate-400">{t(au.bottomDisclaimer)}</p>
        </div>
      </section>
    </div>
  );
}
