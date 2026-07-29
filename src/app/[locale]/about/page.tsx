import { Compass, HeartHandshake, Languages, Target } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);

  const values = [
    { icon: Target, title: t('about.value1Title'), text: t('about.value1Text') },
    { icon: Languages, title: t('about.value2Title'), text: t('about.value2Text') },
    { icon: Compass, title: t('about.value3Title'), text: t('about.value3Text') },
    { icon: HeartHandshake, title: t('about.value4Title'), text: t('about.value4Text') },
  ];

  return (
    <div className="container-page py-14">
      <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} description={t('about.intro')} />
      <div className="grid gap-5 sm:grid-cols-2">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <Card key={value.title} className="p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm text-foreground-muted">{value.text}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
