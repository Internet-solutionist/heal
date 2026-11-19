import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { BreatheNow } from "@/components/breathe-now";
import { MobileNav } from "@/components/mobile-nav";
import { ProgressProvider } from "@/components/progress-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const description =
  "Nine short wellness lessons on health, education, and awareness, written by Nkosenhle Sondezi in Vryheid, KwaZulu-Natal.";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "HEAL — Health, Education, Awareness",
    template: "%s · HEAL",
  },
  description,
  openGraph: {
    title: "HEAL — Health, Education, Awareness",
    description,
    siteName: "HEAL",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEAL — Health, Education, Awareness",
    description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-card focus:px-4 focus:py-2 focus:text-foreground focus:shadow"
        >
          Skip to content
        </a>
        <ProgressProvider>
          <SiteHeader />
          <main id="content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <BreatheNow />
          <MobileNav />
        </ProgressProvider>
      </body>
    </html>
  );
}
