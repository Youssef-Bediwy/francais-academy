import { BadgeCriteria, type Badge } from '@prisma/client';
import { gamificationRepository } from '@/repositories/gamification.repository';
import { userRepository } from '@/repositories/user.repository';
import { progressRepository } from '@/repositories/progress.repository';
import { statsRepository } from '@/repositories/stats.repository';
import type { AchievementDto } from '@/types/progress';

interface Metrics {
  xp: number;
  streak: number;
  lessons: number;
  courses: number;
  exercises: number;
  reviews: number;
  perfect: number;
}

const metricFor = (badge: Badge, metrics: Metrics): number => {
  switch (badge.criteria) {
    case BadgeCriteria.XP_TOTAL:
      return metrics.xp;
    case BadgeCriteria.STREAK_DAYS:
      return metrics.streak;
    case BadgeCriteria.LESSONS_COMPLETED:
      return metrics.lessons;
    case BadgeCriteria.COURSES_COMPLETED:
      return metrics.courses;
    case BadgeCriteria.EXERCISES_PASSED:
      return metrics.exercises;
    case BadgeCriteria.FLASHCARDS_REVIEWED:
      return metrics.reviews;
    case BadgeCriteria.PERFECT_SCORES:
      return metrics.perfect;
    default:
      return 0;
  }
};

async function collectMetrics(userId: string): Promise<Metrics> {
  const [user, stats, lessons, courses, exercises] = await Promise.all([
    userRepository.findById(userId),
    gamificationRepository.statistics(userId),
    progressRepository.countCompletedLessons(userId),
    progressRepository.countCompletedCourses(userId),
    statsRepository.countPassedExercises(userId),
  ]);

  return {
    xp: user?.xp ?? 0,
    streak: user?.streakLongest ?? 0,
    lessons,
    courses,
    exercises,
    reviews: stats?.flashcardsReviewed ?? 0,
    perfect: stats?.perfectScores ?? 0,
  };
}

export const gamificationService = {
  /** Debloque les badges dont le seuil est atteint et retourne ceux gagnes a l'instant. */
  async evaluate(userId: string): Promise<Badge[]> {
    const [badges, achievements, metrics] = await Promise.all([
      gamificationRepository.allBadges(),
      gamificationRepository.achievementsForUser(userId),
      collectMetrics(userId),
    ]);

    const unlockedIds = new Set(achievements.map((a) => a.badgeId));
    const freshlyUnlocked: Badge[] = [];

    for (const badge of badges) {
      const value = metricFor(badge, metrics);
      if (value >= badge.threshold && !unlockedIds.has(badge.id)) {
        await gamificationRepository.unlockBadge(userId, badge.id, value);
        await userRepository.addXp(userId, badge.xpReward);
        freshlyUnlocked.push(badge);
      }
    }

    return freshlyUnlocked;
  },

  async listAchievements(userId: string): Promise<AchievementDto[]> {
    const [badges, achievements, metrics] = await Promise.all([
      gamificationRepository.allBadges(),
      gamificationRepository.achievementsForUser(userId),
      collectMetrics(userId),
    ]);
    const byBadge = new Map(achievements.map((a) => [a.badgeId, a]));

    return badges.map((badge) => {
      const achievement = byBadge.get(badge.id);
      return {
        id: badge.id,
        code: badge.code,
        nameFr: badge.nameFr,
        nameAr: badge.nameAr,
        descriptionFr: badge.descriptionFr,
        descriptionAr: badge.descriptionAr,
        icon: badge.icon,
        tier: badge.tier,
        threshold: badge.threshold,
        progress: Math.min(badge.threshold, metricFor(badge, metrics)),
        unlocked: Boolean(achievement),
        unlockedAt: achievement?.unlockedAt ?? null,
      };
    });
  },

  leaderboard(take = 10) {
    return userRepository.leaderboard(take);
  },
};
