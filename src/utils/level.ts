import { MAX_INTERNAL_LEVEL, XP_PER_LEVEL } from '@/constants/gamification';

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  percentToNextLevel: number;
}

export function levelFromXp(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  const rawLevel = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const level = Math.min(MAX_INTERNAL_LEVEL, rawLevel);
  const xpIntoLevel = level === MAX_INTERNAL_LEVEL ? XP_PER_LEVEL : safeXp % XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    percentToNextLevel: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
  };
}
