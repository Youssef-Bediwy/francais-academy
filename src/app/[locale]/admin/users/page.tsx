import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { userRepository } from '@/repositories/user.repository';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { AdminTable } from '@/features/admin/admin-table';
import { formatDate } from '@/utils/format';

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string; search?: string };
}) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const page = Number(searchParams.page ?? 1);

  const { items, total } = await userRepository.findMany({
    page,
    perPage: 25,
    search: searchParams.search,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground-muted">
        {total} {t('admin.users')}
      </p>
      <AdminTable
        resource="admin/users"
        emptyLabel={t('admin.empty')}
        rows={items}
        columns={[
          {
            key: 'name',
            header: t('admin.colUser'),
            render: (row) => (
              <span className="inline-flex items-center gap-3">
                <Avatar name={row.name} src={row.avatarUrl} size="sm" />
                <span>
                  <span className="block font-medium">{row.name}</span>
                  <span className="block text-xs text-foreground-muted">{row.email}</span>
                </span>
              </span>
            ),
          },
          {
            key: 'role',
            header: t('admin.colRole'),
            render: (row) => (
              <Badge size="sm" variant={row.role === 'ADMIN' ? 'danger' : 'outline'}>
                {row.role}
              </Badge>
            ),
          },
          { key: 'level', header: t('admin.colLevel'), render: (row) => row.level },
          { key: 'xp', header: 'XP', render: (row) => row.xp },
          { key: 'streak', header: t('admin.colStreak'), render: (row) => row.streakCurrent },
          {
            key: 'created',
            header: t('admin.colCreated'),
            render: (row) => formatDate(row.createdAt, locale),
          },
        ]}
      />
    </div>
  );
}
