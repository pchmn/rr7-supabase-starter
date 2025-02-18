import type { Database } from '@rr7-supabase-starter/supabase/types';
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Context, MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient<Database>;
    currentUser: User;
  }
}

export const getSupabase = (c: Context) => {
  return c.get('supabase');
};

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export const supabaseMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const supabaseEnv = env<SupabaseEnv>(c);
    const supabaseUrl = supabaseEnv.SUPABASE_URL;
    const supabaseAnonKey = supabaseEnv.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials missing!');
    }

    const cookieHeaders: string[] = [];

    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(c.req.header('Cookie') ?? '');
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieHeaders.push(serializeCookieHeader(name, value, options)),
            );
          },
        },
      },
    );

    c.set('supabase', supabase);

    await signInAnonymouslyIfUnauthenticated(c);

    // Now proceed with the next middleware/handler
    await next();

    // Set all accumulated cookie headers before the response is sent
    cookieHeaders.forEach((header) => {
      c.header('Set-Cookie', header);
    });
  };
};

async function signInAnonymouslyIfUnauthenticated(c: Context) {
  const supabase = c.get('supabase');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) {
      console.error('Anonymous sign in failed:', error);
      throw error;
    }
    c.set('currentUser', data.user);
  } else {
    c.set('currentUser', user);
  }
}

export const refreshSessionMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const supabase = c.get('supabase');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || session.expires_in > 60) {
      return next();
    }

    await supabase.auth.refreshSession(session);

    await next();
  };
};
