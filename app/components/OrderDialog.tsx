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

  const [packId, setPackId] = useState<PackId>("pack_b");
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
    setPackId("pack_b");
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
    >
      <div className="mx-auto w-full max-w-xl overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_24px_64px_-32px_rgba(79,70,229,0.55)] md:p-6 max-h-[calc(100vh-2rem)]">
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
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {PACK_ORDER.map((id) => {
                  const p = PACKS[id];
                  const selected = packId === id;
                  return (
                    <label
                      key={id}
                      className={
                        "flex cursor-pointer flex-col items-start justify-between gap-3 rounded-2xl border bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50/40 hover:shadow-[0_12px_24px_-18px_rgba(79,70,229,0.5)] " +
                        (selected
                          ? "border-indigo-500 bg-indigo-50/60 shadow-[0_10px_22px_-16px_rgba(79,70,229,0.55)]"
                          : "border-[#E5E5E5]")
                      }
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pack"
                            value={id}
                            checked={selected}
                            onChange={() => setPackId(id)}
                          />
                          <span className="text-sm font-semibold">
                            {p.quantity} {p.quantity === 1 ? "item" : "items"}
                          </span>
                        </div>
                        {p.badge ? (
                          <span className="rounded-full border border-[#E5E5E5] bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                            {p.badge === "premium" ? "Premium" : "Discount"}
                          </span>
                        ) : (
                          <span className="text-[11px] text-zinc-500">
                            &nbsp;
                          </span>
                        )}
                      </div>
                      <div className="w-full">
                        <div className="text-lg font-semibold tracking-tight">
                          {p.priceTnd} TND
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          {locale === "ar"
                            ? "الدفع عند الاستلام"
                            : "Pay on delivery"}
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
