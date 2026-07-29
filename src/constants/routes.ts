import type { AppLocale } from '@/lib/i18n/config';

const base = (locale: AppLocale) => `/${locale}`;

export const routes = {
  home: (l: AppLocale) => base(l),
  about: (l: AppLocale) => `${base(l)}/about`,
  pricing: (l: AppLocale) => `${base(l)}/pricing`,
  login: (l: AppLocale) => `${base(l)}/login`,
  register: (l: AppLocale) => `${base(l)}/register`,
  courses: (l: AppLocale) => `${base(l)}/courses`,
  course: (l: AppLocale, slug: string) => `${base(l)}/courses/${slug}`,
  lesson: (l: AppLocale, courseSlug: string, lessonSlug: string) =>
    `${base(l)}/courses/${courseSlug}/lessons/${lessonSlug}`,
  exercise: (l: AppLocale, id: string) => `${base(l)}/exercises/${id}`,
  review: (l: AppLocale) => `${base(l)}/review`,
  search: (l: AppLocale) => `${base(l)}/search`,
  favorites: (l: AppLocale) => `${base(l)}/favorites`,
  dashboard: (l: AppLocale) => `${base(l)}/dashboard`,
  progress: (l: AppLocale) => `${base(l)}/progress`,
  achievements: (l: AppLocale) => `${base(l)}/achievements`,
  settings: (l: AppLocale) => `${base(l)}/settings`,
  admin: (l: AppLocale) => `${base(l)}/admin`,
  adminCourses: (l: AppLocale) => `${base(l)}/admin/courses`,
  adminCategories: (l: AppLocale) => `${base(l)}/admin/categories`,
  adminLessons: (l: AppLocale) => `${base(l)}/admin/lessons`,
  adminQuestions: (l: AppLocale) => `${base(l)}/admin/questions`,
  adminFlashcards: (l: AppLocale) => `${base(l)}/admin/flashcards`,
  adminUsers: (l: AppLocale) => `${base(l)}/admin/users`,
} as const;

export const PROTECTED_PREFIXES = ['/dashboard', '/progress', '/achievements', '/settings', '/favorites', '/review', '/admin'];
export const ADMIN_PREFIX = '/admin';
