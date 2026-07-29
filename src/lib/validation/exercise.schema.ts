import { z } from 'zod';
import { exerciseTypeSchema, idSchema } from './common.schema';

export const answerInputSchema = z.object({
  textFr: z.string().min(1),
  textAr: z.string().nullish(),
  isCorrect: z.boolean().default(false),
  matchKey: z.string().nullish(),
  position: z.number().int().min(0).default(0),
});

export const questionInputSchema = z.object({
  promptFr: z.string().min(3),
  promptAr: z.string().min(1),
  hintFr: z.string().nullish(),
  hintAr: z.string().nullish(),
  explanationFr: z.string().min(3),
  explanationAr: z.string().min(1),
  audioUrl: z.string().url().nullish(),
  imageUrl: z.string().url().nullish(),
  position: z.number().int().min(0).default(0),
  points: z.number().int().min(1).max(20).default(1),
  answers: z.array(answerInputSchema).min(2, 'Au moins deux reponses'),
});

export const createExerciseSchema = z.object({
  lessonId: idSchema,
  type: exerciseTypeSchema,
  titleFr: z.string().min(3).max(160),
  titleAr: z.string().min(1).max(160),
  instructionsFr: z.string().min(3).max(400),
  instructionsAr: z.string().min(1).max(400),
  position: z.number().int().min(0).default(0),
  points: z.number().int().min(1).max(200).default(10),
  passingScore: z.number().int().min(1).max(100).default(70),
  questions: z.array(questionInputSchema).min(1, 'Au moins une question'),
});

export const updateExerciseSchema = createExerciseSchema.partial().omit({ questions: true });

export const submittedAnswerSchema = z
  .object({
    questionId: idSchema,
    selectedAnswerIds: z.array(idSchema).optional(),
    text: z.string().max(600).optional(),
    orderedAnswerIds: z.array(idSchema).optional(),
    pairs: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (value) =>
      value.selectedAnswerIds !== undefined ||
      value.text !== undefined ||
      value.orderedAnswerIds !== undefined ||
      value.pairs !== undefined,
    { message: 'Aucune reponse fournie' },
  );

export const submitExerciseSchema = z.object({
  answers: z.array(submittedAnswerSchema).min(1),
  durationSeconds: z.number().int().min(0).max(24 * 3600).default(0),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type SubmitExerciseInput = z.infer<typeof submitExerciseSchema>;
