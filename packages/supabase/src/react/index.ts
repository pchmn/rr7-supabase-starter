import { createBrowserClient, isBrowser } from '@supabase/ssr';

declare global {
  interface Window {
    env: { [key: string]: string };
  }
}

let supabase: ReturnType<typeof createBrowserClient>;
function createSupabaseBrowserClient<T>(
  supabaseUrl?: string,
  supabaseAnonKey?: string,
) {
  if (isBrowser() && !supabase) {
    const url = supabaseUrl ?? window.env.SUPABASE_URL;
    const anonKey = supabaseAnonKey ?? window.env.SUPABASE_ANON_KEY;
    supabase = createBrowserClient<T>(url ?? '', anonKey ?? '');
  }
  return supabase as ReturnType<typeof createBrowserClient<T>>;
}

/**
 * Hooks to get supabase client
 * @param url supabase url (default to window.env.SUPABASE_URL)
 * @param anonKey supabase anon key (default to window.env.SUPABASE_ANON_KEY)
 * @returns supabase client
 */
export function useSupabase<T>(supabaseUrl?: string, supabaseAnonKey?: string) {
  return createSupabaseBrowserClient<T>(supabaseUrl, supabaseAnonKey);
}
