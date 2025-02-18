import { useRouteLoaderData } from 'react-router';
import type { loader } from '~/root';

export function useCurrentUser() {
  const data = useRouteLoaderData<typeof loader>('root');

  if (!data?.currentUser) {
    throw new Error('No current user');
  }

  return data.currentUser;
}
