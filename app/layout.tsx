import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        
        {/* Navigation Bar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1 rounded-md">💼</span> JobBoard
            </Link>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition">Browse</Link>
              <Link href="/post" className="hover:text-blue-600 transition">Post a Job</Link>
              <Link href="/admin" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">Admin</Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow">
          {children}
        </main>

      </body>
    </html>
  );
}