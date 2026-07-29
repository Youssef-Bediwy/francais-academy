'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Heart,
  LayoutDashboard,
  Repeat,
  Settings,
  Shield,
  Trophy,
} from 'lucide-react';
import { routes } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { useI18n } from '@/components/providers/i18n-provider';
import { useSession } from '@/components/providers/session-provider';

export function Sidebar() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const user = useSession();

  const items = [
    { href: routes.dashboard(locale), label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: routes.courses(locale), label: t('nav.courses'), icon: BookOpen },
    { href: routes.review(locale), label: t('nav.review'), icon: Repeat },
    { href: routes.progress(locale), label: t('nav.progress'), icon: BarChart3 },
    { href: routes.achievements(locale), label: t('nav.achievements'), icon: Trophy },
    { href: routes.favorites(locale), label: t('nav.favorites'), icon: Heart },
    { href: routes.settings(locale), label: t('nav.settings'), icon: Settings },
    ...(user?.role === 'ADMIN'
      ? [{ href: routes.admin(locale), label: t('nav.admin'), icon: Shield }]
      : []),
  ];

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav aria-label={t('nav.workspace')} className="sticky top-24 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-foreground-muted hover:bg-surface hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
