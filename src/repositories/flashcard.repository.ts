import { Prisma, type CefrLevel, type ReviewGrade } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { toSkipTake } from './base.repository';
import type { ListParams } from './interfaces';

export type FlashcardWithState = Prisma.FlashcardGetPayload<{
  include: { revisions: true; category: true };
}>;

export const flashcardRepository = {
  /** Cartes echues pour l'utilisateur, puis cartes jamais vues, dans la limite demandee. */
  async findDueForUser(userId: string, limit: number, level?: CefrLevel) {
    const now = new Date();
    const due = await prisma.flashcard.findMany({
      where: {
        ...(level ? { level } : {}),
        revisions: { some: { userId, dueAt: { lte: now } } },
      },
      include: { revisions: { where: { userId } }, category: true },
      orderBy: { updatedAt: 'asc' },
      take: limit,
    });

    if (due.length >= limit) return due;

    const fresh = await prisma.flashcard.findMany({
      where: {
        ...(level ? { level } : {}),
        revisions: { none: { userId } },
      },
      include: { revisions: { where: { userId } }, category: true },
      orderBy: { createdAt: 'asc' },
      take: limit - due.length,
    });

    return [...due, ...fresh];
  },

  countDue(userId: string) {
    return prisma.revisionSession.count({ where: { userId, dueAt: { lte: new Date() } } });
  },

  findById(id: string) {
    return prisma.flashcard.findUnique({ where: { id }, include: { category: true } });
  },

  async findMany(params: ListParams & { level?: CefrLevel | undefined; search?: string | undefined }) {
    const where: Prisma.FlashcardWhereInput = {
      ...(params.level ? { level: params.level } : {}),
      ...(params.search
        ? {
            OR: [
              { frontFr: { contains: params.search, mode: 'insensitive' } },
              { backAr: { contains: params.search } },
            ],
          }
        : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.flashcard.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(params),
      }),
      prisma.flashcard.count({ where }),
    ]);
    return { items, total };
  },

  countAll() {
    return prisma.flashcard.count();
  },

  create(data: Prisma.FlashcardUncheckedCreateInput) {
    return prisma.flashcard.create({ data });
  },

  update(id: string, data: Prisma.FlashcardUncheckedUpdateInput) {
    return prisma.flashcard.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.flashcard.delete({ where: { id } });
  },

  findSession(userId: string, flashcardId: string) {
    return prisma.revisionSession.findUnique({
      where: { userId_flashcardId: { userId, flashcardId } },
    });
  },

  upsertSession(
    userId: string,
    flashcardId: string,
    state: {
      easeFactor: number;
      intervalDays: number;
      repetitions: number;
      lapses: number;
      dueAt: Date;
      lastGrade: ReviewGrade;
    },
  ) {
    return prisma.revisionSession.upsert({
      where: { userId_flashcardId: { userId, flashcardId } },
      create: {
        userId,
        flashcardId,
        ...state,
        lastReviewedAt: new Date(),
        reviewCount: 1,
      },
      update: {
        ...state,
        lastReviewedAt: new Date(),
        reviewCount: { increment: 1 },
      },
    });
  },

  historyForUser(userId: string, take = 50) {
    return prisma.revisionSession.findMany({
      where: { userId },
      include: { flashcard: true },
      orderBy: { lastReviewedAt: 'desc' },
      take,
    });
  },
};
