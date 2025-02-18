import { useTheme } from '@rr7-supabase-starter/ssr-theme';
import { Button } from '@rr7-supabase-starter/ui/button';
import type { Route } from './+types/_index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [theme, setTheme] = useTheme();

  return (
    <div>
      <Button
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        Click me
      </Button>
    </div>
  );
}
