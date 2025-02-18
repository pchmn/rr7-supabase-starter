import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    reactRouter(),
    reactRouterHonoServer(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.APP_VERSION || '0.0.1'),
    __APP_VERSION_DATE__: JSON.stringify(
      process.env.APP_VERSION_DATE || new Date().toISOString(),
    ),
  },
  server: {
    port: Number.parseInt(process.env.PORT || '5171'),
  },
});
