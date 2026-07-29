import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { lessonService } from '@/services/lesson.service';
import { NotFoundError } from '@/lib/api/errors';
import { routes } from '@/constants/routes';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AudioButton } from '@/components/domain/audio-button';
import { FavoriteButton } from '@/components/domain/favorite-button';
import { ExerciseCard } from '@/components/domain/exercise-card';
import { LessonActions } from '@/features/lessons/lesson-actions';

interface PageProps {
  params: { locale: string; slug: string; lessonSlug: string };
}

export default async function LessonPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();

  let data;
  try {
    data = await lessonService.detail(params.slug, params.lessonSlug, session?.id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const { lesson, course, vocabulary, exercises, previous, next, lessonIndex, totalLessons } = data;
  const title = locale === 'ar' ? lesson.title.ar : lesson.title.fr;
  const content = locale === 'ar' ? lesson.content.ar : lesson.content.fr;
  const explanation = locale === 'ar' ? lesson.explanation.ar : lesson.explanation.fr;
  const summary = locale === 'ar' ? lesson.summary.ar : lesson.summary.fr;
  const courseTitle = locale === 'ar' ? course.titleAr : course.titleFr;

  return (
    <article className="container-page py-10">
      <Breadcrumb
        items={[
          { label: t('nav.courses'), href: routes.courses(locale) },
          { label: courseTitle, href: routes.course(locale, course.slug) },
          { label: title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" size="sm">
              {t('lesson.step')} {lessonIndex} / {totalLessons}
            </Badge>
            <Badge variant="brand" size="sm">
              {course.level}
            </Badge>
            <AudioButton src={lesson.audioUrl} label={t('lesson.listen')} />
            <FavoriteButton type="LESSON" targetId={lesson.id} />
          </div>

          <h1 className="mt-4 text-3xl">{title}</h1>
          <p className="mt-3 text-foreground-muted">{summary}</p>

          {lesson.illustrationUrl ? (
            <div className="relative mt-6 aspect-[16/7] overflow-hidden rounded-2xl border border-border">
              <Image
                src={lesson.illustrationUrl}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <section className="prose-lesson mt-8 space-y-4">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>

          <Card className="mt-8 border-brand-200 bg-brand-50/60 p-6">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
              <Lightbulb className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('lesson.explanation')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/90">{explanation}</p>
          </Card>

          {lesson.examples.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-xl">{t('lesson.examples')}</h2>
              <ul className="mt-4 space-y-3">
                {lesson.examples.map((example, index) => (
                  <li
                    key={index}
                    className="grid gap-2 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2 sm:items-center"
                  >
                    <p className="font-medium">{example.fr}</p>
                    <p className="font-arabic text-lg text-brand-700" dir="rtl">
                      {example.ar}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {vocabulary.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-xl">{t('lesson.vocabulary')}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {vocabulary.map((word) => (
                  <li
                    key={word.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
                  >
                    <div>
                      <p className="font-semibold">{word.wordFr}</p>
                      {word.phonetic ? (
                        <p className="text-xs text-foreground-muted">{word.phonetic}</p>
                      ) : null}
                    </div>
                    <p className="font-arabic text-lg text-brand-700" dir="rtl">
                      {word.translationAr}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {exercises.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl">{t('lesson.practise')}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            </section>
          ) : null}

          <nav className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
            {previous ? (
              <Link
                href={routes.lesson(locale, course.slug, previous.slug)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
              >
                <ChevronLeft className="h-4 w-4 rtl-flip" aria-hidden="true" />
                {t('common.previous')}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={routes.lesson(locale, course.slug, next.slug)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4 rtl-flip" aria-hidden="true" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <Card className="space-y-4 p-5">
            <h2 className="text-base font-semibold">{t('lesson.progress')}</h2>
            <ProgressBar value={lesson.progress?.percentage ?? 0} showValue tone="teal" />
            <LessonActions
              lessonId={lesson.id}
              completed={lesson.progress?.status === 'COMPLETED'}
              authenticated={Boolean(session)}
            />
            {!session ? (
              <p className="text-xs text-foreground-muted">{t('lesson.loginToTrack')}</p>
            ) : null}
          </Card>

          <Card className="space-y-2 p-5">
            <h2 className="text-base font-semibold">{t('lesson.summary')}</h2>
            <p className="text-sm text-foreground-muted">{summary}</p>
            <p className="pt-2 text-xs font-semibold text-brand-700">+ {lesson.xpReward} XP</p>
          </Card>
        </aside>
      </div>
    </article>
  );
}
