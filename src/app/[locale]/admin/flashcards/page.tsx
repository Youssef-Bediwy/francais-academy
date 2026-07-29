import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { flashcardRepository } from '@/repositories/flashcard.repository';
import { Badge } from '@/components/ui/badge';
import { AdminTable } from '@/features/admin/admin-table';

export default async function AdminFlashcardsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const page = Number(searchParams.page ?? 1);
  const { items, total } = await flashcardRepository.findMany({ page, perPage: 25 });

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground-muted">
        {total} {t('admin.flashcards')}
      </p>
      <AdminTable
        resource="flashcards"
        emptyLabel={t('admin.empty')}
        rows={items}
        columns={[
          { key: 'front', header: t('admin.colFront'), render: (row) => row.frontFr },
          {
            key: 'back',
            header: t('admin.colBack'),
            render: (row) => (
              <span className="font-arabic" dir="rtl">
                {row.backAr}
              </span>
            ),
          },
          { key: 'level', header: t('admin.colLevel'), render: (row) => <Badge size="sm">{row.level}</Badge> },
          { key: 'category', header: t('admin.colCategory'), render: (row) => row.category?.nameFr ?? '-' },
        ]}
      />
    </div>
  );
}
