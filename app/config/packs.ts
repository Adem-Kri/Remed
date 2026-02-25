export type PackId = "pack_a" | "pack_b" | "pack_c" | "pack_d";

type LocalizedCopy = {
  ar: string;
  fr: string;
  en: string;
};

export type Pack = {
  id: PackId;
  quantity: 1 | 2 | 3 | 6;
  priceTnd: number;
  oldPriceTnd?: number;
  badge?: "discount" | "premium" | "best_value";
  imagePath: string;
  title: LocalizedCopy;
  gift: LocalizedCopy;
  note: LocalizedCopy;
};

export const PACKS: Record<PackId, Pack> = {
  pack_a: {
    id: "pack_a",
    quantity: 1,
    priceTnd: 69,
    oldPriceTnd: 92,
    imagePath: "/Remed.jpeg",
    title: {
      ar: "باك 1",
      fr: "Pack 1",
      en: "Pack 1",
    },
    gift: {
      ar: "🎁 هدية: برنامج غذائي 7 ايام",
      fr: "🎁 Cadeau: programme nutrition 7 jours",
      en: "🎁 Gift: 7-day nutrition program",
    },
    note: {
      ar: "📌 مناسب للتجربة فقط",
      fr: "📌 Convient pour un test initial",
      en: "📌 Suitable for first-time trial",
    },
  },
  pack_b: {
    id: "pack_b",
    quantity: 2,
    priceTnd: 129,
    oldPriceTnd: 138,
    badge: "discount",
    imagePath: "/pack-of-2.png",
    title: {
      ar: "باك 2",
      fr: "Pack 2",
      en: "Pack 2",
    },
    gift: {
      ar: "🎁 هدية: برنامج غذائي 14 يوم",
      fr: "🎁 Cadeau: programme nutrition 14 jours",
      en: "🎁 Gift: 14-day nutrition plan",
    },
    note: {
      ar: "📌 يغطي بداية البروتوكول",
      fr: "📌 Couvre le démarrage du protocole",
      en: "📌 Covers the beginning of the protocol",
    },
  },
  pack_c: {
    id: "pack_c",
    quantity: 3,
    priceTnd: 175,
    oldPriceTnd: 207,
    badge: "premium",
    imagePath: "/pack-of-3.png",
    title: {
      ar: "باك 3",
      fr: "Pack 3",
      en: "Pack 3",
    },
    gift: {
      ar: "🎁 هدية: برنامج رياضي و غذائي 30 يوم + جدول متابعة للضغط",
      fr: "🎁 Cadeau: programme sport & nutrition 30 jours + tableau de suivi tension",
      en: "🎁 Gift: 30-day sport and nutrition program + blood pressure tracking table",
    },
    note: {
      ar: "⭐ الأكثر طلبًا ويعطي أفضل فرصة لنتيجة حقيقية",
      fr: "⭐ Le plus demandé avec la meilleure chance de résultat réel",
      en: "⭐ Most requested with the best chance for real results",
    },
  },
  pack_d: {
    id: "pack_d",
    quantity: 6,
    priceTnd: 330,
    oldPriceTnd: 414,
    badge: "best_value",
    imagePath: "/pack-of-6.png",
    title: {
      ar: "باك 4",
      fr: "Pack 4",
      en: "Pack 4",
    },
    gift: {
      ar: "🎁 هدية: برنامج رياضي و غذائي 90 يوم + جدول متابعة للضغط و الكوليسترول + رسائل واتساب شخصية",
      fr: "🎁 Cadeau: programme sport & nutrition 90 jours + suivi tension/cholestérol + messages WhatsApp personnalisés",
      en: "🎁 Gift: 90-day sport and nutrition program + blood pressure/cholesterol tracking + personal WhatsApp messages",
    },
    note: {
      ar: "👑 أفضل نتيجة قوية وثابتة",
      fr: "👑 Meilleur choix pour un résultat fort et durable",
      en: "👑 Best choice for strong, lasting results",
    },
  },
};

export const PACK_ORDER: PackId[] = ["pack_a", "pack_b", "pack_c", "pack_d"];
