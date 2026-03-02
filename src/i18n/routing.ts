import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'], // 당신 지원 언어
  defaultLocale: 'ko',
  localePrefix: 'as-needed', // / = ko, /en = en
});
