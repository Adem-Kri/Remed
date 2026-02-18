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
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
          {title}
        </h2>
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

  const hero = locale === "ar" ? ar.hero : mvp.hero;
  const faq = locale === "ar" ? ar.sections.faq : mvp.sections.faq;
  const finalCta =
    locale === "ar" ? ar.sections.finalCta : mvp.sections.finalCta;

  const [orderOpen, setOrderOpen] = useState(false);
  const [formulaPreviewOk, setFormulaPreviewOk] = useState(true);

  const detailsNote =
    locale === "ar" ? null : (
      <div className="rounded-xl border border-[#E5E5E5] bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
        {mvp.order.fullDetailsNote}
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/Remed.jpeg"
              alt="Remed"
              width={32}
              height={32}
              className="h-8 w-8 rounded-xl border border-[#E5E5E5] bg-white object-cover"
              priority
            />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">
                Remed
              </div>
              <div className="text-xs text-zinc-500">{hero.trustLine}</div>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-5xl px-4 pt-6 md:pt-8">
          <div className="grid items-center gap-6 rounded-2xl border border-[#E5E5E5] bg-white p-4 md:grid-cols-2 md:p-7">
            <div>
              <div className="inline-flex items-center rounded-full border border-[#E5E5E5] bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
                {hero.trustLine}
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {hero.title}
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-700">
                {hero.subtitle}
              </p>

              <ul className="mt-5 grid gap-2 text-sm text-zinc-800 md:grid-cols-2">
                {hero.bullets.map((b) => (
                  <li
                    key={b}
                    className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-2"
                  >
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl border border-[#E5E5E5] bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800">
                {hero.offer}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setOrderOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
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
                  className="absolute inset-0 -z-10 rounded-3xl bg-zinc-50"
                  aria-hidden="true"
                />
                <Image
                  src="/Remed.jpeg"
                  alt="Remed"
                  width={520}
                  height={520}
                  priority
                  className="mx-auto rounded-2xl border border-[#E5E5E5] bg-white object-contain p-3"
                />
              </div>
            </div>
          </div>
        </section>

        <Section title={ar.sections.whyDangerous.title}>
          {detailsNote}
          {ar.sections.whyDangerous.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="space-y-1">
            {ar.sections.whyDangerous.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>{ar.sections.whyDangerous.footer}</p>
        </Section>

        <Section title={ar.sections.whoFor.title}>
          {detailsNote}
          {ar.sections.whoFor.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>

        <Section title={ar.sections.withMeds.title}>
          {detailsNote}
          {ar.sections.withMeds.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="space-y-1">
            {ar.sections.withMeds.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>{ar.sections.withMeds.footer}</p>
        </Section>

        <Section title={ar.sections.ingredients.title}>
          {detailsNote}
          <ul className="space-y-1">
            {ar.sections.ingredients.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Section>

        <Section title={locale === "ar" ? "التركيبة" : "Formula"}>
          {detailsNote}
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[#E5E5E5] bg-zinc-50 p-3">
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
                    className="h-auto w-full rounded-xl border border-[#E5E5E5] bg-white object-contain"
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
              {locale === "ar" ? "اضغط على الصورة للتكبير" : "Click to zoom"}
            </div>
          </div>
        </Section>

        <Section title={ar.sections.usage.title}>
          {detailsNote}
          {ar.sections.usage.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>

        <Section title={ar.sections.expectedResults.title}>
          {detailsNote}
          <ul className="space-y-1">
            {ar.sections.expectedResults.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Section>

        <Section title={ar.sections.guarantee.title}>
          {detailsNote}
          {ar.sections.guarantee.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
          >
            {locale === "ar" ? ar.sections.guarantee.cta : mvp.hero.cta}
          </button>
        </Section>

        <Section title={faq.title}>
          <div className="grid gap-3 md:grid-cols-2">
            {faq.items.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-4"
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
            className="mt-5 w-full rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
          >
            {finalCta.cta}
          </button>
        </Section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-10">
          {detailsNote}
          <div className="grid gap-3 md:grid-cols-3">
            {ar.sections.microCopy.items.map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-4 text-sm text-zinc-700"
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
