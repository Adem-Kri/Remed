import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { LocaleProvider } from "./i18n/LocaleProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.remed.tn"),
  title: {
    default: "Remed Tunisie | REMED HYPERTENSION",
    template: "%s | Remed Tunisie",
  },
  description:
    "REMED HYPERTENSION Tunisie: complément naturel pour soutenir la tension artérielle. Livraison rapide en Tunisie et paiement à la livraison.",
  applicationName: "Remed Tunisie",
  alternates: {
    canonical: "/ar",
    languages: {
      "ar-TN": "/ar",
      "fr-TN": "/fr",
      "en-TN": "/en",
      "x-default": "/ar",
    },
  },
  keywords: [
    "Remed Tunisie",
    "REMED HYPERTENSION",
    "tension artérielle Tunisie",
    "ضغط الدم تونس",
    "complément naturel pression artérielle",
    "paiement à la livraison Tunisie",
  ],
  openGraph: {
    type: "website",
    locale: "ar_TN",
    url: "https://www.remed.tn/ar",
    siteName: "Remed Tunisie",
    title: "Remed Tunisie | REMED HYPERTENSION",
    description:
      "Produit naturel pour soutenir la tension artérielle, avec livraison rapide partout en Tunisie.",
    images: [
      {
        url: "/Remed.webp",
        width: 1200,
        height: 1200,
        alt: "Remed Tunisie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remed Tunisie | REMED HYPERTENSION",
    description:
      "Produit naturel pour soutenir la tension artérielle en Tunisie. Paiement à la livraison.",
    images: ["/Remed.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
