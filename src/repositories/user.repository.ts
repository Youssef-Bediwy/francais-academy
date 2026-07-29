import { Prisma, type Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { toSkipTake } from './base.repository';
import type { ListParams } from './interfaces';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, include: { statistics: true } });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  addXp(id: string, xp: number) {
    return prisma.user.update({ where: { id }, data: { xp: { increment: xp } } });
  },

  setStreak(id: string, current: number, longest: number, lastActiveOn: Date) {
    return prisma.user.update({
      where: { id },
      data: { streakCurrent: current, streakLongest: longest, lastActiveOn },
    });
  },

  async findMany(params: ListParams & { search?: string | undefined; role?: Role | undefined }) {
    const where: Prisma.UserWhereInput = {
      ...(params.role ? { role: params.role } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: { statistics: true },
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(params),
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total };
  },

  leaderboard(take = 10) {
    return prisma.user.findMany({
      select: { id: true, name: true, avatarUrl: true, xp: true, streakCurrent: true },
      orderBy: { xp: 'desc' },
      take,
    });
  },

  countAll() {
    return prisma.user.count();
  },
};
