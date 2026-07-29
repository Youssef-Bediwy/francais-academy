import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import messages from '@/messages/fr.json';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { ToastProvider } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { AppLocale } from '@/lib/i18n/config';
import type { SessionUser } from '@/lib/auth';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  locale?: AppLocale;
  user?: SessionUser | null;
}

/** Rend un composant avec tous les providers de l application. */
export function render(ui: ReactElement, { locale = 'fr', user = null, ...options }: Options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <I18nProvider locale={locale} messages={messages}>
        <SessionProvider user={user}>
          <TooltipProvider>
            <ToastProvider>{children}</ToastProvider>
          </TooltipProvider>
        </SessionProvider>
      </I18nProvider>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
