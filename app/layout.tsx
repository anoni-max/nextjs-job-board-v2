import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobBoard — Find Your Next Job",
  description: "Search thousands of remote and local jobs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col`}>
        
        <Navbar />

        {/* pb-16 adds padding to the bottom so the MobileNav doesn't cover content */}
        <main className="flex-grow pb-16 md:pb-0">
          {children}
        </main>

        <MobileNav />

      </body>
    </html>
  );
}