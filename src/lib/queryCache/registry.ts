import type { CacheEntryDefinition, QueryCacheEntryName } from './types';

const DEFINITIONS: Record<QueryCacheEntryName, CacheEntryDefinition> = {
  'analytics.getAnalyticsDashboard': {
    latestFallback: true,
    name: 'analytics.getAnalyticsDashboard',
    storage: 'plain',
    version: 1,
  },
  'habits.getTracking': {
    latestFallback: true,
    name: 'habits.getTracking',
    storage: 'plain',
    version: 1,
  },
  'habits.list': { name: 'habits.list', storage: 'secure', version: 2 },
  'habits.listArchived': {
    name: 'habits.listArchived',
    storage: 'secure',
    version: 1,
  },
  'settings.get': { name: 'settings.get', storage: 'secure', version: 1 },
  'templates.getImportedTemplateIds': {
    latestFallback: true,
    name: 'templates.getImportedTemplateIds',
    storage: 'plain',
    version: 1,
  },
  'templates.list': {
    latestFallback: true,
    name: 'templates.list',
    storage: 'plain',
    version: 1,
  },
};

export const queryCacheEntries = Object.values(DEFINITIONS);

export function getCacheEntry(name: QueryCacheEntryName): CacheEntryDefinition {
  return DEFINITIONS[name];
}
