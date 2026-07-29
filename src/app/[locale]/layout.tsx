import type { Metadata, Viewport } from 'next';
import { Cairo, Fraunces, Nunito_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import '@/styles/globals.css';
import { getDirection, htmlLang, isLocale, locales, type AppLocale } from '@/lib/i18n/config';
import { getMessages, getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { AppProviders } from '@/components/providers/app-providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { userRepository } from '@/repositories/user.repository';

const sans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const arabic = Cairo({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'fr';
  const t = await getTranslator(locale);
  return {
    title: { default: `${t('app.name')} - ${t('app.tagline')}`, template: `%s | ${t('app.name')}` },
    description: t('app.description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
    alternates: { languages: { fr: '/fr', ar: '/ar' } },
    openGraph: { title: t('app.name'), description: t('app.description'), locale, type: 'website' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as AppLocale;

  const [messages, session] = await Promise.all([getMessages(locale), getSession()]);
  const t = await getTranslator(locale);
  const profile = session ? await userRepository.findById(session.id) : null;

  return (
    <html
      lang={htmlLang[locale]}
      dir={getDirection(locale)}
      className={`${sans.variable} ${display.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <AppProviders locale={locale} messages={messages} user={session}>
          <a href="#main" className="skip-link">
            {t('common.skipToContent')}
          </a>
          <Navbar streak={profile?.streakCurrent} />
          <main id="main" className="pb-16">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
