# Weekly Time Spent per Habit

## Context

Today the app tracks habits as **binary daily completions** (`tracking` table has `completed: boolean`, `date`, `habitId`, `userId` only — `convex/schema.ts:353`). There is no per-completion duration anywhere. The user wants to see how long they did a specific habit across the current week (e.g., "Meditation — 2h 15m this week"), with **manual entry that can happen at any time**, decoupled from the daily check-off.

This adds optional time logging on top of the existing completion model — it does not replace anything. Habits that don't make sense to time (e.g., "drink water") just won't have minutes entered, and the weekly time card will quietly show an empty state with an "Add time" CTA.

## Approach

### 1. Schema — add optional minutes to tracking record

**File:** `convex/schema.ts:353-360`

```ts
tracking: defineTable({
  completed: v.boolean(),
  date: v.string(),
  habitId: v.id('habits'),
  minutes: v.optional(v.number()), // NEW — total minutes for this habit on this date
  userId: v.optional(v.string()),
}).index(...) // unchanged
```

Optional so existing records remain valid; no migration needed.

### 2. Convex API — one mutation, one query

**New file:** `convex/tracking/setMinutes.ts`

- Mutation `setHabitMinutes({ habitId, date, minutes })`.
- Auth + ownership check (mirror `getCompletionStatus.ts:17-37`).
- Validate `date` against `DATE_FORMAT_REGEX`; reject negative or non-finite minutes; cap (e.g., 1440 / day) to prevent fat-finger entries.
- Upsert: if a tracking row exists for `(habitId, date)`, `ctx.db.patch` minutes; else `ctx.db.insert` with `completed: false` and the given minutes. Logging time does **not** auto-mark completed (matches user's "decoupled" intent — "whenever you want to add it").
- Setting `minutes` to `0` or `undefined` clears it (patch with `minutes: undefined`).
- Does **not** trigger the strength recalc (cheap path; minutes don't affect streaks).

**New file:** `convex/tracking/getWeeklyMinutes.ts`

- Query `getWeeklyMinutes({ habitId, weekStartDate })` where `weekStartDate` is the Monday `YYYY-MM-DD`.
- Auth + ownership.
- Use `by_habit_and_date` index, range `weekStartDate` → `weekEnd` (Monday + 6 days, computed inline).
- Returns `{ totalMinutes: number, byDate: Record<string, number> }` — the totals for the week + per-day breakdown so the card can render a 7-cell row.

**Update:** `convex/tracking/index.ts` — export the new mutation/query so the frontend reaches them via `api.tracking.setHabitMinutes` / `api.tracking.getWeeklyMinutes`.

### 3. UI — `WeeklyTimeCard` on the habit detail screen

Reuse existing patterns:

- Card chrome / shadow: copy `GoalTabContent.tsx:50-55` (`shadows.card`, `colors.card`, rounded-2xl, `FadeIn.duration(180)`).
- Week boundary math: reuse `getWeekStart` from `src/utils/trendCalculations/dateHelpers.ts:13-21` (Monday-start, already battle-tested).
- Number/label styling: copy `DetailHeroStat.tsx` pattern (emoji + monospace value + label).
- Bottom sheet pattern: copy `GoalAdjustSheet` (already in `HabitDetailScreen/components/`) for the time-entry sheet.

**New directory:** `src/screens/HabitDetailScreen/components/WeeklyTimeCard/`

```
WeeklyTimeCard/
├── index.ts                       # barrel export
├── WeeklyTimeCard.tsx             # orchestration (≤100 lines)
├── WeeklyTimeCard.hooks.ts        # useWeeklyMinutes (Convex query) + handlers
├── WeeklyTimeCard.types.ts        # props/types
├── WeeklyTimeBreakdown.tsx        # 7 day cells with per-day minutes
├── LogTimeSheet.tsx               # bottom sheet to add/edit minutes for a chosen day
└── formatDuration.ts              # 135 → "2h 15m"; 45 → "45m"; 0 → "—"
```

**Card visual (per design system already in repo):**

```
┌──────────────────────────────────────────┐
│ This week                  [Log time ›]  │
│                                          │
│   ⏱️  2h 15m                              │
│   total this week                        │
│                                          │
│  M   T   W   T   F   S   S               │
│ 30m  —  45m 60m  —   —   —               │
└──────────────────────────────────────────┘
```

- Tapping `Log time` or any day cell opens `LogTimeSheet` for that date with a numeric input (minutes) and quick-pick chips (15 / 30 / 45 / 60). "Save" calls `setHabitMinutes`. "Clear" sets it to undefined.
- Empty state (no minutes anywhere this week): big `—` and a single CTA "Log time" — keeps the card useful for habits that haven't started using it yet.

**Wire-up:** `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx:91-94` — insert the new card between the strength section and the goal section (so the scroll order is Calendar → Strength → **Weekly Time** → Goal). No new tab; the screen is already scrollspy-based, so the card just lives in the scroll.

### 4. Habit type plumbing

`src/features/habits/types.ts` — if the existing `Tracking` type mirrors the schema, add the optional `minutes?: number` so TS picks it up. Otherwise no change (the new card calls its own dedicated query and doesn't go through the existing tracking prop chain).

## Files to modify

| File | Change |
| --- | --- |
| `convex/schema.ts` | Add `minutes: v.optional(v.number())` to `tracking` |
| `convex/tracking/setMinutes.ts` | **New** — `setHabitMinutes` mutation |
| `convex/tracking/getWeeklyMinutes.ts` | **New** — weekly aggregation query |
| `convex/tracking/index.ts` | Export new mutation + query |
| `src/screens/HabitDetailScreen/components/WeeklyTimeCard/*` | **New** card + sheet |
| `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` | Render `<WeeklyTimeCard>` |
| `src/screens/HabitDetailScreen/components/index.ts` | Export `WeeklyTimeCard` |
| `src/features/habits/types.ts` | Add optional `minutes?: number` to Tracking type if present |

All new files target ≤100 lines per the repo's max-lines rule (see `CLAUDE.md` "Code Readability Initiative").

## Reused utilities (no duplication)

- `getWeekStart` — `src/utils/trendCalculations/dateHelpers.ts:13`
- `DATE_FORMAT_REGEX` — `convex/tracking/helpers.ts` (re-exported in `convex/tracking/index.ts:5`)
- Card chrome — pattern from `GoalTabContent.tsx:50-55`
- Bottom sheet — pattern from `GoalAdjustSheet/`
- Auth/ownership pattern — `convex/tracking/getCompletionStatus.ts:17-37`

## Verification

1. **Convex deploy** — `npx convex dev` succeeds (schema migrates cleanly because `minutes` is optional).
2. **Mutation** — from the Convex dashboard or `mcp__convex__run`, call `tracking:setHabitMinutes` with a known habit ID and inspect the row in `mcp__convex__data` to confirm `minutes` is stored.
3. **Query** — call `tracking:getWeeklyMinutes` for that habit + this week's Monday; assert the returned `totalMinutes` matches what was stored, and `byDate` keys map to the right day.
4. **UI** — `npm run start`, open the app, tap a habit to open `HabitDetailScreen`. Confirm:
   - The Weekly Time card renders between Strength and Goal.
   - Empty state shows when no minutes are logged this week.
   - Tapping a day opens the sheet; saving 30m updates the card immediately (Convex live query).
   - Tapping `Log time` for a different day works; clearing minutes updates the total.
   - Total formats correctly: 0 → empty state, 45 → "45m", 135 → "2h 15m".
5. **Lint/types** — `npm run lint:max-lines` shows no new violations; `npx tsc --noEmit` passes.
6. **Regression** — toggling a habit from the calendar still works (toggle path is unchanged; only an extra optional field exists on the row).

## Out of scope (intentionally)

- No timer / start-stop UI (user chose manual).
- No effect on streak or strength calculation (minutes are display-only for now).
- No backfill / migration (optional field; old rows are fine).
- No template-level `estimatedMinutes` autofill (can be a follow-up; user said manual).
- No history view beyond "this week" (can iterate to monthly later).
