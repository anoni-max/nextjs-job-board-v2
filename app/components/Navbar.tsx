"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const findJobsMenu = [
  { label: "Browse Jobs", href: "/" },
  { label: "Remote Jobs", href: "/jobs?type=Remote" },
  { label: "Job Categories", href: "/jobs" },
];

const jobSeekerMenu = [
  { label: "My Profile", href: "/profile" },
  { label: "Jobs Matched", href: "/matches" },
  { label: "Job Alerts", href: "/alerts" },
  { label: "Career Toolkit", href: "/career-toolkit" },
];

const employerMenu = [
  { label: "Post a Job", href: "/post" },
  { label: "Employer Dashboard", href: "/dashboard" },
];

const resourcesMenu = [
  { label: "Blog", href: "/blog" },
  { label: "CV Writing Tips", href: "/career-toolkit" },
  { label: "Interview Preparation", href: "/career-toolkit" },
  { label: "Salary Guide", href: "/salary-guide" },
];

const aboutMenu = [
  { label: "About Us", href: "/about" },
  { label: "Trust & Transparency", href: "/trust" },
  { label: "Contact", href: "/contact" },
  { label: "Help & FAQ", href: "/help" },
];

function NavDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-1">
        {label}
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-56 max-h-[80vh] overflow-y-auto">
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
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && (session?.user as any)?.isAdmin === true;
  const isLoggedIn = mounted && !!session?.user;

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

        <form onSubmit={handleSearch} className="flex-1 min-w-0 md:flex-none md:w-64">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
          <nav className="flex items-center gap-3">
            <NavDropdown label="Find Jobs" items={findJobsMenu} />
            <NavDropdown label="Job Seekers" items={jobSeekerMenu} />
            <NavDropdown label="Employers" items={employerMenu} />
            <NavDropdown label="Resources" items={resourcesMenu} />
            <NavDropdown label="About" items={aboutMenu} />
          </nav>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 whitespace-nowrap"
            >
              Admin
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className="text-sm font-semibold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
