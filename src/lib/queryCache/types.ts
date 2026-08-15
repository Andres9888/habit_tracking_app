export type QueryCacheEntryName =
  | 'analytics.getAnalyticsDashboard'
  | 'habits.get'
  | 'habits.getHabitTracking'
  | 'habits.getTracking'
  | 'habits.list'
  | 'habits.listArchived'
  | 'settings.get'
  | 'templates.getImportedTemplateHabits'
  | 'templates.getImportedTemplateIds'
  | 'templates.list';

export type QueryCacheStorage = 'plain' | 'secure';

export interface CacheEntryDefinition {
  name: QueryCacheEntryName;
  storage: QueryCacheStorage;
  version: number;
  latestFallback?: boolean;
  /**
   * Entry-level default for the `:latest` fallback guard. Applied to every
   * subscriber of this entry unless a call site overrides it via
   * CachedQueryOptions.latestUsable. See windowEndRecency.
   */
  latestUsable?: (persistedArgs: unknown, requestedArgs: unknown) => boolean;
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
  /**
   * Serve the hydrated `:latest` slot while args are 'skip' instead of
   * undefined. Opt-in because most skips mean "this request is not valid yet"
   * (e.g. a null habitId), where stale data would be wrong. Only safe for
   * entries with a single args shape — the `:latest` slot is args-independent,
   * so a multi-args entry could serve another key's payload.
   */
  serveCachedWhileSkipped?: boolean;
}
