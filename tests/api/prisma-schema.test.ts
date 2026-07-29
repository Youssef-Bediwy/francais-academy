import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CEFR_LEVELS } from '@/constants/levels';
import { EXERCISE_TYPES } from '@/constants/exercises';

const schema = readFileSync(join(process.cwd(), 'prisma', 'schema.prisma'), 'utf8');

const REQUIRED_MODELS = [
  'User',
  'UserStatistics',
  'Category',
  'Course',
  'Lesson',
  'Vocabulary',
  'Exercise',
  'Question',
  'Answer',
  'ExerciseResult',
  'Flashcard',
  'RevisionSession',
  'Progress',
  'Favorite',
  'Badge',
  'Achievement',
  'DailyGoal',
];

describe('schema Prisma', () => {
  it('declare les 17 modeles du domaine', () => {
    for (const model of REQUIRED_MODELS) {
      expect(schema).toContain(`model ${model} {`);
    }
    expect(schema.match(/^model /gm)).toHaveLength(REQUIRED_MODELS.length);
  });

  it('cible PostgreSQL', () => {
    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('env("DATABASE_URL")');
  });

  it('reste aligne avec les constantes de niveau', () => {
    for (const level of CEFR_LEVELS) {
      expect(schema).toMatch(new RegExp(`^\\s{2}${level}$`, 'm'));
    }
  });

  it('reste aligne avec les types d exercice', () => {
    for (const type of EXERCISE_TYPES) {
      expect(schema).toMatch(new RegExp(`^\\s{2}${type}$`, 'm'));
    }
  });

  it('protege les relations par des suppressions en cascade', () => {
    expect(schema).toContain('onDelete: Cascade');
    expect(schema).toContain('@@unique([userId, flashcardId])');
    expect(schema).toContain('@@unique([userId, date])');
  });
});
