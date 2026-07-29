import { ProgressStatus } from '@prisma/client';
import { NotFoundError } from '@/lib/api/errors';
import { lessonRepository } from '@/repositories/lesson.repository';
import { progressRepository } from '@/repositories/progress.repository';
import { exerciseRepository } from '@/repositories/exercise.repository';
import { toExerciseDto, toLessonDto } from './mappers';
import { progressService } from './progress.service';
import { XP_REWARD } from '@/constants/gamification';

export const lessonService = {
  async detail(courseSlug: string, lessonSlug: string, userId?: string) {
    const lesson = await lessonRepository.findDetail(courseSlug, lessonSlug);
    if (!lesson) throw new NotFoundError('Lecon');

    const progress = userId ? await progressRepository.findForLesson(userId, lesson.id) : null;
    const siblings = await lessonRepository.findByCourseId(lesson.courseId);
    const index = siblings.findIndex((item) => item.id === lesson.id);
    const exercises = await exerciseRepository.findByLessonId(lesson.id);

    return {
      lesson: userId ? toLessonDto(lesson, progress) : toLessonDto(lesson),
      course: {
        id: lesson.course.id,
        slug: lesson.course.slug,
        titleFr: lesson.course.titleFr,
        titleAr: lesson.course.titleAr,
        level: lesson.course.level,
        categoryNameFr: lesson.course.category.nameFr,
        categoryNameAr: lesson.course.category.nameAr,
      },
      vocabulary: lesson.vocabulary,
      exercises: exercises.map(toExerciseDto),
      previous: index > 0 ? siblings[index - 1] ?? null : null,
      next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] ?? null : null,
      totalLessons: siblings.length,
      lessonIndex: index + 1,
    };
  },

  async start(userId: string, lessonId: string) {
    const existing = await progressRepository.findForLesson(userId, lessonId);
    if (existing?.status === ProgressStatus.COMPLETED) return existing;
    return progressRepository.upsertLesson(userId, lessonId, {
      status: ProgressStatus.IN_PROGRESS,
      percentage: Math.max(existing?.percentage ?? 0, 10),
      timeSpentSeconds: 0,
    });
  },

  /** Marque la lecon terminee, credite l'XP puis recalcule la progression du cours. */
  async complete(userId: string, lessonId: string, timeSpentSeconds: number) {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) throw new NotFoundError('Lecon');

    const existing = await progressRepository.findForLesson(userId, lessonId);
    const alreadyCompleted = existing?.status === ProgressStatus.COMPLETED;

    await progressRepository.upsertLesson(userId, lessonId, {
      status: ProgressStatus.COMPLETED,
      percentage: 100,
      timeSpentSeconds,
    });

    const xp = alreadyCompleted ? 0 : lesson.xpReward || XP_REWARD.lessonCompleted;
    const courseProgress = await progressService.recomputeCourseProgress(userId, lesson.courseId);
    const reward = await progressService.award(userId, {
      xp,
      minutes: Math.round(timeSpentSeconds / 60),
      lessons: alreadyCompleted ? 0 : 1,
    });

    return { xpEarned: xp, courseProgress, ...reward };
  },

  async trackTime(userId: string, lessonId: string, seconds: number) {
    await progressRepository.addTime(userId, lessonId, seconds);
    return progressService.award(userId, { xp: 0, minutes: Math.round(seconds / 60), lessons: 0 });
  },

  async latest(take = 6) {
    return lessonRepository.findLatest(take);
  },
};
