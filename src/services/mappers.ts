import type { Progress } from '@prisma/client';
import type { CategoryWithCount } from '@/repositories/category.repository';
import type { CourseWithMeta } from '@/repositories/course.repository';
import type { LessonDetail, LessonWithCount } from '@/repositories/lesson.repository';
import type { ExerciseWithQuestions } from '@/repositories/exercise.repository';
import type {
  CategoryDto,
  CourseDto,
  ExerciseDto,
  FlashcardDto,
  LessonDto,
  LessonExample,
  LessonListItem,
  ProgressSummary,
} from '@/types/content';

export const toProgressSummary = (progress: Progress | null | undefined): ProgressSummary => ({
  status: progress?.status ?? 'NOT_STARTED',
  percentage: progress?.percentage ?? 0,
  timeSpentSeconds: progress?.timeSpentSeconds ?? 0,
  completedAt: progress?.completedAt ?? null,
});

export const toCategoryDto = (category: CategoryWithCount): CategoryDto => ({
  id: category.id,
  slug: category.slug,
  skill: category.skill,
  name: { fr: category.nameFr, ar: category.nameAr },
  description: { fr: category.descriptionFr, ar: category.descriptionAr },
  icon: category.icon,
  color: category.color,
  courseCount: category._count.courses,
});

export const toCourseDto = (course: CourseWithMeta, progress?: Progress | null): CourseDto => ({
  id: course.id,
  slug: course.slug,
  title: { fr: course.titleFr, ar: course.titleAr },
  description: { fr: course.descriptionFr, ar: course.descriptionAr },
  level: course.level,
  estimatedMinutes: course.estimatedMinutes,
  coverImage: course.coverImage,
  lessonCount: course._count.lessons,
  learnerCount: course.learnerCount,
  rating: course.rating,
  category: {
    id: course.category.id,
    slug: course.category.slug,
    skill: course.category.skill,
    name: { fr: course.category.nameFr, ar: course.category.nameAr },
    icon: course.category.icon,
    color: course.category.color,
  },
  ...(progress === undefined ? {} : { progress: toProgressSummary(progress) }),
});

const parseExamples = (value: unknown): LessonExample[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const record = item as Record<string, unknown>;
    if (typeof record.fr !== 'string' || typeof record.ar !== 'string') return [];
    return [
      {
        fr: record.fr,
        ar: record.ar,
        ...(typeof record.audioUrl === 'string' ? { audioUrl: record.audioUrl } : {}),
      },
    ];
  });
};

export const toLessonDto = (lesson: LessonDetail, progress?: Progress | null): LessonDto => ({
  id: lesson.id,
  slug: lesson.slug,
  courseId: lesson.courseId,
  title: { fr: lesson.titleFr, ar: lesson.titleAr },
  summary: { fr: lesson.summaryFr, ar: lesson.summaryAr },
  content: { fr: lesson.contentFr, ar: lesson.contentAr },
  explanation: { fr: lesson.explanationFr, ar: lesson.explanationAr },
  examples: parseExamples(lesson.examples),
  illustrationUrl: lesson.illustrationUrl,
  audioUrl: lesson.audioUrl,
  position: lesson.position,
  estimatedMinutes: lesson.estimatedMinutes,
  xpReward: lesson.xpReward,
  ...(progress === undefined ? {} : { progress: toProgressSummary(progress) }),
});

export const toLessonListItem = (
  lesson: LessonWithCount,
  progress?: Progress | null,
): LessonListItem => ({
  id: lesson.id,
  slug: lesson.slug,
  title: { fr: lesson.titleFr, ar: lesson.titleAr },
  summary: { fr: lesson.summaryFr, ar: lesson.summaryAr },
  position: lesson.position,
  estimatedMinutes: lesson.estimatedMinutes,
  exerciseCount: lesson._count.exercises,
  status: progress?.status ?? 'NOT_STARTED',
});

/** Expose un exercice au client SANS reveler quelle reponse est correcte. */
export const toExerciseDto = (exercise: ExerciseWithQuestions): ExerciseDto => ({
  id: exercise.id,
  lessonId: exercise.lessonId,
  type: exercise.type,
  title: { fr: exercise.titleFr, ar: exercise.titleAr },
  instructions: { fr: exercise.instructionsFr, ar: exercise.instructionsAr },
  points: exercise.points,
  passingScore: exercise.passingScore,
  questions: exercise.questions.map((question) => ({
    id: question.id,
    promptFr: question.promptFr,
    promptAr: question.promptAr,
    hintFr: question.hintFr,
    hintAr: question.hintAr,
    audioUrl: question.audioUrl,
    imageUrl: question.imageUrl,
    position: question.position,
    points: question.points,
    options: question.answers.map((answer) => ({
      id: answer.id,
      textFr: answer.textFr,
      textAr: answer.textAr,
      matchKey: exercise.type === 'MATCHING' ? answer.matchKey : null,
      position: answer.position,
    })),
  })),
});

export const toFlashcardDto = (card: {
  id: string;
  frontFr: string;
  backAr: string;
  hintFr: string | null;
  audioUrl: string | null;
  level: FlashcardDto['level'];
  revisions?: { dueAt: Date; repetitions: number }[];
}): FlashcardDto => {
  const state = card.revisions?.[0];
  return {
    id: card.id,
    frontFr: card.frontFr,
    backAr: card.backAr,
    hintFr: card.hintFr,
    audioUrl: card.audioUrl,
    level: card.level,
    ...(state ? { dueAt: state.dueAt, repetitions: state.repetitions } : {}),
  };
};
