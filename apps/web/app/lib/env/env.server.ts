import { z } from 'zod';

const envSchema = z.object({
  client: z.object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SITE_URL: z.string().url(),
    APP_ENV: z
      .enum(['development', 'preview', 'production'])
      .default('development'),
  }),
  // /!\ Server only env variables => do not leak to the client
  server: z.object({
    SUPABASE_SERVICE_ROLE_KEY: z.string().trim(),
    SESSION_SECRET: z.string().trim(),
    SMTP_HOST: z.string().trim().optional(),
    SMTP_PORT: z.string().trim().optional(),
    SMTP_USER: z.string().trim().optional(),
    SMTP_PASSWORD: z.string().trim().optional(),
    AWS_ACCESS_KEY_ID: z.string().trim().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().trim().optional(),
  }),
});
// .refine(
//   (data) => {
//     if (data.client.APP_ENV === 'development') return true;
//     return (
//       !!data.server.AWS_ACCESS_KEY_ID && !!data.server.AWS_SECRET_ACCESS_KEY
//     );
//   },
//   {
//     message:
//       'AWS credentials are required for preview and production environments',
//     path: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
//   },
// );

const createEnv = () => {
  return envSchema.parse({
    client: process.env,
    server: process.env,
  });
};

/**
 * @description Use this to access env (client and server) variables. /!\ Do not leak SERVER env to the client
 */
export function loadEnv() {
  return createEnv();
}

/**
 * @description /!\ Server ONLY env variables => do not leak it to the client
 */
export function loadServerEnv() {
  const env = loadEnv();

  return {
    ...env.server,
    ...env.client,
  };
}

/**
 * @description Use this to pass env variables to the client
 */
export function loadClientEnv() {
  return loadEnv().client;
}
