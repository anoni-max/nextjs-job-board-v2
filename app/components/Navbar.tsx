"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const jobSeekerMenu = [
  { label: "Browse Jobs", href: "/" },
  { label: "Career Toolkit", href: "/career-toolkit" },
  { label: "Pricing", href: "/pricing" },
  { label: "Salary Guide", href: "/salary-guide" },
  { label: "My subscription", href: "/subscription" },
  { label: "Job Alerts", href: "/job-alerts" },
];

const employerMenu = [
  { label: "Post a Job", href: "/post" },
  { label: "Talent Search", href: "/talent" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

const communityMenu = [
  { label: "WhatsApp channel", href: "https://whatsapp.com/channel/0029Vb9lSs@FSAt5o20KvL1Q" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "About Us", href: "/about" },
  { label: "Trust & Transparency", href: "/trust" },
  { label: "Contact", href: "/contact" },
  { label: "Help & FAQ", href: "/help" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function NavDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-1">
        {label}
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-56">
          {items.map((item) => {
            const isExternal = item.href.startsWith("http");
            const cls = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600";
            if (isExternal) {
              return (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={item.label} href={item.href} className={cls}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold text-gray-900 shrink-0">
          Kazi<span className="text-blue-600">Spot</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-0 md:flex-none md:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Right group */}
        <div className="hidden md:flex items-center gap-4 ml-auto shrink-0">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Jobs</Link>
            <NavDropdown label="Job Seekers" items={jobSeekerMenu} />
            <NavDropdown label="Employers" items={employerMenu} />
            <NavDropdown label="Community" items={communityMenu} />
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
