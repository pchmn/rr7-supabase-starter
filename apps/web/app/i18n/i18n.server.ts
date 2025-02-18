import { type ActionFunction, createCookie, data } from 'react-router';
import { RemixI18Next } from 'remix-i18next/server';
import { i18nConfig } from './i18nConfig';

export const localeCookie = createCookie('__locale', {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
});

export const remixI18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18nConfig.supportedLngs,
    fallbackLanguage: i18nConfig.fallbackLng,
    cookie: localeCookie,
  },
  i18next: i18nConfig,
});

export const localeAction: ActionFunction = async ({ request }) => {
  const locale = (await request.formData()).get('locale');

  return data(
    { locale },
    { headers: { 'Set-Cookie': await localeCookie.serialize(locale) } },
  );
};
