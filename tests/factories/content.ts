import type { Answer, Exercise, ExerciseType, Question } from '@prisma/client';
import type { CourseDto, ExerciseDto } from '@/types/content';

type QuestionWithAnswers = Question & { answers: Answer[] };

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${(counter += 1)}`;

export function makeAnswer(overrides: Partial<Answer> = {}): Answer {
  return {
    id: nextId('answer'),
    questionId: 'question-1',
    textFr: 'reponse',
    textAr: null,
    isCorrect: false,
    matchKey: null,
    position: 0,
    createdAt: new Date(),
    ...overrides,
  };
}

export function makeQuestion(overrides: Partial<QuestionWithAnswers> = {}): QuestionWithAnswers {
  return {
    id: nextId('question'),
    exerciseId: 'exercise-1',
    promptFr: 'Que signifie livre ?',
    promptAr: 'ماذا تعني livre ؟',
    hintFr: null,
    hintAr: null,
    explanationFr: 'livre = كتاب',
    explanationAr: 'livre = كتاب',
    audioUrl: null,
    imageUrl: null,
    position: 0,
    points: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    answers: [],
    ...overrides,
  };
}

export function makeExercise(
  type: ExerciseType,
  questions: QuestionWithAnswers[],
  overrides: Partial<Exercise> = {},
) {
  const exercise = {
    id: 'exercise-1',
    lessonId: 'lesson-1',
    type,
    titleFr: 'Exercice',
    titleAr: 'تمرين',
    instructionsFr: 'Consigne',
    instructionsAr: 'تعليمة',
    position: 0,
    points: 10,
    passingScore: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
  return {
    ...exercise,
    questions,
    lesson: { id: 'lesson-1', slug: 'lecon', titleFr: 'Lecon', titleAr: 'درس', courseId: 'course-1' },
  };
}

export function makeCourseDto(overrides: Partial<CourseDto> = {}): CourseDto {
  return {
    id: 'course-1',
    slug: 'grammaire-les-bases-a1',
    title: { fr: 'Les bases de la phrase', ar: 'أساسيات الجملة' },
    description: { fr: 'Construire vos premieres phrases.', ar: 'بناء أول جملة.' },
    level: 'A1',
    estimatedMinutes: 40,
    coverImage: null,
    lessonCount: 4,
    learnerCount: 1280,
    rating: 4.8,
    category: {
      id: 'cat-1',
      slug: 'grammaire',
      skill: 'GRAMMAR',
      name: { fr: 'Grammaire', ar: 'القواعد' },
      icon: 'book-open',
      color: 'brand',
    },
    ...overrides,
  };
}

export function makeExerciseDto(overrides: Partial<ExerciseDto> = {}): ExerciseDto {
  return {
    id: 'exercise-1',
    lessonId: 'lesson-1',
    type: 'MCQ',
    title: { fr: 'QCM de vocabulaire', ar: 'اختيار من متعدد' },
    instructions: { fr: 'Choisissez la bonne traduction.', ar: 'اختر الترجمة الصحيحة.' },
    points: 3,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        promptFr: 'Que signifie « livre » ?',
        promptAr: 'ماذا تعني « livre » ؟',
        hintFr: null,
        hintAr: null,
        audioUrl: null,
        imageUrl: null,
        position: 0,
        points: 1,
        options: [
          { id: 'a1', textFr: 'كتاب', textAr: 'كتاب', matchKey: null, position: 0 },
          { id: 'a2', textFr: 'قلم', textAr: 'قلم', matchKey: null, position: 1 },
        ],
      },
    ],
    ...overrides,
  };
}
