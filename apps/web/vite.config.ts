import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [reactRouter(), reactRouterHonoServer(), tsconfigPaths()],
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
