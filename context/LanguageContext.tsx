"use client"; // [필수] 이 줄이 없으면 레이아웃에서 빨간 줄이 뜹니다.

import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'ko' | 'en';

// Context 생성
const LanguageContext = createContext<{ 
  lang: Lang; 
  setLang: (l: Lang) => void 
}>({ 
  lang: 'ko', 
  setLang: () => {} 
});

// Provider 생성
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko');
  
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 훅 생성
export const useLanguage = () => useContext(LanguageContext);