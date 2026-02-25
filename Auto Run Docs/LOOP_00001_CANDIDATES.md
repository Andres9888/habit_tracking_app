# Performance Candidate Log

---

## [Tactic 1: Startup and provider initialization bottlenecks] - Executed [2026-02-25 16:29]

### Finding 1: Duplicate Convex client bootstrap path on web

- **File:** `src/lib/appConfig.ts`, `src/main.tsx`
- **Line(s):** 24, 69
- **Pattern Found:** `new ConvexReactClient(...)` executes in `appConfig.ts` (imported by `App.tsx`) and again in `main.tsx`
- **Context:** On web, module bootstrap now creates two Convex clients before rendering (`appConfig.ts` via `App.tsx` import, plus `main.tsx`), and then nests two `ConvexProvider` layers. This increases startup work and memory pressure for initialization-time setup.

### Finding 2: Offline queue restoration runs synchronously on mount

- **File:** `src/providers/OfflineProvider/OfflineProvider.tsx`, `src/lib/offline/persistence/queueStorage.ts`
- **Line(s):** 64-70, 88-102
- **Pattern Found:** `restoreQueue()` is invoked in a mount `useEffect`, which awaits `manager.restore()`; `restore()` calls `loadQueueState()` and performs `recoverTransaction` + `AsyncStorage.getItem` + `JSON.parse` on startup.
- **Context:** App launch triggers offline queue hydration before the app is fully interactive. Large queue payloads can introduce measurable startup latency and main-thread churn because this runs immediately on provider mount.

### Tactic Summary

- **Issues Found:** 2
- **Files Affected:** 4
- **Status:** EXECUTED

---

## Tactic 2 - Long-list rendering and re-render cascade risk - Executed [2026-02-25 16:33]

### Finding 1: Inline FlatList row renderer recreates per-render closures

- **Category:** Complexity
- **Location:** `src/screens/TemplatesScreen/views/BrowseAllTab.tsx:54-74`
- **Current State:** `FlatList` uses an inline `renderItem` with per-item inline handlers (`onImport`, `onPreview`), so every tab re-render regenerates a new renderer function and closures, increasing row reconciliation work even when list data is unchanged.
- **Proposed Change:** Move row rendering into a memoized item component and pass a stable `renderItem` via `useCallback` (or inline memoized function that avoids recreating closures) so list rows can skip unnecessary re-renders.
- **Code Context:**
  ```tsx
  renderItem={({ item: t }) => (
    <TemplateCard
      ...
      onImport={() => p.handleTemplateImport(t._id)}
      onPreview={() => p.handleTemplatePreview(t)}
    />
  )}
  ```

### Finding 2: Template list row component is not memoized

- **Category:** Complexity
- **Location:** `src/screens/TemplatesScreen/views/TemplateListCard.tsx:18-52`
- **Current State:** `TemplateListCard` is used as a `FlatList` row but is not wrapped in `memo`, so all visible rows can re-render whenever parent renders, limiting FlatList’s ability to short-circuit row updates for large template lists.
- **Proposed Change:** Wrap `TemplateListCard` with `memo` and keep row props stable (including item identity) so unchanged rows skip rendering work.
- **Code Context:**
  ```tsx
  export function TemplateListCard({
    item,
    importingTemplateId,
    onImport,
    onPreview,
  }: TemplateListCardProps) {
    ...
    return <TemplateCard ... onImport={() => onImport(item._id)} onPreview={() => onPreview(item)} />;
  }
  ```

### Finding 3: Key extractor fallback to index can destabilize identity for rows without IDs

- **Category:** Complexity
- **Location:** `src/features/habits/components/HabitsList/useHabitsListHandlers.ts:99-103`
- **Current State:** `keyExtractor` falls back to `index` when `_id` is missing. In a reorder-capable list, index-based keys can remount rows during reordering or insertions, amplifying render churn and risking animation/state glitches.
- **Proposed Change:** Ensure habit rows always provide stable IDs and prefer strict ID-based keys; avoid index-based keys even as fallback in reorder scenarios.
- **Code Context:**
  ```ts
  const keyExtractor = useCallback(
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
    []
  );
  ```

### Tactic Summary

- **Issues Found:** 3
- **Files Affected:** 3
- **Status:** EXECUTED

---

## [Tactic 3: Convex query/mutation hot paths and sort/filter behavior] - Executed [2026-02-25 16:52]

### Finding 1: Tracking queries read full user history for 30-day trend

- **File:** `convex/analyticsTrend.ts`
- **Line(s):** 32-39
- **Pattern Found:** `ctx.db.query('tracking').withIndex('by_user_and_date', ...).collect()` followed by
  `allTrackings.filter((t) => habitIds.has(t.habitId));`
- **Context:** A full history for the user is collected first, then 30-day-completion calculations filter in-memory. This causes unbounded growth in compute and response latency as tracking history grows; it should apply a date window in the query using the `by_user_and_date` index.

### Finding 2: Compliance heatmap filters tracking in-memory for fixed date window

- **File:** `convex/analyticsCompliance.ts`
- **Line(s):** 36-43
- **Pattern Found:** `ctx.db.query('tracking').withIndex('by_user_and_date', ...).collect()` followed by `allTrackings.filter((t) => habitIds.has(t.habitId));`
- **Context:** This query loads all user tracking rows before computing the last 90 days heatmap, performing repeated in-memory filtering each render path. A bounded range query (e.g., only rows after cutoff date) would shrink the result set and reduce query processing cost.

### Finding 3: Unread unlocked letter retrieval does extra in-memory work

- **File:** `convex/lettersQueriesExtra.ts`
- **Line(s):** 35-45
- **Pattern Found:** `query('letters').withIndex('by_habit', ...).order('desc').collect()` + `letters.filter((letter) => letter.unlockAt <= now);` + `unlocked.sort(...)`
- **Context:** For "most recent unlocked" lookup, this collects the whole habit letter set and sorts/filtering in JS. The existing `by_habit_and_unlock` index can support a range query up to `now` and avoid full list materialization.

### Finding 4: Notes search scans all notes before applying habit/text filters

- **File:** `convex/notesQueries.ts`
- **Line(s):** 34-49
- **Pattern Found:** `query('notes').withIndex('by_user', ...).collect()` then optional `notes.filter(...)` for `habitId` and `searchText`.
- **Context:** Even when searching a single habit, the function fetches all notes for a user first, then applies filters. This causes avoidable over-fetch for high-note users and can be reduced by querying `by_habit` when habitId is supplied before applying additional filters.

### Tactic Summary

- **Issues Found:** 4
- **Files Affected:** 4
- **Status:** EXECUTED
