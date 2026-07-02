export { hydrateQueryCache, resetQueryCache } from './hydrate';
export { useCachedQuery, useCachedQuerySavedAt } from './hooks/useCachedQuery';
export { clearQueryCacheForScope } from './persistence/clear';
export { setQueryCacheScope } from './persistence/keys';
export type {
  CachedQueryOptions,
  CacheEntryDefinition,
  QueryCacheEntryName,
} from './types';
