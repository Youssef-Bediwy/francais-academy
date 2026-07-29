import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from './errors';
import { failure } from './response';
import { logger } from '../logger';
import { getSession, type SessionUser } from '../auth';
import { ForbiddenError, UnauthorizedError, ValidationError } from './errors';

export type RouteContext<P = Record<string, string>> = { params: P };
export type Handler<P> = (req: NextRequest, ctx: RouteContext<P>) => Promise<Response>;
export type AuthedHandler<P> = (
  req: NextRequest,
  ctx: RouteContext<P> & { user: SessionUser },
) => Promise<Response>;

/** Traduit toute exception en reponse HTTP normalisee. */
export function withErrorHandling<P>(handler: Handler<P>): Handler<P> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof AppError) {
        return failure(error.status, error.code, error.message, error.details);
      }
      if (error instanceof ZodError) {
        return failure(422, 'VALIDATION_ERROR', 'Donnees invalides', error.flatten());
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return failure(409, 'CONFLICT', 'Cette ressource existe deja');
        }
        if (error.code === 'P2025') {
          return failure(404, 'NOT_FOUND', 'Ressource introuvable');
        }
      }
      logger.error('Erreur non geree dans un route handler', {
        url: req.url,
        message: error instanceof Error ? error.message : String(error),
      });
      return failure(500, 'INTERNAL_ERROR', 'Une erreur interne est survenue');
    }
  };
}

/** Exige une session valide. */
export function withAuth<P>(handler: AuthedHandler<P>): Handler<P> {
  return withErrorHandling<P>(async (req, ctx) => {
    const user = await getSession();
    if (!user) throw new UnauthorizedError();
    return handler(req, { ...ctx, user });
  });
}

/** Exige une session avec le role ADMIN. */
export function withAdmin<P>(handler: AuthedHandler<P>): Handler<P> {
  return withErrorHandling<P>(async (req, ctx) => {
    const user = await getSession();
    if (!user) throw new UnauthorizedError();
    if (user.role !== 'ADMIN') throw new ForbiddenError('Reserve aux administrateurs');
    return handler(req, { ...ctx, user });
  });
}

export async function parseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ValidationError({ body: ['Corps JSON invalide'] });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new ValidationError(parsed.error.flatten());
  return parsed.data;
}

export function parseQuery<T>(req: NextRequest, schema: ZodSchema<T>): T {
  const entries = Object.fromEntries(new URL(req.url).searchParams.entries());
  const parsed = schema.safeParse(entries);
  if (!parsed.success) throw new ValidationError(parsed.error.flatten());
  return parsed.data;
}
