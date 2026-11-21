"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const isAdmin = (session?.user as any)?.isAdmin === true;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center gap-4">
        <Link href="/" className="text-xl font-extrabold text-gray-900 shrink-0">
          Kazi<span className="text-blue-600">Spot</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-0 md:flex-none md:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="hidden md:flex items-center gap-4 ml-auto shrink-0">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Jobs</Link>
            <Link href="/talent" className="text-sm font-medium text-gray-600 hover:text-gray-900">Talent</Link>
            <Link href="/post" className="text-sm font-medium text-gray-600 hover:text-gray-900">Post a Job</Link>
          </nav>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-600 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 whitespace-nowrap"
            >
              Admin
            </Link>
          )}

          {status === "loading" ? (
            <span className="text-sm text-gray-400">…</span>
          ) : session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className="text-sm font-semibold text-gray-700 border border-gray-300 px-4 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
