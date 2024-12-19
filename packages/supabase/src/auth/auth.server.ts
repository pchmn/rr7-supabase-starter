import {
  AuthError,
  type SupabaseClient,
  type User,
  type UserAttributes,
} from '@supabase/supabase-js';
import { createSupabaseServerClient } from '../client/client.server';

export async function getUser() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
}

export async function updateCurrentUser(attributes: UserAttributes) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser(attributes);

  return { user, error };
}

export async function deleteCurrentUser() {
  const supabase = createSupabaseServerClient({ admin: true });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return {
      error: new AuthError('User not found', 404, 'user_not_found'),
    };
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  return { error };
}

export async function generateMagicLink(email: string) {
  const supabase = createSupabaseServerClient({ admin: true });

  try {
    const {
      data: { properties, user },
      error,
    } = await supabase.auth.admin.generateLink({
      email,
      type: 'magiclink',
    });

    return { properties, user, error };
  } catch (unexpectedError) {
    return {
      properties: null,
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
    };
  }
}

export async function signOut() {
  const supabase = createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signOut();

    return { error };
  } catch (unexpectedError) {
    return {
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
    };
  }
}

export async function verifyEmailOtp(
  params: { otp: string; email: string },
  callback?: {
    onSuccess?: (
      suapabase: SupabaseClient,
      user: User | null,
    ) => void | Promise<void>;
  },
) {
  const supabase = createSupabaseServerClient();

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

    return { user, error };
  } catch (unexpectedError) {
    return {
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
    };
  }
}

export async function verifyEmailToken(
  tokenHash: string,
  callback?: {
    onSuccess?: (
      suapabase: SupabaseClient,
      user: User | null,
    ) => void | Promise<void>;
  },
) {
  const supabase = createSupabaseServerClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' });

    if (!error && callback?.onSuccess) {
      await callback.onSuccess(supabase, user);
    }

    return { user, error };
  } catch (unexpectedError) {
    return {
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
    };
  }
}

export async function verifyOauthCode(
  code: string,
  callback?: {
    onSuccess?: (
      suapabase: SupabaseClient,
      user: User | null,
    ) => void | Promise<void>;
  },
) {
  const supabase = createSupabaseServerClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && callback?.onSuccess) {
      await callback.onSuccess(supabase, user);
    }

    return { user, error };
  } catch (unexpectedError) {
    return {
      user: null,
      error: new AuthError(
        unexpectedError.message ?? 'Unknown error',
        500,
        'unknown_error',
      ),
    };
  }
}
