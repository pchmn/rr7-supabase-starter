import type { Database } from '@rr7-supabase-starter/supabase/types';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createHonoServer } from 'react-router-hono-server/node';
import { loadEnv } from '~/lib/env/env.server';
import { supabaseMiddleware } from './middlewares/supabase.middleware';

declare module 'react-router' {
  interface AppLoadContext {
    readonly appEnv: string;
    readonly env: typeof env;
    readonly currentUser: User;
    readonly supabase: SupabaseClient<Database>;
  }
}

const env = loadEnv();

export default await createHonoServer({
  async getLoadContext(c, { mode }) {
    return {
      appEnv: mode,
      env,
      currentUser: c.get('currentUser'),
      supabase: c.get('supabase'),
    };
  },
  configure: (app) => {
    app.use('*', supabaseMiddleware());
  },
});
