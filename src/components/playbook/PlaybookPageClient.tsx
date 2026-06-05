"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { i18n } from "@/lib/i18n";

function Chip({ label }: { label: string }) {
  return (
    <span className="text-label rounded-full border border-white/10 bg-[#080f1c] px-3 py-1.5">
      {label}
    </span>
  );
}

function SectionDisclaimer() {
  const { t } = useLanguage();
  return (
    <p className="text-body-muted mt-6 text-center">{t(i18n.playbook.disclaimer)}</p>
  );
}

function PrepButton({ label }: { label: string }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      disabled
      className="text-label cursor-not-allowed rounded-lg border border-white/15 bg-[#080f1c] px-4 py-2 font-semibold text-slate-400"
      title={t(i18n.playbook.comingSoon)}
    >
      {label} ({t(i18n.playbook.comingSoon)})
    </button>
  );
}

function FlowStep({ label, isLast }: { label: string; isLast?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-body-card flex w-full max-w-xs flex-col items-center rounded-lg border border-white/10 bg-[#080f1c] px-4 py-3 text-center font-medium text-slate-200">
        {label}
      </div>
      {!isLast && (
        <span className="my-2 text-[#0085FF]" aria-hidden>
          ↓
        </span>
      )}
    </div>
  );
}

export default function PlaybookPageClient() {
  const { t } = useLanguage();
  const pb = i18n.playbook;

  const automationTags = t(pb.automation.tags).split(" / ");
  const workflowMaterials = t(pb.workflow.materials).split(" / ");
  const promptCategories = t(pb.prompts.categories).split(" / ");
  const saasStack = t(pb.saas.stack).split(" / ");
  const opsCategories = t(pb.ops.categories).split(" / ");
  const uploadTypes = t(pb.creator.uploadTypes).split(" / ");
  const verifyChecks = t(pb.verify.checks).split(" / ");
  const verifyPass = t(pb.verify.passItems).split(" / ");
  const flowSteps = t(pb.workflow.flow).split(" → ");

  return (
    <div className="overflow-x-hidden bg-[#000510] text-slate-100">
      {/* 1 Hero */}
      <section className="page-container py-12 sm:py-16 lg:py-20">
        <p className="text-label inline-block rounded-full border border-[#0085FF]/40 bg-[#0085FF]/10 px-4 py-1.5 font-bold tracking-wider text-[#0085FF]">
          {t(pb.hero.badge)}
        </p>
        <h1 className="mt-6 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {t(pb.hero.headline)}
        </h1>
        <p className="text-body mt-4 max-w-3xl">
          {t(pb.hero.sub)}
        </p>
        <p className="mt-6 text-lg font-semibold text-[#0085FF] sm:text-xl">{t(pb.hero.tagline)}</p>
        <SectionDisclaimer />
      </section>

      {/* 2 Featured */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{t(pb.featured.title)}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="home-card flex flex-col p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">{t(pb.featured.cardA.title)}</h3>
            <p className="text-body-card mt-2 font-semibold text-[#0085FF]">
              {t(pb.featured.cardA.rating)}
            </p>
            <p className="text-body-card mt-1 text-slate-400">{t(pb.featured.cardA.stat)}</p>
            <p className="text-body-muted mt-1">{t(pb.featured.cardA.creator)}</p>
            <div className="mt-6">
              <PrepButton label={t(pb.featured.cardA.cta)} />
            </div>
          </div>
          <div className="home-card flex flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-semibold text-white">{t(pb.featured.cardB.title)}</h3>
              <span className="text-label shrink-0 rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300">
                {t(pb.featured.cardB.premium)}
              </span>
            </div>
            <p className="text-body-card mt-2 font-semibold text-[#0085FF]">
              {t(pb.featured.cardB.rating)}
            </p>
            <p className="text-body-card mt-1 text-slate-400">{t(pb.featured.cardB.stat)}</p>
          </div>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 3 Automation */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.automation.title)}</h2>
        <p className="text-body mt-2">{t(pb.automation.intro)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {automationTags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </div>
        <div className="home-card mt-6 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">{t(pb.automation.exampleTitle)}</h3>
          <ul className="text-body-card mt-3 space-y-1 text-slate-400">
            <li>{t(pb.automation.difficulty)}</li>
            <li>{t(pb.automation.buildTime)}</li>
            <li>{t(pb.automation.commercial)}</li>
          </ul>
          <div className="mt-5">
            <PrepButton label={t(pb.automation.download)} />
          </div>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 4 Workflow */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.workflow.title)}</h2>
        <p className="text-body mt-2">{t(pb.workflow.intro)}</p>
        <div className="home-card mt-6 flex flex-col items-center p-6 sm:p-8">
          {flowSteps.map((step, i) => (
            <FlowStep key={step} label={step.trim()} isLast={i === flowSteps.length - 1} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {workflowMaterials.map((m) => (
            <Chip key={m} label={m.trim()} />
          ))}
        </div>
        <SectionDisclaimer />
      </section>

      {/* 5 Prompts */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.prompts.title)}</h2>
        <p className="text-body mt-2">{t(pb.prompts.intro)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {promptCategories.map((c) => (
            <Chip key={c} label={c.trim()} />
          ))}
        </div>
        <div className="home-card mt-6 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">{t(pb.prompts.exampleTitle)}</h3>
          <ul className="text-body-card mt-3 space-y-1 text-slate-400">
            <li>{t(pb.prompts.packSize)}</li>
            <li>{t(pb.prompts.abTest)}</li>
            <li>{t(pb.prompts.ctr)}</li>
            <li>{t(pb.prompts.commercial)}</li>
          </ul>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 6 SaaS */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.saas.title)}</h2>
        <p className="text-body mt-2">{t(pb.saas.intro)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {saasStack.map((s) => (
            <Chip key={s} label={s.trim()} />
          ))}
        </div>
        <div className="home-card mt-6 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">{t(pb.saas.exampleTitle)}</h3>
          <p className="text-body-card mt-2 text-slate-400">{t(pb.saas.includes)}</p>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 7 Ops */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.ops.title)}</h2>
        <p className="text-body mt-2">{t(pb.ops.intro)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {opsCategories.map((c) => (
            <Chip key={c} label={c.trim()} />
          ))}
        </div>
        <div className="home-card mt-6 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">{t(pb.ops.exampleTitle)}</h3>
          <p className="text-body-card mt-2 text-slate-400">{t(pb.ops.exampleDesc)}</p>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 8 Creator */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.creator.title)}</h2>
        <p className="text-body mt-2">{t(pb.creator.intro)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {uploadTypes.map((u) => (
            <Chip key={u} label={u.trim()} />
          ))}
        </div>
        <div className="home-card mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="text-xl font-semibold text-white">{t(pb.creator.cardName)}</h3>
            <p className="text-label mt-1 font-medium text-[#0085FF]">{t(pb.creator.verified)}</p>
            <ul className="text-body-card mt-3 space-y-1 text-slate-400">
              <li>{t(pb.creator.materials)}</li>
              <li>{t(pb.creator.rating)}</li>
              <li>{t(pb.creator.followers)}</li>
            </ul>
          </div>
          <PrepButton label={t(pb.creator.follow)} />
        </div>
        <SectionDisclaimer />
      </section>

      {/* 9 Premium */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.premium.title)}</h2>
        <p className="text-body mt-2">{t(pb.premium.intro)}</p>
        <div className="home-card mt-6 border-[#0085FF]/30 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">{t(pb.premium.exampleTitle)}</h3>
          <p className="text-label mt-2 text-[#0085FF]">{t(pb.premium.difficulty)}</p>
          <p className="text-body-card mt-2 text-slate-400">{t(pb.premium.includes)}</p>
          <p className="mt-4 text-2xl font-bold text-white">{t(pb.premium.price)}</p>
          <p className="text-body-muted mt-1">{t(pb.disclaimer)}</p>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 10 Verification */}
      <section className="page-container pb-12 sm:pb-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.verify.title)}</h2>
        <div className="home-card mt-4 border-[#0085FF]/40 p-6 sm:p-8">
          <p className="text-xl font-bold text-[#0085FF] sm:text-2xl">{t(pb.verify.headline)}</p>
          <p className="text-body-muted mt-2">{t(pb.verify.note)}</p>
          <h3 className="text-label mt-6 font-semibold uppercase tracking-wider text-slate-400">
            {t(pb.verify.auditTitle)}
          </h3>
          <ul className="mt-3 space-y-2">
            {verifyChecks.map((item) => (
              <li key={item} className="text-body-card flex items-start gap-2 text-slate-300">
                <span className="text-[#0085FF]" aria-hidden>
                  ✓
                </span>
                {item.trim()}
              </li>
            ))}
          </ul>
          <h3 className="text-label mt-8 font-semibold uppercase tracking-wider text-slate-400">
            {t(pb.verify.passTitle)}
          </h3>
          <ul className="mt-3 space-y-2">
            {verifyPass.map((item) => (
              <li key={item} className="text-body-card text-slate-300">
                {item.trim()}
              </li>
            ))}
          </ul>
        </div>
        <SectionDisclaimer />
      </section>

      {/* 11 About */}
      <section className="page-container border-t border-white/5 pb-16 pt-12 sm:pb-24">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(pb.about.title)}</h2>
        <p className="text-body mt-4 max-w-3xl">
          {t(pb.about.body)}
        </p>
        <SectionDisclaimer />
      </section>
    </div>
  );
}
