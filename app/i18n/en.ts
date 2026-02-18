import type { Dictionary } from "./dictionary";

export const en: Pick<Dictionary, "hero" | "order" | "ui"> & {
  sections: Pick<Dictionary["sections"], "faq" | "finalCta">;
} = {
  hero: {
    trustLine: "⭐ Over 1200 Tunisians trusted us ⭐⭐⭐⭐⭐",
    title: "REMED HYPERTENSION – 100% natural",
    subtitle: "Supports blood pressure, arteries, and heart health",
    bullets: ["✅ Free delivery", "✅ Pay on delivery", "✅ Daily use"],
    offer: "Today’s offer: free delivery + pay on delivery",
    cta: "Buy now",
  },
  sections: {
    faq: {
      title: "FAQ",
      items: [
        { q: "When will it arrive?", a: "24 to 72 hours depending on your region." },
        {
          q: "Any side effects?",
          a: "Natural supplement. If you’re allergic to bee products, consult a doctor.",
        },
        { q: "Can I use it with my medication?", a: "Yes, but do not change medication without medical follow-up." },
        { q: "Can I return it?", a: "Yes, 30-day guarantee." },
      ],
    },
    finalCta: {
      title: "Limited offer — don’t miss out!",
      body: "Fast delivery across Tunisia · Pay on delivery · 30-day guarantee",
      cta: "Buy now",
    },
  },
  order: {
    title: "Order (pay on delivery)",
    subtitle: "Our team will call you to confirm your order.",
    fields: {
      name: "Full name",
      phone: "Phone",
      address: "Address",
      notes: "Notes (optional)",
      pack: "Choose a pack",
    },
    submit: "Confirm",
    submitting: "Sending...",
    successTitle: "Order saved ✅",
    successBody: "We’ll contact you soon to confirm.",
    errorGeneric: "Something went wrong. Please try again.",
    fullDetailsNote: "(Full details available in Arabic)",
  },
  ui: {
    buyNow: "Buy now",
    close: "Close",
    language: "Language",
  },
};
