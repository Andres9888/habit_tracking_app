# ChainDay Improvement Opportunities

## Context
Andres asked for improvement ideas across design and code. After exploring the full codebase (225K lines, ~120 components, Convex backend with 8 tables), the app scores ~8.5/10 overall — strong design system, science-backed habit strength model, accessibility compliance, and layered micro-interactions. The improvements below target the gaps that would have the most user-visible impact.

---

## Priority 1: Critical — Fully-Built Features Users Can't Access

### 1. Make Analytics & Character screens reachable
The Analytics screen (charts, distributions, rankings, weekly insights, trend predictions) and Character screen (gamification, XP, progression) are **fully built but have no navigation entry point**. Users have zero visibility into their progress data or gamification status. For a habit tracking app, showing progress over time is the core retention driver.

**Effort:** Medium
**Key files:** `src/features/habits/components/BottomActionBar/BottomActionBar.tsx`, `src/features/habits/hooks/useModalVisibilityState.ts`, `src/features/habits/components/HabitsModals/HabitsModals.tsx`

### 2. Data export passes empty arrays
`useAnalyticsExport.ts` calls `prepareExportData([], [], overviewStats)` — exported files contain only summary stats, not actual habit data or tracking history. Premium users paying for export get an empty file.

**Effort:** Small
**Key files:** `src/screens/AnalyticsScreen/hooks/useAnalyticsExport.ts`

---

## Priority 2: Quick Wins — Small Effort, Visible Impact

### 3. Wire up 3 dead navigation taps in Analytics
Three `// TODO: navigate to habit detail` stubs mean tapping a habit in rankings, insights, or overview does nothing. The navigation infrastructure exists; these are callback wiring fixes.

**Effort:** Small
**Key files:** `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts:60`, `src/components/HabitRankingsList/HabitRankingsList.tsx:23`, `src/screens/AnalyticsScreen/components/InsightsSections.tsx:37`

### 4. Fix or remove "View Past Reports" dead button
`InsightsSections.tsx` renders a "View Past Reports" button whose handler is `() => { /* TODO */ }`. Either wire it up or remove it.

**Effort:** Small
**Key files:** `src/screens/AnalyticsScreen/components/InsightsSections.tsx`

### 5. Migrate FAB animations to Reanimated
The FAB (primary CTA) is the only component still using the legacy `Animated` API (JS thread). Everything else runs on the UI thread via Reanimated. The file is 49 lines with an explicit TODO.

**Effort:** Small
**Key files:** `src/features/habits/components/FloatingActionButton/useFABAnimations.ts`

---

## Priority 3: Design/UX — Polish & Discovery

### 6. Templates UX Redesign (spec 003 exists, not implemented)
Detailed spec at `specs/003-templates-ux-redesign/spec.md` with 6 user stories: trending cards with 1-tap import (down from 3 taps), quick-filter chips, featured hero collections, curated packs, and PRO badge removal. This is the primary habit discovery mechanism.

**Effort:** Large
**Key files:** `src/screens/TemplatesScreen/` (many components)

### 7. Time-of-day habit grouping
Habits have a `preferredTime` field ("morning"/"afternoon"/"evening") set during creation, but the main list renders them flat. Grouping by time-of-day with collapsible sections would show users the habits relevant to their current time.

**Effort:** Medium
**Key files:** `src/features/habits/components/HabitsList/HabitsListContent.tsx`, `src/features/habits/hooks/habitsSortHelpers.ts`

### 8. Habit search/filter on main list
No search or filter exists on the main habits list. Users with many habits must scroll. The `tags` and `preferredTime` fields exist but have no front-end filtering.

**Effort:** Medium
**Key files:** `src/features/habits/components/HabitsList/HabitsListHeader.tsx`

---

## Priority 4: Features — New Capabilities

### 9. Server-side push notifications for streak-at-risk habits
Schema has `remindersEnabled`, `reminderTime`, `streakRemindersEnabled` but no backend push functions. Local notifications only fire if the user recently opened the app. A Convex cron job sending push notifications via Expo Push API would catch users before they break a streak.

**Effort:** Large
**Key files:** `convex/schema.ts` (add push token), new `convex/notifications.ts`, new `convex/crons.ts`

### 10. Quick complete from notification action button
Add an Expo Notifications action button ("Mark Complete") so users can complete habits from the notification without opening the app. The toggle mutation already exists.

**Effort:** Medium
**Key files:** `src/utils/notifications/streakAtRisk.ts`, `src/hooks/useNotificationResponse.ts`

---

## Priority 5: Code Quality & Backend

### 11. Decompose 3 oversized files (>200 lines each)
- `SettingsContent.tsx` (328 lines) — split into per-section components
- `FeedbackModal.tsx` (309 lines) — extract form fields and type selector
- `TemplatePreviewModal.tsx` (279 lines) — extract customization sections

### 12. Optimize weekly analytics query
`analyticsWeekly.ts` fetches ALL user tracking records then filters in JS. The `by_user_and_date` index exists; add `.gte()`/`.lte()` range bounds for 95%+ data reduction.

### 13. Fix `any` type in useAnalyticsActions
`overviewStats: any` on line 13 — should use the `OverviewStats` type that already exists in the sibling hook.

---

## Recommended Order of Attack

| Phase | Items | Why |
|-------|-------|-----|
| **Now** | #1 (Analytics nav), #2 (export fix), #3 (dead taps), #4 (dead button), #5 (FAB) | Unblocks built features, fixes broken UX, all small-medium effort |
| **Next** | #7 (time grouping), #8 (search/filter), #12 (query opt), #13 (any type) | Quality-of-life for daily use |
| **Later** | #6 (templates redesign), #9 (server push), #10 (quick complete), #11 (decompose) | Larger efforts with high payoff |
