"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mail, Compass, Bell, Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // 1. 언어 Context 가져오기
import { translations } from "@/lib/i18n"; // 2. 다국어 데이터 가져오기

export default function Sidebar() {
  const pathname = usePathname();
  const { lang } = useLanguage(); // 3. 현재 언어 상태 가져오기
  const t = translations[lang]; // 4. 현재 언어에 맞는 텍스트 객체 선택

  const navItems = [
    { label: t.home, href: "/", icon: <Home size={20} /> },
    { label: t.journal, href: "/journal", icon: <BookOpen size={20} /> },
    { label: t.letters, href: "/letters", icon: <Mail size={20} /> },
    { label: t.explore, href: "/explore", icon: <Compass size={20} /> },
    { label: t.notifications, href: "/notifications", icon: <Bell size={20} /> },
    { label: t.settings, href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <nav className="mt-10 space-y-2 text-sm">
      {navItems.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors justify-center lg:justify-start ${
              isActive 
                ? "bg-neutral-100 font-semibold text-black" 
                : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            {/* 아이콘은 항상 표시 */}
            <span className="shrink-0">{icon}</span>
            
            {/* 화면 작아질 때 글자 숨기기 */}
            <span className="hidden lg:block">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}