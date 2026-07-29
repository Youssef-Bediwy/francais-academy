'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, LayoutDashboard, Repeat } from 'lucide-react';
import { routes } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { useI18n } from '@/components/providers/i18n-provider';

/** Barre de navigation basse, visible uniquement sur mobile pour l'espace connecte. */
export function MobileNav() {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  const items = [
    { href: routes.dashboard(locale), label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: routes.courses(locale), label: t('nav.courses'), icon: BookOpen },
    { href: routes.review(locale), label: t('nav.review'), icon: Repeat },
    { href: routes.progress(locale), label: t('nav.progress'), icon: BarChart3 },
  ];

  return (
    <nav
      aria-label={t('nav.workspace')}
      className="fixed bottom-0 z-40 flex w-full border-t border-border bg-surface/95 backdrop-blur lg:hidden"
    >
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
              active ? 'text-brand-700' : 'text-foreground-muted',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
