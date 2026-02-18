"use client";

import { useLocale } from "../i18n/LocaleProvider";
import type { Locale } from "../i18n/types";

const LOCALES: Array<{ id: Locale; label: string; short: string }> = [
  { id: "ar", label: "العربية", short: "AR" },
  { id: "fr", label: "Français", short: "FR" },
  { id: "en", label: "English", short: "EN" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const rtl = locale === "ar";

  return (
    <div
      className={
        "relative flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-gradient-to-r from-white to-indigo-50/40 px-2.5 py-2 shadow-sm transition duration-200 hover:to-indigo-50/70 focus-within:ring-2 focus-within:ring-indigo-300/40 " +
        (rtl ? "flex-row-reverse" : "")
      }
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-zinc-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5 0 4.5-4 4.5-9S14.5 3 12 3 7.5 7 7.5 12 9.5 21 12 21zm-9-9h18"
        />
      </svg>

      <label className="sr-only" htmlFor="locale">
        Language
      </label>

      <select
        id="locale"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={
          "appearance-none bg-transparent text-xs font-semibold text-zinc-800 outline-none " +
          (rtl ? "pl-6 pr-2" : "pr-6 pl-2")
        }
      >
        {LOCALES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label} ({l.short})
          </option>
        ))}
      </select>

      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className={
          "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 " +
          (rtl ? "left-2" : "right-2")
        }
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
      </svg>
    </div>
  );
}
