"use client";

import Image from "next/image";
import { useState } from "react";

import { getMvpDict } from "../i18n";
import { useLocale } from "../i18n/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OrderDialog } from "./OrderDialog";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-5 md:py-6">
      <div className="rounded-2xl border border-[#E5E5E5] bg-white/95 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] transition duration-300 hover:shadow-[0_18px_42px_-28px_rgba(79,70,229,0.3)] md:p-6">
        <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400" />
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
            {title}
          </h2>
        </div>
        <div className="mt-4 space-y-3 text-[15px] leading-7 text-zinc-800">
          {children}
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  const { locale } = useLocale();
  const { ar, mvp } = getMvpDict(locale);
  const dict = locale === "ar" ? ar : mvp;

  const hero = dict.hero;
  const faq = dict.sections.faq;
  const finalCta = dict.sections.finalCta;

  const [orderOpen, setOrderOpen] = useState(false);
  const [formulaPreviewOk, setFormulaPreviewOk] = useState(true);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-indigo-50/40 via-white to-emerald-50/30 text-zinc-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-140px] top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-160px] top-[420px] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl"
      />

      <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/Remed.jpeg"
              alt="Remed"
              width={32}
              height={32}
              className="h-9 w-9 rounded-2xl border border-[#E5E5E5] bg-white object-cover"
              priority
            />
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight text-zinc-900">
                Remed
              </div>
              <div className="mt-0.5 text-xs text-zinc-500">
                {hero.trustLine}
              </div>
              <div className="mt-1 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 shadow-sm">
                Official Store
              </div>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-5xl px-4 pt-6 md:pt-8">
          <div className="relative grid items-center gap-6 overflow-hidden rounded-3xl border border-[#E5E5E5] bg-gradient-to-br from-white via-indigo-50/40 to-violet-50/40 p-5 shadow-[0_12px_40px_-24px_rgba(79,70,229,0.45)] transition duration-300 hover:shadow-[0_20px_52px_-30px_rgba(79,70,229,0.42)] md:grid-cols-2 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-80px] top-[-90px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,rgba(99,102,241,0)_70%)]"
            />
            <div>
              <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {hero.trustLine}
              </div>
              <h1 className="mt-4 text-[1.8rem] font-semibold leading-tight tracking-tight text-zinc-950 [word-break:keep-all] md:text-[2.35rem]">
                {hero.title}
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-700">
                {hero.subtitle}
              </p>

              <ul className="mt-5 grid gap-2 text-sm text-zinc-800 md:grid-cols-2">
                {hero.bullets.map((b) => (
                  <li
                    key={b}
                    className="rounded-xl border border-[#E5E5E5] bg-white/90 px-3 py-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
                  >
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm font-semibold text-amber-900">
                {hero.offer}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setOrderOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(79,70,229,0.8)] transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/40"
                >
                  {hero.cta}
                </button>
                <div className="text-xs text-zinc-500">
                  {locale === "ar"
                    ? "الدفع عند الاستلام · فريقنا يتصل بك للتأكيد"
                    : "Pay on delivery · We’ll call to confirm"}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div
                  className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-100/80 via-violet-100/70 to-emerald-100/70 blur-sm"
                  aria-hidden="true"
                />
                <Image
                  src="/Remed.jpeg"
                  alt="Remed"
                  width={520}
                  height={520}
                  priority
                  className="mx-auto rounded-2xl border border-[#E5E5E5] bg-white object-contain p-3 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.55)] transition duration-300 hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        </section>

        <Section title={dict.sections.whyDangerous.title}>
          {dict.sections.whyDangerous.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="space-y-1">
            {dict.sections.whyDangerous.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>{dict.sections.whyDangerous.footer}</p>
        </Section>

        <Section title={dict.sections.whoFor.title}>
          {dict.sections.whoFor.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            {dict.sections.whoFor.chips.map((chip) => (
              <div
                key={chip}
                className="rounded-full border border-[#E5E5E5] bg-indigo-50/70 px-3 py-1.5 text-sm font-medium text-zinc-800"
              >
                {chip}
              </div>
            ))}
          </div>
        </Section>

        <Section title={dict.sections.withMeds.title}>
          {dict.sections.withMeds.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="space-y-1">
            {dict.sections.withMeds.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>{dict.sections.withMeds.footer}</p>
        </Section>

        <Section title={dict.sections.ingredients.title}>
          <ul className="space-y-1">
            {dict.sections.ingredients.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Section>

        <Section title={dict.sections.resultsTiming.title}>
          {dict.sections.resultsTiming.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>

        <Section
          title={
            locale === "ar"
              ? "التركيبة"
              : locale === "fr"
                ? "Formule"
                : "Formula"
          }
        >
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[#E5E5E5] bg-indigo-50/60 p-3 transition duration-300 hover:shadow-[0_16px_34px_-26px_rgba(79,70,229,0.4)]">
              {formulaPreviewOk ? (
                <a
                  href="/formula.png"
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src="/formula.png"
                    alt={locale === "ar" ? "التركيبة" : "Formula"}
                    className="h-auto w-full rounded-xl border border-[#E5E5E5] bg-white object-contain shadow-sm transition duration-300 hover:scale-[1.01]"
                    loading="lazy"
                    onError={() => setFormulaPreviewOk(false)}
                  />
                </a>
              ) : (
                <div className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-6 text-center text-sm text-zinc-700">
                  {locale === "ar"
                    ? "ضع ملف formula.png داخل مجلد public لعرض المعاينة هنا"
                    : "Place formula.png in the public/ folder to show the preview here"}
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-zinc-700">
              {locale === "ar"
                ? "اضغط على الصورة للتكبير"
                : locale === "fr"
                  ? "Cliquez pour zoomer"
                  : "Click to zoom"}
            </div>
          </div>
        </Section>

        <Section title={dict.sections.usage.title}>
          {dict.sections.usage.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>

        <Section title={dict.sections.guarantee.title}>
          {dict.sections.guarantee.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(79,70,229,0.8)] transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/40"
          >
            {dict.sections.guarantee.cta}
          </button>
        </Section>

        <Section title={faq.title}>
          <div className="grid gap-3 md:grid-cols-2">
            {faq.items.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white to-indigo-50/40 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(79,70,229,0.4)]"
              >
                <div className="text-sm font-semibold">{item.q}</div>
                <div className="mt-1 text-sm leading-6 text-zinc-700">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={finalCta.title}>
          <p>{finalCta.body}</p>
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(79,70,229,0.75)] transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/40"
          >
            {finalCta.cta}
          </button>
        </Section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-10">
          <div className="grid gap-3 md:grid-cols-3">
            {dict.sections.microCopy.items.map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white to-emerald-50/50 p-4 text-sm text-zinc-700 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(16,185,129,0.45)]"
              >
                {t}
              </div>
            ))}
          </div>
        </section>
      </main>

      <OrderDialog open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}
