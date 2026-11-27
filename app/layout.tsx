import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from "@next/third-parties/google"; // ← GA4

import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// 👇 keep your own title/description if you had one
export const metadata: Metadata = {
  title: "KaziSpot — Find Jobs Worldwide",
  description:
    "Discover job opportunities from trusted employers around the world. Explore local and international vacancies on KaziSpot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Suspense fallback={<div />}>
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">{children}</main>
            <MobileNav />
          </Suspense>
        </SessionProvider>

        {/* GA4 — renders only when the env var is set */}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
