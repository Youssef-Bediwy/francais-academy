'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { routes } from '@/constants/routes';
import { useI18n } from '@/components/providers/i18n-provider';

export function Footer() {
  const { t, locale } = useI18n();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t('footer.learn'),
      links: [
        { href: routes.courses(locale), label: t('nav.courses') },
        { href: routes.review(locale), label: t('nav.review') },
        { href: routes.search(locale), label: t('nav.search') },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { href: routes.about(locale), label: t('nav.about') },
        { href: routes.pricing(locale), label: t('nav.pricing') },
      ],
    },
    {
      title: t('footer.account'),
      links: [
        { href: routes.login(locale), label: t('nav.login') },
        { href: routes.register(locale), label: t('nav.register') },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <span className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            {t('app.name')}
          </span>
          <p className="max-w-xs text-sm text-foreground-muted">{t('app.tagline')}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-3 text-sm font-semibold">{column.title}</p>
            <ul className="space-y-2 text-sm text-foreground-muted">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-700 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-5">
        <p className="container-page text-xs text-foreground-muted">
          &copy; {year} {t('app.name')}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
