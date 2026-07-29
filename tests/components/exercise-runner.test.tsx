import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@tests/render';
import { ExerciseRunner } from '@/features/exercises/exercise-runner';
import { makeExerciseDto } from '@tests/factories/content';

const correction = {
  exerciseId: 'exercise-1',
  type: 'MCQ' as const,
  score: 1,
  maxScore: 1,
  percentage: 100,
  correctCount: 1,
  totalCount: 1,
  passed: true,
  xpEarned: 25,
  corrections: [
    {
      questionId: 'q1',
      correct: true,
      earnedPoints: 1,
      maxPoints: 1,
      expected: ['كتاب'],
      given: ['كتاب'],
      explanationFr: 'livre se traduit par كتاب',
      explanationAr: 'livre تعني كتاب',
    },
  ],
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      status: 200,
      json: async () => ({ success: true, data: { correction, newBadges: [] } }),
    })),
  );
});

describe('ExerciseRunner', () => {
  it('affiche l enonce et desactive la validation avant toute reponse', () => {
    render(<ExerciseRunner exercise={makeExerciseDto()} />);
    expect(screen.getByRole('heading', { name: /livre/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Valider mes réponses/ })).toBeDisabled();
  });

  it('soumet la reponse choisie et affiche la correction', async () => {
    render(<ExerciseRunner exercise={makeExerciseDto()} />);

    await userEvent.click(screen.getByRole('radio', { name: 'كتاب' }));
    const submit = screen.getByRole('button', { name: /Valider mes réponses/ });
    expect(submit).toBeEnabled();
    await userEvent.click(submit);

    expect((await screen.findAllByText('Exercice réussi')).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Recommencer l'exercice/ })).toBeInTheDocument();
    expect(screen.getByText('livre se traduit par كتاب')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/exercises/exercise-1/submit',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('permet de recommencer apres correction', async () => {
    render(<ExerciseRunner exercise={makeExerciseDto()} />);
    await userEvent.click(screen.getByRole('radio', { name: 'كتاب' }));
    await userEvent.click(screen.getByRole('button', { name: /Valider mes réponses/ }));

    const retry = await screen.findByRole('button', { name: /Recommencer l'exercice/ });
    await userEvent.click(retry);

    expect(screen.getByRole('button', { name: /Valider mes réponses/ })).toBeDisabled();
  });
});
