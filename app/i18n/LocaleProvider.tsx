"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { trackEvent, trackPageView } from "../lib/analytics";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "remed.locale";
const GA_SESSION_KEY = "remed.ga.session_demarree";

function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  function localeFromPath(path: string | null): Locale | null {
    if (!path) return null;
    const first = path.split("/").filter(Boolean)[0];
    return isLocale(first) ? first : null;
  }

  useEffect(() => {
    const pathLocale = localeFromPath(pathname);
    if (pathLocale) {
      setLocaleState(pathLocale);
      return;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) {
      setLocaleState(saved);
      router.replace(`/${saved}`);
      return;
    }

    router.replace(`/${DEFAULT_LOCALE}`);
  }, [pathname, router]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    if (!pathname) return;
    const query = typeof window !== "undefined" ? window.location.search : "";
    const fullPath = query ? `${pathname}${query}` : pathname;
    trackPageView(fullPath);
  }, [pathname]);

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;
    if (window.sessionStorage.getItem(GA_SESSION_KEY)) return;

    trackEvent("demarrage_session_remed", {
      langue: locale,
      chemin_page: pathname,
    });
    window.sessionStorage.setItem(GA_SESSION_KEY, "1");
  }, [locale, pathname]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        if (nextLocale === locale) return;

        trackEvent("changement_locale", {
          langue_precedente: locale,
          langue_nouvelle: nextLocale,
          chemin_actuel: pathname ?? "/",
        });

        setLocaleState(nextLocale);

        const current = pathname ?? "/";
        const segments = current.split("/").filter(Boolean);
        if (segments.length > 0 && isLocale(segments[0])) {
          segments[0] = nextLocale;
        } else {
          segments.unshift(nextLocale);
        }

        const nextPath = `/${segments.join("/")}`;
        router.push(nextPath);
      },
    }),
    [locale, pathname, router],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
