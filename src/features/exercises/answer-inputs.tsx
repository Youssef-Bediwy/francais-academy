'use client';

import type { ExerciseType } from '@prisma/client';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { AnswerOption, QuestionDto } from '@/types/content';
import type { SubmittedAnswer } from '@/types/exercise';
import { FREE_TEXT_TYPES } from '@/constants/exercises';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface InputProps {
  type: ExerciseType;
  question: QuestionDto;
  value: SubmittedAnswer;
  onChange: (answer: SubmittedAnswer) => void;
  disabled?: boolean;
  locale: 'fr' | 'ar';
  labels: { placeholder: string; choose: string; moveUp: string; moveDown: string };
}

const optionLabel = (option: AnswerOption, locale: 'fr' | 'ar') =>
  locale === 'ar' ? (option.textAr ?? option.textFr) : option.textFr;

/** Rend le controle adapte au type d'exercice, sans logique de correction. */
export function AnswerInput({
  type,
  question,
  value,
  onChange,
  disabled = false,
  locale,
  labels,
}: InputProps) {
  if (FREE_TEXT_TYPES.includes(type)) {
    return (
      <Input
        id={`answer-${question.id}`}
        value={value.text ?? ''}
        disabled={disabled}
        placeholder={labels.placeholder}
        autoComplete="off"
        onChange={(event) => onChange({ questionId: question.id, text: event.target.value })}
      />
    );
  }

  if (type === 'WORD_ORDER') {
    const ordered =
      value.orderedAnswerIds && value.orderedAnswerIds.length === question.options.length
        ? value.orderedAnswerIds
        : question.options.map((option) => option.id);

    const move = (index: number, direction: -1 | 1) => {
      const next = [...ordered];
      const target = index + direction;
      if (target < 0 || target >= next.length) return;
      const a = next[index] as string;
      const b = next[target] as string;
      next[index] = b;
      next[target] = a;
      onChange({ questionId: question.id, orderedAnswerIds: next });
    };

    return (
      <ol className="space-y-2">
        {ordered.map((id, index) => {
          const option = question.options.find((item) => item.id === id);
          return (
            <li
              key={id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5"
            >
              <span className="text-xs font-bold text-foreground-muted">{index + 1}</span>
              <span className="flex-1 text-sm font-medium">
                {option ? optionLabel(option, locale) : ''}
              </span>
              <span className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={disabled || index === 0}
                  aria-label={labels.moveUp}
                  className="rounded-lg border border-border p-1.5 disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={disabled || index === ordered.length - 1}
                  aria-label={labels.moveDown}
                  className="rounded-lg border border-border p-1.5 disabled:opacity-40"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  if (type === 'MATCHING') {
    const keys = [...new Set(question.options.map((option) => option.matchKey ?? ''))].filter(Boolean);
    return (
      <div className="space-y-3">
        {question.options.map((option) => (
          <div key={option.id} className="grid items-center gap-3 sm:grid-cols-2">
            <p className="rounded-xl bg-surface-muted px-4 py-2.5 text-sm font-medium">
              {optionLabel(option, locale)}
            </p>
            <Select
              id={`match-${option.id}`}
              disabled={disabled}
              placeholder={labels.choose}
              value={value.pairs?.[option.id] ?? ''}
              options={keys.map((key) => ({ value: key, label: key }))}
              onChange={(event) =>
                onChange({
                  questionId: question.id,
                  pairs: { ...(value.pairs ?? {}), [option.id]: event.target.value },
                })
              }
            />
          </div>
        ))}
      </div>
    );
  }

  // MCQ / TRUE_FALSE / FLASHCARD / LISTENING
  const selected = value.selectedAnswerIds ?? [];
  return (
    <div role="radiogroup" aria-labelledby={`prompt-${question.id}`} className="grid gap-2.5">
      {question.options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange({ questionId: question.id, selectedAnswerIds: [option.id] })}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 text-start text-sm font-medium transition',
              active
                ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-ring'
                : 'border-border bg-surface hover:border-brand-300 hover:bg-surface-muted',
              disabled && 'opacity-70',
            )}
          >
            <span
              className={cn(
                'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                active ? 'border-brand-600 bg-brand-600' : 'border-ink-300',
              )}
            >
              {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </span>
            {optionLabel(option, locale)}
          </button>
        );
      })}
    </div>
  );
}
