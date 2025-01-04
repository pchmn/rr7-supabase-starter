import type { I18nConfig } from '@monorepo-template/i18n/types';

export const i18nConfig = {
  fallbackLocale: 'en',
  translations: '/app/i18n/{{locale}}.json',
} satisfies I18nConfig;
