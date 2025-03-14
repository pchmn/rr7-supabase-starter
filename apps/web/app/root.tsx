import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  useLoaderData,
} from 'react-router';

import '@rr7-supabase-starter/ui/style.css';
import './app.css';

import { Toaster } from '@rr7-supabase-starter/ui/toaster';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';
import type { Route } from './+types/root';
import { remixI18next } from './i18n/i18n.server';
import { themeSessionResolver } from './lib/theme/session.server';
import { toast as showToast } from './lib/toast/toast.client';
import { getToast } from './lib/toast/toast.server';
import { normalizeKey } from './lib/utils/normalizeKey';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const locale = await remixI18next.getLocale(request);
  const { toast, headers } = await getToast(request);

  const currentUser = context.currentUser;
  console.log('currentUser', currentUser?.id);

  return data(
    {
      theme: getTheme(),
      locale,
      toast,
      clientEnv: context.env.client,
      currentUser,
    },
    { headers },
  );
}

export default function AppWithProviders() {
  const { theme } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={theme} themeAction='/preferences/set-theme'>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const {
    locale,
    theme: ssrTheme,
    toast,
    clientEnv,
  } = useLoaderData<typeof loader>();

  const [theme] = useTheme();

  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  useEffect(() => {
    if (toast) {
      showToast[toast.type](
        i18n.t(normalizeKey(toast.message)),
        i18n.t(normalizeKey(toast.description)),
      );
    }
  }, [toast, i18n]);

  return (
    <html lang={locale} dir={i18n.dir()} className={theme ?? ''}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(ssrTheme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <Toaster theme={theme as 'dark' | 'light'} />
        <ScrollRestoration />
        <script
          // /!\ Be aware to only inject env variables that are safe to be used in the client
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(clientEnv)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
