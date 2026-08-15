import { isWindowEndRecent } from './guards/windowEndRecency';
import type { CacheEntryDefinition, QueryCacheEntryName } from './types';

const DEFINITIONS: Record<QueryCacheEntryName, CacheEntryDefinition> = {
  'analytics.getAnalyticsDashboard': {
    latestFallback: true,
    name: 'analytics.getAnalyticsDashboard',
    storage: 'plain',
    version: 2,
  },
  // Detail data is private and keyed by habit ID. Persist the most recently
  // opened habit for fast reopen/offline access, but never fall back across
  // IDs: hydrateQueryCache restores the exact args key for the persisted row.
  'habits.get': {
    name: 'habits.get',
    storage: 'secure',
    version: 1,
  },
  // Habit-scoped year-to-date history behind the detail screen's insight
  // cards. Keyed by habit ID like `habits.get`, so no cross-ID latest fallback.
  'habits.getHabitTracking': {
    name: 'habits.getHabitTracking',
    storage: 'secure',
    version: 1,
  },
  'habits.getTracking': {
    latestFallback: true,
    latestUsable: isWindowEndRecent,
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
  // v2 rejects rows that may contain defaults returned before Convex auth was
  // server-confirmed. Those rows can otherwise reopen the first-paint flash.
  'settings.get': { name: 'settings.get', storage: 'secure', version: 2 },
  // Contains private habit IDs paired with their public source templates.
  // Secure persistence keeps the post-add focus target correct when offline.
  'templates.getImportedTemplateHabits': {
    latestFallback: true,
    name: 'templates.getImportedTemplateHabits',
    storage: 'secure',
    version: 1,
  },
  // 'plain': only opaque template IDs (no habit content); keys are
  // user-scoped and cleared on logout via clearQueryCacheForScope.
  'templates.getImportedTemplateIds': {
    latestFallback: true,
    name: 'templates.getImportedTemplateIds',
    storage: 'plain',
    version: 1,
  },
  // 'plain': public catalog (~215KB) — Keychain-backed 'secure' storage
  // would be a perf hazard for data that needs no protection.
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
