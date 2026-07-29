import { ReviewGrade, type CefrLevel } from '@prisma/client';
import { flashcardRepository } from '@/repositories/flashcard.repository';
import { exerciseRepository } from '@/repositories/exercise.repository';
import { courseRepository, type CourseWithMeta } from '@/repositories/course.repository';
import { NotFoundError } from '@/lib/api/errors';
import { SM2, XP_REWARD } from '@/constants/gamification';
import { addDays } from '@/utils/date';
import { toFlashcardDto } from './mappers';
import { progressService } from './progress.service';
import type { FlashcardDto } from '@/types/content';

const QUALITY: Record<ReviewGrade, number> = {
  AGAIN: 1,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
};

export interface Sm2State {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
}

/** Algorithme SM-2 : fonction pure, entierement testable. */
export function computeSm2(state: Sm2State, grade: ReviewGrade): Sm2State {
  const quality = QUALITY[grade];

  if (quality < 3) {
    return {
      easeFactor: Math.max(SM2.minEase, state.easeFactor - 0.2),
      intervalDays: SM2.firstInterval,
      repetitions: 0,
      lapses: state.lapses + 1,
    };
  }

  const repetitions = state.repetitions + 1;
  const easeFactor = Math.min(
    SM2.maxEase,
    Math.max(
      SM2.minEase,
      state.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    ),
  );

  const intervalDays =
    repetitions === 1
      ? SM2.firstInterval
      : repetitions === 2
        ? SM2.secondInterval
        : Math.round(state.intervalDays * easeFactor);

  return { easeFactor, intervalDays: Math.max(1, intervalDays), repetitions, lapses: state.lapses };
}

export const reviewService = {
  async queue(userId: string, limit: number, level?: CefrLevel): Promise<FlashcardDto[]> {
    const cards = await flashcardRepository.findDueForUser(userId, limit, level);
    return cards.map((card) =>
      toFlashcardDto({
        id: card.id,
        frontFr: card.frontFr,
        backAr: card.backAr,
        hintFr: card.hintFr,
        audioUrl: card.audioUrl,
        level: card.level,
        revisions: card.revisions.map((r) => ({ dueAt: r.dueAt, repetitions: r.repetitions })),
      }),
    );
  },

  async grade(userId: string, flashcardId: string, grade: ReviewGrade, durationSeconds: number) {
    const card = await flashcardRepository.findById(flashcardId);
    if (!card) throw new NotFoundError('Carte');

    const session = await flashcardRepository.findSession(userId, flashcardId);
    const next = computeSm2(
      {
        easeFactor: session?.easeFactor ?? SM2.defaultEase,
        intervalDays: session?.intervalDays ?? 0,
        repetitions: session?.repetitions ?? 0,
        lapses: session?.lapses ?? 0,
      },
      grade,
    );

    const dueAt = addDays(new Date(), next.intervalDays);
    await flashcardRepository.upsertSession(userId, flashcardId, {
      ...next,
      dueAt,
      lastGrade: grade,
    });

    const reward = await progressService.award(userId, {
      xp: grade === ReviewGrade.AGAIN ? 0 : XP_REWARD.flashcardReviewed,
      minutes: Math.round(durationSeconds / 60),
      flashcards: 1,
    });

    return { nextDueAt: dueAt, intervalDays: next.intervalDays, ...reward };
  },

  async stats(userId: string) {
    const [due, history] = await Promise.all([
      flashcardRepository.countDue(userId),
      flashcardRepository.historyForUser(userId, 200),
    ]);
    const reviewed = history.reduce((sum, item) => sum + item.reviewCount, 0);
    const lapses = history.reduce((sum, item) => sum + item.lapses, 0);
    const mastered = history.filter((item) => item.repetitions >= 4).length;
    return { due, tracked: history.length, reviewed, lapses, mastered };
  },

  /** Recommande des cours a retravailler a partir des exercices echoues. */
  async recommendations(userId: string, take = 4) {
    const failed = await exerciseRepository.findFailedQuestionIds(userId, 100);
    if (failed.length === 0) {
      const popular = await courseRepository.findPopular(take);
      return { reason: 'popular' as const, courses: popular };
    }

    const weakestByCount = new Map<string, number>();
    for (const row of failed) {
      weakestByCount.set(row.exerciseId, (weakestByCount.get(row.exerciseId) ?? 0) + 1);
    }

    const exerciseIds = [...weakestByCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, take)
      .map(([id]) => id);

    const courses: CourseWithMeta[] = [];
    for (const exerciseId of exerciseIds) {
      const exercise = await exerciseRepository.findById(exerciseId);
      if (!exercise) continue;
      const course = await courseRepository.findById(exercise.lesson.courseId);
      if (course && !courses.some((c) => c.id === course.id)) courses.push(course);
    }

    return { reason: 'errors' as const, courses };
  },
};
