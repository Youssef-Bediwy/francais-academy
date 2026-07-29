'use client';

import { I18nProvider } from './i18n-provider';
import { SessionProvider } from './session-provider';
import { ToastProvider } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { AppLocale } from '@/lib/i18n/config';
import type { Messages } from '@/lib/i18n/translate';
import type { SessionUser } from '@/lib/auth';

export function AppProviders({
  locale,
  messages,
  user,
  children,
}: {
  locale: AppLocale;
  messages: Messages;
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <SessionProvider user={user}>
        <TooltipProvider>
          <ToastProvider>{children}</ToastProvider>
        </TooltipProvider>
      </SessionProvider>
    </I18nProvider>
  );
}
