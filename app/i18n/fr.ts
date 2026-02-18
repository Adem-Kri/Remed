import type { Dictionary } from "./dictionary";

export const fr: Pick<Dictionary, "hero" | "order" | "ui"> & {
  sections: Pick<Dictionary["sections"], "faq" | "finalCta">;
} = {
  hero: {
    trustLine: "⭐ Plus de 1200 Tunisiens nous ont fait confiance ⭐⭐⭐⭐⭐",
    title: "REMED HYPERTENSION – 100% naturel",
    subtitle: "Pour soutenir la tension, les artères et le cœur",
    bullets: ["✅ Livraison gratuite", "✅ Paiement à la livraison", "✅ Usage quotidien"],
    offer: "Offre du jour : livraison gratuite + paiement à la livraison",
    cta: "Acheter maintenant",
  },
  sections: {
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Quand vais-je recevoir le produit ?", a: "24 à 72h selon la région." },
        {
          q: "Y a-t-il des effets secondaires ?",
          a: "Complément naturel. Si vous êtes allergique aux produits de la ruche, consultez un médecin.",
        },
        { q: "Puis-je l’utiliser avec mon traitement ?", a: "Oui, sans changer votre traitement sans suivi médical." },
        { q: "Puis-je retourner le produit ?", a: "Oui, garantie 30 jours." },
      ],
    },
    finalCta: {
      title: "Offre limitée – ne ratez pas l’occasion !",
      body: "Livraison rapide en Tunisie · Paiement à la livraison · Garantie 30 jours",
      cta: "Acheter maintenant",
    },
  },
  order: {
    title: "Commande (paiement à la livraison)",
    subtitle: "Notre équipe vous appellera pour confirmer la commande.",
    fields: {
      name: "Nom complet",
      phone: "Téléphone",
      address: "Adresse",
      notes: "Notes (optionnel)",
      pack: "Choisir un pack",
    },
    submit: "Confirmer",
    submitting: "Envoi...",
    successTitle: "Commande enregistrée ✅",
    successBody: "Nous vous contacterons bientôt pour confirmer.",
    errorGeneric: "Une erreur s'est produite. Réessayez.",
    fullDetailsNote: "(Détails complets disponibles en arabe)",
  },
  ui: {
    buyNow: "Acheter maintenant",
    close: "Fermer",
    language: "Langue",
  },
};
