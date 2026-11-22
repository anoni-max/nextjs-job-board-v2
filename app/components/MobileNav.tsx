"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Home, Users, Briefcase, Globe, Lock, LogIn, LogOut, X } from "lucide-react";

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
  { label: "Social Media", href: "/social-media" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "About Us", href: "/about" },
  { label: "Trust & Transparency", href: "/trust" },
  { label: "Contact", href: "/contact" },
  { label: "Help & FAQ", href: "/help" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const menus: Record<string, { title: string; items: { label: string; href: string }[] }> = {
  seekers: { title: "Job Seekers", items: jobSeekerMenu },
  employers: { title: "Employers", items: employerMenu },
  community: { title: "Community", items: communityMenu },
};

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && (session?.user as any)?.isAdmin === true;
  const isLoggedIn = mounted && !!session?.user;

  function toggleMenu(key: string) {
    setOpenMenu((prev) => (prev === key ? null : key));
  }

  const activeMenu = openMenu ? menus[openMenu] : null;

  const itemCls = (active: boolean) =>
    `flex flex-col items-center justify-center py-2 px-0.5 text-[9px] font-medium ${
      active ? "text-blue-600" : "text-gray-500"
    }`;

  return (
    <>
      {activeMenu && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg max-h-[50vh] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">{activeMenu.title}</h3>
            <button onClick={() => setOpenMenu(null)} className="text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="py-2">
            {activeMenu.items.map((item) => {
              const isExternal = item.href.startsWith("http");
              const cls = "flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50";
              if (isExternal) {
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {item.label}
                  </a>
                );
              }
              return (
                <Link key={item.label} href={item.href} onClick={() => setOpenMenu(null)} className={cls}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-stretch">
          <Link href="/" className={itemCls(pathname === "/")}>
            <Home className="w-5 h-5" />
            <span className="mt-0.5">Jobs</span>
          </Link>

          <button onClick={() => toggleMenu("seekers")} className={itemCls(openMenu === "seekers")}>
            <Users className="w-5 h-5" />
            <span className="mt-0.5">Job Seekers</span>
          </button>

          <button onClick={() => toggleMenu("employers")} className={itemCls(openMenu === "employers")}>
            <Briefcase className="w-5 h-5" />
            <span className="mt-0.5">Employers</span>
          </button>

          <button onClick={() => toggleMenu("community")} className={itemCls(openMenu === "community")}>
            <Globe className="w-5 h-5" />
            <span className="mt-0.5">Community</span>
          </button>

          {isAdmin && (
            <Link href="/admin" className={itemCls(pathname === "/admin")}>
              <Lock className="w-5 h-5" />
              <span className="mt-0.5">Admin</span>
            </Link>
          )}

          {isLoggedIn ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className={itemCls(false)}>
              <LogOut className="w-5 h-5" />
              <span className="mt-0.5">Sign out</span>
            </button>
          ) : (
            <Link href="/signin" className={itemCls(pathname === "/signin")}>
              <LogIn className="w-5 h-5" />
              <span className="mt-0.5">Sign in</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
