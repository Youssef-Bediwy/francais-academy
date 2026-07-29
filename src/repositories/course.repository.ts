import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { insensitiveContains, toSkipTake } from './base.repository';
import type { CourseFilters, PaginatedResult } from './interfaces';

export const courseInclude = {
  category: true,
  _count: { select: { lessons: true } },
} satisfies Prisma.CourseInclude;

export type CourseWithMeta = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;

function buildWhere(filters: CourseFilters): Prisma.CourseWhereInput {
  const search = insensitiveContains(filters.search);
  return {
    ...(filters.onlyPublished === false ? {} : { isPublished: true }),
    ...(filters.level ? { level: filters.level } : {}),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(search
      ? {
          OR: [
            { titleFr: search },
            { titleAr: search },
            { descriptionFr: search },
            { descriptionAr: search },
          ],
        }
      : {}),
  };
}

function buildOrderBy(sort: CourseFilters['sort']): Prisma.CourseOrderByWithRelationInput[] {
  switch (sort) {
    case 'recent':
      return [{ createdAt: 'desc' }];
    case 'level':
      return [{ level: 'asc' }, { position: 'asc' }];
    case 'alphabetical':
      return [{ titleFr: 'asc' }];
    case 'popular':
    default:
      return [{ learnerCount: 'desc' }, { rating: 'desc' }];
  }
}

export const courseRepository = {
  async findMany(filters: CourseFilters): Promise<PaginatedResult<CourseWithMeta>> {
    const where = buildWhere(filters);
    const [items, total] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        include: courseInclude,
        orderBy: buildOrderBy(filters.sort),
        ...toSkipTake(filters),
      }),
      prisma.course.count({ where }),
    ]);
    return { items, total };
  },

  findBySlug(slug: string): Promise<CourseWithMeta | null> {
    return prisma.course.findUnique({ where: { slug }, include: courseInclude });
  },

  findById(id: string): Promise<CourseWithMeta | null> {
    return prisma.course.findUnique({ where: { id }, include: courseInclude });
  },

  findPopular(take = 6): Promise<CourseWithMeta[]> {
    return prisma.course.findMany({
      where: { isPublished: true },
      include: courseInclude,
      orderBy: [{ learnerCount: 'desc' }, { rating: 'desc' }],
      take,
    });
  },

  findByCategory(categoryId: string, take = 8): Promise<CourseWithMeta[]> {
    return prisma.course.findMany({
      where: { categoryId, isPublished: true },
      include: courseInclude,
      orderBy: { position: 'asc' },
      take,
    });
  },

  countAll(): Promise<number> {
    return prisma.course.count({ where: { isPublished: true } });
  },

  create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({ data, include: courseInclude });
  },

  update(id: string, data: Prisma.CourseUpdateInput) {
    return prisma.course.update({ where: { id }, data, include: courseInclude });
  },

  delete(id: string) {
    return prisma.course.delete({ where: { id } });
  },

  incrementLearners(id: string) {
    return prisma.course.update({ where: { id }, data: { learnerCount: { increment: 1 } } });
  },
};
