import type { CefrLevel, CourseSkill, ExerciseType, ProgressStatus } from '@prisma/client';

export interface LocalizedText {
  fr: string;
  ar: string;
}

export interface CategoryDto {
  id: string;
  slug: string;
  skill: CourseSkill;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  color: string;
  courseCount: number;
}

export interface CourseDto {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  level: CefrLevel;
  estimatedMinutes: number;
  coverImage: string | null;
  lessonCount: number;
  learnerCount: number;
  rating: number;
  category: Pick<CategoryDto, 'id' | 'slug' | 'skill' | 'name' | 'icon' | 'color'>;
  progress?: ProgressSummary;
}

export interface LessonExample {
  fr: string;
  ar: string;
  audioUrl?: string;
}

export interface LessonDto {
  id: string;
  slug: string;
  courseId: string;
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText;
  explanation: LocalizedText;
  examples: LessonExample[];
  illustrationUrl: string | null;
  audioUrl: string | null;
  position: number;
  estimatedMinutes: number;
  xpReward: number;
  progress?: ProgressSummary;
}

export interface LessonListItem {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  position: number;
  estimatedMinutes: number;
  exerciseCount: number;
  status: ProgressStatus;
}

export interface VocabularyDto {
  id: string;
  wordFr: string;
  translationAr: string;
  phonetic: string | null;
  exampleFr: string;
  exampleAr: string;
  audioUrl: string | null;
  level: CefrLevel;
}

export interface AnswerOption {
  id: string;
  textFr: string;
  textAr: string | null;
  matchKey: string | null;
  position: number;
}

export interface QuestionDto {
  id: string;
  promptFr: string;
  promptAr: string;
  hintFr: string | null;
  hintAr: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
  position: number;
  points: number;
  options: AnswerOption[];
}

export interface ExerciseDto {
  id: string;
  lessonId: string;
  type: ExerciseType;
  title: LocalizedText;
  instructions: LocalizedText;
  points: number;
  passingScore: number;
  questions: QuestionDto[];
}

export interface ProgressSummary {
  status: ProgressStatus;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: Date | null;
}

export interface FlashcardDto {
  id: string;
  frontFr: string;
  backAr: string;
  hintFr: string | null;
  audioUrl: string | null;
  level: CefrLevel;
  dueAt?: Date;
  repetitions?: number;
}
