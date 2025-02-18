import { Button } from '@rr7-supabase-starter/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@rr7-supabase-starter/ui/dropdown-menu';
import { Flex } from '@rr7-supabase-starter/ui/flex';
import { cn } from '@rr7-supabase-starter/ui/utils';
import {
  CheckIcon,
  LanguagesIcon,
  LogInIcon,
  LogOutIcon,
  PaletteIcon,
  UserRoundIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useFetcher } from 'react-router';
import { useTheme } from '~/lib/theme/useTheme';
import { useSignOut } from '~/modules/auth/useSignOut';
import type { Route } from './+types/_layout';

export async function loader({ context }: Route.LoaderArgs) {
  const currentUser = context.currentUser;

  return {
    currentUser,
  };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  // console.log('loaderData', loaderData);
  const { signOut } = useSignOut();

  const { t } = useTranslation();

  return (
    <Flex direction='col' className='h-full w-full m-auto pb-8'>
      <Flex
        direction='row'
        justify='between'
        align='center'
        className='sm:px-8 px-4 sm:py-6 py-4'
      >
        <Link to='/'>
          <Flex align='center'>
            <img
              src='/images/logo.png'
              alt='rr7-supabase-starter-logo'
              className='h-[30px] w-[30px]'
            />
            <span className='ml-2 font-["Work Sans"] text-[16px] font-bold text-foreground'>
              rr7-supabase-starter
            </span>
          </Flex>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='rounded-full h-8 w-8 p-0'>
              <Flex
                className='h-full w-full rounded-full overflow-hidden bg-accent/50'
                align='center'
                justify='center'
              >
                {loaderData.currentUser.user_metadata.avatar_url ? (
                  <img
                    src={loaderData.currentUser.user_metadata.avatar_url}
                    alt='user-avatar'
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <UserRoundIcon className='h-6 w-6' />
                )}
              </Flex>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {loaderData.currentUser.email && (
              <>
                <DropdownMenuLabel>
                  {loaderData.currentUser.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to='/account'>
                  <DropdownMenuItem className='cursor-pointer'>
                    <UserRoundIcon className='mr-1.5 h-4 w-4 opacity-50' />
                    <span>{t('header.account')}</span>
                  </DropdownMenuItem>
                </Link>
              </>
            )}

            <ThemeDropdown />
            <LanguageDropdown />
            <DropdownMenuSeparator />
            {!loaderData.currentUser.is_anonymous ? (
              <DropdownMenuItem onClick={signOut} className='cursor-pointer'>
                <LogOutIcon className='mr-1.5 h-4 w-4 opacity-50' />
                <span>{t('header.signOut')}</span>
              </DropdownMenuItem>
            ) : (
              <Link to='/sign-in'>
                <DropdownMenuItem className='cursor-pointer'>
                  <LogInIcon className='mr-1.5 h-4 w-4 opacity-50' />
                  <span>{t('header.signIn')}</span>
                </DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      <Flex className='pb-8 pt-4 sm:px-8 px-4'>
        <Outlet />
      </Flex>
    </Flex>
  );
}

function ThemeDropdown() {
  const [theme, setTheme] = useTheme();

  const { t } = useTranslation();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <PaletteIcon className='mr-1.5 h-4 w-4 opacity-50' />{' '}
        {t('header.theme.title')}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className='justify-between'
          >
            <span className={cn(theme === 'light' ? 'font-bold' : '')}>
              {t('header.theme.light')}
            </span>
            {theme === 'light' && <CheckIcon className='h-3 w-3' />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className='justify-between'
          >
            <span className={cn(theme === 'dark' ? 'font-bold' : '')}>
              {t('header.theme.dark')}
            </span>
            {theme === 'dark' && <CheckIcon className='h-3 w-3' />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className='justify-between'
          >
            <span className={cn(theme === 'system' ? 'font-bold' : '')}>
              {t('header.theme.system')}
            </span>
            {theme === 'system' && <CheckIcon className='h-3 w-3' />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

function LanguageDropdown() {
  const fetcher = useFetcher();

  const { i18n, t } = useTranslation();

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    fetcher.submit(
      { locale },
      { method: 'post', action: '/preferences/set-locale' },
    );
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <LanguagesIcon className='mr-1.5 h-4 w-4 opacity-50' />{' '}
        {t('header.language.title')}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            onClick={() => changeLanguage('en')}
            className='justify-between'
          >
            <span className={cn(i18n.language === 'en' ? 'font-bold' : '')}>
              English
            </span>
            {i18n.language === 'en' && <CheckIcon className='h-3 w-3' />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeLanguage('fr')}
            className='justify-between'
          >
            <span className={cn(i18n.language === 'fr' ? 'font-bold' : '')}>
              Français
            </span>
            {i18n.language === 'fr' && <CheckIcon className='h-3 w-3' />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
