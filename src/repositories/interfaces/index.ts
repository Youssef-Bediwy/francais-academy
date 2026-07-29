import type { CefrLevel, Prisma } from '@prisma/client';

/** Contrats consommes par la couche services (inversion de dependance). */

export interface ListParams {
  page: number;
  perPage: number;
}

export interface CourseFilters extends ListParams {
  search?: string | undefined;
  categorySlug?: string | undefined;
  level?: CefrLevel | undefined;
  sort: 'recent' | 'popular' | 'level' | 'alphabetical' | 'progress';
  onlyPublished?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export type TransactionClient = Prisma.TransactionClient;
