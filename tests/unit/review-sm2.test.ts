import { describe, expect, it } from 'vitest';
import { computeSm2 } from '@/services/review.service';
import { SM2 } from '@/constants/gamification';

const fresh = { easeFactor: SM2.defaultEase, intervalDays: 0, repetitions: 0, lapses: 0 };

describe('computeSm2', () => {
  it('programme la premiere reussite a un jour', () => {
    const next = computeSm2(fresh, 'GOOD');
    expect(next.repetitions).toBe(1);
    expect(next.intervalDays).toBe(SM2.firstInterval);
  });

  it('programme la deuxieme reussite a six jours', () => {
    const next = computeSm2({ ...fresh, repetitions: 1, intervalDays: 1 }, 'GOOD');
    expect(next.intervalDays).toBe(SM2.secondInterval);
  });

  it('multiplie l intervalle par le facteur de facilite ensuite', () => {
    const next = computeSm2({ easeFactor: 2.5, intervalDays: 6, repetitions: 2, lapses: 0 }, 'GOOD');
    expect(next.intervalDays).toBe(15);
    expect(next.repetitions).toBe(3);
  });

  it('remet a zero et compte un oubli sur AGAIN', () => {
    const next = computeSm2({ easeFactor: 2.5, intervalDays: 20, repetitions: 5, lapses: 1 }, 'AGAIN');
    expect(next.repetitions).toBe(0);
    expect(next.intervalDays).toBe(SM2.firstInterval);
    expect(next.lapses).toBe(2);
    expect(next.easeFactor).toBeCloseTo(2.3);
  });

  it('ne descend jamais sous le facteur minimal', () => {
    let state = { easeFactor: SM2.minEase, intervalDays: 1, repetitions: 0, lapses: 0 };
    for (let i = 0; i < 10; i += 1) state = computeSm2(state, 'AGAIN');
    expect(state.easeFactor).toBe(SM2.minEase);
  });

  it('augmente le facteur sur EASY et le plafonne', () => {
    let state = { easeFactor: 2.5, intervalDays: 6, repetitions: 3, lapses: 0 };
    for (let i = 0; i < 10; i += 1) state = computeSm2(state, 'EASY');
    expect(state.easeFactor).toBeLessThanOrEqual(SM2.maxEase);
    expect(state.easeFactor).toBeGreaterThan(2.5);
  });
});
