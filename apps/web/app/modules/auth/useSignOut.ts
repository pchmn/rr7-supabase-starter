import { useFetcher } from 'react-router';

export function useSignOut() {
  const fetcher = useFetcher();

  const signOut = async () => {
    fetcher.submit({}, { method: 'post', action: '/sign-out' });
  };

  return { signOut };
}
