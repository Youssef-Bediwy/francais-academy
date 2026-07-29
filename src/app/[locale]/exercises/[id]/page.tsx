import { notFound } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { exerciseService } from '@/services/exercise.service';
import { NotFoundError } from '@/lib/api/errors';
import { routes } from '@/constants/routes';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ExerciseRunner } from '@/features/exercises/exercise-runner';

export default async function ExercisePage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);

  let data;
  try {
    data = await exerciseService.detail(params.id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const { exercise, lesson } = data;

  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumb
        items={[
          { label: t('nav.courses'), href: routes.courses(locale) },
          { label: locale === 'ar' ? lesson.titleAr : lesson.titleFr },
          { label: locale === 'ar' ? exercise.title.ar : exercise.title.fr },
        ]}
      />
      <h1 className="mb-2 text-2xl">{locale === 'ar' ? exercise.title.ar : exercise.title.fr}</h1>
      <p className="mb-8 text-sm text-foreground-muted">
        {locale === 'ar' ? exercise.instructions.ar : exercise.instructions.fr}
      </p>
      <ExerciseRunner exercise={exercise} />
    </div>
  );
}
