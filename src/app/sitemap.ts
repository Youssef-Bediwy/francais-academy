import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { courseRepository } from '@/repositories/course.repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const staticPaths = ['', '/courses', '/about', '/pricing', '/search'];

  const entries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );

  try {
    const { items } = await courseRepository.findMany({
      page: 1,
      perPage: 60,
      sort: 'recent',
    });
    for (const locale of locales) {
      for (const course of items) {
        entries.push({
          url: `${base}/${locale}/courses/${course.slug}`,
          lastModified: course.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // base indisponible au moment du build : on retourne les routes statiques
  }

  return entries;
}
