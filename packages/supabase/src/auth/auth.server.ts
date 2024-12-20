import {
  AuthError,
  type SupabaseClient,
  type User,
  type UserAttributes,
} from '@supabase/supabase-js';
import { createSupabaseServerClient } from '../client/client.server';

export type SerializedUser = Omit<User, 'factors'>;

export function serializeUser(user: User | null) {
  if (!user) {
    return null;
  }
  return {
    ...user,
    factors: undefined,
  } as SerializedUser;
}

export function serializeAuthError(error: AuthError | null) {
  if (!error) {
    return null;
  }
  return {
    name: error.name,
    message: error.message,
    code: error.code as string,
    status: error.status,
    stack: error.stack,
  };
}

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user: serializeUser(user),
    error: serializeAuthError(error),
  };
}

export async function updateCurrentUser(attributes: UserAttributes) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser(attributes);

  return { user: serializeUser(user), error: serializeAuthError(error) };
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

  return { error: serializeAuthError(error) };
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

    return {
      properties,
      user: serializeUser(user),
      error: serializeAuthError(error),
    };
  } catch (unexpectedError) {
    return {
      properties: null,
      user: null,
      error: serializeAuthError(
        new AuthError(
          unexpectedError.message ?? 'Unknown error',
          500,
          'unknown_error',
        ),
      ),
    };
  }
}

export async function signOut() {
  const supabase = createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signOut();

    return { error: serializeAuthError(error) };
  } catch (unexpectedError) {
    return {
      error: serializeAuthError(
        new AuthError(
          unexpectedError.message ?? 'Unknown error',
          500,
          'unknown_error',
        ),
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

    return { user: serializeUser(user), error: serializeAuthError(error) };
  } catch (unexpectedError) {
    return {
      user: null,
      error: serializeAuthError(
        new AuthError(
          unexpectedError.message ?? 'Unknown error',
          500,
          'unknown_error',
        ),
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

    return { user: serializeUser(user), error: serializeAuthError(error) };
  } catch (unexpectedError) {
    return {
      user: null,
      error: serializeAuthError(
        new AuthError(
          unexpectedError.message ?? 'Unknown error',
          500,
          'unknown_error',
        ),
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

    return { user: serializeUser(user), error: serializeAuthError(error) };
  } catch (unexpectedError) {
    return {
      user: null,
      error: serializeAuthError(
        new AuthError(
          unexpectedError.message ?? 'Unknown error',
          500,
          'unknown_error',
        ),
      ),
    };
  }
}
