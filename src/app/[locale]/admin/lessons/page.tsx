import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { lessonRepository } from '@/repositories/lesson.repository';
import { AdminTable } from '@/features/admin/admin-table';

export default async function AdminLessonsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const page = Number(searchParams.page ?? 1);
  const { items, total } = await lessonRepository.findMany({ page, perPage: 25 });

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground-muted">
        {total} {t('admin.lessons')}
      </p>
      <AdminTable
        resource="lessons"
        emptyLabel={t('admin.empty')}
        rows={items}
        columns={[
          { key: 'title', header: t('admin.colTitle'), render: (row) => row.titleFr },
          { key: 'position', header: t('admin.colPosition'), render: (row) => row.position },
          { key: 'exercises', header: t('admin.colExercises'), render: (row) => row._count.exercises },
          { key: 'xp', header: 'XP', render: (row) => row.xpReward },
        ]}
      />
    </div>
  );
}
