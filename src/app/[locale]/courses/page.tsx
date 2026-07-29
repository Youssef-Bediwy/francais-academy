import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { courseQuerySchema } from '@/lib/validation/course.schema';
import { courseService } from '@/services/course.service';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { CourseCard } from '@/components/domain/course-card';
import { CourseFilters } from '@/features/courses/course-filters';
import { CoursePagination } from '@/features/courses/course-pagination';

interface PageProps {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function CoursesPage({ params, searchParams }: PageProps) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();

  const parsed = courseQuerySchema.safeParse({
    page: searchParams.page ?? 1,
    perPage: 12,
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    level: typeof searchParams.level === 'string' ? searchParams.level : undefined,
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : 'popular',
  });

  // Un parametre d URL fantaisiste ne doit jamais casser la page : on retombe sur les defauts.
  const query = parsed.success
    ? parsed.data
    : courseQuerySchema.parse({ page: 1, perPage: 12, sort: 'popular' });

  const [{ items, meta }, categories] = await Promise.all([
    courseService.list(query, session?.id),
    courseService.categories(),
  ]);

  return (
    <div className="container-page py-12">
      <SectionHeading
        eyebrow={t('courses.eyebrow')}
        title={t('courses.title')}
        description={t('courses.subtitle')}
      />

      <CourseFilters categories={categories} />

      <p className="mb-5 text-sm text-foreground-muted">
        {meta.total} {t('courses.results')}
      </p>

      {items.length === 0 ? (
        <EmptyState title={t('courses.emptyTitle')} description={t('courses.emptyDescription')} />
      ) : (
        <div className="grid-auto-cards">
          {items.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <CoursePagination page={meta.page} totalPages={meta.totalPages} />
    </div>
  );
}
