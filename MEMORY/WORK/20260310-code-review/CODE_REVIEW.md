# Code Review: Latest 3 Commits

**Reviewed commits:**
- `aec0dbe` — refactor: remove unused premium features + redesign CalendarTimeline header
- `8d3e356` — feat: consolidate design system tokens for UI consistency (#1172)
- `f090691` — refactor(templates): improve browse layout UX (#1173)

**Focus:** The bulk of changes are in `aec0dbe` (604 files, ~26k lines removed, ~23k lines added). This review focuses on modified production code, not deleted files.

---

## Critical Issues

### 1. Habit deleted before its tracking records — partial failure risk
**File:** `convex/habits/remove.ts:43`
**Severity:** CRITICAL

The habit document is deleted at line 43, but tracking records referencing that habit are deleted afterward (lines 46-51). If the mutation fails partway through (e.g., Convex transaction timeout on a habit with many tracking records), the habit is gone but orphaned tracking records remain permanently.

**Fix:** Delete tracking records first, then the habit. A partial failure then leaves the habit intact with some tracking already cleaned up (recoverable).

### 2. Phantom type export — `DraftData` does not exist
**File:** `src/hooks/index.ts:150`
**Severity:** CRITICAL

Line 150 exports `type DraftData` from `./useDraftStorage`, but this type is never defined or exported anywhere in the `useDraftStorage` module. Any consumer importing `DraftData` from `@/hooks` will get a TypeScript error.

**Fix:** Either define and export `DraftData` in `useDraftStorage`, or remove the re-export.

---

## High-Priority Warnings

### 3. `restore` mutation accepts unvalidated client data
**File:** `convex/habits/remove.ts:54-88`

The `remove` function returns habit data to the client for undo support. The `restore` mutation accepts this data back without re-validating string fields (name, notes, why) through `containsDangerousPatterns`. A malicious client could call `restore` with crafted payloads containing XSS strings, bypassing input validation.

### 4. `analyticsWeekly` loads entire tracking history
**File:** `convex/analyticsWeekly.ts:42-48`

The query fetches ALL tracking records for a user via `by_user_and_date` index filtered only by `userId`, but only 2 weeks of data are needed. The index includes `date` — use it to bound the query.

### 5. Unsafe `q: unknown` type cast
**File:** `convex/analyticsWeekly.ts:45`

The query builder is cast as `unknown`, suppressing all type checking. If the Convex API changes, this breaks silently at runtime.

### 6. Unbounded `.collect()` on tracking records
**File:** `convex/habits/toggle.ts:100-103`

`recalculateStreakAndStrength` collects ALL tracking records for a habit with no limit. For a daily habit tracked over years, this could be thousands of records in a single mutation.

### 7. No batch limit on `deleteAllArchived`
**File:** `convex/habits/archive.ts:95-111`

Deletes all archived habits and all their tracking/templateUsage records in a single transaction. Could hit Convex transaction limits with extensive history.

### 8. `habitId` typed as `never` in Mutations interface
**File:** `src/components/OfflineQueueProcessor/processItem.ts:58`

```ts
updateHabit: (args: { habitId: never } & Record<string, unknown>) => Promise<unknown>;
```
Using `never` means no value can legally be passed. Line 82 works around this with `payload.habitId as never`, defeating type safety. Should be `string`.

### 9. Duplicate mutation instantiation
**File:** `src/components/OfflineQueueProcessor/useQueueProcessor.ts:32,41-47`

Imports `useMutation(api.habits.update)` directly AND constructs a `mutations` object, duplicating the logic in `useMutations.ts`. One is dead code.

### 10. Settings string fields not validated
**File:** `convex/settings/settings.ts:106-112`

The update mutation normalizes `darkMode` but does not validate string fields like `appIcon`, `streakReminderTime`, or `textSize` against input sanitization utilities. `streakReminderTime` accepts any arbitrary string.

---

## Stale References (Incomplete Cleanup)

### 11. `showCharacterScreen` setting still exists after character feature removal
**Files:**
- `convex/schema.ts:374`
- `convex/settings/types.ts:39`
- `convex/settings/validators.ts:33,82`
- `convex/settings/settings.ts:53-54`
- `src/features/habits/types.ts:79`
- `src/features/habits/components/HabitsModals/SettingsModalSection.tsx:167,180`
- `src/lib/settings/sanitizeSettingsPayload.ts:71-72`
- `src/components/SettingsModal/types.ts:34`

The character feature (convex/character/) was deleted, but `showCharacterScreen` remains in the schema, default settings, validators, and UI. This is dead code that will confuse future developers.

### 12. StreakChain component still exists
**Directory:** `src/components/StreakChain/`

The StreakChain component files remain (4 files) but appear to have no external consumers. The component is exported but never imported outside its own directory.

### 13. VisionBoardSection still exists but backend deleted
**Directory:** `src/components/MotivationSystem/Workshop/VisionBoardSection/`

The VisionBoardSection component (20 files) still exists and is exported from `Workshop/index.ts`. The backend (`convex/visionBoard*.ts`, `convex/visionBoardImages*.ts`) was deleted. The component doesn't directly call Convex APIs (uses props), but the data pipeline is broken.

### 14. `generateWeeklyInsights` is a no-op
**File:** `convex/analyticsWeekly.ts:75-83`

This internal mutation creates a local variable `_insightData` (explicitly unused) and returns `{ success: true }` without doing anything. Dead code.

---

## Moderate Warnings

### 15. `DayCellRing` fill animation only works on mount
**File:** `src/components/CalendarTimeline/components/DayCellRing.tsx:60-70`

`fillScale` spring animation plays on initial mount but not on subsequent completion toggles. If `isComplete` changes from false to true during component lifetime, the spring is a no-op because `fillScale` is already at `1`.

### 16. `DEFAULT_COLORS` / `HIGH_CONTRAST_COLORS` frozen to light mode
**File:** `src/components/CalendarTimeline/CalendarTimeline.styles.ts:17-24`

Module-level constants computed with `isDark = false`. If any consumer uses these in dark mode, colors will be wrong. The `getColors` function handles dark mode correctly — these constants may be stale.

### 17. ProgressGreeting month format inconsistency
**File:** `src/components/CalendarTimeline/components/ProgressGreeting.tsx:65`

Always uses full month name (`'MMMM'`), but `CalendarTimeline.tsx` switches to abbreviated (`'MMM'`) when viewing past weeks. Inconsistent display.

### 18. No backward navigation boundary guard
**File:** `src/components/CalendarTimeline/useTimelineSwipe.ts:30-36`

Forward swipe is gated by `canNavigateForward`, but backward swipe has no equivalent guard. Could navigate beyond valid date bounds.

### 19. `onQueueChange` callback stability risk
**File:** `src/hooks/useOfflineQueue/useOfflineQueue.ts:49`

`onQueueChange` in useEffect dependency array can cause infinite re-render loops if the consumer passes an unstabilized callback.

### 20. `callbacks` object in useEffect dependency
**File:** `src/components/OfflineQueueProcessor/useQueueProcessor.ts:57`

`callbacks` is an object prop in the dependency array. Unless the parent memoizes, `updateState` and everything depending on it recreates every render.

---

## Nits

| # | File | Issue |
|---|------|-------|
| 21 | `WeekNavRow.tsx:60` | Hardcoded `#3D2E00` chip text color won't adapt to dark mode |
| 22 | `WeekNavRow.tsx:77-82` | Hardcoded rgba pill colors — should use palette |
| 23 | `DayCellContent.tsx:88` | Mixed `className` + inline `style` — specificity conflicts |
| 24 | `DayCellContent.tsx:93` | Hardcoded `translateX: 3` for "Today" — fragile layout hack |
| 25 | `CalendarTimeline.tsx:75,86` | Duplicate hardcoded `paddingHorizontal: 40` |
| 26 | `CalendarTimeline.types.ts:20-23` | Reserved-for-future fields (`selectedDate`, `onDateSelect`) — YAGNI |
| 27 | `DayCellRing.styles.ts:19-20` | `AMBER_LIGHT` and `AMBER_DARK` are identical values |
| 28 | `CalendarTimeline.styles.ts:88` | Magic arithmetic `14 + 2 + 22 - 2` for topOffset |
| 29 | `inputValidation.ts:47` | `on\w+\s*=` regex flags legitimate strings like "ongoing=" |
| 30 | `errorMessages.ts` | Trivial getter functions add 50 lines — callers can index directly |
| 31 | Multiple files | `eslint-disable max-lines` suppressions on files close to 100-line limit |

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High Warning | 8 |
| Stale Reference | 4 |
| Moderate Warning | 6 |
| Nit | 11 |

**Top 3 actions recommended:**
1. Fix deletion order in `convex/habits/remove.ts` (delete tracking first, then habit)
2. Remove or define `DraftData` type export in `src/hooks/index.ts`
3. Clean up `showCharacterScreen` references and dead `StreakChain`/`VisionBoardSection` components
