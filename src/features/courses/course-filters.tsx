'use client';

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { CategoryDto } from '@/types/content';
import { CEFR_LEVELS } from '@/constants/levels';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { useQueryParams } from '@/hooks/use-pagination';
import { useI18n } from '@/components/providers/i18n-provider';

export function CourseFilters({ categories }: { categories: CategoryDto[] }) {
  const { t, locale } = useI18n();
  const { get, setParams } = useQueryParams();
  const [search, setSearch] = useState(get('search') ?? '');
  const debounced = useDebounce(search, 400);

  useEffect(() => {
    const current = get('search') ?? '';
    if (debounced !== current) setParams({ search: debounced }, { resetPage: true });
  }, [debounced, get, setParams]);

  return (
    <div className="mb-8 grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-4">
      <Input
        id="course-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('courses.searchPlaceholder')}
        icon={<Search className="h-4 w-4" />}
        className="md:col-span-2"
        aria-label={t('courses.searchPlaceholder')}
      />

      <Select
        id="course-category"
        aria-label={t('courses.category')}
        placeholder={t('courses.allCategories')}
        value={get('category') ?? ''}
        options={categories.map((category) => ({
          value: category.slug,
          label: locale === 'ar' ? category.name.ar : category.name.fr,
        }))}
        onChange={(event) => setParams({ category: event.target.value }, { resetPage: true })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="course-level"
          aria-label={t('courses.level')}
          placeholder={t('courses.allLevels')}
          value={get('level') ?? ''}
          options={CEFR_LEVELS.map((level) => ({ value: level, label: level }))}
          onChange={(event) => setParams({ level: event.target.value }, { resetPage: true })}
        />
        <Select
          id="course-sort"
          aria-label={t('courses.sort')}
          value={get('sort') ?? 'popular'}
          options={[
            { value: 'popular', label: t('courses.sortPopular') },
            { value: 'recent', label: t('courses.sortRecent') },
            { value: 'level', label: t('courses.sortLevel') },
            { value: 'alphabetical', label: t('courses.sortAlpha') },
          ]}
          onChange={(event) => setParams({ sort: event.target.value }, { resetPage: true })}
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="justify-self-start md:col-span-4"
        onClick={() => {
          setSearch('');
          setParams({ search: undefined, category: undefined, level: undefined, sort: undefined }, { resetPage: true });
        }}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        {t('courses.reset')}
      </Button>
    </div>
  );
}
