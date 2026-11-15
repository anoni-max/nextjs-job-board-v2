import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobBoard — Find Your Next Job",
  description: "Search thousands of remote jobs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
              💼 JobBoard
            </Link>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition">Browse</Link>
              <Link href="/post" className="hover:text-blue-600 transition">Post a Job</Link>
              <Link href="/admin" className="text-red-600 hover:text-red-700 transition font-bold">Admin</Link>
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