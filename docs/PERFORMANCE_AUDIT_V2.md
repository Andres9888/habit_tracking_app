# Performance Audit v2 — Findings & Fixes

**Date:** 2026-02-14  
**Auditor:** MiniMax M2.5  
**Scope:** Convex queries (N+1 patterns, missing indexes), React re-renders, bundle lazy-loading

---

## Critical Issues Fixed

### 1. N+1 Query Pattern in `analyticsCompliance.ts` ⚠️ HIGH

**Before:** Looped over N habits, executing one `ctx.db.query('tracking').withIndex('by_habit_and_date', ...)` per habit. For a user with 15 habits, this was 15 separate indexed queries + 1 habits query = 16 DB round-trips.

**After:** Single query using `by_user_and_date` index with date-range bounds (`gte`/`lte`), then pre-indexing completions by date in a `Map<string, number>` for O(1) day lookups.

**Impact:** 16 DB reads → 2 DB reads (habits + tracking). Eliminates O(N×T) filtering per day.

### 2. N+1 Query Pattern in `analyticsTrend.ts` ⚠️ HIGH

**Before:** Same N+1 loop pattern — one tracking query per habit for 30-day trend data.

**After:** Single user-level query with date-range bounds, pre-indexed by date.

**Impact:** N+1 → 2 DB reads. Reduced O(30×T) day-level filtering to O(T) single-pass indexing.

### 3. Full Table Scans — Missing `by_userId` Index Usage ⚠️ MEDIUM

**Affected queries:**
- `analyticsOverview.ts` — `ctx.db.query('habits').collect()` (all users' habits)
- `analyticsDistribution.ts` — same full table scan
- `analyticsWeekly.ts` — same full table scan
- `notesQueries.ts` list/search — `ctx.db.query('notes').order('desc').collect()` (all users' notes)
- `reflectionsQueries.ts` listRecent — `ctx.db.query('reflections').order('desc').take(limit)` (all users)

**Fix:** All now authenticate first, then use `by_userId` / `by_user_and_date` indexes. This is both a **performance** fix (scoped reads) and a **security** fix (data isolation).

### 4. Lazy Loading for Modal Components ⚠️ MEDIUM

**Before:** 7 heavy modal sections (Settings, Calendar, Share, Templates, Visualization, Activation, HapticTest) were eagerly imported in `HabitsModals.tsx`. These modals are rarely opened but their code was parsed on every app launch.

**After:** All modal sections except `CreateHabitModal` and `QuickActions` (frequently used) are now `React.lazy()` loaded. Wrapped in `<Suspense>` with a lightweight fallback.

**Impact:** Estimated ~80KB+ deferred from initial bundle parse/eval time.

### 5. Missing `React.memo` on FlatList Item ⚠️ MEDIUM

**Before:** `DraggableHabitCard` was a plain function component rendered inside a `DraggableFlatList`. Any parent state change (e.g., drag operation, settings toggle) triggered re-render of ALL cards.

**After:** Wrapped in `React.memo()` so cards only re-render when their own props change.

**Impact:** Prevents O(N) re-renders on parent state changes.

---

## Issues Noted (Not Fixed — Low Risk or Architecture-Level)

### 6. Redundant `useQuery(api.settings.get)` in `useCardStrengthFill`

Every `DraggableHabitCard` creates its own `useQuery(api.settings.get)` subscription. For 15 habits, that's 15 subscriptions to the same query. Convex deduplicates these at the transport level, but each hook still triggers a React state update independently — potentially causing 15 micro-rerenders when settings change.

**Recommendation:** Thread `showGradientFill` as a prop from the list level. Not fixed here due to prop-threading complexity across the render-item chain.

### 7. `StatsNotesModal` Triple-Queries Tracking Data

`useStatsOverviewData.ts` fires 3 separate `useQuery` calls for overlapping date ranges:
- `getTracking({ dates: last7Days })`
- `getTracking({ dates: [todayString] })`  
- `getTracking({ dates: last7Days })` (in `useHabitStats`)

**Recommendation:** Consolidate into a single wider date-range query and compute subsets client-side.

### 8. `categories.ts` Fetches All Templates to Derive Categories

`categories.list` does `ctx.db.query('templates').collect()` — fetches all template documents just to extract unique category strings. Templates are static seeded data (~50-100 docs) so impact is low, but a dedicated categories table or cached computation would be more efficient.

### 9. Analytics Screen Fires 5 Parallel Queries

`AnalyticsScreen.hooks.ts` fires 5 `useQuery` calls simultaneously. Each of these (now fixed) queries the habits table independently. Consider a consolidated `getAnalyticsDashboard` query that returns all 5 datasets in one round-trip to reduce Convex function invocations.

---

## Schema Index Coverage

Current indexes are **well-designed** for the primary access patterns:
- `habits.by_userId` ✅
- `tracking.by_user_and_date` ✅ (now used everywhere)
- `tracking.by_habit_and_date` ✅ (used for single-habit lookups)
- `notes.by_user_and_date` ✅ (now used by list/search)

**No missing indexes found.** All N+1 patterns were caused by query-level code not using existing indexes, not by missing index definitions.

---

## Summary

| Category | Issues Found | Fixed | Noted |
|----------|-------------|-------|-------|
| N+1 Queries | 2 critical | 2 | — |
| Full Table Scans | 5 queries | 5 | — |
| Lazy Loading | 7 eager modals | 7 lazy | — |
| React.memo | 1 FlatList item | 1 | — |
| Redundant Queries | 3 patterns | — | 3 |
| Architecture | 1 pattern | — | 1 |
