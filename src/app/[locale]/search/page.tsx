import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { SectionHeading } from '@/components/ui/section-heading';
import { SearchView } from '@/features/search/search-view';

export default async function SearchPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);

  return (
    <div className="container-page py-12">
      <SectionHeading eyebrow={t('search.eyebrow')} title={t('search.title')} description={t('search.subtitle')} />
      <SearchView />
    </div>
  );
}
