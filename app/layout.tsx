import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { LocaleProvider } from "./i18n/LocaleProvider";

export const metadata: Metadata = {
  title: "Remed",
  description: "Remed COD landing page",
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
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
