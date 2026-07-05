export { hydrateQueryCache, resetQueryCache } from './hydrate';
export { useCachedQuery, useCachedQuerySavedAt } from './hooks/useCachedQuery';
export { useQueryCacheHydrated } from './hooks/useQueryCacheHydrated';
export { clearQueryCacheForScope } from './persistence/clear';
export { setQueryCacheScope } from './persistence/keys';
export { markQueryCacheHydrated } from './store/hydration';
export type {
  CachedQueryOptions,
  CacheEntryDefinition,
  QueryCacheEntryName,
} from './types';
