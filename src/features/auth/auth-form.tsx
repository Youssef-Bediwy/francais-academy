'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import { routes } from '@/constants/routes';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/hooks/use-api';
import { useI18n } from '@/components/providers/i18n-provider';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isRegister = mode === 'register';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = isRegister
      ? {
          name: String(form.get('name') ?? ''),
          email: String(form.get('email') ?? ''),
          password: String(form.get('password') ?? ''),
          locale,
        }
      : {
          email: String(form.get('email') ?? ''),
          password: String(form.get('password') ?? ''),
        };

    try {
      await apiFetch(isRegister ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      router.push(routes.dashboard(locale));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('errors.generic'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md p-7">
      <h1 className="text-2xl">{t(isRegister ? 'auth.registerTitle' : 'auth.loginTitle')}</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        {t(isRegister ? 'auth.registerSubtitle' : 'auth.loginSubtitle')}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {error ? <Alert variant="danger">{error}</Alert> : null}

        {isRegister ? (
          <Input id="name" name="name" label={t('auth.name')} required minLength={2} autoComplete="name" />
        ) : null}

        <Input
          id="email"
          name="email"
          type="email"
          label={t('auth.email')}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label={t('auth.password')}
          required
          minLength={8}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          hint={isRegister ? t('auth.passwordHint') : undefined}
        />

        <Button type="submit" block loading={pending}>
          {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          {t(isRegister ? 'auth.registerCta' : 'auth.loginCta')}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-foreground-muted">
        {t(isRegister ? 'auth.haveAccount' : 'auth.noAccount')}{' '}
        <Link
          href={isRegister ? routes.login(locale) : routes.register(locale)}
          className="font-semibold text-brand-700 hover:underline"
        >
          {t(isRegister ? 'auth.loginCta' : 'auth.registerCta')}
        </Link>
      </p>
    </Card>
  );
}
