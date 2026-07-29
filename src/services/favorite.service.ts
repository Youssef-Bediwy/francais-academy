import { FavoriteType } from '@prisma/client';
import { ConflictError, NotFoundError } from '@/lib/api/errors';
import { favoriteRepository } from '@/repositories/favorite.repository';
import { toCourseDto } from './mappers';

export const favoriteService = {
  async list(userId: string) {
    const rows = await favoriteRepository.listForUser(userId);
    return {
      courses: rows
        .filter((row) => row.course)
        .map((row) => ({ favoriteId: row.id, course: toCourseDto(row.course!) })),
      lessons: rows
        .filter((row) => row.lesson)
        .map((row) => ({
          favoriteId: row.id,
          id: row.lesson!.id,
          slug: row.lesson!.slug,
          courseSlug: row.lesson!.course.slug,
          titleFr: row.lesson!.titleFr,
          titleAr: row.lesson!.titleAr,
          summaryFr: row.lesson!.summaryFr,
          summaryAr: row.lesson!.summaryAr,
        })),
      flashcards: rows
        .filter((row) => row.flashcard)
        .map((row) => ({ favoriteId: row.id, ...row.flashcard! })),
    };
  },

  async toggle(userId: string, type: FavoriteType, targetId: string) {
    const existing = await favoriteRepository.find(userId, type, targetId);
    if (existing) {
      await favoriteRepository.deleteById(existing.id);
      return { favorited: false };
    }
    await favoriteRepository.create(userId, type, targetId);
    return { favorited: true };
  },

  async remove(userId: string, favoriteId: string) {
    const rows = await favoriteRepository.listForUser(userId);
    const target = rows.find((row) => row.id === favoriteId);
    if (!target) throw new NotFoundError('Favori');
    await favoriteRepository.deleteById(favoriteId);
  },

  count(userId: string) {
    return favoriteRepository.countForUser(userId);
  },
};
