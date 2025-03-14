import { verifyOauthCode } from '@rr7-supabase-starter/supabase/auth.server';
import { redirect } from 'react-router';
import { redirectWithToast } from '~/lib/toast/toast.server';
import type { Route } from './+types/oauth.callback';

export async function loader({ request }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const { error, headers } = await verifyOauthCode(request, code);
    if (!error) {
      return redirect(next, { headers });
    }
  }

  return redirectWithToast('/sign-in', {
    type: 'error',
    message: 'common.oops',
    description: 'auth.signIn.oauthError',
  });
}
