import { deleteCurrentUser } from '@rr7-supabase-starter/supabase/auth.server';
import { Button } from '@rr7-supabase-starter/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rr7-supabase-starter/ui/card';
import { Flex } from '@rr7-supabase-starter/ui/flex';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rr7-supabase-starter/ui/select';
import { LogOutIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { redirect, useFetcher } from 'react-router';
import { ConfirmButton } from '~/components/confirm/ConfirmButton';
import { remixI18next } from '~/i18n/i18n.server';
import { useTheme } from '~/lib/theme/useTheme';
import { normalizeKey } from '~/lib/utils/normalizeKey';
import { useSignOut } from '~/modules/auth/useSignOut';
import type { Route } from './+types/account';

export async function loader({ request, context }: Route.LoaderArgs) {
  const currentUser = context.currentUser;

  if (currentUser.is_anonymous) {
    return redirect('/');
  }

  const t = await remixI18next.getFixedT(request);

  return {
    currentUser,
    meta: {
      title: t('account.meta.title'),
      description: t('account.meta.description'),
    },
  };
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    const { error, headers } = await deleteCurrentUser(request);

    if (error) {
      return { error };
    }

    return redirect('/', { headers });
  }

  return null;
}

export function meta({ data: { meta } }: Route.MetaArgs) {
  return [
    { title: meta.title },
    { name: 'description', content: meta.description },
  ];
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();

  const { signOut } = useSignOut();

  const [theme, setTheme] = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    fetcher.submit(
      { locale },
      { method: 'post', action: '/preferences/set-locale' },
    );
  };

  return (
    <div className='w-full max-w-[1200px] mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-[300px_1fr] lg:gap-0 gap-8'>
        {/* Avatar and email section */}
        <div className='mx-auto lg:mx-0 w-fit'>
          <Flex direction='col' align='center' gap='md' className='fit-content'>
            <img
              src={loaderData.currentUser.user_metadata.avatar_url}
              alt='user-avatar'
              className='h-32 w-32 rounded-full object-cover'
            />
            <span className='text-sm text-muted-foreground'>
              {loaderData.currentUser.email}
            </span>
            <Button variant='outline' size='sm' onClick={signOut}>
              <LogOutIcon className='h-4 w-4 opacity-50' />
              {t('account.signOut')}
            </Button>
          </Flex>
        </div>

        {/* Cards section */}
        <Flex direction='col' gap='lg'>
          <Card>
            <CardHeader>
              <CardTitle>{t('account.language.title')}</CardTitle>
              <CardDescription>
                {t('account.language.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                name='language'
                value={i18n.language as string}
                onValueChange={changeLanguage}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select a language'>
                    {t(normalizeKey(`account.language.${i18n.language}`))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position='item-aligned'>
                  <SelectGroup>
                    <SelectItem value='fr'>
                      {t('account.language.fr')}
                    </SelectItem>
                    <SelectItem value='en'>
                      {t('account.language.en')}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('account.theme.title')}</CardTitle>
              <CardDescription>
                {t('account.theme.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                name='theme'
                value={theme}
                onValueChange={(value) =>
                  setTheme(value as 'light' | 'dark' | 'system')
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select a theme'>
                    {t(normalizeKey(`account.theme.${theme}`))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='light'>
                      {t('account.theme.light')}
                    </SelectItem>
                    <SelectItem value='dark'>
                      {t('account.theme.dark')}
                    </SelectItem>
                    <SelectItem value='system'>
                      {t('account.theme.system')}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className='border-destructive/50'>
            <CardHeader>
              <CardTitle>{t('account.deleteAccount.title')}</CardTitle>
              <CardDescription>
                {t('account.deleteAccount.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfirmButton
                variant='destructive'
                modalProps={{
                  description: t('account.deleteAccount.description'),
                  confirmLabel: t('account.deleteAccount.confirmLabel'),
                  destructive: true,
                }}
                onConfirm={async () => {
                  await fetcher.submit(null, { method: 'DELETE' });
                }}
              >
                {t('account.deleteAccount.title')}
              </ConfirmButton>
            </CardContent>
          </Card>
        </Flex>
      </div>
    </div>
  );
}
