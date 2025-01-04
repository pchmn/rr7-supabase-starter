import { I18nProvider } from '@monorepo-template/i18n/react';
import {
  loadTranslation,
  localeHandler,
  localeValidator,
} from '@monorepo-template/i18n/tanstart';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from '@monorepo-template/ssr-theme/react';
import {
  getThemeFromSession,
  themeHandler,
  themeValidator,
} from '@monorepo-template/ssr-theme/tanstart';
import uiCss from '@monorepo-template/ui/style.css?url';
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router';
import { Meta, Scripts, createServerFn } from '@tanstack/start';
import type { ReactNode } from 'react';
import { i18nConfig } from '~/i18n/i18n.server';
import { authMiddleware } from '~/middlewares/authMiddleware';

const loader = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const theme = await getThemeFromSession();
    const user = await context.supabase.auth.getUser();
    const { locale, translation } = await loadTranslation(i18nConfig);
    console.log('LOCALE', locale, translation);
    return { theme, user: context.user, locale, translation };
  });

const updateTheme = createServerFn({ method: 'POST' })
  .validator(themeValidator)
  .handler(themeHandler);

const updateLocale = createServerFn({ method: 'POST' })
  .validator(localeValidator)
  .handler(localeHandler);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [{ rel: 'stylesheet', href: uiCss }],
  }),
  beforeLoad: () => loader(),
  component: RootComponent,
});

function RootComponent() {
  const { theme, user, locale, translation } = Route.useRouteContext();
  console.log('LOCALE', locale, translation);

  return (
    <ThemeProvider specifiedTheme={theme} themeAction={updateTheme}>
      <I18nProvider
        config={{ locale, translation, localeAction: updateLocale }}
      >
        <RootDocument>
          <Outlet />
        </RootDocument>
      </I18nProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const [theme] = useTheme();

  return (
    <html lang='en' className={theme ?? ''}>
      <head>
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
