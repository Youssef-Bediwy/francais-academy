'use client';

import { Pagination } from '@/components/ui/pagination';
import { useQueryParams } from '@/hooks/use-pagination';
import { useI18n } from '@/components/providers/i18n-provider';

export function CoursePagination({ page, totalPages }: { page: number; totalPages: number }) {
  const { t } = useI18n();
  const { setPage } = useQueryParams();

  return (
    <Pagination
      className="mt-10"
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      labels={{ previous: t('common.previous'), next: t('common.next'), page: t('common.page') }}
    />
  );
}
