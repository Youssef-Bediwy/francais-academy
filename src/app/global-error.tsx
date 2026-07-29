'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui', padding: '4rem', textAlign: 'center' }}>
        <h1>Erreur critique</h1>
        <p>L&apos;application n&apos;a pas pu demarrer correctement.</p>
        <button type="button" onClick={reset} style={{ marginTop: '1rem' }}>
          Reessayer
        </button>
      </body>
    </html>
  );
}
