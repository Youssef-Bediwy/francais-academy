import { Locale } from '@prisma/client';
import { ConflictError, UnauthorizedError } from '@/lib/api/errors';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSession, destroySession, type SessionUser } from '@/lib/auth';
import { userRepository } from '@/repositories/user.repository';
import { gamificationRepository } from '@/repositories/gamification.repository';
import type { LoginInput, RegisterInput } from '@/lib/validation/auth.schema';

export const authService = {
  async register(input: RegisterInput): Promise<SessionUser> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Un compte existe deja avec cet email');

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      locale: input.locale === 'ar' ? Locale.AR : Locale.FR,
    });
    await gamificationRepository.upsertStatistics(user.id, {});

    const session: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    await createSession(session);
    return session;
  },

  async login(input: LoginInput): Promise<SessionUser> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) throw new UnauthorizedError('Email ou mot de passe incorrect');

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Email ou mot de passe incorrect');

    const session: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    await createSession(session);
    return session;
  },

  logout(): void {
    destroySession();
  },
};
