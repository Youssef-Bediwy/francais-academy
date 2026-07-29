'use client';

import { createContext, useContext, useMemo } from 'react';
import type { AppLocale } from '@/lib/i18n/config';
import { getDirection } from '@/lib/i18n/config';
import { createTranslator, type Messages, type Translator } from '@/lib/i18n/translate';

interface I18nValue {
  locale: AppLocale;
  dir: 'ltr' | 'rtl';
  t: Translator;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: AppLocale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, dir: getDirection(locale), t: createTranslator(messages) }),
    [locale, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n doit etre utilise dans un I18nProvider');
  return context;
}
