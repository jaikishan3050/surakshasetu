// Export all API services and types
export { default as api } from './config';
export { authApi } from './auth';
export { drillsApi } from './drills';
export { alertsApi } from './alerts';
export { newsApi } from './news';
export * from './types';

// Re-export everything for convenience
export {
  default as authService,
  authApi as auth,
} from './auth';

export {
  default as drillsService,
  drillsApi as drills,
} from './drills';

export {
  default as alertsService,
  alertsApi as alerts,
} from './alerts';

export {
  default as newsService,
  newsApi as news,
} from './news';