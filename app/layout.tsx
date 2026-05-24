import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { Geist, Geist_Mono } from "next/font/google";
import MainLayout from "@/components/MainLayout"; // 분리한 레이아웃 가져오기
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Somedays",
  description: "Journal and future letters",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
           <MainLayout>{children}</MainLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}