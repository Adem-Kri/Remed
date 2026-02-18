import type { Locale } from "./types";
import type { Dictionary } from "./dictionary";
import { ar } from "./ar";
import { en } from "./en";
import { fr } from "./fr";

export const arDict: Dictionary = ar;

export function getMvpDict(locale: Locale) {
  if (locale === "fr") return { locale, ar: arDict, mvp: fr } as const;
  if (locale === "en") return { locale, ar: arDict, mvp: en } as const;
  return { locale, ar: arDict, mvp: arDict } as const;
}
