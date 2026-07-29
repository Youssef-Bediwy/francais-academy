import type { BadgeTier, CefrLevel } from '@prisma/client';

export interface ProgressOverview {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  percentToNextLevel: number;
  cefrLevel: CefrLevel;
  streakCurrent: number;
  streakLongest: number;
  totalTimeSeconds: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  exercisesPassed: number;
  flashcardsReviewed: number;
  accuracy: number;
  globalPercentage: number;
}

export interface ActivityPoint {
  date: string;
  xp: number;
  minutes: number;
}

export interface DailyGoalDto {
  date: string;
  targetXp: number;
  achievedXp: number;
  targetLessons: number;
  achievedLessons: number;
  targetMinutes: number;
  achievedMinutes: number;
  completed: boolean;
}

export interface AchievementDto {
  id: string;
  code: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  icon: string;
  tier: BadgeTier;
  threshold: number;
  progress: number;
  unlocked: boolean;
  unlockedAt: Date | null;
}

export interface RecentActivityItem {
  id: string;
  kind: 'lesson' | 'exercise' | 'review' | 'badge';
  labelFr: string;
  labelAr: string;
  xp: number;
  at: Date;
}
