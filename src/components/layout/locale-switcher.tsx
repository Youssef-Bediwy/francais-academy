'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, localeNames, type AppLocale } from '@/lib/i18n/config';
import { Dropdown } from '@/components/ui/dropdown';
import { useI18n } from '@/components/providers/i18n-provider';

export function LocaleSwitcher() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: AppLocale) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
    router.refresh();
  };

  return (
    <Dropdown
      label="Changer de langue"
      trigger={
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-medium"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{localeNames[locale]}</span>
        </button>
      }
      items={locales.map((value) => ({
        key: value,
        label: localeNames[value],
        onSelect: () => switchTo(value),
      }))}
    />
  );
}
