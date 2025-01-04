import { useTranslation } from '@monorepo-template/i18n/react';
import { useTheme } from '@monorepo-template/ssr-theme/react';
import { Button } from '@monorepo-template/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import * as fs from 'node:fs';

const filePath = 'count.txt';

async function readCount() {
  return Number.parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  );
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();
  const [theme, setTheme] = useTheme();

  const { t, setLocale, locale } = useTranslation();

  return (
    <>
      <Button
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        {t('hello')} {t('world')}
        {t('home.title')}
      </Button>
      <Button
        onClick={async () => {
          await setLocale(locale === 'en' ? 'fr' : 'en');
          router.invalidate();
        }}
      >
        {locale}
      </Button>
    </>
  );
}
