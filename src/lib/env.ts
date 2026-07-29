import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL est requis'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET doit faire au moins 32 caracteres'),
  AUTH_COOKIE_NAME: z.string().default('fa_session'),
  AUTH_SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

/** Valide les variables d'environnement une seule fois, cote serveur uniquement. */
export function getEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Configuration invalide :\n${details}`);
  }
  cached = parsed.data;
  return cached;
}

export const isProduction = () => process.env.NODE_ENV === 'production';
