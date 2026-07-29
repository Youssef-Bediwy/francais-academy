import { prisma } from '@/lib/prisma';
import { startOfDayUtc } from '@/utils/date';

export const statsRepository = {
  async accuracyFor(userId: string): Promise<number> {
    const aggregate = await prisma.exerciseResult.aggregate({
      where: { userId },
      _sum: { correctCount: true, totalCount: true },
    });
    const total = aggregate._sum.totalCount ?? 0;
    if (total === 0) return 0;
    return Math.round(((aggregate._sum.correctCount ?? 0) / total) * 100);
  },

  countPassedExercises(userId: string) {
    return prisma.exerciseResult.count({ where: { userId, passed: true } });
  },

  countReviews(userId: string) {
    return prisma.revisionSession.aggregate({ where: { userId }, _sum: { reviewCount: true } });
  },

  async platformTotals() {
    const [users, courses, lessons, exercises, words, flashcards, badges] = await prisma.$transaction([
      prisma.user.count(),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.exercise.count(),
      prisma.vocabulary.count(),
      prisma.flashcard.count(),
      prisma.badge.count(),
    ]);
    return { users, courses, lessons, exercises, words, flashcards, badges };
  },

  async adminOverview() {
    const since = startOfDayUtc(new Date(Date.now() - 29 * 86_400_000));
    const [totals, activeUsers, results, completions] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { lastActiveOn: { gte: since } } }),
      prisma.exerciseResult.count({ where: { createdAt: { gte: since } } }),
      prisma.progress.count({ where: { status: 'COMPLETED', completedAt: { gte: since } } }),
    ]);
    return { totals, activeUsers, results, completions };
  },

  signupsByDay(days = 30) {
    const from = startOfDayUtc(new Date(Date.now() - (days - 1) * 86_400_000));
    return prisma.user.findMany({
      where: { createdAt: { gte: from } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  levelDistribution() {
    return prisma.course.groupBy({ by: ['level'], _count: { _all: true } });
  },
};
