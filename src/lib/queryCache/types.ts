export type QueryCacheEntryName =
  | 'analytics.getAnalyticsDashboard'
  | 'habits.getTracking'
  | 'habits.list'
  | 'habits.listArchived'
  | 'settings.get'
  | 'templates.getImportedTemplateIds'
  | 'templates.list';

export type QueryCacheStorage = 'plain' | 'secure';

export interface CacheEntryDefinition {
  name: QueryCacheEntryName;
  storage: QueryCacheStorage;
  version: number;
  latestFallback?: boolean;
}

export interface PersistedEntry<T = unknown> {
  args: unknown;
  savedAt: number;
  value: T;
  version: number;
}

export interface CachedQueryOptions {
  entryName: QueryCacheEntryName;
  fallbackToLatest?: boolean;
}
