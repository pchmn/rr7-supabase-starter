import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';
import { parseCookies, setCookie } from 'vinxi/http';
import type { Database } from '../types/database-generated.types';

export function createSupabaseServerClient<T = Database>(options?: {
  admin?: boolean;
}) {
  const { admin } = options || {};
  const supabaseKey = admin
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_ANON_KEY;
  invariant(
    process.env.SUPABASE_URL && supabaseKey,
    'SUPABASE_URL & SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be defined',
  );

  if (admin) {
    return createClient<T>(process.env.SUPABASE_URL, supabaseKey);
  }

  return createServerClient<T>(process.env.SUPABASE_URL, supabaseKey, {
    cookies: {
      getAll() {
        return Object.entries(parseCookies()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookies) {
        cookies.forEach((cookie) => {
          setCookie(cookie.name, cookie.value);
        });
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
  });
}
