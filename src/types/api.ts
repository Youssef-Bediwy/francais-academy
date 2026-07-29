export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export type ApiResult<T> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: { code: string; message: string; details?: unknown } };
