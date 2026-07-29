'use client';

import { useEffect, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import type { CourseDto, VocabularyDto } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { CourseCard } from '@/components/domain/course-card';
import { useDebounce } from '@/hooks/use-debounce';
import { apiFetch } from '@/hooks/use-api';
import { useI18n } from '@/components/providers/i18n-provider';
import { CEFR_LEVELS } from '@/constants/levels';

interface SearchResponse {
  courses: { items: CourseDto[]; total: number };
  lessons: {
    items: { id: string; slug: string; titleFr: string; titleAr: string; summaryFr: string; summaryAr: string }[];
    total: number;
  };
  vocabulary: { items: VocabularyDto[]; total: number };
  total: number;
}

export function SearchView() {
  const { t, locale } = useI18n();
  const [term, setTerm] = useState('');
  const [scope, setScope] = useState('all');
  const [level, setLevel] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(term, 350);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ q: debounced, scope, perPage: '9' });
    if (level) params.set('level', level);

    apiFetch<SearchResponse>(`/api/search?${params.toString()}`)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, scope, level]);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          id="global-search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={t('search.placeholder')}
          icon={<SearchIcon className="h-4 w-4" />}
          className="md:col-span-2"
          aria-label={t('search.placeholder')}
          autoFocus
        />
        <Select
          id="search-scope"
          aria-label={t('search.scope')}
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          options={[
            { value: 'all', label: t('search.scopeAll') },
            { value: 'courses', label: t('search.scopeCourses') },
            { value: 'lessons', label: t('search.scopeLessons') },
            { value: 'vocabulary', label: t('search.scopeWords') },
          ]}
        />
        <Select
          id="search-level"
          aria-label={t('courses.level')}
          placeholder={t('courses.allLevels')}
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          options={CEFR_LEVELS.map((value) => ({ value, label: value }))}
        />
      </div>

      {loading ? <SkeletonGrid count={3} /> : null}

      {!loading && debounced.trim().length >= 2 && results?.total === 0 ? (
        <EmptyState title={t('search.noResults')} description={t('search.noResultsHint')} />
      ) : null}

      {!loading && results && results.total > 0 ? (
        <div className="space-y-10">
          {results.courses.items.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl">
                {t('search.courses')} <Badge size="sm">{results.courses.total}</Badge>
              </h2>
              <div className="grid-auto-cards">
                {results.courses.items.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          ) : null}

          {results.lessons.items.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl">
                {t('search.lessons')} <Badge size="sm">{results.lessons.total}</Badge>
              </h2>
              <ul className="space-y-2">
                {results.lessons.items.map((lesson) => (
                  <li key={lesson.id}>
                    <Card className="p-4">
                      <p className="font-semibold">{locale === 'ar' ? lesson.titleAr : lesson.titleFr}</p>
                      <p className="mt-1 text-sm text-foreground-muted">
                        {locale === 'ar' ? lesson.summaryAr : lesson.summaryFr}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.vocabulary.items.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xl">
                {t('search.words')} <Badge size="sm">{results.vocabulary.total}</Badge>
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {results.vocabulary.items.map((word) => (
                  <li key={word.id}>
                    <Card className="flex items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-semibold">{word.wordFr}</p>
                        {word.phonetic ? (
                          <p className="text-xs text-foreground-muted">{word.phonetic}</p>
                        ) : null}
                      </div>
                      <p className="font-arabic text-lg text-brand-700" dir="rtl">
                        {word.translationAr}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {debounced.trim().length < 2 && !loading ? (
        <EmptyState title={t('search.startTitle')} description={t('search.startHint')} icon={<SearchIcon className="h-8 w-8" />} />
      ) : null}
    </div>
  );
}
