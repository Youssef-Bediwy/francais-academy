export function startOfDayUtc(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = startOfDayUtc(b).getTime() - startOfDayUtc(a).getTime();
  return Math.round(ms / 86_400_000);
}

export const isSameDay = (a: Date, b: Date) => daysBetween(a, b) === 0;

export const toIsoDate = (date: Date) => startOfDayUtc(date).toISOString().slice(0, 10);
