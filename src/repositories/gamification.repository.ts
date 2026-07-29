import { prisma } from '@/lib/prisma';
import { startOfDayUtc } from '@/utils/date';

type BadgeCreateData = Parameters<
  typeof prisma.badge.create
>[0]['data'];

type StatisticsUpdateData = Parameters<
  typeof prisma.userStatistics.update
>[0]['data'];

type StatisticsUpsertCreateData = Parameters<
  typeof prisma.userStatistics.upsert
>[0]['create'];

type StatisticsUpsertUpdateData = Parameters<
  typeof prisma.userStatistics.upsert
>[0]['update'];

type DailyGoalCreateData = Parameters<
  typeof prisma.dailyGoal.upsert
>[0]['create'];

type DailyGoalUpdateData = Parameters<
  typeof prisma.dailyGoal.upsert
>[0]['update'];

export const gamificationRepository = {
  allBadges() {
    return prisma.badge.findMany({
      orderBy: [
        { criteria: 'asc' },
        { threshold: 'asc' },
      ],
    });
  },

  achievementsForUser(userId: string) {
    return prisma.achievement.findMany({
      where: { userId },
      include: { badge: true },
    });
  },

  unlockBadge(
    userId: string,
    badgeId: string,
    progress: number,
  ) {
    return prisma.achievement.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId,
        },
      },
      create: {
        userId,
        badgeId,
        progress,
      },
      update: {
        progress,
      },
    });
  },

  countBadges() {
    return prisma.badge.count();
  },

  createBadge(data: BadgeCreateData) {
    return prisma.badge.create({
      data,
    });
  },

  statistics(userId: string) {
    return prisma.userStatistics.findUnique({
      where: { userId },
    });
  },

  upsertStatistics(
    userId: string,
    data: StatisticsUpdateData,
  ) {
    const {
      userId: _ignoredUserId,
      ...safeData
    } = data as StatisticsUpdateData & {
      userId?: string;
    };

    const createData = {
      userId,
      ...safeData,
    } as StatisticsUpsertCreateData;

    const updateData = safeData as StatisticsUpsertUpdateData;

    return prisma.userStatistics.upsert({
      where: { userId },
      create: createData,
      update: updateData,
    });
  },

  goalForDate(
    userId: string,
    date: Date,
  ) {
    return prisma.dailyGoal.findUnique({
      where: {
        userId_date: {
          userId,
          date: startOfDayUtc(date),
        },
      },
    });
  },

  upsertGoal(
    userId: string,
    date: Date,
    create: DailyGoalCreateData,
    update: DailyGoalUpdateData,
  ) {
    return prisma.dailyGoal.upsert({
      where: {
        userId_date: {
          userId,
          date: startOfDayUtc(date),
        },
      },
      create,
      update,
    });
  },

  goalsRange(
    userId: string,
    from: Date,
    to: Date,
  ) {
    return prisma.dailyGoal.findMany({
      where: {
        userId,
        date: {
          gte: startOfDayUtc(from),
          lte: startOfDayUtc(to),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  },
};