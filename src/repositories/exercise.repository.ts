import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { toSkipTake } from './base.repository';
import type { ListParams, PaginatedResult } from './interfaces';

export const exerciseInclude = {
  questions: {
    orderBy: { position: 'asc' },
    include: { answers: { orderBy: { position: 'asc' } } },
  },
  lesson: { select: { id: true, slug: true, titleFr: true, titleAr: true, courseId: true } },
} satisfies Prisma.ExerciseInclude;

export type ExerciseWithQuestions = Prisma.ExerciseGetPayload<{ include: typeof exerciseInclude }>;

export const exerciseRepository = {
  findById(id: string): Promise<ExerciseWithQuestions | null> {
    return prisma.exercise.findUnique({ where: { id }, include: exerciseInclude });
  },

  findByLessonId(lessonId: string): Promise<ExerciseWithQuestions[]> {
    return prisma.exercise.findMany({
      where: { lessonId },
      include: exerciseInclude,
      orderBy: { position: 'asc' },
    });
  },

  async findMany(params: ListParams & { lessonId?: string | undefined }) {
    const where: Prisma.ExerciseWhereInput = params.lessonId ? { lessonId: params.lessonId } : {};
    const [items, total] = await prisma.$transaction([
      prisma.exercise.findMany({
        where,
        include: exerciseInclude,
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(params),
      }),
      prisma.exercise.count({ where }),
    ]);
    return { items, total } as PaginatedResult<ExerciseWithQuestions>;
  },

  countAll() {
    return prisma.exercise.count();
  },

  create(data: Prisma.ExerciseCreateInput) {
    return prisma.exercise.create({ data, include: exerciseInclude });
  },

  update(id: string, data: Prisma.ExerciseUpdateInput) {
    return prisma.exercise.update({ where: { id }, data, include: exerciseInclude });
  },

  delete(id: string) {
    return prisma.exercise.delete({ where: { id } });
  },

  saveResult(data: Prisma.ExerciseResultUncheckedCreateInput) {
    return prisma.exerciseResult.create({ data });
  },

  findResults(userId: string, take = 20) {
    return prisma.exerciseResult.findMany({
      where: { userId },
      include: { exercise: { select: { titleFr: true, titleAr: true, type: true, lessonId: true } } },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  findFailedQuestionIds(userId: string, take = 200) {
    return prisma.exerciseResult.findMany({
      where: { userId, passed: false },
      select: { details: true, exerciseId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },
};
