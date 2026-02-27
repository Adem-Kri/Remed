import { Landing } from "./Landing";

type Props = {
  locale: "ar" | "fr" | "en";
};

export function HomePage({ locale }: Props) {
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
        "@type": "Product",
        name: "REMED HYPERTENSION",
        image: ["https://www.remed.tn/Remed.webp"],
        description:
          "Complément naturel destiné à soutenir la tension artérielle et la santé cardiovasculaire.",
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
          url: "https://www.remed.tn",
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
