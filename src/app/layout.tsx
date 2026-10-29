import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBusinessJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Paver Installer in Las Vegas | PavExpert Hub",
    template: "%s | PavExpert Hub",
  },
  description:
    "Paver installer in Las Vegas, Henderson, and Summerlin. Travertine and porcelain installation, paver repair, paver step repair, sealing, and landscape projects.",
  openGraph: {
    siteName: "PavExpert Hub",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={inter.className}>
        <JsonLd data={buildBusinessJsonLd()} />
        <ClientLayout>
          <main>
          {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
