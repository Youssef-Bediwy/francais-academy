/** Normalise une reponse libre : casse, accents, ponctuation, espaces. */
export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.,;:!?'"()\u00ab\u00bb]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const answersMatch = (given: string, expected: string) =>
  normalizeAnswer(given) === normalizeAnswer(expected);

export function truncate(input: string, max: number): string {
  return input.length <= max ? input : `${input.slice(0, Math.max(0, max - 1)).trimEnd()}\u2026`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
