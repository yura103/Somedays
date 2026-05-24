"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mail, Compass, Bell, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Sidebar'); 

  const navItems = [
    { label: t('home'), href: "/", icon: <Home size={20} /> },
    { label: t('journal'), href: "/journal", icon: <BookOpen size={20} /> },
    { label: t('letters'), href: "/letters", icon: <Mail size={20} /> },
    { label: t('explore'), href: "/explore", icon: <Compass size={20} /> },
    { label: t('notifications'), href: "/notifications", icon: <Bell size={20} /> },
    { label: t('settings'), href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col px-2 py-6">
      {/* 화면이 작아지면 제목 자체를 숨겨서 'S...' 현상을 방지합니다 */}
      <h1 className="mb-10 px-4 text-3xl font-serif text-black hidden lg:block">
        Somedays
      </h1>

      <nav className="flex-1 space-y-2 text-sm lg:items-start">
        {navItems.map(({ label, href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors justify-center lg:justify-start ${
                isActive 
                  ? "bg-neutral-100 font-semibold text-black" 
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
              }`}
            >
              <span className="shrink-0">{icon}</span>
              {/* lg 사이즈 이상일 때만 label이 나타나며, 옆으로 글자가 밀려나지 않게 합니다 */}
              <span className="hidden lg:block whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}