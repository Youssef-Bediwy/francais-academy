'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/** Synchronise la pagination et les filtres avec l'URL (partageable, back/forward). */
export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string | number | undefined>, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '') params.delete(key);
        else params.set(key, String(value));
      }
      if (options?.resetPage) params.delete('page');
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return {
    get: (key: string) => searchParams.get(key) ?? undefined,
    setParams,
    setPage: (page: number) => setParams({ page }),
  };
}
