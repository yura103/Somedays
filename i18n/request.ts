// someday/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'ko'; // 기본값

  return {
    locale,
    // 폴더 구조에 맞게 messages 폴더를 지정
    messages: (await import(`../messages/${locale}.json`)).default
  };
});