# Plan: Binary Year Calendar on Habit Detail Screen

## Context

The habit detail screen currently shows a monthly calendar grid (MonthlyCalendarGrid) under the "HISTORY" section. The user wants a GitHub-style binary year calendar added **above** the monthly calendar to give a zoomed-out view of the full year's completions at a glance.

The existing `BinaryHeatmap` component already implements this exact visualization (7 rows x N columns, binary done/missed cells, month labels, horizontal scroll). It supports `'1y'` time range in the grid generation utility but is hardcoded to `'6m'`. The change is primarily wiring up the existing `timeRange` prop and placing the component on the detail page.

## Decisions

- **Header title**: "Year Overview" (not "Activity")
- **Dark mode**: Deferred — get it working in light mode first
- **Mock first**: Create HTML mock before implementation

## Phase 1: HTML Mock

Create an HTML mock in `.superdesign/design_iterations/` to visualize how the year heatmap looks above the monthly calendar on the detail screen, before touching React Native code. This lets us validate layout, spacing, and proportion.

## Phase 2: Implementation

### Step 1 - Wire up `timeRange` prop in BinaryHeatmap

**File:** `src/components/BinaryHeatmap/BinaryHeatmapNew.tsx`

- Remove `FIXED_TIME_RANGE` constant
- Use `timeRange ?? '6m'` from props (the prop already exists in `BinaryHeatmapProps` but is ignored)
- Add `timeRange` to the `useMemo` dependency array for `gridData`
- Backward compatible: existing consumers without `timeRange` get `'6m'`

### Step 2 - Add optional `title` prop

**File:** `src/components/BinaryHeatmap/BinaryHeatmapNew.tsx` + `types.ts`

- Add `title?: string` to `BinaryHeatmapProps` in `types.ts`
- Default to `"Activity"` (current behavior)
- Pass `title="Year Overview"` from the detail screen wrapper

### Step 3 - Create `YearHeatmapSection` wrapper

**New file:** `src/screens/HabitDetailScreen/components/YearHeatmapSection.tsx` (~35 lines)

Thin wrapper that:
- Renders `BinaryHeatmap` with `timeRange="1y"`
- Wraps in `Animated.View` with card styling (rounded corners, shadow) matching existing sections
- Passes through `completedDates`, `habitColor`, `habitCreatedAt`, `habitId`, `onDayPress`

### Step 4 - Integrate into HabitDetailContent

**File:** `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` (currently 93 lines)

Insert `YearHeatmapSection` between the "HISTORY" `SectionLabel` and `MonthlyCalendarGrid`:

```
QuickStatsRow
SectionLabel "HISTORY"
  YearHeatmapSection  <-- NEW (year heatmap)
  MonthlyCalendarGrid  (existing monthly view)
SectionLabel "STRENGTH"
  HabitStrengthSection
```

Add ~8 lines (import + JSX). File stays under 100 lines.

## Files to Modify

| File | Change | Est. Lines |
|------|--------|-----------|
| `src/components/BinaryHeatmap/BinaryHeatmapNew.tsx` | Use `timeRange` prop, add `title` prop | ~92 |
| `src/components/BinaryHeatmap/types.ts` | Add `title?: string` to `BinaryHeatmapProps` | 207 (no change) |
| `src/screens/HabitDetailScreen/components/YearHeatmapSection.tsx` | **New**: wrapper component | ~35 |
| `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` | Add import + JSX for year section | ~100 |

## What This Does NOT Include (Follow-ups)

- **Dark mode theming**: The BinaryHeatmap uses hardcoded light colors. Works fine in light mode. Dark mode support is a separate task requiring a `useHeatmapColors` hook and threading theme colors through `cellHelpers`, `InlineHeatmapGrid`, `HeatmapLegend`.
- **Auto-scroll to recent**: The horizontal ScrollView starts at the left (oldest). Scrolling to the right (most recent) on mount would be a nice UX improvement.
- **Cross-view interaction**: Tapping a cell in the year view could navigate the monthly calendar to that month.

## Verification

1. Open any habit's detail screen
2. Confirm the year heatmap appears above the monthly calendar under "HISTORY"
3. Verify 52 weeks of cells render with correct completion coloring
4. Verify horizontal scroll works smoothly
5. Verify the monthly calendar still works normally below
6. Verify existing BinaryHeatmap consumers (if any use `'6m'` default) are unaffected
