import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { startOfDayUtc } from '@/utils/date';

export const gamificationRepository = {
  allBadges() {
    return prisma.badge.findMany({ orderBy: [{ criteria: 'asc' }, { threshold: 'asc' }] });
  },

  achievementsForUser(userId: string) {
    return prisma.achievement.findMany({ where: { userId }, include: { badge: true } });
  },

  unlockBadge(userId: string, badgeId: string, progress: number) {
    return prisma.achievement.upsert({
      where: { userId_badgeId: { userId, badgeId } },
      create: { userId, badgeId, progress },
      update: { progress },
    });
  },

  countBadges() {
    return prisma.badge.count();
  },

  createBadge(data: Prisma.BadgeCreateInput) {
    return prisma.badge.create({ data });
  },

  statistics(userId: string) {
    return prisma.userStatistics.findUnique({ where: { userId } });
  },

  upsertStatistics(userId: string, data: Prisma.UserStatisticsUncheckedUpdateInput) {
    return prisma.userStatistics.upsert({
      where: { userId },
      create: { userId, ...(data as Prisma.UserStatisticsUncheckedCreateInput) },
      update: data,
    });
  },

  goalForDate(userId: string, date: Date) {
    return prisma.dailyGoal.findUnique({
      where: { userId_date: { userId, date: startOfDayUtc(date) } },
    });
  },

  upsertGoal(
    userId: string,
    date: Date,
    create: Prisma.DailyGoalUncheckedCreateInput,
    update: Prisma.DailyGoalUncheckedUpdateInput,
  ) {
    return prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date: startOfDayUtc(date) } },
      create,
      update,
    });
  },

  goalsRange(userId: string, from: Date, to: Date) {
    return prisma.dailyGoal.findMany({
      where: { userId, date: { gte: startOfDayUtc(from), lte: startOfDayUtc(to) } },
      orderBy: { date: 'asc' },
    });
  },
};
