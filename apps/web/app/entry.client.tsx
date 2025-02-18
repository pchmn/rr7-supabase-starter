import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { HydratedRouter } from 'react-router/dom';
import { i18nConfig } from './i18n/i18nConfig';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    ...i18nConfig,
    detection: {
      // Here only enable htmlTag detection, we'll detect the language only
      // server-side with remix-i18next, by using the `<html lang>` attribute
      // we can communicate to the client the language detected server-side
      order: ['htmlTag'],
      // Because we only use htmlTag, there's no reason to cache the language
      // on the browser, so we disable it
      caches: [],
    },
  })
  .then(() => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <HydratedRouter />
        </StrictMode>,
      );
    });
  });
