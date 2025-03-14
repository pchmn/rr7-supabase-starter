import { useSupabase } from '@rr7-supabase-starter/supabase/react';
import { Button } from '@rr7-supabase-starter/ui/button';
import { Flex } from '@rr7-supabase-starter/ui/flex';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { remixI18next } from '~/i18n/i18n.server';
import { toast } from '~/lib/toast/toast.client';
import { redirectWithToast } from '~/lib/toast/toast.server';
import type { Route } from './+types/sign-in';

export async function loader({ request, context }: Route.LoaderArgs) {
  if (!context.currentUser.is_anonymous) {
    return redirectWithToast('/', {
      type: 'info',
      message: 'auth.signIn.alreadySignedIn',
    });
  }

  const t = await remixI18next.getFixedT(request);

  return {
    meta: {
      title: t('auth.signIn.meta.title'),
      description: t('auth.signIn.meta.description'),
    },
  };
}

export function meta({ data: { meta } }: Route.MetaArgs) {
  return [
    { title: meta.title },
    { name: 'description', content: meta.description },
  ];
}

export default function SignIn() {
  const { t } = useTranslation();

  const supabase = useSupabase();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/oauth/callback` },
    });

    if (error) {
      toast.error(t('common.oops'), t('auth.signIn.oauthError'));
    }
  };

  return (
    <Flex direction='col' className='h-full max-w-[1300px] m-auto pb-8'>
      <Link to='/'>
        <Flex align='center' className='sm:px-8 px-4 sm:mt-6 mt-4 h-8'>
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
      <Flex justify='center' flex='1' className='mb-16 pt-16'>
        <Flex
          direction='col'
          className='mt-12 w-full sm:mt-[12vh] sm:max-w-[330px] px-8 sm:px-0'
        >
          <Flex direction='col' className='mb-10'>
            <span className='text-2xl font-semibold'>
              {t('auth.signIn.title')}
            </span>
            <span className='my-2 text-xl font-semibold text-foreground/50 leading-7'>
              {t('auth.signIn.subtitle')}
            </span>
          </Flex>
          <Button variant='outline' size='lg' onClick={signInWithGoogle}>
            <GoogleIcon />
            {t('auth.signIn.signInWithGoogle')}
          </Button>
          <div className='mt-14 mb-8 text-xs text-foreground/40 text-center'>
            {t('auth.signIn.acceptTermsAndConditions')}{' '}
            <Link to='/terms-and-conditions' className='text-foreground/60'>
              {t('auth.signIn.termsAndConditions')}
            </Link>{' '}
            {t('common.and')}{' '}
            <Link to='/privacy-policy' className='text-foreground/60'>
              {t('auth.signIn.privacyPolicy')}
            </Link>
            .
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}

type IconProps = React.HTMLAttributes<SVGElement>;
export function GoogleIcon(props: IconProps) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      <g
        xmlns='http://www.w3.org/2000/svg'
        transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'
      >
        <path
          fill='#4285F4'
          d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
        />
        <path
          fill='#34A853'
          d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
        />
        <path
          fill='#FBBC05'
          d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
        />
        <path
          fill='#EA4335'
          d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
        />
      </g>
    </svg>
  );
}
