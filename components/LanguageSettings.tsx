"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSettings() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <span className="text-xs text-neutral-500 font-medium">언어 (Language)</span>
      
      {/* 셀렉트 박스 */}
      <select 
        value={lang} 
        onChange={(e) => setLang(e.target.value as 'ko' | 'en')}
        className="w-full p-3 border border-neutral-200 rounded-xl bg-white cursor-pointer hover:border-black transition-colors"
      >
        <option value="ko">한국어 (Korean)</option>
        <option value="en">영어 (English)</option>
      </select>
    </div>
  );
}