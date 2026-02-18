import type { Locale } from "../i18n/types";
import type { PackId } from "../config/packs";
import { PACKS } from "../config/packs";

export type OrderBody = {
  name: string;
  phone: string;
  address: string;
  packId: PackId;
  locale: Locale;
  utmSource?: string;
  utmCampaign?: string;
  referrer?: string;
  honeypot?: string;
};

export type ValidatedOrder = {
  name: string;
  phone: string;
  address: string;
  packId: PackId;
  quantity: number;
  locale: Locale;
  utmSource: string;
  utmCampaign: string;
  referrer: string;
};

const PHONE_RE = /^(?:\+216)?\d{8}$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function normalizePhone(input: string) {
  return input.replace(/[\s-]/g, "").trim();
}

export function validateOrderBody(
  body: unknown,
):
  | { ok: true; value: ValidatedOrder; isSpam: boolean }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object")
    return { ok: false, error: "Invalid JSON body" };

  const raw = body as Record<string, unknown>;

  const honeypot = asString(raw.honeypot);
  const isSpam = honeypot.trim().length > 0;

  const name = asString(raw.name).trim();
  const phone = normalizePhone(asString(raw.phone));
  const address = asString(raw.address).trim();
  const packId = asString(raw.packId) as PackId;
  const locale = asString(raw.locale) as Locale;

  const utmSource = asString(raw.utmSource).trim();
  const utmCampaign = asString(raw.utmCampaign).trim();
  const referrer = asString(raw.referrer).trim();

  if (!name) return { ok: false, error: "Missing name" };
  if (!phone) return { ok: false, error: "Missing phone" };
  if (!PHONE_RE.test(phone)) return { ok: false, error: "Invalid phone" };
  if (!address) return { ok: false, error: "Missing address" };
  if (!packId || !(packId in PACKS))
    return { ok: false, error: "Invalid packId" };
  if (locale !== "ar" && locale !== "fr" && locale !== "en")
    return { ok: false, error: "Invalid locale" };

  const quantity = PACKS[packId].quantity;

  return {
    ok: true,
    isSpam,
    value: {
      name,
      phone,
      address,
      packId,
      quantity,
      locale,
      utmSource,
      utmCampaign,
      referrer,
    },
  };
}
