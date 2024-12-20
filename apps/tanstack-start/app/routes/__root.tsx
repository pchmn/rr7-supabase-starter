import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from '@monorepo-template/ssr-theme';
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
import { authMiddleware } from '~/middlewares/authMiddleware';

const loader = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const theme = await getThemeFromSession();
    return { theme, user: context.user };
  });

const updateTheme = createServerFn({ method: 'POST' })
  .validator(themeValidator)
  .handler(themeHandler);

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
  const { theme, user } = Route.useRouteContext();
  console.log(user);

  return (
    <ThemeProvider specifiedTheme={theme} themeAction={updateTheme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
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
