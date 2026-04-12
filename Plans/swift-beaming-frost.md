# Calendar Timeline — Clarity & Contrast Fix

## Context
The calendar timeline feels "blurry" due to compounding low-contrast elements on the warm parchment shelf (`#FAF8F5`). Multiple elements — weekday labels, ring tracks, ghost connectors, month prefixes — are all so subtle they create a muddy, undefined composition. This plan tightens contrast across 7 files with surgical, targeted changes.

## Root Cause
Too many elements at sub-WCAG contrast ratios on the warm stone background:
- Weekday labels: `gray[300]` (#C4BFB7) = **~1.5:1 contrast** (FAILS WCAG)
- Ring tracks: `gray[200]` (#DDD8D2) = **~1.3:1 contrast**
- Ghost connectors: effective **~17.5% opacity** (invisible)
- Month prefix: **7px** font (sub-readable)
- Chevron: **10px** (borderline invisible)

## Changes (8 tweaks, 7 files)

### 1. Weekday labels — `theme.ts` line 44
`secondaryText: colors.gray[300]` -> `colors.gray[400]` (#6E6660, 4.69:1 WCAG AA pass)

### 2. Ring track stroke — `DayCellRing.styles.ts` line 14
`TRACK_LIGHT = palette.gray[200]` -> `'rgba(0,0,0,0.12)'` (consistent definition on any local bg)

### 3. Month prefix size — `DayCellRing.styles.ts` lines 135-138
`fontSize: 7` -> `9`, `marginBottom: -1` -> `0`

### 4. Today label alignment — `DayCellContent.tsx` line 96
Remove `...(isCurrentDay && { transform: [{ translateX: 3 }] })` — fragile hack, already in centered container

### 5. Date pill chevron — `WeekNavRow.tsx` line 96
`size={iconSizes.micro}` (10px) -> `size={12}` (explicit, visible affordance)

### 6. Breathing glow cadence — `useTodayGlow.ts` line 22
`HALF_CYCLE_MS = 1250` -> `1500` (3s full cycle, calmer rhythm)

### 7. Ghost connector visibility — `ConnectorArms.tsx` lines 41, 51
`opacity: 0.5` -> `0.8` (effective ~28% vs ~17.5%, visible but clearly lighter than solid)

### 8. Missed day indicator — `DayCellRing.tsx` lines 11, ~144
Import `Line` from react-native-svg. Add a subtle 10px horizontal dash inside missed-day rings:
```tsx
{isMissed && (
  <Line x1={HALF - 5} y1={HALF} x2={HALF + 5} y2={HALF}
    stroke={rc.track} strokeWidth={1.5} strokeLinecap="round" />
)}
```

## Files Modified
1. `src/components/CalendarTimeline/theme.ts` — secondaryText color
2. `src/components/CalendarTimeline/components/DayCellRing.styles.ts` — track color, month prefix
3. `src/components/CalendarTimeline/components/DayCellContent.tsx` — remove translateX hack
4. `src/components/CalendarTimeline/components/WeekNavRow.tsx` — chevron size
5. `src/components/CalendarTimeline/hooks/useTodayGlow.ts` — glow cadence
6. `src/components/CalendarTimeline/components/ConnectorArms.tsx` — ghost opacity
7. `src/components/CalendarTimeline/components/DayCellRing.tsx` — missed day dash

## Verification
1. Run `npx jest --testPathPattern CalendarTimeline` — existing tests should pass (no color/size assertions)
2. Visual check on device/simulator in **light mode + dark mode** with:
   - Normal week (mix of complete, partial, missed, future)
   - Week starting on 1st of month (month prefix)
   - Today incomplete (breathing glow)
   - Past week (chevron on date pill)
   - Streak reaching today (ghost connectors)
3. WCAG contrast: `#6E6660` on `#FAF8F5` = 4.69:1 (AA pass)
