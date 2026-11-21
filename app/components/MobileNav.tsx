"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, Users, PlusCircle, Lock, LogIn, LogOut } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = (session?.user as any)?.isAdmin === true;

  const items = [
    { href: "/", label: "Jobs", icon: Home },
    { href: "/talent", label: "Talent", icon: Users },
    { href: "/post", label: "Post", icon: PlusCircle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-stretch">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-2 text-xs font-medium ${
                active ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center py-2 px-2 text-xs font-medium ${
              pathname === "/admin" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="mt-0.5">Admin</span>
          </Link>
        )}

        {session?.user ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center py-2 px-2 text-xs font-medium text-gray-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="mt-0.5">Sign out</span>
          </button>
        ) : (
          <Link
            href="/signin"
            className={`flex flex-col items-center py-2 px-2 text-xs font-medium ${
              pathname === "/signin" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="mt-0.5">Sign in</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
