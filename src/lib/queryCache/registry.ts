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
  // Habit-scoped ranges behind Detail insights and History. The complete args
  // key prevents fallback across habits or requested ranges.
  // 'plain': rows carry only habit IDs, dates and booleans — no habit content
  // (names live in habits.get / habits.list). History requests the full
  // since-creation range, and sensitiveStorage chunks secure values every 512
  // chars, so 'secure' turned one persist into hundreds of Keychain writes.
  'habits.getHabitTracking': {
    migratedFromSecure: true,
    name: 'habits.getHabitTracking',
    storage: 'plain',
    version: 2,
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
  // latestFallback is safe: settings.get has one args shape ({}), so the
  // :latest slot is this user's row. Without it, skip→live drops the cache
  // and AuthGate parks on the loading screen until Convex answers.
  'settings.get': {
    latestFallback: true,
    name: 'settings.get',
    storage: 'secure',
    version: 2,
  },
  // 'plain': opaque template/habit ID pairs (no habit content); keys are
  // user-scoped and cleared on logout via clearQueryCacheForScope.
  'templates.getImportedTemplateHabitIds': {
    latestFallback: true,
    name: 'templates.getImportedTemplateHabitIds',
    storage: 'plain',
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
