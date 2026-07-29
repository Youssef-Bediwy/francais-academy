import { revalidateTag } from 'next/cache';

export const CacheTag = {
  categories: 'categories',
  courses: 'courses',
  course: (id: string) => `course:${id}`,
  lessons: 'lessons',
  lesson: (id: string) => `lesson:${id}`,
  exercises: 'exercises',
  flashcards: 'flashcards',
  badges: 'badges',
  stats: 'stats',
} as const;

export const REVALIDATE = { short: 60, medium: 300, long: 3600 } as const;

export function invalidate(...tags: string[]): void {
  for (const tag of tags) revalidateTag(tag);
}
