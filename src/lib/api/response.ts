import { NextResponse } from 'next/server';

export interface ApiMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

export const ok = <T>(data: T, meta?: ApiMeta) =>
  NextResponse.json<ApiSuccess<T>>({ success: true, data, ...(meta ? { meta } : {}) });

export const created = <T>(data: T) =>
  NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status: 201 });

export const noContent = () => new NextResponse(null, { status: 204 });

export const failure = (status: number, code: string, message: string, details?: unknown) =>
  NextResponse.json<ApiFailure>(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );

export const buildMeta = (page: number, perPage: number, total: number): ApiMeta => ({
  page,
  perPage,
  total,
  totalPages: Math.max(1, Math.ceil(total / perPage)),
});
