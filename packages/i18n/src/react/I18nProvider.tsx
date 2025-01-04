import { type ReactNode, createContext, useContext } from 'react';
import type { Translation } from '../types/i18nConfig';

interface I18nContextProps {
  translation?: Translation;
  locale: string;
  localeAction: (opts: { data: { locale: string } }) => Promise<unknown>;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({
  config,
  children,
}: { config: I18nContextProps; children: ReactNode }) {
  return (
    <I18nContext.Provider
      value={{
        translation: config.translation,
        locale: config.locale,
        localeAction: config.localeAction,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}${'.'}${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export const useTranslation = <T extends Translation>() => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const t = (key: NestedKeyOf<T>, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let translation = keys.reduce(
      (obj, k) => obj?.[k],
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      context.translation as any,
    );

    if (typeof translation !== 'string') {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }

    for (const [paramKey, value] of Object.entries(params ?? {})) {
      translation = translation.replace(`{{${paramKey}}}`, `${value}`);
    }
    return translation;
  };

  const setLocale = async (locale: string) => {
    await context.localeAction({ data: { locale } });
  };

  return {
    t,
    locale: context.locale,
    setLocale,
  };
};
