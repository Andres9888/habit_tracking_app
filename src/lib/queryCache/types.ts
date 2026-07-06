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
  /**
   * Write this subscriber's results to the shared `:latest` slot and disk.
   * Defaults to true unless fallbackToLatest is explicitly false.
   */
  writeLatest?: boolean;
  /**
   * Guard for the `:latest` fallback: given the args the latest slot was
   * written with and the args being requested, return false to reject the
   * fallback (treat as no cache) instead of serving unrelated data.
   */
  latestUsable?: (persistedArgs: unknown, requestedArgs: unknown) => boolean;
}
