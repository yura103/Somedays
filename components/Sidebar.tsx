"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mail, Compass, Bell, Settings } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: <Home size={20} /> },
  { label: "Journal", href: "/journal", icon: <BookOpen size={20} /> },
  { label: "Letters", href: "/letters", icon: <Mail size={20} /> },
  { label: "Explore", href: "/explore", icon: <Compass size={20} /> },
  { label: "Notifications", href: "/notifications", icon: <Bell size={20} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="mt-10 space-y-2 text-sm">
      {navItems.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              isActive 
                ? "bg-neutral-100 font-semibold text-black" 
                : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}