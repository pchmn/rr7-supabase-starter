import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import invariant from 'tiny-invariant';
import type { Database } from '../types/database-generated.types';

/**
 * Creates a supabase client for server side. It needs SESSION_SECRET, SUPABASE_URL & SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) to be defined.
 * @param request request
 * @param options options
 * @returns supabase client
 */
export function createSupabaseServerClient<T = Database>(
  request: Request,
  options?: { admin?: boolean },
) {
  const { admin } = options || {};
  const supabaseKey = admin
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_ANON_KEY;
  invariant(
    process.env.SUPABASE_URL && supabaseKey,
    'SUPABASE_URL & SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be defined',
  );

  const headers = new Headers();

  return {
    headers,
    supabase: createServerClient<T>(process.env.SUPABASE_URL, supabaseKey, {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.APP_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        domain: process.env.DOMAIN,
      },
      auth: {
        autoRefreshToken: !admin,
        persistSession: !admin,
        detectSessionInUrl: !admin,
      },
    }),
  };
}
