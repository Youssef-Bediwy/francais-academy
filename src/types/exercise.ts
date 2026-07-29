import type { ExerciseType } from '@prisma/client';

/** Reponse envoyee par le client pour une question. */
export interface SubmittedAnswer {
  questionId: string;
  /** MCQ / TRUE_FALSE : ids selectionnes. */
  selectedAnswerIds?: string[];
  /** FILL_BLANK / SENTENCE_COMPLETION / PRONUNCIATION : texte saisi. */
  text?: string;
  /** WORD_ORDER : ids ordonnes. */
  orderedAnswerIds?: string[];
  /** MATCHING : { answerId: matchKey choisi }. */
  pairs?: Record<string, string>;
}

export interface QuestionCorrection {
  questionId: string;
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
  expected: string[];
  given: string[];
  explanationFr: string;
  explanationAr: string;
}

export interface ExerciseCorrection {
  exerciseId: string;
  type: ExerciseType;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  xpEarned: number;
  corrections: QuestionCorrection[];
}
