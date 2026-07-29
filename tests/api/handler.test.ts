import { describe, expect, it, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import type { NextRequest } from 'next/server';
import {
  ForbiddenError,
  NotFoundError,
  parseBody,
  parseQuery,
  withAdmin,
  withAuth,
  withErrorHandling,
} from '@/lib/api';
import { buildMeta, ok } from '@/lib/api/response';

const getSession = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth', () => ({ getSession }));

const request = (url = 'http://localhost/api/test', init?: RequestInit) =>
  new Request(url, init) as unknown as NextRequest;

beforeEach(() => {
  getSession.mockReset();
});

describe('withErrorHandling', () => {
  it('renvoie la reponse quand tout va bien', async () => {
    const handler = withErrorHandling(async () => ok({ hello: 'monde' }));
    const response = await handler(request(), { params: {} });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, data: { hello: 'monde' } });
  });

  it('traduit une AppError en code HTTP', async () => {
    const handler = withErrorHandling(async () => {
      throw new NotFoundError('Cours');
    });
    const response = await handler(request(), { params: {} });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({ success: false, error: { code: 'NOT_FOUND' } });
  });

  it('masque les erreurs inattendues derriere un 500', async () => {
    const handler = withErrorHandling(async () => {
      throw new Error('fuite de detail interne');
    });
    const response = await handler(request(), { params: {} });
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain('fuite de detail interne');
  });
});

describe('withAuth et withAdmin', () => {
  it('refuse un visiteur anonyme', async () => {
    getSession.mockResolvedValue(null);
    const handler = withAuth(async () => ok({}));
    const response = await handler(request(), { params: {} });
    expect(response.status).toBe(401);
  });

  it('transmet l utilisateur au handler', async () => {
    getSession.mockResolvedValue({ id: 'u1', email: 'a@b.c', name: 'Karim', role: 'USER' });
    const handler = withAuth(async (_req, { user }) => ok({ id: user.id }));
    const response = await handler(request(), { params: {} });
    await expect(response.json()).resolves.toEqual({ success: true, data: { id: 'u1' } });
  });

  it('interdit l espace admin a un simple utilisateur', async () => {
    getSession.mockResolvedValue({ id: 'u1', email: 'a@b.c', name: 'Karim', role: 'USER' });
    const handler = withAdmin(async () => ok({}));
    const response = await handler(request(), { params: {} });
    expect(response.status).toBe(403);
    expect(new ForbiddenError().status).toBe(403);
  });

  it('autorise un administrateur', async () => {
    getSession.mockResolvedValue({ id: 'u2', email: 'admin@b.c', name: 'Amina', role: 'ADMIN' });
    const handler = withAdmin(async () => ok({ granted: true }));
    const response = await handler(request(), { params: {} });
    expect(response.status).toBe(200);
  });
});

describe('validation des entrees', () => {
  const schema = z.object({ email: z.string().email(), age: z.coerce.number().int().min(1) });

  it('rejette un corps invalide avec un 422', async () => {
    const handler = withErrorHandling(async (req) => {
      const body = await parseBody(req, schema);
      return ok(body);
    });
    const response = await handler(
      request('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'pas-un-email', age: 0 }),
      }),
      { params: {} },
    );
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('accepte un corps valide', async () => {
    const handler = withErrorHandling(async (req) => ok(await parseBody(req, schema)));
    const response = await handler(
      request('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'karim@example.com', age: '31' }),
      }),
      { params: {} },
    );
    const body = await response.json();
    expect(body.data).toEqual({ email: 'karim@example.com', age: 31 });
  });

  it('lit et valide les parametres de requete', async () => {
    const querySchema = z.object({ page: z.coerce.number().default(1) });
    const handler = withErrorHandling(async (req) => ok(parseQuery(req, querySchema)));
    const response = await handler(request('http://localhost/api/test?page=3'), { params: {} });
    const body = await response.json();
    expect(body.data).toEqual({ page: 3 });
  });
});

describe('buildMeta', () => {
  it('calcule le nombre de pages', () => {
    expect(buildMeta(2, 12, 30)).toEqual({ page: 2, perPage: 12, total: 30, totalPages: 3 });
    expect(buildMeta(1, 12, 0).totalPages).toBe(1);
  });
});
