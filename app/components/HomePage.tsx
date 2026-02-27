import { Landing } from "./Landing";

type Props = {
  locale: "ar" | "fr" | "en";
};

export function HomePage({ locale }: Props) {
  const languageTagByLocale = {
    ar: "ar-TN",
    fr: "fr-TN",
    en: "en-TN",
  } as const;

  const productDescriptionByLocale = {
    ar: "مكمل طبيعي لدعم توازن ضغط الدم وصحة القلب في تونس.",
    fr: "Complément naturel destiné à soutenir la tension artérielle et la santé cardiovasculaire.",
    en: "Natural supplement designed to support blood pressure balance and cardiovascular wellness.",
  } as const;

  const localePath = `https://www.remed.tn/${locale}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Remed Tunisie",
        url: "https://www.remed.tn",
        logo: "https://www.remed.tn/icon.png",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: "Remed Tunisie",
        url: "https://www.remed.tn",
        inLanguage: ["ar-TN", "fr-TN", "en-TN"],
      },
      {
        "@type": "WebPage",
        url: localePath,
        inLanguage: languageTagByLocale[locale],
        isPartOf: {
          "@type": "WebSite",
          url: "https://www.remed.tn",
          name: "Remed Tunisie",
        },
      },
      {
        "@type": "Product",
        name: "REMED HYPERTENSION",
        image: ["https://www.remed.tn/Remed.webp"],
        description: productDescriptionByLocale[locale],
        inLanguage: languageTagByLocale[locale],
        brand: {
          "@type": "Brand",
          name: "Remed",
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "TND",
          lowPrice: "69",
          highPrice: "330",
          offerCount: "4",
          availability: "https://schema.org/InStock",
          url: localePath,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing key={locale} />
    </>
  );
}
