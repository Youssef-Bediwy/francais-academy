import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

process.env.AUTH_SECRET = process.env.AUTH_SECRET ?? 'secret-de-test-suffisamment-long-pour-zod';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/test';

// Next navigation n existe pas en environnement jsdom.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/fr/courses',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
