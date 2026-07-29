import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Compass className="h-12 w-12 text-brand-500" aria-hidden="true" />
      <h1 className="text-3xl">404</h1>
      <p className="text-foreground-muted">Cette page n&apos;existe pas ou a ete deplacee.</p>
      <Link href="/fr" className="font-semibold text-brand-700 hover:underline">
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}
