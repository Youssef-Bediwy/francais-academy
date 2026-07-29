'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, LogOut, Menu, Search, Sparkles, User, X } from 'lucide-react';
import { routes } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { Button, ButtonLink } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LocaleSwitcher } from './locale-switcher';
import { useI18n } from '@/components/providers/i18n-provider';
import { useSession } from '@/components/providers/session-provider';
import { apiFetch } from '@/hooks/use-api';

export function Navbar({ streak }: { streak?: number }) {
  const { t, locale } = useI18n();
  const user = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { href: routes.courses(locale), label: t('nav.courses') },
    { href: routes.review(locale), label: t('nav.review') },
    { href: routes.search(locale), label: t('nav.search') },
    { href: routes.about(locale), label: t('nav.about') },
  ];

  const logout = async () => {
    await apiFetch<void>('/api/auth/logout', { method: 'POST' });
    router.push(routes.home(locale));
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href={routes.home(locale)} className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">{t('app.name')}</span>
        </Link>

        <nav aria-label={t('nav.main')} className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-surface-muted',
                pathname === link.href && 'bg-surface-muted text-brand-700',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {typeof streak === 'number' && streak > 0 ? (
            <Badge variant="warning" className="hidden sm:inline-flex">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              {streak}
            </Badge>
          ) : null}

          <Link
            href={routes.search(locale)}
            aria-label={t('nav.search')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface md:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>

          <LocaleSwitcher />

          {user ? (
            <Dropdown
              label={t('nav.account')}
              trigger={
                <button type="button" className="rounded-full">
                  <Avatar name={user.name} size="md" />
                </button>
              }
              items={[
                { key: 'dashboard', label: t('nav.dashboard'), href: routes.dashboard(locale) },
                { key: 'progress', label: t('nav.progress'), href: routes.progress(locale) },
                { key: 'favorites', label: t('nav.favorites'), href: routes.favorites(locale) },
                { key: 'achievements', label: t('nav.achievements'), href: routes.achievements(locale) },
                ...(user.role === 'ADMIN'
                  ? [{ key: 'admin', label: t('nav.admin'), href: routes.admin(locale) }]
                  : []),
                {
                  key: 'logout',
                  label: (
                    <span className="inline-flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </span>
                  ),
                  destructive: true,
                  onSelect: () => void logout(),
                },
              ]}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href={routes.login(locale)} variant="ghost" size="sm">
                {t('nav.login')}
              </ButtonLink>
              <ButtonLink href={routes.register(locale)} size="sm">
                {t('nav.register')}
              </ButtonLink>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t('nav.menu')}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-surface md:hidden">
          <nav aria-label={t('nav.main')} className="container-page flex flex-col py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-surface-muted"
              >
                {link.label}
              </Link>
            ))}
            {!user ? (
              <div className="mt-2 flex gap-2">
                <ButtonLink href={routes.login(locale)} variant="outline" block>
                  {t('nav.login')}
                </ButtonLink>
                <ButtonLink href={routes.register(locale)} block>
                  {t('nav.register')}
                </ButtonLink>
              </div>
            ) : (
              <Link
                href={routes.dashboard(locale)}
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-surface-muted"
              >
                <User className="h-4 w-4" />
                {t('nav.dashboard')}
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
