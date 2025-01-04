// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface Translation {}

export interface I18nConfig {
  locale?: string;
  fallbackLocale: string;
  // If translations is an array, we need to lazy import the translations (json files)
  translations: Record<string, Translation> | string;
}
