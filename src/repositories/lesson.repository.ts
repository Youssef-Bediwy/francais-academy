import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { insensitiveContains, toSkipTake } from './base.repository';
import type { ListParams, PaginatedResult } from './interfaces';

export const lessonInclude = {
  _count: { select: { exercises: true } },
} satisfies Prisma.LessonInclude;

export const lessonDetailInclude = {
  course: { include: { category: true } },
  exercises: { orderBy: { position: 'asc' } },
  vocabulary: { orderBy: { wordFr: 'asc' } },
} satisfies Prisma.LessonInclude;

export type LessonWithCount = Prisma.LessonGetPayload<{ include: typeof lessonInclude }>;
export type LessonDetail = Prisma.LessonGetPayload<{ include: typeof lessonDetailInclude }>;

export const lessonRepository = {
  findByCourseId(courseId: string): Promise<LessonWithCount[]> {
    return prisma.lesson.findMany({
      where: { courseId, isPublished: true },
      include: lessonInclude,
      orderBy: { position: 'asc' },
    });
  },

  findDetail(courseSlug: string, lessonSlug: string): Promise<LessonDetail | null> {
    return prisma.lesson.findFirst({
      where: { slug: lessonSlug, course: { slug: courseSlug } },
      include: lessonDetailInclude,
    });
  },

  findById(id: string): Promise<LessonDetail | null> {
    return prisma.lesson.findUnique({ where: { id }, include: lessonDetailInclude });
  },

  findLatest(take = 6): Promise<Prisma.LessonGetPayload<{ include: { course: true } }>[]> {
    return prisma.lesson.findMany({
      where: { isPublished: true },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  async findMany(
    params: ListParams & { courseId?: string | undefined; search?: string | undefined },
  ): Promise<PaginatedResult<LessonWithCount>> {
    const search = insensitiveContains(params.search);
    const where: Prisma.LessonWhereInput = {
      ...(params.courseId ? { courseId: params.courseId } : {}),
      ...(search ? { OR: [{ titleFr: search }, { titleAr: search }, { summaryFr: search }] } : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.lesson.findMany({
        where,
        include: lessonInclude,
        orderBy: [{ courseId: 'asc' }, { position: 'asc' }],
        ...toSkipTake(params),
      }),
      prisma.lesson.count({ where }),
    ]);
    return { items, total };
  },

  countByCourse(courseId: string) {
    return prisma.lesson.count({ where: { courseId, isPublished: true } });
  },

  countAll() {
    return prisma.lesson.count({ where: { isPublished: true } });
  },

  create(data: Prisma.LessonCreateInput) {
    return prisma.lesson.create({ data });
  },

  update(id: string, data: Prisma.LessonUpdateInput) {
    return prisma.lesson.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.lesson.delete({ where: { id } });
  },
};
