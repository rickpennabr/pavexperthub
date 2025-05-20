import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import MainMenu from "@/components/layout/MainMenu";
import AppContainer from "@/components/layout/AppContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PavExpertHub",
  description: "Online Hardscape Source",
  icons: {
    icon: '/images/logo/icon.png',
    apple: '/images/logo/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="icon"
          href="/images/logo/icon.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/images/logo/icon.png"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <AppContainer>
          <Header />
          <MainMenu />
          {children}
        </AppContainer>
      </body>
    </html>
  );
}
