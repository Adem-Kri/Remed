import type { Metadata } from "next";
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
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}

