import 'server-only';
import type { AppLocale } from './config';
import { createTranslator, type Messages, type Translator } from './translate';

const loaders: Record<AppLocale, () => Promise<Messages>> = {
  fr: () => import('@/messages/fr.json').then((m) => m.default as Messages),
  ar: () => import('@/messages/ar.json').then((m) => m.default as Messages),
};

export async function getMessages(locale: AppLocale): Promise<Messages> {
  return loaders[locale]();
}

export async function getTranslator(locale: AppLocale): Promise<Translator> {
  return createTranslator(await getMessages(locale));
}
