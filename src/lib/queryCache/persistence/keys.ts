import { buildScopedStorageKey } from '../../../utils/storage/scopedStorageKey';
import type { CacheEntryDefinition } from '../types';

const BASE_KEY = '@chainday:query_cache_v1';
let queryCacheScope: string | null = null;

export function setQueryCacheScope(scope: string | null): void {
  queryCacheScope = scope;
}

export function getQueryCacheScope(): string | null {
  return queryCacheScope;
}

export function normalizeArgs(args: unknown): string {
  if (args === undefined) return '{}';
  return canonicalStringify(args);
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => sortValue(item));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => [key, sortValue(item)])
  );
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

export function buildMemoryKey(name: string, args: unknown): string {
  return `${name}:${normalizeArgs(args)}`;
}

export function buildLatestMemoryKey(name: string): string {
  return `${name}:latest`;
}

// Args the :latest slot was written with — lets readers judge whether the
// fallback payload is usable for their request (see CachedQueryOptions.latestUsable).
export function buildLatestArgsMemoryKey(name: string): string {
  return `${name}:latest:args`;
}

export function buildLatestStorageKey(
  entry: CacheEntryDefinition,
  scope = queryCacheScope
): string {
  return buildScopedStorageKey(`${BASE_KEY}:${entry.name}:latest`, scope);
}
