import '@monorepo-template/i18n/types';
import type en from './en.json';

// Augment the Translation interface
declare module '@monorepo-template/i18n/types' {
  type EnTranslation = typeof en;
  interface Translation extends EnTranslation {}
}
