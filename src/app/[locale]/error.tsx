'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-12 w-12 text-berry-500" aria-hidden="true" />
      <h1 className="text-2xl">Une erreur est survenue</h1>
      <p className="max-w-md text-sm text-foreground-muted">
        Nous n&apos;avons pas pu charger cette page. Vous pouvez reessayer.
      </p>
      <Button onClick={reset}>Reessayer</Button>
    </div>
  );
}
