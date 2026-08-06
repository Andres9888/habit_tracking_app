# Ring Progress Cells — CalendarTimeline Implementation Plan

## Context

Replace the current square day cells (44x44 rounded rectangles) in the CalendarTimeline with circular SVG progress rings (Apple Watch style). Each day shows a ring that fills based on completion percentage. Complete days show a solid filled circle with checkmark. This gives users precise visual feedback on daily progress and creates "close the ring" motivation.

The codebase already has the `ProgressRingFAB` component using `react-native-svg` + `Animated.createAnimatedComponent(Circle)`, so the SVG ring pattern is proven and ready to reuse.

---

## Key Data Flow Change

**Problem:** Currently `DayCellContent` only receives `completionStatus: CompletionStatus` (a string: 'complete'|'partial'|'none'|'future'). To render a ring, we need the raw `completed` and `total` counts per day.

**Solution:** Compute a parallel `completionCounts` array in `useDerivedState` and thread it through `DayStrip` → `DayCell` → `DayCellContent`.

---

## Files to Modify (8) + New Files (2)

### 1. NEW: `src/components/CalendarTimeline/components/DayCellRing.tsx` (~90 lines)

SVG progress ring sized at 44px (matches current cell).

- **Geometry:** SIZE=44, STROKE_WIDTH=3, RADIUS=20.5, CIRCUMFERENCE=128.8
- **States:**
  - `complete` → Solid emerald circle fill + Check icon overlay (no ring stroke)
  - `partial` → Track circle (muted) + animated progress arc (emerald), day number centered
  - `none` (past) → Track circle only, day number centered, subtle border
  - `future` → Dashed/faint circle, day number, 40% opacity
  - `today` (not complete) → Amber-colored track + progress arc, golden glow
  - `today` (complete) → Solid emerald fill + check + glow
- **Animation:** `useAnimatedProps` on `strokeDashoffset` (reuse pattern from ProgressRingFAB)
- **Center text:** Day number (same font sizing as current: 14px)
- **Imports:** `Svg, Circle` from `react-native-svg`, `Animated` from `react-native-reanimated`

### 2. NEW: `src/components/CalendarTimeline/components/DayCellRing.styles.ts` (~40 lines)

Ring geometry constants and theme-aware color functions.

```
RING_SIZE = 44
STROKE_WIDTH = 3
RADIUS = (44 - 3) / 2 = 20.5
CIRCUMFERENCE = 2 * PI * 20.5 ≈ 128.81

getRingColors(isDark, isToday, completionStatus) → {
  track: muted gray track color
  progress: emerald (normal) or amber (today)
  fill: emerald-600 (complete state solid fill)
  text: day number color
}
```

### 3. MODIFY: `src/components/CalendarTimeline/CalendarTimeline.derived.ts`

Add `completionCounts` array alongside `completionStatuses`.

```diff
+ const completionCounts = useMemo(
+   () => dates.map((d) => {
+     const key = format(d, 'yyyy-MM-dd');
+     return completionByDay[key] ?? { completed: 0, total: 0 };
+   }),
+   [dates, completionByDay]
+ );

  return {
    ...
    completionStatuses,
+   completionCounts,
    ...
  };
```

### 4. MODIFY: `src/components/CalendarTimeline/CalendarTimeline.tsx`

Pass `completionCounts` to `DayStrip`.

```diff
  <DayStrip
    ...existing props...
+   completionCounts={tl.completionCounts}
  />
```

### 5. MODIFY: `src/components/CalendarTimeline/components/DayStrip.tsx`

Accept and pass `completionCounts` to each `DayCell`.

```diff
  interface DayStripProps {
    ...
+   completionCounts: { completed: number; total: number }[];
  }

  // Inside map:
  <DayCell
    ...existing props...
+   completed={completionCounts[index]?.completed ?? 0}
+   total={completionCounts[index]?.total ?? 0}
  />
```

### 6. MODIFY: `src/components/CalendarTimeline/CalendarTimeline.types.ts`

Add `completed` and `total` to `DayCellProps`.

```diff
  export interface DayCellProps {
    ...
+   /** Number of habits completed on this day */
+   completed: number;
+   /** Total number of habits for this day */
+   total: number;
  }
```

### 7. MODIFY: `src/components/CalendarTimeline/components/DayCell.tsx`

Pass `completed` and `total` through to `DayCellContent`.

```diff
  const cp = {
    ...existing props...
+   completed,
+   total,
  };
```

### 8. MODIFY: `src/components/CalendarTimeline/components/DayCellContent.tsx`

Replace the square `Animated.View` cell with `DayCellRing`. Remove `CompletionDot` and the fixed-height spacer (the ring itself shows progress).

```diff
- import { CheckBadge } from './CheckBadge';
- import { CompletionDot } from './CompletionDot';
- import { getDayCellStyles } from './DayCellContent.helpers';
+ import { DayCellRing } from './DayCellRing';

  interface DayCellContentProps {
    ...existing...
+   completed: number;
+   total: number;
  }

  // Render: replace the Animated.View + CheckBadge + CompletionDot with:
  <DayCellRing
    completed={completed}
    completionStatus={completionStatus}
    dayNumber={dayNumber}
    isCurrentDay={isCurrentDay}
    isUpcoming={isUpcoming}
    reduceMotion={reduceMotion}
    total={total}
    isDark={isDark}
  />
  // Remove the fixed-height spacer View (no more CompletionDot needed)
```

### 9. MODIFY: `src/components/CalendarTimeline/components/ConnectorArms.tsx`

Adjust `topOffset` if needed — current value (36.5px) was calibrated for the square cell. The ring is the same 44px size so this should remain the same, but verify visually.

---

## What Gets Removed / Unused

- `CompletionDot` is no longer rendered inside `DayCellContent` (keep the file — it may be used elsewhere or in MiniCalendar)
- `CheckBadge` is no longer rendered inside `DayCellContent` (the check icon moves into `DayCellRing`)
- `getDayCellStyles()` in `DayCellContent.helpers.ts` — no longer called from `DayCellContent` (keep file, may be useful)
- `useTodayGlow` hook — glow moves into `DayCellRing` styling (keep file)

---

## Ring Visual States (Detail)

| State            | Ring Track  | Progress Arc       | Fill              | Center             | Extra               |
| ---------------- | ----------- | ------------------ | ----------------- | ------------------ | ------------------- |
| Complete         | hidden      | hidden             | emerald-600 solid | Check icon (white) | glow shadow         |
| Complete + Today | hidden      | hidden             | emerald-600 solid | Check icon (white) | amber border + glow |
| Partial          | muted gray  | emerald-500 arc    | transparent       | day number         | —                   |
| Partial + Today  | amber track | amber progress arc | transparent       | day number (amber) | golden glow pulse   |
| None (past)      | muted gray  | none               | transparent       | day number (muted) | —                   |
| Future           | dashed gray | none               | transparent       | day number (faint) | 40% opacity         |

---

## Animation Approach

- **Progress arc:** `useAnimatedProps` controlling `strokeDashoffset` on `AnimatedCircle` (same pattern as `ProgressRingFAB.tsx:28-31`)
- **Complete fill:** `withSpring` scale from 0→1 for the solid circle (celebration spring from `@/theme/animations`)
- **Check icon:** Reuse `Check` from `lucide-react-native` with the same celebration spring
- **Today glow:** Reuse breathing shadow pattern from `useTodayGlow` but applied to ring wrapper
- **Reduce motion:** All animations set values directly when `reduceMotion=true`

---

## Files Not Changed

- `CalendarTimeline.styles.ts` — ring styles go in new `DayCellRing.styles.ts`
- `CalendarTimeline.hooks.ts` — no changes needed
- `MiniCalendarPopup/Grid` — keeps current dot display
- `ProgressGreeting/WeekNavRow/ProgressText` — unchanged
- `StripNav` — unchanged

---

## Verification

1. Run `npx expo start` and check the home screen calendar timeline
2. **Complete days:** Solid emerald circle with white check icon, glow shadow
3. **Partial days:** Ring with emerald arc proportional to completion (e.g., 3/5 = 60% fill), day number centered
4. **Today (incomplete):** Amber-tinted ring with progress arc, golden breathing glow
5. **Past empty days:** Gray track ring, day number visible
6. **Future days:** Faded (40% opacity) dashed circle
7. **Streak connectors:** Still connect between complete days at correct vertical position
8. **Week swipe:** Ring cells animate in/out with existing week transition
9. **Dark mode:** Verify all ring colors adapt
10. **High contrast mode:** Verify rings have visible borders
11. **Reduce motion:** No animations, values set directly
12. Run `npm run lint:max-lines` — all new files under 100 lines
