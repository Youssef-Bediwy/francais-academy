import { z } from 'zod';
import { localeSchema } from './common.schema';

export const passwordSchema = z
  .string()
  .min(8, 'Au moins 8 caracteres')
  .regex(/[A-Za-z]/, 'Doit contenir une lettre')
  .regex(/[0-9]/, 'Doit contenir un chiffre');

export const registerSchema = z.object({
  name: z.string().min(2, 'Nom trop court').max(80),
  email: z.string().email('Email invalide').toLowerCase(),
  password: passwordSchema,
  locale: localeSchema.default('fr'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
