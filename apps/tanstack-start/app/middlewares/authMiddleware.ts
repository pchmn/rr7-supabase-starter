import { getCurrentUser } from '@monorepo-template/supabase/auth.server';
import { createMiddleware } from '@tanstack/start';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { user } = await getCurrentUser();
  // if (!user) {
  //   return redirect('/login');
  // }
  return next({
    context: {
      user,
    },
  });
});
