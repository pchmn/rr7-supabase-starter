import type { InitOptions } from 'i18next';
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
} as const;
export type I18nKey = (typeof resources)['en']['translation'];

export const i18nConfig = {
  supportedLngs: ['en', 'fr'],
  fallbackLng: 'en',
  ns: defaultNS,
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
} satisfies InitOptions;
