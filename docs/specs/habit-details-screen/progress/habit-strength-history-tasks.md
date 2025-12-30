# Habit Strength History - Implementation Tasks

**Spec Reference:** `habit-strength-history-spec.md`
**Mockup:** `.superdesign/design_iterations/habit_strength_history_v1.html`
**Estimated Effort:** 2-3 days

---

## Task Overview

| Phase | Tasks | Priority | Dependencies |
|-------|-------|----------|--------------|
| Phase 1: Core Algorithm | 3 tasks | P0 | None |
| Phase 2: UI Components | 4 tasks | P0 | Phase 1 |
| Phase 3: Integration | 3 tasks | P1 | Phase 2 |
| Phase 4: Polish | 3 tasks | P2 | Phase 3 |

---

## Phase 1: Core Algorithm

### Task 1.1: Create useHabitStrength Hook

**File:** `src/hooks/useHabitStrength.ts`

**Description:**
Create custom React hook that calculates habit strength using exponential smoothing algorithm.

**Acceptance Criteria:**
- [ ] Hook accepts `completedDates: Set<string>` and `habitCreatedAt: number`
- [ ] Returns `currentStrength` (0-100)
- [ ] Returns `strengthHistory` array for charting
- [ ] Returns `metrics` object with comparison values
- [ ] Implements memoization to avoid recalculating on every render
- [ ] Uses exponential smoothing formula:
  - Growth: `strength + (1 - strength) * 0.05` on completion
  - Decay: `strength * 0.95` on miss

**Technical Notes:**
```typescript
interface UseHabitStrengthReturn {
  currentStrength: number;
  strengthHistory: StrengthSnapshot[];
  metrics: StrengthMetrics;
  isCalculating: boolean;
}
```

---

### Task 1.2: Create strengthUtils.ts Helper Functions

**File:** `src/components/HabitStrengthHistory/strengthUtils.ts`

**Description:**
Utility functions for strength calculations and formatting.

**Functions to Implement:**

```typescript
// 1. Calculate strength at a specific date
export function calculateStrengthAtDate(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  targetDate: Date
): number;

// 2. Get label for strength value
export function getStrengthLabel(
  strength: number
): 'weak' | 'developing' | 'strong';

// 3. Get color based on strength
export function getStrengthColor(strength: number): string;

// 4. Generate timeline data for chart
export function generateStrengthTimeline(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  sampleSize?: number
): StrengthSnapshot[];

// 5. Calculate peak and lowest strength
export function calculateStrengthExtremes(
  strengthHistory: StrengthSnapshot[]
): { peak: StrengthSnapshot; lowest: StrengthSnapshot };
```

**Acceptance Criteria:**
- [ ] All functions are properly typed
- [ ] `getStrengthLabel` uses thresholds: <30% weak, 30-69% developing, 70%+ strong
- [ ] `generateStrengthTimeline` samples data points for performance (max 100)
- [ ] Edge cases handled (empty dates, single day, etc.)

---

### Task 1.3: Add TypeScript Types

**File:** `src/components/HabitStrengthHistory/types.ts`

**Description:**
Define TypeScript interfaces for the Habit Strength History feature.

**Types to Define:**

```typescript
export type StrengthLabel = 'weak' | 'developing' | 'strong';

export interface StrengthSnapshot {
  date: Date;
  dateString: string;  // YYYY-MM-DD
  strength: number;    // 0-100
  label: StrengthLabel;
}

export interface StrengthMetrics {
  current: number;
  thirtyDaysAgo: number | null;
  oneYearAgo: number | null;
  peak: number;
  peakDate: Date;
  lowest: number;
  lowestDate: Date;
  deltaVsMonth: number;
  habitAgeDays: number;
}

export interface StrengthColors {
  primary: string;
  background: string;
  ring: string;
}
```

**Acceptance Criteria:**
- [ ] All types exported
- [ ] JSDoc comments on complex types
- [ ] Nullable fields for edge cases (habit too new)

---

## Phase 2: UI Components

### Task 2.1: Create StrengthComparisonCards Component

**File:** `src/components/HabitStrengthHistory/StrengthComparisonCards.tsx`

**Description:**
Three-card horizontal layout showing strength at Now, 30 Days Ago, and 1 Year Ago.

**Visual Design:**
```
┌─────────┐   ┌─────────┐   ┌─────────┐
│  ○73%○  │   │  ○45%○  │   │  ○22%○  │
│  NOW    │   │ 30 DAYS │   │ 1 YEAR  │
│ Strong  │   │Developing│   │  Weak   │
│ +28% ▲  │   │         │   │         │
└─────────┘   └─────────┘   └─────────┘
```

**Props:**
```typescript
interface StrengthComparisonCardsProps {
  current: number;
  thirtyDaysAgo: number | null;
  oneYearAgo: number | null;
  deltaVsMonth: number;
  habitAgeDays: number;
}
```

**Acceptance Criteria:**
- [ ] Circular progress ring with SVG or react-native-svg
- [ ] Ring color matches strength label (red/amber/emerald)
- [ ] "Now" card has highlight border
- [ ] Delta badge shows "+X%" or "-X%" with arrow
- [ ] If habit < 30 days, show "Start" instead of "30 Days Ago"
- [ ] If habit < 365 days, show "Start" instead of "1 Year Ago"
- [ ] Animated ring fill on mount

---

### Task 2.2: Create StrengthTimelineChart Component

**File:** `src/components/HabitStrengthHistory/StrengthTimelineChart.tsx`

**Description:**
SVG area chart showing strength over time since habit creation.

**Visual Design:**
```
100% ┼─────────────────────●
     │                ●──●
 50% ┼          ●──●
     │    ●──●
  0% ┼──●─────────────────────
     Start        6mo       Now
```

**Props:**
```typescript
interface StrengthTimelineChartProps {
  strengthHistory: StrengthSnapshot[];
  habitColor?: string;
  height?: number;  // default: 120
}
```

**Acceptance Criteria:**
- [ ] SVG-based area chart with gradient fill
- [ ] Bezier curve smoothing between points
- [ ] X-axis labels: Start, 6mo (if applicable), 1yr (if applicable), Now
- [ ] Current position marked with pulsing dot
- [ ] Uses habit color for fill gradient
- [ ] Handles short histories gracefully (< 30 days)

---

### Task 2.3: Create StrengthInsightsRow Component

**File:** `src/components/HabitStrengthHistory/StrengthInsightsRow.tsx`

**Description:**
Horizontal row of three key metrics.

**Visual Design:**
```
┌──────────────┬──────────────┬──────────────┐
│  📈 +28%     │  🏆 89%      │  📉 12%      │
│  vs Month    │  Peak        │  Lowest      │
└──────────────┴──────────────┴──────────────┘
```

**Props:**
```typescript
interface StrengthInsightsRowProps {
  deltaVsMonth: number;
  peak: number;
  lowest: number;
}
```

**Acceptance Criteria:**
- [ ] Three-column flex layout
- [ ] Icons: trending up/down for delta, trophy for peak, chart for lowest
- [ ] Delta shows green if positive, red if negative
- [ ] Compact mobile-friendly design

---

### Task 2.4: Create HabitStrengthHistory Container

**File:** `src/components/HabitStrengthHistory/HabitStrengthHistory.tsx`

**Description:**
Main container component composing all sub-components.

**Props:**
```typescript
interface HabitStrengthHistoryProps {
  habitId: string;
  completedDates: Set<string>;
  habitCreatedAt: number;
  habitColor?: string;
}
```

**Acceptance Criteria:**
- [ ] Section header: "Strength History" with info icon
- [ ] Composes: StrengthComparisonCards, StrengthTimelineChart, StrengthInsightsRow
- [ ] Uses useHabitStrength hook
- [ ] Loading state with skeleton
- [ ] Entry animation (fade + slide up)

**Barrel Export:**
```typescript
// src/components/HabitStrengthHistory/index.ts
export { HabitStrengthHistory } from './HabitStrengthHistory';
export type { HabitStrengthHistoryProps } from './HabitStrengthHistory';
```

---

## Phase 3: Integration

### Task 3.1: Add to Progress Tab

**File:** `src/screens/HabitDetailScreen.tsx` or relevant Progress component

**Description:**
Integrate HabitStrengthHistory into the habit detail Progress tab.

**Acceptance Criteria:**
- [ ] Import HabitStrengthHistory component
- [ ] Position below Calendar Heatmap, above Weekly Pattern Chart
- [ ] Pass props: `habitId`, `completedDates`, `habitCreatedAt`, `habitColor`
- [ ] Verify data flow from Convex query

**Integration Point:**
```tsx
<CalendarHeatmapWithViews {...calendarProps} />

{/* NEW: Habit Strength History */}
<HabitStrengthHistory
  habitId={habit._id}
  completedDates={completedDatesSet}
  habitCreatedAt={habit._creationTime}
  habitColor={habit.color}
/>

<WeeklyPatternChart {...patternProps} />
```

---

### Task 3.2: Add Animations

**File:** Various component files

**Description:**
Enhance UX with polished animations.

**Animations to Add:**
- [ ] Section entry: `FadeIn` + `SlideInUp` (400ms, 200ms delay)
- [ ] Progress ring fill: Animated `stroke-dashoffset` (1000ms)
- [ ] Number count-up: Animate from 0 to final value (800ms)
- [ ] Chart path draw: Animate path length (600ms)

**Libraries:**
- `react-native-reanimated` for performant animations
- Consider `withTiming`, `withSpring` for micro-interactions

---

### Task 3.3: Accessibility

**Description:**
Ensure feature is accessible to all users.

**Acceptance Criteria:**
- [ ] Progress rings have `accessibilityRole="progressbar"`
- [ ] Progress rings have `accessibilityValue={{ min: 0, max: 100, now: strength }}`
- [ ] Labels have `accessibilityLabel` with full context
- [ ] Chart has `accessibilityLabel` describing the trend
- [ ] Colors meet WCAG AA contrast requirements

---

## Phase 4: Polish & Edge Cases

### Task 4.1: Handle Edge Cases

**Description:**
Gracefully handle various data scenarios.

**Edge Cases:**
| Scenario | Behavior |
|----------|----------|
| New habit (< 7 days) | Show "Building your history..." placeholder |
| Habit < 30 days | Replace "30 Days Ago" card with "Start" |
| Habit < 365 days | Replace "1 Year Ago" card with "Start" |
| No completions ever | Show encouraging empty state |
| All completions | Celebrate with "Perfect!" badge |

**Acceptance Criteria:**
- [ ] All edge cases have designed UI states
- [ ] No crashes or undefined values
- [ ] Placeholder states are visually polished

---

### Task 4.2: Add Loading States

**Description:**
Show loading feedback while calculating strength.

**Acceptance Criteria:**
- [ ] Skeleton cards while loading (3 pulse cards)
- [ ] Skeleton chart with gradient shimmer
- [ ] Loading completes in < 500ms for typical datasets

---

### Task 4.3: Unit Tests

**File:** `src/components/HabitStrengthHistory/__tests__/`

**Description:**
Test core algorithm and edge cases.

**Tests to Write:**
```typescript
// strengthUtils.test.ts
describe('calculateStrengthAtDate', () => {
  it('returns 0 for empty completedDates');
  it('grows strength on consecutive completions');
  it('decays strength on missed days');
  it('reaches ~100% after 60-90 perfect days');
});

describe('getStrengthLabel', () => {
  it('returns weak for 0-29%');
  it('returns developing for 30-69%');
  it('returns strong for 70-100%');
});

describe('generateStrengthTimeline', () => {
  it('samples to max 100 points for long histories');
  it('returns all points for short histories');
});
```

**Acceptance Criteria:**
- [ ] >80% code coverage on utility functions
- [ ] Edge cases explicitly tested
- [ ] Algorithm matches Loop Habit Tracker behavior

---

## Definition of Done

- [ ] All Phase 1-3 tasks completed
- [ ] Feature visible in Progress tab
- [ ] Animations smooth at 60fps
- [ ] No TypeScript errors
- [ ] Accessibility audit passed
- [ ] Code reviewed and approved
- [ ] Tested on iOS and Android

---

## File Structure Summary

```
src/
├── components/
│   └── HabitStrengthHistory/
│       ├── HabitStrengthHistory.tsx       # Main container
│       ├── StrengthComparisonCards.tsx    # Three-card comparison
│       ├── StrengthTimelineChart.tsx      # Area chart
│       ├── StrengthInsightsRow.tsx        # Metrics row
│       ├── strengthUtils.ts               # Helper functions
│       ├── types.ts                       # TypeScript types
│       ├── index.ts                       # Barrel export
│       └── __tests__/
│           └── strengthUtils.test.ts      # Unit tests
│
└── hooks/
    └── useHabitStrength.ts                # Custom hook
```

---

## Notes for Reviewers

1. **Algorithm Choice:** We're using Loop Habit Tracker's exponential smoothing. Consider if this matches user expectations.

2. **Performance:** Timeline calculation iterates all days since creation. For habits > 2 years old, this could be 700+ iterations. Memoization is critical.

3. **Chart Library:** Spec assumes raw SVG. Consider `react-native-svg` or `victory-native` if complexity grows.

4. **Premium Gating:** Currently no premium features in this section. Consider gating:
   - Detailed timeline (date inspection)
   - Historical comparisons beyond 1 year
