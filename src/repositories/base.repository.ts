import type { ListParams } from './interfaces';

/** Transforme page/perPage en skip/take Prisma. */
export function toSkipTake({ page, perPage }: ListParams) {
  return { skip: (Math.max(1, page) - 1) * perPage, take: perPage };
}

export function insensitiveContains(value?: string) {
  return value ? { contains: value, mode: 'insensitive' as const } : undefined;
}
