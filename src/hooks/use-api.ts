'use client';

import { useCallback, useState } from 'react';
import type { ApiResult } from '@/types/api';

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (response.status === 204) return undefined as T;

  const payload = (await response.json()) as ApiResult<T>;
  if (!payload.success) {
    throw new ApiClientError(payload.error.message, payload.error.code, payload.error.details);
  }
  return payload.data;
}

/** Petit wrapper d'appel mutant : etat pending + erreur normalisee. */
export function useMutation<TInput, TOutput>(
  request: (input: TInput) => Promise<TOutput>,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setPending(true);
      setError(null);
      try {
        return await request(input);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Une erreur est survenue');
        return null;
      } finally {
        setPending(false);
      }
    },
    [request],
  );

  return { mutate, pending, error, reset: () => setError(null) };
}
