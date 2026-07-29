import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@prisma/client';
import { getEnv } from './env';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const ISSUER = 'francais-academy';

const secret = () => new TextEncoder().encode(getEnv().AUTH_SECRET);

export async function signSessionToken(user: SessionUser): Promise<string> {
  const ttl = getEnv().AUTH_SESSION_TTL_DAYS;
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${ttl}d`)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: (payload.role === 'ADMIN' ? 'ADMIN' : 'USER') as Role,
    };
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser): Promise<void> {
  const env = getEnv();
  const token = await signSessionToken(user);
  cookies().set(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: env.AUTH_SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export function destroySession(): void {
  cookies().delete(getEnv().AUTH_COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(getEnv().AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
