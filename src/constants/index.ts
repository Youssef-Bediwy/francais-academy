export * from './levels';
export * from './gamification';
export * from './routes';
export * from './exercises';
export * from './categories';

export const PAGINATION = { defaultPage: 1, defaultPerPage: 12, maxPerPage: 60 } as const;
export const REVIEW_BATCH_SIZE = 20;
