"use client";

type EventParams = Record<string, string | number | boolean | null | undefined>;

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

function isGaReady() {
  return (
    Boolean(GA_MEASUREMENT_ID) &&
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  );
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (!isGaReady()) return;

  const sanitizedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  window.gtag?.("event", eventName, sanitizedParams);
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
