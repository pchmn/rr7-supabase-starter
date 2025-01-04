import {
  type CookieSerializeOptions,
  getWebRequest,
  useSession,
} from 'vinxi/http';
import type { I18nConfig, Translation } from '../types/i18nConfig';

const COOKIE_NAME = '__tanstart_locale';
const COOKIE_PASSWORD =
  'should-not-need-password-because-cookie-is-not-sensitive';
const COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function getLocaleFromSession() {
  const session = await useSession<{ locale?: string }>({
    name: COOKIE_NAME,
    password: COOKIE_PASSWORD,
    cookie: COOKIE_OPTIONS,
  });

  return session.data.locale;
}

export async function getLocale(i18nConfig: I18nConfig) {
  let locale = await getLocaleFromSession();

  if (locale) {
    return locale;
  }

  const request = getWebRequest();
  locale = request.headers.get('accept-language')?.split(';')[0]?.split(',')[0];

  return (
    (locale?.includes('-') ? locale?.split('-')[0] : locale) ||
    i18nConfig.fallbackLocale
  );
}

export async function getTranslation(i18nConfig: I18nConfig) {
  if (typeof i18nConfig.translations === 'string') {
    /* @vite-ignore */
    const translation = await import(
      i18nConfig.translations.replace(
        '{{locale}}',
        i18nConfig.locale || i18nConfig.fallbackLocale,
      )
    );
    return translation.default as Translation;
  }
  return i18nConfig.translations[
    i18nConfig.locale || i18nConfig.fallbackLocale
  ];
}

export async function loadTranslation(i18nConfig: I18nConfig) {
  const locale = await getLocale(i18nConfig);
  const translation = await getTranslation({ ...i18nConfig, locale });
  return { translation, locale };
}

export const localeValidator = (data: unknown): { locale: string } => {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Theme must be an object');
  }

  if ('locale' in data && typeof data.locale !== 'string') {
    throw new Error('Locale must be a string');
  }

  return data as { locale: string };
};

export const localeHandler = async ({
  data: { locale },
}: { data: { locale: string } }) => {
  const session = await useSession<{ locale?: string }>({
    name: COOKIE_NAME,
    password: COOKIE_PASSWORD,
    cookie: COOKIE_OPTIONS,
  });

  if (locale === null) {
    await session.clear();
  } else {
    await session.update({
      locale,
    });
  }

  return { locale };
};
