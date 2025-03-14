import {
  AuthError,
  type SupabaseClient,
  type User,
  type UserAttributes,
} from '@supabase/supabase-js';
import { createSupabaseServerClient } from '../client/client.server';

type AuthCallback = {
  onSuccess?: (
    supabase: SupabaseClient,
    user: User | null,
  ) => void | Promise<void>;
};

function createAuthClient(ctx: Request | SupabaseClient) {
  let supabase: SupabaseClient;
  let headers: Headers | undefined;
  if (ctx instanceof Request) {
    const res = createSupabaseServerClient(ctx);
    supabase = res.supabase;
    headers = res.headers;
  } else {
    supabase = ctx;
  }
  return { supabase, headers };
}

export async function getCurrentUser(ctx: Request | SupabaseClient) {
  const { supabase, headers } = createAuthClient(ctx);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error, headers };
}

export async function updateCurrentUser(
  request: Request,
  attributes: UserAttributes,
) {
  const { supabase, headers } = createSupabaseServerClient(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser(attributes);

  return { user, error, headers };
}

export async function deleteCurrentUser(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request, {
    admin: true,
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return {
      error: new AuthError('User not found', 404, 'user_not_found'),
      headers,
    };
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  return { error, headers };
}

export async function sendMagicLinkEmail(request: Request, email: string) {
  const { supabase, headers } = createSupabaseServerClient(request);

  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  return { error, headers };
}

export async function signOut(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const { error } = await supabase.auth.signOut();

    return { error, headers };
  } catch (unexpectedError) {
    return {
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
      headers,
    };
  }
}

export async function verifyEmailOtp(
  request: Request,
  params: { otp: string; email: string },
  callback?: AuthCallback,
) {
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({
      email: params.email,
      token: params.otp,
      type: 'email',
    });

    if (!error && callback?.onSuccess) {
      await callback.onSuccess(supabase, user);
    }

    return { user, error, headers };
  } catch (unexpectedError) {
    return {
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
      headers,
    };
  }
}

export async function verifyEmailToken(
  request: Request,
  tokenHash: string,
  callback?: AuthCallback,
) {
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' });

    if (!error && callback?.onSuccess) {
      await callback.onSuccess(supabase, user);
    }

    return { user, error, headers };
  } catch (unexpectedError) {
    return {
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
      headers,
    };
  }
}

export async function verifyOauthCode(
  request: Request,
  code: string,
  callback?: AuthCallback,
) {
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && callback?.onSuccess) {
      await callback.onSuccess(supabase, user);
    }

    return { user, error, headers };
  } catch (unexpectedError) {
    return {
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
      headers,
    };
  }
}
