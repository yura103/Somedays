// app/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { LanguageProvider } from '@/context/LanguageContext';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import "./globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageProvider>
            {/* 2. 테두리 선 스타일 수정: border-neutral-200 (연한 회색) */}
            <aside className="sticky top-0 h-screen w-20 flex-shrink-0 border-r border-neutral-200 bg-white lg:w-64">
              <Sidebar />
            </aside>
            
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}