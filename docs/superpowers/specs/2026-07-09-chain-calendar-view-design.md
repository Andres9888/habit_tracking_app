# Chain Calendar View

**Date:** 2026-07-09
**Status:** Design — approved via interactive mock, ready for implementation plan
**Surface:** `src/components/BinaryHeatmap/MonthlyCalendarGrid/`, `src/components/BinaryHeatmap/` (year strip cells), `src/components/SettingsModal/` (Look & Feel → Calendar Look), `src/components/HabitChainVisualizer/` (reused, not modified), `convex/settings/`

## Context

The habit detail screen's calendar (month grid + year strip, inside `HabitDetailScreen`'s unified Calendar tab) currently renders square day cells. The ask: introduce a round "chain link" cell style, make it discoverable and configurable, and make streak continuity ("don't break the chain") more visually legible than plain squares — without regressing the square style for people who prefer it.

The brief originally pointed at `src/components/ComplianceHeatmap/` as the file to extend. That component only powers the Analytics screen's aggregate multi-habit grid and is never used in the per-habit detail or year view — confirmed by reading its only call site (`ChartSections.tsx`). The real per-habit calendar is `BinaryHeatmap`'s `MonthlyCalendarGrid` (month) + `YearStrip` (year), both rendered inside `HabitDetailScreen`. This spec targets that system instead. `ComplianceHeatmap` (Analytics) and the legacy `HabitCalendarModal` (still reachable in parallel to `HabitDetailScreen`) are explicitly out of scope — confirmed with the user.

Two existing settings already partially cover this territory:

- `dayShape: 'circle' | 'square'` — already shipped, already has a picker (`DayShapePicker.tsx`), but today only drives `HabitChainVisualizer` (the weekly day-chip strip on habit list cards) and the Settings preview. It does **not** yet affect the month/year calendar grid.
- `showStreakConnections: boolean` — already shipped, drives `ChainConnectors.tsx`, a ribbon overlay that merges adjacent completed square cells in the month grid into one continuous block. Its correctness rule (never bridge across a week-row boundary) is already solved via a `for i < 6` per-row loop.

Through interactive mockups (`.superdesign/design_iterations/chain_view_plan_2.html`), the design converged on generalizing these two independent axes rather than adding a third, overlapping "Chain vs Squares" preset.

## Settings model

Two settings, reused/extended rather than a new redundant toggle:

1. **`dayShape: 'circle' | 'square'`** (existing setting; reach extended to the calendar grid; default changes from `'square'` to `'circle'` — see "Flagged consequence" below).
2. **`connectorStyle: 'none' | 'small' | 'full'`** (new; replaces `showStreakConnections: boolean`). Semantics:
   - `none` — cells stand alone, no connector. (`false` equivalent of the old boolean.)
   - `small` — a thin connector line between consecutive completed cells. **Reuses the existing `DayConnector` component** (`src/components/HabitChainVisualizer/DayConnector.tsx`, already shipped and already visible in the Settings preview / habit-list weekly strip) rather than inventing a new line style.
   - `full` — for `dayShape: 'square'`, this **is** the existing `ChainConnectors.tsx` ribbon, unchanged. For `dayShape: 'circle'`, this is a new per-cell round join-bar (see below). (`true` equivalent of the old boolean.)
   - The Settings UI only exposes `none`/`full` when `dayShape: 'circle'` (per explicit user direction — circle does not get a "small" option). Square exposes all three.
3. **Default on ship: `dayShape: 'circle'`, `connectorStyle: 'full'`** — this is "Chain," the new app default.

### Flagged consequence (surface before implementing the default flip)

Because `dayShape` is a **shared** setting (not calendar-specific), changing its default from `'square'` to `'circle'` also changes the default appearance of the habit-list weekly card strip (`HabitChainVisualizer`, via `DraggableHabit`) for every user who hasn't explicitly set a shape preference — not just the calendar. This is consistent with the original brief's "applies app-wide wherever the streak grid renders," and reusing `dayShape` is the architecturally correct move (one setting, one meaning, everywhere) rather than forking a calendar-only shape flag. But it is a larger blast radius than "the calendar screen only," so it's called out explicitly here rather than silently bundled into the same commit as everything else — the default-flip should land as its own isolated, easily-revertible change in the plan.

## Architecture

**Principle: reuse the interaction shell, swap only the visual body.** `CalendarDay.tsx` already separates the Pressable/animation/a11y shell from `CalendarDayBody.tsx` (pure visuals). All press handling, pending-toggle blocking, reduced-motion, and accessibility labeling (`useCalendarDayCellState`, `getDayAccessibility`) stay untouched and shape-agnostic.

### Month grid (`MonthlyCalendarGrid/`)

- `CalendarDay.tsx` gains `shape: 'circle' | 'square'` and `connectorStyle: 'none' | 'small' | 'full'` props (defaults preserve current behavior). Renders `ChainDayBody` (new) instead of `CalendarDayBody` when `shape === 'circle'`; `CalendarDayBody` gains the same connector-aware rendering for the square case.
- **New `chainLinkHelpers.ts`**: `isLinkable(day)` (extracted from `ChainConnectors.tsx`, shared so both paths use one definition: `isCompleted && isCurrentMonth && !isFuture`) and `shouldJoinRight(week, index)` → `isLinkable(week[index]) && isLinkable(week[index+1]) && index < week.length - 1`. This is the critical correctness rule, verbatim: a link only fuses right when **both** days are completed **and** the current cell isn't the last column of its week row. Implemented per-cell (each day decides its own right-edge decoration), not as a row-spanning absolute overlay — so the week-boundary guarantee falls out of the array index check structurally, the same way `ChainConnectors.tsx`'s existing `for i < 6` loop already guarantees it today.
- **New `ChainDayBody.tsx`**: round dot, filled `colors.primary[500]`/border `colors.primary[600]` when completed, open dashed ring (`colors.gray[300]`) when missed (plus two short dotted stub lines on its own left/right edges — a static property of being a missed cell, not neighbor-conditioned), muted ring when future/outside-month, soft halo ring on today. When `connectorStyle === 'full'` and `shouldJoinRight`, renders its own right-edge join bar. When `connectorStyle === 'small'`, both shapes render a `DayConnector` instance instead of the custom join bar (one shared "small" implementation, not two).
- `AnimatedWeeksGrid.tsx` computes `shouldJoinRight` per day in a row and passes `shape`/`connectorStyle`/`joinRight` down; skips rendering `ChainConnectors` (the square-only ribbon overlay) whenever `connectorStyle !== 'full'` or `shape === 'circle'`.
- `MonthlyCalendarGrid.tsx` reads `settings?.dayShape` and `settings?.connectorStyle` (mirrors the existing `showConnections` read pattern) and threads them down.

### Year strip (`YearStrip` → `InlineHeatmapGrid` → `HeatmapCell`)

Cells are 13px (`BinaryHeatmap/constants.ts`). Decision, confirmed via the plan mock: **shape follows `dayShape` (circle vs rounded-square), but no connector overlay is rendered at this scale regardless of `connectorStyle`** — `none`/`small`/`full` all render identically here (dot/square only). Tight cell spacing already reads consecutive filled cells as continuous; a join bar or `DayConnector` line would be sub-pixel noise at 13px. `HeatmapCell.tsx` gets a `shape` prop and a new `getChainCellShape` helper (sibling to the existing `getCellBackgroundColor` in `cellHelpers.ts`) controlling `borderRadius` (full circle vs existing small radius) and the missed/future ring treatment. Year cells remain non-interactive (inspect + jump-to-month only, per existing behavior — untouched).

### Colors

No new hardcoded palette. `colors.primary[500]`/`[600]` (done), `colors.gray[300]` (missed ring + dotted trace — closest existing token to the mock's warm tan, documented as "disabled elements"), `colors.gray[100]`/`[200]` (future/muted).

## Settings UI

- `CalendarLookPage.tsx`: the existing "Streak connections" toggle row is replaced by a new **`ConnectorStylePicker`** (segmented control, options gated by current `dayShape`: circle → None/Full, square → None/Small/Full), built on the same `getSegmentedControlColors` pattern as `DayShapePicker.tsx` — no new UI primitive.
- `DayShapePicker.tsx` itself is unchanged (already exists) but its selection now also drives the calendar preview and the real calendar grid, not just the weekly-strip preview.
- Persistence follows the exact existing `dayShape`/`showStreakConnections` chain end-to-end: `DEFAULT_SETTINGS` (`convex/settings/types.ts`) → validators (`convex/settings/validators.ts`, `src/lib/settings/sanitizeSettingsPayload.ts`) → local mirrored state (`useSettingsLocalPrefs.ts`) → updater (`SettingsModal.settingsUpdaters.ts`) → threaded through `SettingsModal.hooks.ts` → `SettingsModal.tsx` → `SettingsMainView.tsx` → `CalendarLookPage.tsx`. `showStreakConnections` is removed from this chain (superseded by `connectorStyle`), including its `AppearanceChainRows.tsx` row and the `CalendarPreviewWeek.tsx` preview wiring.

## Accessibility

Unchanged. `getDayAccessibility` (month grid) and the year-strip's existing label builder are already shape-independent (date + status), so no new a11y work is needed beyond making sure `ChainDayBody` doesn't bypass the shared `a11y` object from `useCalendarDayCellState`.

## Out of scope

- `src/components/ComplianceHeatmap/` (Analytics aggregate grid) — untouched.
- Legacy `HabitCalendarModal` / `HeatmapCalendar` — untouched, still reachable in parallel.
- `HabitChainVisualizer`'s own rendering logic — untouched; only its `DayConnector` sub-component is **reused** (imported), not modified, by the month grid's "small" connector style.

## File plan

**New:** `MonthlyCalendarGrid/ChainDayBody.tsx`, `MonthlyCalendarGrid/chainLinkHelpers.ts`, `SettingsModal/ConnectorStylePicker.tsx`, a small chain-shape helper alongside `BinaryHeatmap/cellHelpers.ts`.

**Touched:** `CalendarDay.tsx`, `CalendarDayBody.tsx`, `AnimatedWeeksGrid.tsx`, `MonthlyCalendarGrid.tsx`, `HeatmapCell.tsx`, `InlineHeatmapGrid.tsx`, `YearStrip.tsx`, `CalendarLookPage.tsx`, `CalendarLookPage.types.ts`, `CalendarPreview.tsx`, `CalendarPreviewWeek.tsx`, `AppearanceChainRows.tsx` (removed/replaced), `useSettingsLocalPrefs.ts`, `SettingsModal.settingsUpdaters.ts`, `SettingsModal.hooks.ts`, `SettingsModal.tsx`, `SettingsMainView.tsx` (+ `.types.ts`), `convex/settings/types.ts`, `convex/settings/validators.ts`, `src/lib/settings/sanitizeSettingsPayload.ts`.

Each new file is single-purpose and expected to land well under the 100-line/file, 40-line/function project ceiling given the narrow scope of each (matches the existing decomposition density in both `MonthlyCalendarGrid/` and `BinaryHeatmap/`).

## Testing / verification plan

- `tsc` clean, `npm run lint` clean (including `lint:max-lines`).
- No new jest failures (existing ~17% RN-mock-env red is pre-existing and out of scope).
- iOS simulator: screenshot the default (circle + full) on month + year view, square + full (unchanged ribbon), square + small (new), square + none, circle + none. Verify the setting persists across an app restart.
- Verify the week-wrap correctness rule visually: a completed Saturday must never show a join bar reaching into the next row's Sunday.
