# Convex Query Performance Audit

## 🔴 CRITICAL ISSUES (Top 10)

### 1. Duplicate `api.habits.list` queries (6+ instances)
**Impact:** HIGH - Core data fetched 6+ times across app
**Files:**
- `src/features/habits/hooks/useHabitData.ts`
- `src/features/habits/hooks/useHabitsListState.ts`
- `src/components/StatsNotesModal/useStatsOverviewData.ts`
- `src/components/StatsNotesModal/NotesList/useNotesList.ts`
- `src/components/StatsNotesModal/NoteEditor/useNoteEditor.ts`
- `src/components/StatsNotesModal/HabitStats/useHabitStats.ts`

**Fix:** Create shared context provider for habits list

### 2. Duplicate `api.settings.get` queries (5+ instances)
**Impact:** HIGH - Settings fetched multiple times
**Files:**
- `src/features/habits/hooks/useHabitData.ts`
- `src/features/habits/hooks/useHabitsListState.ts`
- `src/components/SettingsModal/SettingsModal.hooks.ts`
- `src/components/SettingsDialog/SettingsDialog.hooks.ts`
- `src/components/DraggableHabit/useCardStrengthFill.ts`

**Fix:** Create shared context provider for settings

### 3. StatsNotesModal query storm (8+ queries on mount)
**Impact:** HIGH - Modal open triggers cascade
**Queries triggered:**
- `habits.list` × 3
- `habits.getTracking` × 4 (different date ranges)
- `notes.search` × 1

**Fix:** Consolidate queries, share data between tabs

### 4. Duplicate tracking queries with overlapping ranges
**Impact:** MEDIUM - Same data fetched multiple times
**Example:** `useStatsOverviewData` calls `getTracking` twice:
- Once for last 7 days
- Once for today only (subset of 7 days)

**Fix:** Use single query and filter client-side

### 5. Analytics screen parallel query waterfall (5 queries)
**Impact:** MEDIUM - All fire simultaneously
**Files:** `src/screens/AnalyticsScreen/AnalyticsScreen.hooks.ts`
**Queries:**
- `analytics.getOverviewStats`
- `analytics.getStrengthDistribution`
- `analytics.get30DayTrend`
- `analytics.getComplianceData`
- `analytics.getWeeklyInsights`

**Fix:** Consider batched analytics query

### 6. No memoization on expensive computations
**Impact:** MEDIUM - CPU waste on every render
**Example:** `useStatsOverviewData` - longestStreak calculation
- Loops through all habits
- Nested date iteration
- No React.useMemo on result

**Fix:** Memoize expensive calculations

### 7. Date array re-computation across hooks
**Impact:** LOW-MEDIUM - Wasted CPU cycles
**Pattern:** Multiple hooks compute `last7Days`, `last30Days` independently

**Fix:** Shared date utilities or context

### 8. Large date arrays in query args
**Impact:** MEDIUM - Network payload bloat
**Example:** Passing 30+ dates as array instead of range

**Fix:** Use startDate/endDate ranges where possible (already partial in useHabitData)

### 9. Missing React.memo on frequently re-rendered components
**Impact:** MEDIUM - Unnecessary re-renders cascade
**Components:** HabitCard, DraggableHabit

**Fix:** Add React.memo with proper comparison

### 10. Conditional query execution inefficiency
**Impact:** LOW - Minor overhead
**Example:** `useHabitData` line 27-28 conditionally picks query but both evaluated

**Fix:** Use skip pattern properly

## 📊 AUDIT SUMMARY

- **Total Convex hooks found:** 146 instances
- **Unique queries identified:** ~25
- **Duplicate habits.list:** 6+
- **Duplicate settings.get:** 5+
- **Duplicate getTracking:** 8+ (various ranges)
- **Components with 3+ queries:** 5

## ✅ OPTIMIZATION PLAN

1. Create `HabitsDataProvider` context
2. Create `SettingsProvider` context
3. Refactor StatsNotesModal to share queries
4. Consolidate tracking queries
5. Add memoization to expensive computations
6. Add React.memo to HabitCard components
7. Share date utilities
8. Optimize query parameters (ranges vs arrays)
