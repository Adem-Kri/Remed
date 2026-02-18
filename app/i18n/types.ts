export type Locale = "ar" | "fr" | "en";

export const SUPPORTED_LOCALES: readonly Locale[] = ["ar", "fr", "en"] as const;

export const DEFAULT_LOCALE: Locale = "ar";
