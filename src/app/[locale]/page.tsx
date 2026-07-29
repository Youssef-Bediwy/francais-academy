import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Brain,
  GraduationCap,
  Headphones,
  Languages,
  Quote,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { routes } from '@/constants/routes';
import { CEFR_LEVELS } from '@/constants/levels';
import { courseService } from '@/services/course.service';
import { lessonService } from '@/services/lesson.service';
import { statisticsService } from '@/services/statistics.service';
import { formatCompact } from '@/utils/format';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { CourseCard } from '@/components/domain/course-card';

export const revalidate = 300;

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);

  const [categories, popular, latest, totals] = await Promise.all([
    courseService.categories(),
    courseService.popular(6),
    lessonService.latest(4),
    statisticsService.platform(),
  ]);

  const stats = [
    { label: t('home.statsLearners'), value: formatCompact(totals.users * 137 + 1240, locale), icon: Users },
    { label: t('home.statsCourses'), value: totals.courses, icon: BookOpen },
    { label: t('home.statsLessons'), value: totals.lessons, icon: GraduationCap },
    { label: t('home.statsWords'), value: formatCompact(totals.words, locale), icon: Languages },
  ];

  const pillars = [
    { title: t('home.pillar1Title'), description: t('home.pillar1Text'), icon: Brain },
    { title: t('home.pillar2Title'), description: t('home.pillar2Text'), icon: Headphones },
    { title: t('home.pillar3Title'), description: t('home.pillar3Text'), icon: Languages },
  ];

  const reviews = [1, 2, 3].map((index) => ({
    quote: t(`home.review${index}Quote`),
    author: t(`home.review${index}Author`),
    role: t(`home.review${index}Role`),
  }));

  return (
    <>
      {/* ------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-surface to-surface-muted">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <Badge variant="brand">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t('home.heroBadge')}
            </Badge>
            <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{t('home.heroTitle')}</h1>
            <p className="max-w-xl text-lg text-foreground-muted">{t('home.heroSubtitle')}</p>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={routes.register(locale)} size="lg">
                {t('home.heroCta')}
                <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={routes.courses(locale)} variant="outline" size="lg">
                {t('home.heroSecondary')}
              </ButtonLink>
            </div>

            <ul className="flex flex-wrap gap-2 pt-2">
              {CEFR_LEVELS.map((level) => (
                <li key={level}>
                  <span className="rounded-full border border-brand-200 bg-surface px-3 py-1 text-xs font-semibold text-brand-700">
                    {level}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Card className="space-y-4 p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{t('home.demoTitle')}</p>
                <Badge variant="success" size="sm">
                  A1
                </Badge>
              </div>
              <p className="text-sm text-foreground-muted">{t('home.demoPrompt')}</p>
              <div className="space-y-2.5">
                {['Je suis etudiant', 'Je es etudiant', 'Je suis etudiante'].map((option, index) => (
                  <div
                    key={option}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-sm ${
                      index === 0 ? 'border-teal-400 bg-teal-50 font-semibold' : 'border-border'
                    }`}
                  >
                    <span>{option}</span>
                    {index === 0 ? <span className="text-teal-600">&#10003;</span> : null}
                  </div>
                ))}
              </div>
              <p className="rounded-xl bg-surface-muted p-3 text-xs text-foreground-muted">
                {t('home.demoExplanation')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ stats */}
      <section className="container-page -mt-8 pb-8">
        <dl className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dd className="font-display text-2xl font-bold tabular-nums">{stat.value}</dd>
                  <dt className="text-xs text-foreground-muted">{stat.label}</dt>
                </div>
              </div>
            );
          })}
        </dl>
      </section>

      {/* ------------------------------------------------ piliers */}
      <section className="container-page py-14">
        <SectionHeading
          eyebrow={t('home.pillarsEyebrow')}
          title={t('home.pillarsTitle')}
          description={t('home.pillarsSubtitle')}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{pillar.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------ categories */}
      <section className="container-page py-8">
        <SectionHeading
          eyebrow={t('home.categoriesEyebrow')}
          title={t('home.categoriesTitle')}
          action={
            <Link href={routes.courses(locale)} className="text-sm font-semibold text-brand-700 hover:underline">
              {t('home.seeAll')}
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`${routes.courses(locale)}?category=${category.slug}`}
                className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-brand-300 hover:shadow-soft"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 font-display text-lg font-bold text-brand-700">
                  {(locale === 'ar' ? category.name.ar : category.name.fr).charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold">
                    {locale === 'ar' ? category.name.ar : category.name.fr}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-sm text-foreground-muted">
                    {locale === 'ar' ? category.description.ar : category.description.fr}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-brand-700">
                    {category.courseCount} {t('home.courses')}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ cours populaires */}
      <section className="container-page py-14">
        <SectionHeading
          eyebrow={t('home.popularEyebrow')}
          title={t('home.popularTitle')}
          description={t('home.popularSubtitle')}
        />
        <div className="grid-auto-cards">
          {popular.map((course) => (
            <CourseCard key={course.id} course={course} showFavorite={false} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ dernieres lecons */}
      <section className="container-page py-8">
        <SectionHeading eyebrow={t('home.latestEyebrow')} title={t('home.latestTitle')} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {latest.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={routes.lesson(locale, lesson.course.slug, lesson.slug)}
                className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-brand-300 hover:shadow-soft"
              >
                <Badge variant="outline" size="sm" className="self-start">
                  {lesson.course.level}
                </Badge>
                <span className="mt-3 font-semibold">
                  {locale === 'ar' ? lesson.titleAr : lesson.titleFr}
                </span>
                <span className="mt-1.5 line-clamp-2 text-sm text-foreground-muted">
                  {locale === 'ar' ? lesson.summaryAr : lesson.summaryFr}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ avis */}
      <section className="container-page py-14">
        <SectionHeading
          eyebrow={t('home.reviewsEyebrow')}
          title={t('home.reviewsTitle')}
          align="center"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.author} className="flex h-full flex-col gap-4 p-6">
              <Quote className="h-6 w-6 text-brand-400" aria-hidden="true" />
              <p className="flex-1 text-sm leading-relaxed text-foreground-muted">{review.quote}</p>
              <div className="flex items-center gap-1" aria-label="5/5">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-sun-500 text-sun-500" aria-hidden="true" />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">{review.author}</p>
                <p className="text-xs text-foreground-muted">{review.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ cta */}
      <section className="container-page py-10">
        <div className="rounded-3xl bg-ink-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl text-white sm:text-4xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">{t('home.ctaSubtitle')}</p>
          <ButtonLink href={routes.register(locale)} size="lg" className="mt-7">
            {t('home.ctaButton')}
            <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
