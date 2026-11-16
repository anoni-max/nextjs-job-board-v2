"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusSquare, Shield, Briefcase } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { name: "Home", href: "/", icon: Home },
    { name: "Talent", href: "/talent", icon: Users },
    { name: "Post", href: "/post", icon: PlusSquare },
    { name: "Admin", href: "/admin", icon: Shield },
    { name: "Jobs", href: "/", icon: Briefcase }, 
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-gray-900" : "text-gray-500"}`} />
              <span className={`text-[10px] ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}