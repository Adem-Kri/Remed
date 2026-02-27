import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "../components/HomePage";
import { SUPPORTED_LOCALES, type Locale } from "../i18n/types";

type Props = {
  params: Promise<{ locale: string }>;
};

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

const metadataByLocale: Record<Locale, Metadata> = {
  ar: {
    title: "Remed تونس | REMED HYPERTENSION",
    description:
      "REMED HYPERTENSION في تونس: مكمل طبيعي لدعم توازن ضغط الدم مع توصيل سريع والدفع عند الاستلام.",
    alternates: {
      canonical: "/ar",
      languages: {
        "ar-TN": "/ar",
        "fr-TN": "/fr",
        "en-TN": "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      url: "https://www.remed.tn/ar",
      locale: "ar_TN",
      alternateLocale: ["fr_TN", "en_TN"],
      title: "Remed تونس | REMED HYPERTENSION",
      description:
        "مكمل طبيعي لدعم ضغط الدم مع توصيل سريع والدفع عند الاستلام في تونس.",
      images: [
        {
          url: "https://www.remed.tn/Remed.webp",
          width: 1200,
          height: 1200,
          alt: "Remed Tunisie",
        },
      ],
    },
  },
  fr: {
    title: "Remed Tunisie | REMED HYPERTENSION",
    description:
      "REMED HYPERTENSION en Tunisie: complément naturel pour soutenir la tension artérielle. Livraison rapide et paiement à la livraison.",
    alternates: {
      canonical: "/fr",
      languages: {
        "ar-TN": "/ar",
        "fr-TN": "/fr",
        "en-TN": "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      url: "https://www.remed.tn/fr",
      locale: "fr_TN",
      alternateLocale: ["ar_TN", "en_TN"],
      title: "Remed Tunisie | REMED HYPERTENSION",
      description:
        "Complément naturel pour soutenir la tension artérielle en Tunisie.",
      images: [
        {
          url: "https://www.remed.tn/Remed.webp",
          width: 1200,
          height: 1200,
          alt: "Remed Tunisie",
        },
      ],
    },
  },
  en: {
    title: "Remed Tunisia | REMED HYPERTENSION",
    description:
      "REMED HYPERTENSION in Tunisia: natural support for blood pressure balance with fast delivery and cash on delivery.",
    alternates: {
      canonical: "/en",
      languages: {
        "ar-TN": "/ar",
        "fr-TN": "/fr",
        "en-TN": "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      url: "https://www.remed.tn/en",
      locale: "en_TN",
      alternateLocale: ["ar_TN", "fr_TN"],
      title: "Remed Tunisia | REMED HYPERTENSION",
      description:
        "Natural product to support blood pressure and heart wellness in Tunisia.",
      images: [
        {
          url: "https://www.remed.tn/Remed.webp",
          width: 1200,
          height: 1200,
          alt: "Remed Tunisia",
        },
      ],
    },
  },
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return metadataByLocale[locale];
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <HomePage locale={locale} />;
}
