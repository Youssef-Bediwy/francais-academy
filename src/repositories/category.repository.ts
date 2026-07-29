import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { categorySchema } from '@/lib/validation';
import type { z } from 'zod';

export const categoryInclude = {
  _count: { select: { courses: true } },
} satisfies Prisma.CategoryInclude;

export type CategoryWithCount = Prisma.CategoryGetPayload<{ include: typeof categoryInclude }>;

export const categoryRepository = {
  findAll(): Promise<CategoryWithCount[]> {
    return prisma.category.findMany({ include: categoryInclude, orderBy: { position: 'asc' } });
  },

  findBySlug(slug: string): Promise<CategoryWithCount | null> {
    return prisma.category.findUnique({ where: { slug }, include: categoryInclude });
  },

  findById(id: string): Promise<CategoryWithCount | null> {
    return prisma.category.findUnique({ where: { id }, include: categoryInclude });
  },

  create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};

export type CategoryInput = z.infer<typeof categorySchema>;
