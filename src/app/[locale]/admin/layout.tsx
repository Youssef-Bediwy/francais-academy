import Link from 'next/link';
import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { Badge } from '@/components/ui/badge';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();

  // Double garde : middleware (edge) + verification serveur.
  if (!session) redirect(routes.login(locale));
  if (session.role !== 'ADMIN') redirect(routes.dashboard(locale));

  const tabs = [
    { href: routes.admin(locale), label: t('admin.overview') },
    { href: routes.adminCourses(locale), label: t('admin.courses') },
    { href: routes.adminCategories(locale), label: t('admin.categories') },
    { href: routes.adminLessons(locale), label: t('admin.lessons') },
    { href: routes.adminFlashcards(locale), label: t('admin.flashcards') },
    { href: routes.adminUsers(locale), label: t('admin.users') },
  ];

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl">{t('admin.title')}</h1>
        <Badge variant="danger" size="sm">
          {t('admin.restricted')}
        </Badge>
      </div>

      <nav aria-label={t('admin.title')} className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-surface-muted p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-foreground-muted transition hover:bg-surface hover:text-foreground"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
