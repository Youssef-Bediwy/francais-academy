import { ProgressStatus } from '@prisma/client';
import { NotFoundError } from '@/lib/api/errors';
import { progressRepository } from '@/repositories/progress.repository';
import { lessonRepository } from '@/repositories/lesson.repository';
import { userRepository } from '@/repositories/user.repository';
import { gamificationRepository } from '@/repositories/gamification.repository';
import { statsRepository } from '@/repositories/stats.repository';
import { courseRepository } from '@/repositories/course.repository';
import { DEFAULT_DAILY_GOAL, XP_REWARD } from '@/constants/gamification';
import { levelFromXp } from '@/utils/level';
import { addDays, daysBetween, startOfDayUtc, toIsoDate } from '@/utils/date';
import { gamificationService } from './gamification.service';
import type { ActivityPoint, DailyGoalDto, ProgressOverview, RecentActivityItem } from '@/types/progress';

export interface AwardInput {
  xp: number;
  minutes?: number;
  lessons?: number;
  courses?: number;
  exercisesAttempted?: number;
  exercisesPassed?: number;
  perfect?: number;
  flashcards?: number;
  accuracySample?: { correct: number; total: number };
}

export const progressService = {
  /** Point d'entree unique de la gamification : XP, serie, objectif du jour, badges. */
  async award(userId: string, input: AwardInput) {
    const before = await userRepository.findById(userId);
    if (!before) throw new NotFoundError('Utilisateur');

    const levelBefore = levelFromXp(before.xp).level;
    const streak = await this.touchStreak(userId);

    const xpTotal = input.xp;
    if (xpTotal > 0) await userRepository.addXp(userId, xpTotal);

    const stats = await gamificationRepository.statistics(userId);
    const accuracy = input.accuracySample
      ? await statsRepository.accuracyFor(userId)
      : (stats?.accuracy ?? 0);

    await gamificationRepository.upsertStatistics(userId, {
      totalXp: (stats?.totalXp ?? 0) + xpTotal,
      totalTimeSeconds: (stats?.totalTimeSeconds ?? 0) + (input.minutes ?? 0) * 60,
      lessonsCompleted: (stats?.lessonsCompleted ?? 0) + (input.lessons ?? 0),
      coursesCompleted: (stats?.coursesCompleted ?? 0) + (input.courses ?? 0),
      exercisesAttempted: (stats?.exercisesAttempted ?? 0) + (input.exercisesAttempted ?? 0),
      exercisesPassed: (stats?.exercisesPassed ?? 0) + (input.exercisesPassed ?? 0),
      perfectScores: (stats?.perfectScores ?? 0) + (input.perfect ?? 0),
      flashcardsReviewed: (stats?.flashcardsReviewed ?? 0) + (input.flashcards ?? 0),
      accuracy,
    });

    const goal = await this.updateDailyGoal(userId, {
      xp: xpTotal,
      lessons: input.lessons ?? 0,
      minutes: input.minutes ?? 0,
    });

    const after = await userRepository.findById(userId);
    const levelAfter = levelFromXp(after?.xp ?? 0).level;
    const newBadges = await gamificationService.evaluate(userId);

    return {
      xpTotal: after?.xp ?? 0,
      levelUp: levelAfter > levelBefore,
      level: levelAfter,
      streak,
      goal,
      newBadges,
    };
  },

  /** Met a jour la serie quotidienne : +1 si hier, reset si trou, inchangee le meme jour. */
  async touchStreak(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('Utilisateur');

    const today = startOfDayUtc();
    if (user.lastActiveOn && daysBetween(user.lastActiveOn, today) === 0) {
      return { current: user.streakCurrent, longest: user.streakLongest, incremented: false };
    }

    const gap = user.lastActiveOn ? daysBetween(user.lastActiveOn, today) : Infinity;
    const current = gap === 1 ? user.streakCurrent + 1 : 1;
    const longest = Math.max(user.streakLongest, current);
    await userRepository.setStreak(userId, current, longest, today);
    return { current, longest, incremented: true };
  },

  async updateDailyGoal(
    userId: string,
    delta: { xp: number; lessons: number; minutes: number },
  ): Promise<DailyGoalDto> {
    const today = startOfDayUtc();
    const existing = await gamificationRepository.goalForDate(userId, today);

    const achievedXp = (existing?.achievedXp ?? 0) + delta.xp;
    const achievedLessons = (existing?.achievedLessons ?? 0) + delta.lessons;
    const achievedMinutes = (existing?.achievedMinutes ?? 0) + delta.minutes;
    const targetXp = existing?.targetXp ?? DEFAULT_DAILY_GOAL.targetXp;
    const targetLessons = existing?.targetLessons ?? DEFAULT_DAILY_GOAL.targetLessons;
    const targetMinutes = existing?.targetMinutes ?? DEFAULT_DAILY_GOAL.targetMinutes;
    const completed = achievedXp >= targetXp && achievedLessons >= targetLessons;

    const saved = await gamificationRepository.upsertGoal(
      userId,
      today,
      {
        userId,
        date: today,
        targetXp,
        targetLessons,
        targetMinutes,
        achievedXp,
        achievedLessons,
        achievedMinutes,
        completed,
      },
      { achievedXp, achievedLessons, achievedMinutes, completed },
    );

    // Bonus unique le jour ou l'objectif est atteint.
    if (completed && !existing?.completed) {
      await userRepository.addXp(userId, XP_REWARD.dailyGoal);
    }

    return {
      date: toIsoDate(saved.date),
      targetXp: saved.targetXp,
      achievedXp: saved.achievedXp,
      targetLessons: saved.targetLessons,
      achievedLessons: saved.achievedLessons,
      targetMinutes: saved.targetMinutes,
      achievedMinutes: saved.achievedMinutes,
      completed: saved.completed,
    };
  },

  /** Recalcule le pourcentage d'un cours a partir des lecons terminees. */
  async recomputeCourseProgress(userId: string, courseId: string) {
    const [totalLessons, completed] = await Promise.all([
      lessonRepository.countByCourse(courseId),
      progressRepository.completedLessonIdsForCourse(userId, courseId),
    ]);
    const percentage = totalLessons === 0 ? 0 : Math.round((completed.length / totalLessons) * 100);
    const status =
      percentage >= 100
        ? ProgressStatus.COMPLETED
        : percentage > 0
          ? ProgressStatus.IN_PROGRESS
          : ProgressStatus.NOT_STARTED;

    const existing = await progressRepository.findForCourse(userId, courseId);
    const justCompleted = status === ProgressStatus.COMPLETED && existing?.status !== ProgressStatus.COMPLETED;

    const progress = await progressRepository.upsertCourse(userId, courseId, { status, percentage });
    if (!existing) await courseRepository.incrementLearners(courseId);
    if (justCompleted) {
      const stats = await gamificationRepository.statistics(userId);
      await gamificationRepository.upsertStatistics(userId, {
        coursesCompleted: (stats?.coursesCompleted ?? 0) + 1,
      });
    }
    return { percentage, status, justCompleted, progress };
  },

  async overview(userId: string): Promise<ProgressOverview> {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('Utilisateur');

    const [stats, totalCourses, completedCourses, completedLessons, time, accuracy] =
      await Promise.all([
        gamificationRepository.statistics(userId),
        courseRepository.countAll(),
        progressRepository.countCompletedCourses(userId),
        progressRepository.countCompletedLessons(userId),
        progressRepository.totalTimeSpent(userId),
        statsRepository.accuracyFor(userId),
      ]);

    const levelInfo = levelFromXp(user.xp);

    return {
      xp: user.xp,
      level: levelInfo.level,
      xpIntoLevel: levelInfo.xpIntoLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      percentToNextLevel: levelInfo.percentToNextLevel,
      cefrLevel: user.level,
      streakCurrent: user.streakCurrent,
      streakLongest: user.streakLongest,
      totalTimeSeconds: time._sum.timeSpentSeconds ?? 0,
      coursesCompleted: completedCourses,
      lessonsCompleted: completedLessons,
      exercisesPassed: stats?.exercisesPassed ?? 0,
      flashcardsReviewed: stats?.flashcardsReviewed ?? 0,
      accuracy,
      globalPercentage: totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100),
    };
  },

  async activity(userId: string, days = 30): Promise<ActivityPoint[]> {
    const to = startOfDayUtc();
    const from = addDays(to, -(days - 1));
    const goals = await gamificationRepository.goalsRange(userId, from, to);
    const byDate = new Map(goals.map((goal) => [toIsoDate(goal.date), goal]));

    return Array.from({ length: days }, (_, index) => {
      const date = toIsoDate(addDays(from, index));
      const goal = byDate.get(date);
      return { date, xp: goal?.achievedXp ?? 0, minutes: goal?.achievedMinutes ?? 0 };
    });
  },

  async recent(userId: string, take = 8): Promise<RecentActivityItem[]> {
    const rows = await progressRepository.recentActivity(userId, take);
    return rows.map((row) => ({
      id: row.id,
      kind: 'lesson' as const,
      labelFr: row.lesson?.titleFr ?? 'Lecon',
      labelAr: row.lesson?.titleAr ?? 'درس',
      xp: row.status === ProgressStatus.COMPLETED ? (row.lesson?.xpReward ?? 0) : 0,
      at: row.lastViewedAt,
    }));
  },

  goal(userId: string) {
    return this.updateDailyGoal(userId, { xp: 0, lessons: 0, minutes: 0 });
  },
};
