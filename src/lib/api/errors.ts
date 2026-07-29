export type ErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requete invalide', details?: unknown) {
    super('BAD_REQUEST', 400, message, details);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown, message = 'Donnees invalides') {
    super('VALIDATION_ERROR', 422, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentification requise') {
    super('UNAUTHORIZED', 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acces refuse') {
    super('FORBIDDEN', 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Ressource') {
    super('NOT_FOUND', 404, `${resource} introuvable`);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit avec une ressource existante') {
    super('CONFLICT', 409, message);
  }
}
