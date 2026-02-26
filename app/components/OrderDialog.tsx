"use client";

import { useEffect, useMemo, useState } from "react";

import { PACKS, PACK_ORDER, type PackId } from "../config/packs";
import { getMvpDict } from "../i18n";
import { useLocale } from "../i18n/LocaleProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

const PHONE_RE = /^(?:\+216)?\d{8}$/;

export function OrderDialog({ open, onClose }: Props) {
  const { locale } = useLocale();
  const { ar, mvp } = getMvpDict(locale);

  const orderDict = locale === "ar" ? ar.order : mvp.order;

  const [utmSource, setUtmSource] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  const [packId, setPackId] = useState<PackId>("pack_c");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [address, setAddress] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function resetForm() {
    setPackId("pack_c");
    setName("");
    setPhone("");
    setPhoneTouched(false);
    setAddress("");
    setHoneypot("");
    setSubmitting(false);
    setSuccess(false);
    setError(null);
    setSubmitAttempted(false);
  }

  function handleClose() {
    if (success) {
      resetForm();
    } else {
      setError(null);
      setSuccess(false);
    }
    onClose();
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmSource(params.get("utm_source") ?? "");
    setUtmCampaign(params.get("utm_campaign") ?? "");
  }, []);

  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const prevOverscrollBehavior = body.style.overscrollBehavior;

    // Avoid layout shift when hiding the scrollbar.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "contain";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      body.style.overscrollBehavior = prevOverscrollBehavior;
    };
  }, [open]);

  const normalizedPhone = useMemo(
    () => phone.replace(/[\s-]/g, "").trim(),
    [phone],
  );
  const phoneInvalid =
    normalizedPhone.length > 0 && !PHONE_RE.test(normalizedPhone);
  const showPhoneError = (phoneTouched || submitAttempted) && phoneInvalid;

  const validationMessages = useMemo(() => {
    if (locale === "ar") {
      return {
        missingName: "الاسم مطلوب",
        invalidPhone: "رقم الهاتف غير صحيح",
        missingAddress: "العنوان مطلوب",
        missingPack: "اختر الباقة",
        phoneHint: "رقم من 8 أرقام، مع +216 اختيارياً",
      };
    }
    if (locale === "fr") {
      return {
        missingName: "Nom requis",
        invalidPhone: "Téléphone invalide",
        missingAddress: "Adresse requise",
        missingPack: "Choisissez un pack",
        phoneHint: "8 chiffres, +216 optionnel",
      };
    }
    return {
      missingName: "Name is required",
      invalidPhone: "Invalid phone",
      missingAddress: "Address is required",
      missingPack: "Please choose a pack",
      phoneHint: "8 digits, optional +216",
    };
  }, [locale]);

  if (!open) return null;

  async function submit() {
    setError(null);
    setSubmitAttempted(true);
    if (!name.trim()) return setError(validationMessages.missingName);
    if (!normalizedPhone || !PHONE_RE.test(normalizedPhone))
      return setError(validationMessages.invalidPhone);
    if (!address.trim()) return setError(validationMessages.missingAddress);
    if (!packId) return setError(validationMessages.missingPack);

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizedPhone,
          address: address.trim(),
          packId,
          locale,
          utmSource,
          utmCampaign,
          referrer: document.referrer ?? "",
          honeypot,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Request failed");
      }

      setSuccess(true);
    } catch {
      setError(orderDict.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-indigo-950/30 p-4 backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="mx-auto w-full max-w-xl overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_24px_64px_-32px_rgba(79,70,229,0.55)] md:p-6 max-h-[calc(100vh-2rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 md:text-xl">
              {orderDict.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{orderDict.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1 text-sm text-zinc-700 transition duration-200 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/40"
          >
            {(locale === "ar" ? ar.ui.close : mvp.ui.close) ?? "Close"}
          </button>
        </div>

        {success ? (
          <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/80 p-4">
            <div className="text-base font-semibold text-emerald-900">
              {orderDict.successTitle}
            </div>
            <div className="mt-1 text-sm text-emerald-800">
              {orderDict.successBody}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold">
                {orderDict.fields.pack}
              </label>
              <div className="mt-2 grid gap-1.5">
                {PACK_ORDER.map((id) => {
                  const p = PACKS[id];
                  const selected = packId === id;
                  return (
                    <label
                      key={id}
                      className={
                        "flex w-full cursor-pointer items-start gap-2 rounded-2xl border bg-white p-2 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50/40 hover:shadow-[0_12px_24px_-18px_rgba(79,70,229,0.5)] " +
                        (selected
                          ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-300/60 shadow-[0_10px_22px_-16px_rgba(79,70,229,0.55)]"
                          : "border-[#E5E5E5]")
                      }
                    >
                      <div className="relative h-28 w-28 shrink-0 md:h-32 md:w-32">
                        <img
                          src={p.imagePath}
                          alt={p.title[locale]}
                          onError={(e) => {
                            e.currentTarget.src = "/Remed.jpeg";
                          }}
                          className="h-full w-full rounded-2xl bg-white object-contain p-1.5"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl">
                          <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-b from-white to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-b-2xl bg-gradient-to-t from-white to-transparent" />
                          <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-gradient-to-r from-white to-transparent" />
                          <div className="absolute inset-y-0 right-0 w-[3px] rounded-r-2xl bg-gradient-to-l from-white to-transparent" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex w-full items-center justify-between gap-1">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <input
                              type="radio"
                              name="pack"
                              value={id}
                              checked={selected}
                              onChange={() => setPackId(id)}
                            />
                            <span className="truncate text-[13px] font-semibold">
                              {p.title[locale]}
                            </span>
                          </div>
                          {p.badge ? (
                            <span className="rounded-full border border-[#E5E5E5] bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 shadow-sm md:text-xs">
                              {p.badge === "premium"
                                ? locale === "ar"
                                  ? "🔥 الأكثر طلبًا"
                                  : locale === "fr"
                                    ? "🔥 Populaire"
                                    : "🔥 Most popular"
                                : p.badge === "best_value"
                                  ? locale === "ar"
                                    ? "🏆 أفضل قيمة"
                                    : locale === "fr"
                                      ? "🏆 Meilleure valeur"
                                      : "🏆 Best value"
                                  : locale === "ar"
                                    ? "💸 خصم"
                                    : locale === "fr"
                                      ? "💸 Réduction"
                                      : "💸 Discount"}
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-500">
                              &nbsp;
                            </span>
                          )}
                        </div>
                        <div className="mt-0 text-[11px] text-zinc-600">
                          {locale === "ar"
                            ? `${p.quantity} قوارير`
                            : locale === "fr"
                              ? `${p.quantity} bouteilles`
                              : `${p.quantity} bottles`}
                        </div>
                        <div className="text-[17px] font-semibold leading-none tracking-tight text-indigo-700">
                          {p.priceTnd} {locale === "ar" ? "د.ت" : "TND"}
                        </div>
                        {p.oldPriceTnd ? (
                          <div className="mt-0.5 inline-flex rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 line-through decoration-2">
                            {p.oldPriceTnd} {locale === "ar" ? "د.ت" : "TND"}
                          </div>
                        ) : null}
                        <div className="mt-1 text-[11px] leading-4 text-zinc-700">
                          {p.gift[locale]}
                        </div>
                        <div className="mt-0.5 text-[11px] font-medium leading-4 text-indigo-700">
                          {p.note[locale]}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold">
                  {orderDict.fields.name}
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300/40"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {orderDict.fields.phone}
                </label>
                <input
                  className={
                    "mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300/40 " +
                    (showPhoneError ? "border-red-500" : "")
                  }
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder={"+216XXXXXXXX"}
                  inputMode="tel"
                  dir="ltr"
                />
                {showPhoneError ? (
                  <div className="mt-1 text-xs text-red-600">
                    {validationMessages.invalidPhone} (
                    {validationMessages.phoneHint})
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {orderDict.fields.address}
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300/40"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <input
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                aria-hidden="true"
              />

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="mt-1 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(79,70,229,0.75)] transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/40"
              >
                {submitting ? orderDict.submitting : orderDict.submit}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
