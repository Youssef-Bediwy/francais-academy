import { describe, expect, it } from 'vitest';
import { gradeExercise, gradeQuestion } from '@/services/exercise.service';
import { makeAnswer, makeExercise, makeQuestion } from '@tests/factories/content';

describe('gradeQuestion', () => {
  it('valide un QCM quand la bonne option est selectionnee', () => {
    const good = makeAnswer({ textFr: 'كتاب', isCorrect: true, position: 0 });
    const bad = makeAnswer({ textFr: 'قلم', position: 1 });
    const question = makeQuestion({ answers: [good, bad] });

    const result = gradeQuestion('MCQ', question, {
      questionId: question.id,
      selectedAnswerIds: [good.id],
    });

    expect(result.correct).toBe(true);
    expect(result.earnedPoints).toBe(1);
  });

  it('refuse un QCM quand la mauvaise option est selectionnee', () => {
    const good = makeAnswer({ isCorrect: true, position: 0 });
    const bad = makeAnswer({ position: 1 });
    const question = makeQuestion({ answers: [good, bad] });

    const result = gradeQuestion('MCQ', question, {
      questionId: question.id,
      selectedAnswerIds: [bad.id],
    });

    expect(result.correct).toBe(false);
    expect(result.earnedPoints).toBe(0);
  });

  it('accepte une reponse libre malgre accents et majuscules', () => {
    const expected = makeAnswer({ textFr: 'etudiant', isCorrect: true });
    const question = makeQuestion({ answers: [expected] });

    const result = gradeQuestion('FILL_BLANK', question, {
      questionId: question.id,
      text: '  Étudiant. ',
    });

    expect(result.correct).toBe(true);
  });

  it('verifie l ordre des mots via matchKey', () => {
    const answers = ['Voici', 'un', 'livre'].map((textFr, index) =>
      makeAnswer({ textFr, position: index, matchKey: String(index), isCorrect: true }),
    );
    const question = makeQuestion({ answers, points: 2 });

    const ok = gradeQuestion('WORD_ORDER', question, {
      questionId: question.id,
      orderedAnswerIds: answers.map((item) => item.id),
    });
    const ko = gradeQuestion('WORD_ORDER', question, {
      questionId: question.id,
      orderedAnswerIds: [...answers].reverse().map((item) => item.id),
    });

    expect(ok.correct).toBe(true);
    expect(ok.earnedPoints).toBe(2);
    expect(ko.correct).toBe(false);
  });

  it('exige que toutes les paires soient justes en association', () => {
    const answers = [
      makeAnswer({ textFr: 'livre', matchKey: 'كتاب', isCorrect: true, position: 0 }),
      makeAnswer({ textFr: 'stylo', matchKey: 'قلم', isCorrect: true, position: 1 }),
    ];
    const question = makeQuestion({ answers, points: 2 });
    const [first, second] = answers;

    const ok = gradeQuestion('MATCHING', question, {
      questionId: question.id,
      pairs: { [first!.id]: 'كتاب', [second!.id]: 'قلم' },
    });
    const ko = gradeQuestion('MATCHING', question, {
      questionId: question.id,
      pairs: { [first!.id]: 'قلم', [second!.id]: 'كتاب' },
    });

    expect(ok.correct).toBe(true);
    expect(ko.correct).toBe(false);
  });

  it('compte une question sans reponse comme fausse', () => {
    const question = makeQuestion({ answers: [makeAnswer({ isCorrect: true })] });
    const result = gradeQuestion('MCQ', question, undefined);
    expect(result.correct).toBe(false);
    expect(result.given).toEqual([]);
  });
});

describe('gradeExercise', () => {
  it('calcule le pourcentage, la reussite et l XP', () => {
    const goodA = makeAnswer({ isCorrect: true });
    const badA = makeAnswer();
    const q1 = makeQuestion({ answers: [goodA, badA] });

    const goodB = makeAnswer({ isCorrect: true });
    const badB = makeAnswer();
    const q2 = makeQuestion({ answers: [goodB, badB] });

    const exercise = makeExercise('MCQ', [q1, q2]);

    const perfect = gradeExercise(exercise, [
      { questionId: q1.id, selectedAnswerIds: [goodA.id] },
      { questionId: q2.id, selectedAnswerIds: [goodB.id] },
    ]);
    expect(perfect.percentage).toBe(100);
    expect(perfect.passed).toBe(true);
    expect(perfect.xpEarned).toBeGreaterThan(0);

    const half = gradeExercise(exercise, [
      { questionId: q1.id, selectedAnswerIds: [goodA.id] },
      { questionId: q2.id, selectedAnswerIds: [badB.id] },
    ]);
    expect(half.percentage).toBe(50);
    expect(half.passed).toBe(false);
    expect(half.xpEarned).toBe(0);
    expect(half.corrections).toHaveLength(2);
  });
});
