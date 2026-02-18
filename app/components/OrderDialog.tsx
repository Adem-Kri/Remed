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
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setPackId("pack_b");
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setHoneypot("");
    setSubmitting(false);
    setSuccess(false);
    setError(null);
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
  const phoneOk =
    normalizedPhone.length === 0 ? true : PHONE_RE.test(normalizedPhone);

  if (!open) return null;

  async function submit() {
    setError(null);
    if (!name.trim()) return setError("Missing name");
    if (!normalizedPhone || !PHONE_RE.test(normalizedPhone))
      return setError("Invalid phone");
    if (!address.trim()) return setError("Missing address");
    if (!packId) return setError("Missing pack");

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizedPhone,
          address: address.trim(),
          notes: notes.trim(),
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-sm md:p-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight md:text-xl">
              {orderDict.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{orderDict.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
          >
            {(locale === "ar" ? ar.ui.close : mvp.ui.close) ?? "Close"}
          </button>
        </div>

        {success ? (
          <div className="mt-6 rounded-lg border border-[#E5E5E5] p-4">
            <div className="text-base font-semibold">
              {orderDict.successTitle}
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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
                        "flex cursor-pointer flex-col items-start justify-between gap-3 rounded-2xl border bg-white p-4 transition-colors hover:bg-zinc-50 " +
                        (selected ? "border-zinc-900" : "border-[#E5E5E5]")
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
                          <span className="rounded-full border border-[#E5E5E5] bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
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
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
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
                    "mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 " +
                    (phoneOk ? "" : "border-red-500")
                  }
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={"+216XXXXXXXX"}
                  inputMode="tel"
                  dir="ltr"
                />
                {!phoneOk ? (
                  <div className="mt-1 text-xs text-red-600">
                    Invalid phone (8 digits, optional +216)
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {orderDict.fields.address}
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  {orderDict.fields.notes}
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
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
                className="mt-1 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
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
