import type { Answer, ExerciseType, Question } from '@prisma/client';
import { NotFoundError } from '@/lib/api/errors';
import { exerciseRepository, type ExerciseWithQuestions } from '@/repositories/exercise.repository';
import { FREE_TEXT_TYPES } from '@/constants/exercises';
import { XP_REWARD } from '@/constants/gamification';
import { answersMatch } from '@/utils/text';
import { toExerciseDto } from './mappers';
import { progressService } from './progress.service';
import type {
  ExerciseCorrection,
  QuestionCorrection,
  SubmittedAnswer,
} from '@/types/exercise';

type QuestionWithAnswers = Question & { answers: Answer[] };

const sortedCorrect = (answers: Answer[]) =>
  answers.filter((a) => a.isCorrect).sort((a, b) => a.position - b.position);

/** Corrige une question selon le type d'exercice. Aucune I/O : pure et testable. */
export function gradeQuestion(
  type: ExerciseType,
  question: QuestionWithAnswers,
  submitted: SubmittedAnswer | undefined,
): QuestionCorrection {
  const correctAnswers = sortedCorrect(question.answers);
  const base = {
    questionId: question.id,
    maxPoints: question.points,
    explanationFr: question.explanationFr,
    explanationAr: question.explanationAr,
  };

  const fail = (expected: string[], given: string[]): QuestionCorrection => ({
    ...base,
    correct: false,
    earnedPoints: 0,
    expected,
    given,
  });

  if (!submitted) {
    return fail(correctAnswers.map((a) => a.textFr), []);
  }

  if (type === 'WORD_ORDER') {
    const expectedOrder = question.answers
      .slice()
      .sort((a, b) => Number(a.matchKey ?? a.position) - Number(b.matchKey ?? b.position));
    const givenIds = submitted.orderedAnswerIds ?? [];
    const correct =
      givenIds.length === expectedOrder.length &&
      expectedOrder.every((answer, index) => answer.id === givenIds[index]);
    const givenTexts = givenIds.map(
      (id) => question.answers.find((a) => a.id === id)?.textFr ?? '?',
    );
    return correct
      ? { ...base, correct: true, earnedPoints: question.points, expected: expectedOrder.map((a) => a.textFr), given: givenTexts }
      : fail(expectedOrder.map((a) => a.textFr), givenTexts);
  }

  if (type === 'MATCHING') {
    const pairs = submitted.pairs ?? {};
    const expected = question.answers.map((a) => `${a.textFr} = ${a.matchKey ?? ''}`);
    const given = Object.entries(pairs).map(([answerId, key]) => {
      const answer = question.answers.find((a) => a.id === answerId);
      return `${answer?.textFr ?? '?'} = ${key}`;
    });
    const allMatched =
      question.answers.length > 0 &&
      question.answers.every((answer) => pairs[answer.id] === (answer.matchKey ?? ''));
    return allMatched
      ? { ...base, correct: true, earnedPoints: question.points, expected, given }
      : fail(expected, given);
  }

  if (FREE_TEXT_TYPES.includes(type)) {
    const given = submitted.text?.trim() ?? '';
    const accepted = correctAnswers.map((a) => a.textFr);
    const correct = accepted.some((expected) => answersMatch(given, expected));
    return correct
      ? { ...base, correct: true, earnedPoints: question.points, expected: accepted, given: [given] }
      : fail(accepted, [given]);
  }

  // MCQ, TRUE_FALSE, FLASHCARD, LISTENING : selection d'une ou plusieurs options.
  const selected = [...(submitted.selectedAnswerIds ?? [])].sort();
  const expectedIds = correctAnswers.map((a) => a.id).sort();
  const correct =
    selected.length === expectedIds.length && selected.every((id, i) => id === expectedIds[i]);
  const givenTexts = selected.map((id) => question.answers.find((a) => a.id === id)?.textFr ?? '?');
  return correct
    ? {
        ...base,
        correct: true,
        earnedPoints: question.points,
        expected: correctAnswers.map((a) => a.textFr),
        given: givenTexts,
      }
    : fail(correctAnswers.map((a) => a.textFr), givenTexts);
}

export function gradeExercise(
  exercise: ExerciseWithQuestions,
  answers: SubmittedAnswer[],
): ExerciseCorrection {
  const byQuestion = new Map(answers.map((a) => [a.questionId, a]));
  const corrections = exercise.questions.map((question) =>
    gradeQuestion(exercise.type, question, byQuestion.get(question.id)),
  );

  const maxScore = corrections.reduce((sum, c) => sum + c.maxPoints, 0);
  const score = corrections.reduce((sum, c) => sum + c.earnedPoints, 0);
  const correctCount = corrections.filter((c) => c.correct).length;
  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const passed = percentage >= exercise.passingScore;
  const perfect = percentage === 100;

  return {
    exerciseId: exercise.id,
    type: exercise.type,
    score,
    maxScore,
    percentage,
    correctCount,
    totalCount: corrections.length,
    passed,
    xpEarned: passed ? (perfect ? XP_REWARD.perfectExercise : XP_REWARD.exercisePassed) : 0,
    corrections,
  };
}

export const exerciseService = {
  async detail(id: string) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) throw new NotFoundError('Exercice');
    return { exercise: toExerciseDto(exercise), lesson: exercise.lesson };
  },

  async forLesson(lessonId: string) {
    const exercises = await exerciseRepository.findByLessonId(lessonId);
    return exercises.map(toExerciseDto);
  },

  async submit(
    userId: string,
    exerciseId: string,
    answers: SubmittedAnswer[],
    durationSeconds: number,
  ) {
    const exercise = await exerciseRepository.findById(exerciseId);
    if (!exercise) throw new NotFoundError('Exercice');

    const correction = gradeExercise(exercise, answers);

    await exerciseRepository.saveResult({
      userId,
      exerciseId,
      score: correction.score,
      maxScore: correction.maxScore,
      correctCount: correction.correctCount,
      totalCount: correction.totalCount,
      percentage: correction.percentage,
      passed: correction.passed,
      durationSeconds,
      xpEarned: correction.xpEarned,
      details: correction.corrections.map((c) => ({
        questionId: c.questionId,
        correct: c.correct,
        given: c.given,
      })),
    });

    const reward = await progressService.award(userId, {
      xp: correction.xpEarned,
      minutes: Math.round(durationSeconds / 60),
      exercisesAttempted: 1,
      exercisesPassed: correction.passed ? 1 : 0,
      perfect: correction.percentage === 100 ? 1 : 0,
      accuracySample: { correct: correction.correctCount, total: correction.totalCount },
    });

    return { correction, ...reward };
  },

  history(userId: string, take = 20) {
    return exerciseRepository.findResults(userId, take);
  },
};
