"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  
  // [테스트용] 테스트 중에는 여기서 true로 변경하세요!
  const isLoggedIn = true; 

  const showSidebar = isLoggedIn && !isLoginPage;

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <aside className="fixed left-0 top-0 flex h-screen w-20 lg:w-[240px] flex-col items-center lg:items-stretch border-r border-neutral-200 bg-white py-8 transition-all duration-300 z-50">
          <Link href="/" className="mb-8 text-center lg:px-6 lg:text-left">
            <span className="hidden text-2xl font-semibold lg:block">Somedays</span>
            <span className="block text-2xl font-bold lg:hidden">S</span>
          </Link>
          <div className="w-full px-2 lg:px-6">
            <Sidebar />
          </div>
          <div className="mt-auto w-full px-2 lg:px-6">
            <Link href="/premium" className="flex items-center justify-center rounded-2xl border border-neutral-200 p-3 lg:block lg:p-4 text-sm hover:border-black transition-all">
              <p className="hidden font-medium lg:block">Premium</p>
              <p className="mt-1 hidden text-xs text-neutral-500 lg:block">기록을 안전하게 보관해요.</p>
              <p className="block font-bold lg:hidden text-lg">P</p>
            </Link>
          </div>
        </aside>
      )}
      <main className={`${showSidebar ? "ml-20 lg:ml-[240px]" : "ml-0"} min-h-screen flex-1 transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}