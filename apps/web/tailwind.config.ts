import baseConfig from '@rr7-supabase-starter/ui/tailwind.config';
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  presets: [baseConfig],
} satisfies Config;
