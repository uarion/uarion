"use client";

import IntroCard from "@/components/IntroCard";
import { useLanguage } from "@/components/LanguageProvider";
import { i18n } from "@/lib/i18n";

export default function CertificationPageClient() {
  const { t } = useLanguage();
  const cert = i18n.certification;

  const inspectionItems = t(cert.items).split(" / ");
  const resultRows = t(cert.resultRows).split("|").map((row) => {
    const [label, value] = row.split(":");
    return { label: label.trim(), value: value.trim() };
  });

  return (
    <div className="overflow-x-hidden bg-[#000510] text-slate-100">
      <div className="page-container py-12 sm:py-16">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#0085FF]">
            {t(cert.badge)}
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{t(cert.title)}</h1>
          <p className="text-body mt-3 font-medium text-slate-200">{t(cert.subtitle)}</p>
          <p className="text-body mt-4">
            {t(cert.description)}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <IntroCard title={t(cert.inspectionTitle)}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {inspectionItems.map((item) => (
                <li
                  key={item}
                  className="text-body-card rounded-lg border border-white/10 bg-[#080f1c] px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </IntroCard>

          <IntroCard title={t(cert.resultTitle)}>
            <div className="mb-4 rounded-lg border border-[#0085FF]/30 bg-[#0085FF]/10 px-4 py-3 text-center">
              <p className="text-lg font-bold tracking-wide text-[#0085FF]">
                {t(cert.verifiedLabel)}
              </p>
            </div>
            <dl className="space-y-3">
              {resultRows.slice(1).map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0"
                >
                  <dt className="text-body-card text-slate-500">{row.label}</dt>
                  <dd className="text-body-card font-semibold text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-body-muted mt-4">{t(cert.pipelineNote)}</p>
          </IntroCard>
        </div>

        <div className="home-card mt-10 border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-body leading-relaxed text-amber-100/90">
            {t(cert.disclaimer)}
          </p>
        </div>
      </div>
    </div>
  );
}
