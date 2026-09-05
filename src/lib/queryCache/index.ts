export {
  applyQueryCacheScope,
  hydrateQueryCache,
  resetQueryCache,
} from './hydrate';
export { useCachedQuery } from './hooks/useCachedQuery';
export { useCachedQuerySavedAt } from './hooks/useCachedQuerySavedAt';
export { useQueryCacheHydrated } from './hooks/useQueryCacheHydrated';
export { clearQueryCacheForScope } from './persistence/clear';
export { setQueryCacheScope } from './persistence/keys';
export { hasCachedQueryValue, primeQueryCache } from './prime';
export { markQueryCacheHydrated } from './store/hydration';
export type {
  CachedQueryOptions,
  CacheEntryDefinition,
  QueryCacheEntryName,
} from './types';
