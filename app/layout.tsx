import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Sidebar from "@/components/Sidebar"; // 분리한 사이드바 가져오기
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Someday",
  description: "Journal and future letters",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAFA] text-[#111]">
        <div className="flex min-h-screen">
          <aside className="fixed left-0 top-0 flex h-screen w-[240px] flex-col border-r border-neutral-200 bg-white px-6 py-8">
            <Link href="/" className="text-2xl font-semibold">Someday</Link>
            
            {/* 네비게이션 적용 */}
            <Sidebar />

            <Link href="/premium" className="mt-auto rounded-2xl border border-neutral-200 p-4 text-sm hover:border-black">
              <p className="font-medium">Premium</p>
              <p className="mt-1 text-xs text-neutral-500">기록을 안전하게 보관해요.</p>
            </Link>
          </aside>

          <main className="ml-[240px] min-h-screen flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}