import { Prisma, type CefrLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { toSkipTake } from './base.repository';
import type { ListParams } from './interfaces';

export const vocabularyRepository = {
  async findMany(params: ListParams & { search?: string | undefined; level?: CefrLevel | undefined }) {
    const where: Prisma.VocabularyWhereInput = {
      ...(params.level ? { level: params.level } : {}),
      ...(params.search
        ? {
            OR: [
              { wordFr: { contains: params.search, mode: 'insensitive' } },
              { translationAr: { contains: params.search } },
              { exampleFr: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.vocabulary.findMany({ where, orderBy: { wordFr: 'asc' }, ...toSkipTake(params) }),
      prisma.vocabulary.count({ where }),
    ]);
    return { items, total };
  },

  findByLesson(lessonId: string) {
    return prisma.vocabulary.findMany({ where: { lessonId }, orderBy: { wordFr: 'asc' } });
  },

  countAll() {
    return prisma.vocabulary.count();
  },
};
