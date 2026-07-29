import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { courseRepository } from '@/repositories/course.repository';
import { Badge } from '@/components/ui/badge';
import { AdminTable } from '@/features/admin/admin-table';

export default async function AdminCoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const page = Number(searchParams.page ?? 1);

  const { items, total } = await courseRepository.findMany({
    page,
    perPage: 25,
    sort: 'recent',
    onlyPublished: false,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground-muted">
        {total} {t('admin.courses')}
      </p>
      <AdminTable
        resource="courses"
        emptyLabel={t('admin.empty')}
        rows={items}
        columns={[
          { key: 'title', header: t('admin.colTitle'), render: (row) => row.titleFr },
          { key: 'category', header: t('admin.colCategory'), render: (row) => row.category.nameFr },
          {
            key: 'level',
            header: t('admin.colLevel'),
            render: (row) => <Badge size="sm">{row.level}</Badge>,
          },
          { key: 'lessons', header: t('admin.colLessons'), render: (row) => row._count.lessons },
          {
            key: 'published',
            header: t('admin.colStatus'),
            render: (row) => (
              <Badge size="sm" variant={row.isPublished ? 'success' : 'outline'}>
                {row.isPublished ? t('admin.published') : t('admin.draft')}
              </Badge>
            ),
          },
        ]}
      />
    </div>
  );
}
