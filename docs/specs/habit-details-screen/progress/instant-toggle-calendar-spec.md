# Instant Toggle Calendar Specification

## Feature Overview

**Feature Name:** HabitKit-Inspired Instant Toggle Calendar
**Status:** Implemented
**Version:** 2.0
**Last Updated:** 2024-12-28

### Summary

Transform the calendar heatmap from a view-only component into an interactive, HabitKit-style instant toggle interface where users can tap any day cell to immediately toggle completion status with satisfying animations and haptic feedback.

---

## Problem Statement

### User Pain Points

1. **Friction in Completion Flow**: Previous implementation required tapping a cell, viewing a tooltip, then confirming action - too many steps for a frequent action
2. **Delayed Feedback**: No immediate visual confirmation of toggle action
3. **Inconsistent UX**: Today indicator was subtle; easy to lose track of current day
4. **Static Feel**: Calendar felt like a passive data display, not an interactive tool

### Competitive Analysis

| Feature | Our App (Before) | HabitKit | Streaks | Done |
|---------|------------------|----------|---------|------|
| Instant toggle | No (tooltip first) | Yes | Yes | Yes |
| Completion animation | No | Spring pop | Fade | Scale |
| Haptic feedback | Light | Medium | Heavy | None |
| Today indicator | Subtle amber | Bold pulse | Ring | Dot |
| Cell size options | Fixed | 3 sizes | Fixed | Fixed |

---

## Solution Design

### Core Principles

1. **Instant Feedback**: Tap → Haptic → Animation → Backend (not Tap → Backend → Animation)
2. **Optimistic UI**: Play animation immediately, sync with backend asynchronously
3. **Graceful Degradation**: If backend fails, animation state auto-corrects on next data sync
4. **Accessibility First**: Respect `reduceMotion` preferences, provide proper labels

### Feature Components

#### 1. Instant Toggle Mode (`instantToggle` prop)

```typescript
/** Enable instant tap-to-toggle mode (defaults to true) */
instantToggle?: boolean;
```

- **Default**: `true` (HabitKit-style behavior)
- **When `false`**: Falls back to tooltip-based interaction

#### 2. Completion Animation Sequence

**On Complete (tap uncompleted cell):**
```
0ms   → Haptic: Medium Impact
0ms   → Fill: Scale 0→1 (spring, damping: 12, stiffness: 200)
100ms → Check: Scale 0→1.3→1 with rotation -45°→0° (spring pop)
```

**On Uncomplete (tap completed cell):**
```
0ms   → Haptic: Medium Impact
0ms   → Check: Scale 1→0, Rotate 0°→-45° (150ms timing)
100ms → Fill: Scale 1→0 (200ms timing)
```

#### 3. Today Indicator Enhancement

- **Before**: Subtle amber border
- **After**: Pulsing glow ring with shadow
  - Scale: 1.0 → 1.5 → 1.2 (repeating)
  - Opacity: 0.3 → 0.8 → 0.6 (repeating)
  - Shadow: 8px amber glow

#### 4. Cell Size Options

```typescript
export type CellSize = 'compact' | 'comfortable' | 'large';

export const CELL_SIZES = {
  compact: { cell: 20, check: 10, radius: 'rounded-sm' },     // Default
  comfortable: { cell: 28, check: 14, radius: 'rounded-md' }, // HabitKit-style
  large: { cell: 36, check: 18, radius: 'rounded-lg' },       // Accessibility
};
```

---

## Technical Architecture

### Animation State Management

The critical challenge is synchronizing optimistic UI animations with backend state. We use a **dual-state pattern**:

```typescript
// Animation state (immediate, optimistic)
const fillScale = useSharedValue(day.completed ? 1 : 0);
const checkScale = useSharedValue(day.completed ? 1 : 0);
const checkRotation = useSharedValue(day.completed ? 0 : -45);

// CRITICAL: Sync when backend state changes
useEffect(() => {
  if (instantToggle) {
    const targetFill = day.completed ? 1 : 0;
    if (fillScale.value !== targetFill) {
      // Instant update (no animation) - visual animation already played
      fillScale.value = targetFill;
      checkScale.value = targetCheck;
      checkRotation.value = targetRotation;
    }
  }
}, [day.completed, instantToggle]);
```

### Component Hierarchy

```
CalendarHeatmapWithViews
├── ViewToggle (week/month/3m/year)
├── WeekGrid ─────────► WeekDayCell (instantToggle)
├── MonthGrid ────────► MonthDayCell (instantToggle)
├── CalendarGrid ─────► DayCell (instantToggle)
└── YearlyCalendarGrid ► (read-only, no toggle)
```

### Data Flow

```
User Tap
    │
    ▼
handlePress()
    │
    ├─► Haptics.impactAsync(Medium)     // Immediate feedback
    │
    ├─► playCompletionAnimation()        // Optimistic UI
    │
    └─► onDayToggle(date, !completed)   // Trigger mutation
              │
              ▼
        HabitDetailScreen
              │
              ▼
        toggleHabitMutation({ habitId, date })
              │
              ▼
        Convex Backend
              │
              ▼
        Reactive Update → day.completed changes
              │
              ▼
        useEffect syncs animation state (if needed)
```

---

## Files Modified

### Core Components

| File | Changes |
|------|---------|
| `DayCell.tsx` | Full implementation: animations, haptics, size options |
| `WeekGrid.tsx` | Added `instantToggle` prop, animation logic |
| `MonthGrid.tsx` | Added `instantToggle` prop, animation logic |
| `CalendarGrid.tsx` | Pass `instantToggle` to DayCell |
| `CalendarHeatmapWithViews.tsx` | Added `onDayToggle` callback, toggle handler |

### Screen Integration

| File | Changes |
|------|---------|
| `HabitDetailScreen.tsx` | Added `toggleHabitMutation`, wired `handleCalendarDayToggle` |

### Types & Exports

| File | Changes |
|------|---------|
| `index.ts` | Export `CellSize`, `CELL_SIZES`, `DayCell` |

---

## API Contracts

### DayCell Props

```typescript
interface DayCellProps {
  day: CalendarDay;
  index: number;
  habitColor?: string;
  onPress?: (date: string, completed: boolean) => void;
  completedDates: Set<string>;
  habitCreatedAt?: number;
  cellSize?: CellSize;           // NEW
  instantToggle?: boolean;       // NEW (default: true)
}
```

### CalendarHeatmapWithViews Props

```typescript
interface CalendarHeatmapWithViewsProps extends CalendarHeatmapProps {
  isPremium?: boolean;
  onPremiumUpsell?: () => void;
  initialView?: CalendarViewMode;
  currentStreak?: number;
  bestStreak?: number;
  onDayToggle?: (date: string, newCompleted: boolean) => void;  // NEW
  instantToggle?: boolean;                                       // NEW
}
```

---

## Accessibility

### ARIA Labels

```typescript
accessibilityLabel={`${DAY_NAMES_FULL[index]}, ${day.dayOfMonth}${day.completed ? ', completed' : ''}${day.isToday ? ', today' : ''}`}
accessibilityHint={instantToggle ? 'Tap to toggle completion' : 'Tap to view details'}
accessibilityState={{ selected: day.completed }}
```

### Reduce Motion Support

```typescript
const reduceMotion = useReduceMotion();

// In animation functions:
if (reduceMotion) {
  // Skip animations, set values directly
  fillScale.value = 1;
  checkScale.value = 1;
  checkRotation.value = 0;
  return;
}
```

---

## Performance Considerations

### Reanimated Best Practices

1. **SharedValues**: All animation state uses `useSharedValue` (runs on UI thread)
2. **Worklet Functions**: `useAnimatedStyle` callbacks are worklets
3. **No Re-renders**: Animation updates don't trigger React re-renders
4. **Memoized Callbacks**: `playCompletionAnimation` wrapped in `useCallback`

### Memory Optimization

- Each cell creates 3 SharedValues (fillScale, checkScale, checkRotation)
- For 3-month view: ~90 cells × 3 values = ~270 SharedValues
- Acceptable overhead for smooth 60fps animations

---

## Testing Scenarios

### Manual Testing Checklist

- [ ] Tap empty cell → fills with animation + haptic
- [ ] Tap filled cell → empties with reverse animation
- [ ] Rapid taps → animations queue correctly
- [ ] Toggle then undo before backend responds → state syncs correctly
- [ ] Backend error → UI reverts on next data refresh
- [ ] Today cell → pulsing glow visible and touchable
- [ ] Different cell sizes → all animate correctly
- [ ] Reduce Motion ON → no animations, state changes instantly
- [ ] VoiceOver → correct labels and hints

### Edge Cases

1. **Offline Toggle**: Animation plays, mutation fails, next sync corrects state
2. **Concurrent Toggles**: User taps multiple cells quickly - all should animate independently
3. **View Switch Mid-Animation**: Changing views cancels pending animations gracefully

---

## Future Enhancements

### Phase 2 (Planned)

- [ ] Streak chain visualization connecting completed cells
- [ ] Custom grid themes (GitHub, Tiles, Dots, Pixels)
- [ ] Week start customization (Sunday/Monday)
- [ ] Quick month navigation gestures

### Phase 3 (Considered)

- [ ] Undo toast after toggle (3 second window)
- [ ] Batch edit mode (toggle multiple cells)
- [ ] Completion notes/mood on long press

---

## Changelog

### v2.0 (2024-12-28)
- Implemented HabitKit-style instant toggle across all calendar views
- Added completion/un-completion spring animations
- Enhanced today indicator with pulsing glow
- Added configurable cell sizes
- Added animation state sync for optimistic UI
- Upgraded haptic feedback to Medium impact

### v1.0 (Previous)
- Basic calendar heatmap with tooltip-based interaction
- Static completion display
- Light haptic feedback on selection
