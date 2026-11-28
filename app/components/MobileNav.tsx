"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Search, Users, Briefcase, BookOpen, Info, Lock, LogIn, LogOut, X } from "lucide-react";

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

const menus: Record<string, { title: string; items: { label: string; href: string }[] }> = {
  findJobs: { title: "Find Jobs", items: findJobsMenu },
  seekers: { title: "Job Seekers", items: jobSeekerMenu },
  employers: { title: "Employers", items: employerMenu },
  resources: { title: "Resources", items: resourcesMenu },
  about: { title: "About", items: aboutMenu },
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
          <button onClick={() => toggleMenu("findJobs")} className={itemCls(openMenu === "findJobs")}>
            <Search className="w-5 h-5" />
            <span className="mt-0.5">Jobs</span>
          </button>

          <button onClick={() => toggleMenu("seekers")} className={itemCls(openMenu === "seekers")}>
            <Users className="w-5 h-5" />
            <span className="mt-0.5">Seekers</span>
          </button>

          <button onClick={() => toggleMenu("employers")} className={itemCls(openMenu === "employers")}>
            <Briefcase className="w-5 h-5" />
            <span className="mt-0.5">Employers</span>
          </button>

          <button onClick={() => toggleMenu("resources")} className={itemCls(openMenu === "resources")}>
            <BookOpen className="w-5 h-5" />
            <span className="mt-0.5">Resources</span>
          </button>

          <button onClick={() => toggleMenu("about")} className={itemCls(openMenu === "about")}>
            <Info className="w-5 h-5" />
            <span className="mt-0.5">About</span>
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
