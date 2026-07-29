/** Palier d'XP requis pour atteindre chaque niveau interne (index = niveau - 1). */
export const XP_PER_LEVEL = 250;
export const MAX_INTERNAL_LEVEL = 60;

export const XP_REWARD = {
  lessonCompleted: 20,
  exercisePassed: 15,
  perfectExercise: 25,
  flashcardReviewed: 2,
  dailyGoal: 40,
  streakMilestone: 60,
} as const;

export const DEFAULT_DAILY_GOAL = { targetXp: 50, targetLessons: 1, targetMinutes: 15 } as const;

/** Intervalles SM-2 initiaux (en jours) pour les deux premieres reussites. */
export const SM2 = {
  firstInterval: 1,
  secondInterval: 6,
  minEase: 1.3,
  maxEase: 2.8,
  defaultEase: 2.5,
} as const;
