# Habit Strength Section Redesign

## Overview

Redesign the Habit Strength section in `HabitDetailScreen` to combine the best elements from design explorations A + B, replacing the current `HabitStrengthHistory` component with a more comprehensive and visually impactful design.

**Design Reference**: `.superdesign/design_iterations/habit_strength_with_calendar_1.html`

---

## Current State

The existing `HabitStrengthHistory` component (`src/components/HabitStrengthHistory/`) includes:
- `StrengthComparisonCards`: Three circular progress rings (Now, 30 Days, 1 Year)
- `StrengthTimelineChart`: SVG area chart with bezier curves
- `StrengthInsightsRow`: Peak, lowest, and delta metrics

---

## Target State

A redesigned `HabitStrengthSection` component combining:

### 1. Header with Time Range Switcher
- Title: "Habit Strength"
- Pill toggle: `1M` | `1Y` (selected) | `All`
- Time range selection updates the chart view

### 2. Hero Section
- **Circular Progress Ring** (72x72px)
  - Current strength percentage in center
  - Ring color based on strength level (emerald for strong)
  - Animated fill on mount
- **Status Display**
  - Strength label: "Strong" / "Developing" / "Weak"
  - Delta badge: "+12% vs last month" with trend icon

### 3. Full-Width Timeline Chart
- **Dimensions**: Full card width, 112px height
- **Visual Elements**:
  - Gradient-filled area (emerald, 25% → 2% opacity)
  - Smooth bezier curve line (2.5px stroke)
  - Horizontal grid lines (dashed, 3 lines at 0%, 50%, 100%)
  - X-axis labels based on time range (e.g., Jan, Apr, Jul, Oct, Now)
  - Pulsing dot at current position
- **Animation**: Path draw animation on mount (1.5s)

### 4. Comparison Stats Row
- Three columns separated by vertical dividers
- Metrics:
  - **Since Start**: Total growth percentage
  - **Last Month**: Month-over-month change (highlighted if positive)
  - **Last Week**: Week-over-week change

---

## Component Structure

```
src/components/HabitStrengthSection/
├── index.ts                      # Exports
├── HabitStrengthSection.tsx      # Main container
├── StrengthHero.tsx              # Ring + status display
├── StrengthChart.tsx             # Full-width timeline chart
├── StrengthStatsRow.tsx          # Comparison metrics
├── TimeRangeToggle.tsx           # 1M/1Y/All pills
├── types.ts                      # TypeScript interfaces
├── constants.ts                  # Sizing, colors, animation config
├── utils.ts                      # Data transformation helpers
└── __tests__/
    └── HabitStrengthSection.test.tsx
```

---

## Props Interface

```typescript
interface HabitStrengthSectionProps {
  habitId: string;
  completedDates: Set<string>;
  habitCreatedAt: number;
  habitColor?: string;
}

type TimeRange = '1m' | '1y' | 'all';

interface StrengthMetrics {
  current: number;           // 0-100
  label: 'weak' | 'developing' | 'strong';
  deltaVsMonth: number;
  deltaVsWeek: number;
  sinceStart: number;
  strengthHistory: StrengthSnapshot[];
}
```

---

## Behavior

### Time Range Selection
- **1M**: Shows last 30 days of strength data
- **1Y**: Shows last 365 days (default)
- **All**: Shows entire history since habit creation

### Strength Calculation
- Uses existing `useHabitStrength` hook
- Exponential smoothing algorithm (unchanged)
- Recalculates metrics when time range changes

### Animations
- Ring fill: 1000ms ease-out on mount
- Number count-up: 800ms synchronized with ring
- Chart path draw: 1500ms ease-out
- Pulsing dot: 2000ms infinite loop
- Respect `reduceMotion` preference

---

## Accessibility

- Progress ring has `accessibilityRole="progressbar"` with min/max/now values
- Chart has descriptive `accessibilityLabel` with trend description
- Time range buttons are properly labeled
- Color contrast meets WCAG AA (4.5:1 minimum)

---

## Integration

### HabitDetailScreen Changes

```tsx
// Before
<HabitStrengthHistory
  habitId={habit._id}
  completedDates={completedDates}
  habitCreatedAt={habitCreatedAt}
  habitColor={habit.iconColor}
/>

// After
<HabitStrengthSection
  habitId={habit._id}
  completedDates={completedDates}
  habitCreatedAt={habitCreatedAt}
  habitColor={habit.iconColor}
/>
```

### Files to Modify
- `src/screens/HabitDetailScreen.tsx` - Update import and usage
- `src/components/HabitStrengthHistory/` - Can be deprecated after migration

---

## Performance Considerations

- Memoize chart path calculations with `useMemo`
- Use `React.memo` on sub-components
- Debounce time range changes if rapid switching causes lag
- Chart SVG should use `shouldRasterizeIOS` for complex paths

---

## Success Criteria

1. Circular progress ring displays current strength with animation
2. Time range toggle switches chart view (1M/1Y/All)
3. Full-width chart renders with smooth bezier curves
4. Stats row shows accurate delta values
5. All animations respect `reduceMotion` setting
6. No performance regression on low-end devices
7. Existing `useHabitStrength` hook works without modification

---

# Implementation Tasks

## Phase 1: Component Scaffolding

### Task 1.1: Create Component Directory Structure
**Priority**: High | **Effort**: 15 min

- [ ] Create `src/components/HabitStrengthSection/` directory
- [ ] Create `index.ts` with exports
- [ ] Create `types.ts` with interfaces
- [ ] Create `constants.ts` with sizing/color/animation values

**Files**:
- `src/components/HabitStrengthSection/index.ts`
- `src/components/HabitStrengthSection/types.ts`
- `src/components/HabitStrengthSection/constants.ts`

---

### Task 1.2: Implement TimeRangeToggle Component
**Priority**: High | **Effort**: 30 min

- [ ] Create pill-style toggle with 1M/1Y/All options
- [ ] Implement selection state with visual feedback
- [ ] Add haptic feedback on selection
- [ ] Support `reduceMotion` for transitions

**Props**:
```typescript
interface TimeRangeToggleProps {
  value: '1m' | '1y' | 'all';
  onChange: (value: '1m' | '1y' | 'all') => void;
}
```

**Files**:
- `src/components/HabitStrengthSection/TimeRangeToggle.tsx`

---

### Task 1.3: Implement StrengthHero Component
**Priority**: High | **Effort**: 45 min

- [ ] Create circular progress ring with SVG
- [ ] Implement animated fill using `react-native-reanimated`
- [ ] Add count-up animation for percentage number
- [ ] Display strength label (Strong/Developing/Weak)
- [ ] Show delta badge with trend icon

**Acceptance Criteria**:
- Ring animates from 0 to current value on mount
- Number counts up synchronized with ring
- Colors match strength level (emerald/amber/red)

**Files**:
- `src/components/HabitStrengthSection/StrengthHero.tsx`

---

## Phase 2: Chart Implementation

### Task 2.1: Implement StrengthChart Component
**Priority**: High | **Effort**: 1 hour

- [ ] Create full-width SVG container
- [ ] Generate bezier curve path from data points
- [ ] Add gradient fill under the curve
- [ ] Implement horizontal grid lines
- [ ] Add X-axis labels based on time range
- [ ] Create pulsing dot at current position

**Acceptance Criteria**:
- Chart fills available width
- Path has smooth bezier curves (Catmull-Rom to Bezier)
- Gradient fades from 25% to 2% opacity
- Grid lines are dashed and subtle

**Files**:
- `src/components/HabitStrengthSection/StrengthChart.tsx`

---

### Task 2.2: Add Chart Animations
**Priority**: Medium | **Effort**: 30 min

- [ ] Implement path draw animation (stroke-dashoffset)
- [ ] Add pulsing animation for current position dot
- [ ] Respect `useReducedMotion` preference
- [ ] Add fade-in for chart container

**Files**:
- `src/components/HabitStrengthSection/StrengthChart.tsx` (update)

---

## Phase 3: Stats & Integration

### Task 3.1: Implement StrengthStatsRow Component
**Priority**: High | **Effort**: 30 min

- [ ] Create three-column layout with dividers
- [ ] Display: Since Start, Last Month, Last Week
- [ ] Highlight positive changes in emerald
- [ ] Add fade-in animation

**Files**:
- `src/components/HabitStrengthSection/StrengthStatsRow.tsx`

---

### Task 3.2: Create Main HabitStrengthSection Container
**Priority**: High | **Effort**: 45 min

- [ ] Compose all sub-components
- [ ] Manage time range state
- [ ] Connect to `useHabitStrength` hook
- [ ] Handle loading/empty states
- [ ] Implement card styling with shadow

**Files**:
- `src/components/HabitStrengthSection/HabitStrengthSection.tsx`

---

### Task 3.3: Add Time Range Filtering to useHabitStrength
**Priority**: Medium | **Effort**: 30 min

- [ ] Extend hook to accept `timeRange` parameter
- [ ] Filter `strengthHistory` based on range
- [ ] Recalculate metrics for filtered data
- [ ] Memoize filtered results

**Files**:
- `src/hooks/useHabitStrength.ts` (update)

---

## Phase 4: Integration & Testing

### Task 4.1: Integrate into HabitDetailScreen
**Priority**: High | **Effort**: 20 min

- [ ] Import `HabitStrengthSection`
- [ ] Replace `HabitStrengthHistory` usage
- [ ] Verify props are passed correctly
- [ ] Test on device

**Files**:
- `src/screens/HabitDetailScreen.tsx`

---

### Task 4.2: Write Unit Tests
**Priority**: Medium | **Effort**: 1 hour

- [ ] Test `TimeRangeToggle` selection behavior
- [ ] Test `StrengthHero` with different strength levels
- [ ] Test `StrengthChart` path generation
- [ ] Test `StrengthStatsRow` formatting
- [ ] Test main component composition

**Files**:
- `src/components/HabitStrengthSection/__tests__/HabitStrengthSection.test.tsx`
- `src/components/HabitStrengthSection/__tests__/StrengthChart.test.tsx`

---

### Task 4.3: Accessibility Audit
**Priority**: Medium | **Effort**: 30 min

- [ ] Add `accessibilityRole` to interactive elements
- [ ] Add `accessibilityLabel` to chart with trend description
- [ ] Test with VoiceOver/TalkBack
- [ ] Verify color contrast (WCAG AA)

---

### Task 4.4: Performance Optimization
**Priority**: Low | **Effort**: 30 min

- [ ] Profile component render times
- [ ] Add `React.memo` where beneficial
- [ ] Ensure `useMemo` on expensive calculations
- [ ] Test on low-end device

---

## Phase 5: Cleanup

### Task 5.1: Deprecate Old Components
**Priority**: Low | **Effort**: 15 min

- [ ] Add deprecation notice to `HabitStrengthHistory`
- [ ] Update component index exports
- [ ] Remove unused imports from HabitDetailScreen

---

## Task Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Scaffolding | 3 | 1.5 hours |
| Phase 2: Chart | 2 | 1.5 hours |
| Phase 3: Stats & Integration | 3 | 1.75 hours |
| Phase 4: Testing | 4 | 2.5 hours |
| Phase 5: Cleanup | 1 | 15 min |
| **Total** | **13** | **~7.5 hours** |

## Dependencies

- `react-native-svg` (existing)
- `react-native-reanimated` (existing)
- `useHabitStrength` hook (existing)
- `date-fns` (existing)

---

# CodeRabbit Review Checklist

## Pre-Review Setup

- [ ] All tasks above are complete
- [ ] Component renders correctly on iOS simulator
- [ ] Component renders correctly on Android emulator
- [ ] No TypeScript errors in the codebase
- [ ] ESLint passes with no warnings

---

## Code Quality

### Component Architecture
- [ ] Components follow single responsibility principle
- [ ] Props interfaces are properly typed with JSDoc comments
- [ ] Default props are defined where appropriate
- [ ] Component names match file names
- [ ] Exports are organized in `index.ts`

### TypeScript
- [ ] No `any` types used
- [ ] All props have explicit types
- [ ] Return types are specified for utility functions
- [ ] Enums/union types used for fixed value sets (e.g., TimeRange)

### React Best Practices
- [ ] `useMemo` used for expensive calculations
- [ ] `useCallback` used for event handlers passed to children
- [ ] `React.memo` applied to pure sub-components
- [ ] No inline object/array creation in render (causes re-renders)
- [ ] Keys are stable and unique in lists

### Reanimated Animations
- [ ] Animated values created with `useSharedValue`
- [ ] Derived values use `useDerivedValue`
- [ ] Worklets are properly defined (run on UI thread)
- [ ] `useReducedMotion` is respected
- [ ] No unnecessary re-renders from animation changes

---

## Visual & UX

### Design Fidelity
- [ ] Matches mockup: `.superdesign/design_iterations/habit_strength_with_calendar_1.html`
- [ ] Circular progress ring is 72x72px
- [ ] Chart height is 112px (or 128px for taller variant)
- [ ] Colors match design system (emerald-500, stone-50, etc.)
- [ ] Typography matches (Inter font, correct weights/sizes)

### Responsive Behavior
- [ ] Component adapts to different screen widths
- [ ] Chart fills available width correctly
- [ ] No horizontal overflow or clipping
- [ ] Tested on small screens (iPhone SE) and large (iPhone Pro Max)

### Animations
- [ ] Ring fill animation is smooth (60fps)
- [ ] Number count-up is synchronized with ring
- [ ] Chart path draws smoothly
- [ ] Pulsing dot animation loops infinitely
- [ ] No animation jank on time range switch

### States
- [ ] Loading state shows skeleton/placeholder
- [ ] Empty state (no completions) shows encouraging message
- [ ] Error state is handled gracefully
- [ ] Time range toggle reflects current selection

---

## Accessibility

### Screen Reader Support
- [ ] Progress ring has `accessibilityRole="progressbar"`
- [ ] Progress ring has `accessibilityValue={{ min: 0, max: 100, now: X }}`
- [ ] Chart has descriptive `accessibilityLabel` (e.g., "Strength chart showing upward trend from 10% to 70%")
- [ ] Time range buttons have `accessibilityRole="button"`
- [ ] All interactive elements are focusable

### Color & Contrast
- [ ] Text meets WCAG AA contrast ratio (4.5:1)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators are visible

### Motion
- [ ] Animations disabled when `reduceMotion` is true
- [ ] Static fallback shown instead of animated elements

---

## Performance

### Bundle Size
- [ ] No new large dependencies added
- [ ] SVG paths are optimized (no unnecessary precision)
- [ ] Constants extracted (not recreated each render)

### Render Performance
- [ ] Component profiles under 16ms render time
- [ ] No excessive re-renders (React DevTools Profiler)
- [ ] Chart path calculation is memoized
- [ ] Time range switch doesn't cause full tree re-render

### Memory
- [ ] No memory leaks from animation subscriptions
- [ ] Cleanup in `useEffect` return functions
- [ ] Large data arrays are not duplicated unnecessarily

---

## Testing

### Unit Tests
- [ ] `TimeRangeToggle` tests selection and callback
- [ ] `StrengthHero` tests with 0%, 50%, 100% values
- [ ] `StrengthChart` tests path generation algorithm
- [ ] `StrengthStatsRow` tests formatting of positive/negative/zero deltas
- [ ] Main component tests composition and state

### Snapshot Tests
- [ ] Snapshot for each strength level (weak/developing/strong)
- [ ] Snapshot for each time range (1m/1y/all)
- [ ] Snapshot for empty state

### Integration Tests
- [ ] Time range changes update chart data
- [ ] Props from parent are passed correctly to children

---

## Documentation

### Code Comments
- [ ] Complex algorithms have explanatory comments
- [ ] Bezier curve calculation is documented
- [ ] Animation timing choices are explained
- [ ] TODO items are tracked (no orphaned TODOs)

### JSDoc
- [ ] All exported components have JSDoc descriptions
- [ ] Props interfaces have property descriptions
- [ ] Utility functions have param/return documentation

---

## Security

- [ ] No sensitive data logged to console
- [ ] No hardcoded API keys or secrets
- [ ] User data is not exposed in error messages

---

## Final Verification

### Manual Testing Checklist
- [ ] Open HabitDetailScreen for a habit with completions
- [ ] Verify ring shows correct percentage
- [ ] Verify chart shows historical data
- [ ] Tap each time range option (1M, 1Y, All)
- [ ] Verify stats row shows correct deltas
- [ ] Test with a brand new habit (no completions)
- [ ] Test with a habit that has 1+ year of history
- [ ] Toggle device accessibility settings (VoiceOver/TalkBack)
- [ ] Toggle Reduce Motion setting

### Sign-Off
- [ ] Developer self-review complete
- [ ] Code passes all CI checks
- [ ] PR description includes screenshots/videos
- [ ] Ready for CodeRabbit automated review

---

## PR Description Template

```markdown
## Summary
Redesigns the Habit Strength section with new UI combining time range switcher, circular progress ring, full-width chart, and comparison stats.

## Changes
- New `HabitStrengthSection` component
- Updated `HabitDetailScreen` integration
- Extended `useHabitStrength` hook for time range filtering

## Testing
- Unit tests added for all sub-components
- Manual testing on iOS/Android
- Accessibility audit complete

## Screenshots
[Attach before/after screenshots]
```
