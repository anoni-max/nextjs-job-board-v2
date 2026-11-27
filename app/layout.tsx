// app/layout.tsx  (FULL — with GA4 added)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from "@next/third-parties/google"; // ← STEP 2: import

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// 👇 Keep your own metadata if you already have one — don't overwrite it
export const metadata: Metadata = {
  title: "KaziSpot — Find Jobs Worldwide",
  description:
    "Discover job opportunities from trusted employers around the world. Explore local and international vacancies on KaziSpot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // STEP 2: read the Measurement ID from env (undefined until you add it)
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Suspense fallback={<div />}>
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </Suspense>
        </SessionProvider>

        {/* === STEP 2: GA4 — only renders once you set the env var === */}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
