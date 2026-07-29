import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { categoryRepository } from '@/repositories/category.repository';
import { AdminTable } from '@/features/admin/admin-table';

export default async function AdminCategoriesPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const categories = await categoryRepository.findAll();

  return (
    <AdminTable
      resource="categories"
      emptyLabel={t('admin.empty')}
      rows={categories}
      columns={[
        { key: 'name', header: t('admin.colTitle'), render: (row) => row.nameFr },
        { key: 'nameAr', header: t('admin.colTitleAr'), render: (row) => row.nameAr },
        { key: 'skill', header: t('admin.colSkill'), render: (row) => row.skill },
        { key: 'courses', header: t('admin.colCourses'), render: (row) => row._count.courses },
      ]}
    />
  );
}
