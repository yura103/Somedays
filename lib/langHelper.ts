// lib/langHelper.ts
export type Lang = 'ko' | 'en';

export const t = (data: { ko: string; en: string } | null, lang: Lang) => {
  if (!data) return "";
  return data[lang] || data['ko'];
};