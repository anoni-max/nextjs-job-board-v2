"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Home, Users, Briefcase, Shield, MessageSquare } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Talent Pool", href: "/talent", icon: Users },
    { name: "Post a Job", href: "/post", icon: Briefcase },
    { name: "Admin", href: "/admin", icon: Shield },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tighter shrink-0">
          JobBoard
        </Link>

        {/* Middle: Search Bar (Takes up remaining space on mobile) */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 text-sm text-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Right: Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 text-xs font-medium transition-colors border-b-2 ${
                  isActive 
                    ? "text-gray-900 border-gray-900" 
                    : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Mobile Icons (Hidden on Desktop) */}
        <div className="flex md:hidden items-center gap-4 shrink-0">
           <button className="text-gray-500 hover:text-gray-900">
             <MessageSquare className="w-6 h-6" />
           </button>
        </div>

      </div>
    </nav>
  );
}