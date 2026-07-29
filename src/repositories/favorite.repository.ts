import { FavoriteType, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const columnFor = (type: FavoriteType): 'courseId' | 'lessonId' | 'flashcardId' =>
  type === FavoriteType.COURSE ? 'courseId' : type === FavoriteType.LESSON ? 'lessonId' : 'flashcardId';

export const favoriteRepository = {
  listForUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        course: { include: { category: true, _count: { select: { lessons: true } } } },
        lesson: { include: { course: { select: { slug: true } } } },
        flashcard: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  find(userId: string, type: FavoriteType, targetId: string) {
    return prisma.favorite.findFirst({ where: { userId, type, [columnFor(type)]: targetId } });
  },

  create(userId: string, type: FavoriteType, targetId: string) {
    const data: Prisma.FavoriteUncheckedCreateInput = { userId, type };
    data[columnFor(type)] = targetId;
    return prisma.favorite.create({ data });
  },

  deleteById(id: string) {
    return prisma.favorite.delete({ where: { id } });
  },

  countForUser(userId: string) {
    return prisma.favorite.count({ where: { userId } });
  },
};
