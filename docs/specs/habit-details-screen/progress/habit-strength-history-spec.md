# Habit Strength History - Feature Specification

## Document Overview

**Feature Area:** Habit Detail Screen → Progress Tab → Habit Strength History
**Status:** Planned
**Version:** 1.0
**Last Updated:** 2024-12-29
**Mockup:** `.superdesign/design_iterations/habit_strength_history_v1.html`

---

## 1. Executive Summary

### Purpose

The Habit Strength History section provides users with a longitudinal view of their habit strength over time, showing how their habit has evolved from a weak behavior to a strong, automatic routine.

### Key Value Proposition

- **Progress Visualization:** See how far you've come since starting
- **Temporal Comparison:** Compare strength at 3 key timeframes (Now, 30 Days Ago, 1 Year Ago)
- **Motivation Boost:** Visual evidence of improvement drives continued engagement
- **Pattern Recognition:** Identify periods of growth and decline

### Position in UI

**Recommended Layout Order (Calendar First):**
1. Stats Summary Bar
2. Calendar Heatmap (3M default)
3. Traditional Calendar
4. **Habit Strength History** ← New Section
5. Weekly Pattern Chart

---

## 2. Feature Design

### 2.1 Three-Card Comparison

Display habit strength at three key timeframes with visual strength indicators.

```
┌─────────────────────────────────────────────────────┐
│  Habit Strength History                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │  ○73%○  │   │  ○45%○  │   │  ○22%○  │          │
│  │  NOW    │   │ 30 DAYS │   │ 1 YEAR  │          │
│  │ Strong  │   │Developing│   │  Weak   │          │
│  │ +28% ▲  │   │         │   │         │          │
│  └─────────┘   └─────────┘   └─────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Card Fields:**
| Field | Description |
|-------|-------------|
| Percentage | Current habit strength (0-100%) |
| Timeframe Label | "Now", "30 Days Ago", "1 Year Ago" |
| Strength Label | Weak (<30%), Developing (30-69%), Strong (70%+) |
| Delta Badge | Only on "Now" card, showing change vs 30 days ago |

**Visual Treatment:**
- Circular progress ring showing percentage
- Color gradient: Red (weak) → Amber (developing) → Emerald (strong)
- "Now" card highlighted with border/glow
- Subtle animation on percentage ring

### 2.2 Timeline Chart

Area chart showing habit strength journey since habit creation.

```
┌─────────────────────────────────────────────────────┐
│  Your Journey                                       │
│                                                     │
│  100% ┼─────────────────────────────────────────   │
│       │                                  ●──●       │
│   75% ┼                           ●──●──●          │
│       │                    ●──●──●                  │
│   50% ┼             ●──●──●                         │
│       │      ●──●──●                                │
│   25% ┼  ●──●                                       │
│       │ ●                                           │
│    0% ┼─────────────────────────────────────────   │
│       Start        6mo         1yr       Now        │
└─────────────────────────────────────────────────────┘
```

**Chart Features:**
- Area fill with gradient (habit color → transparent)
- Smooth bezier curve connecting data points
- Key milestone markers (6mo, 1yr, etc.)
- Current position highlighted with pulsing dot
- Touch interaction to see specific date values

### 2.3 Insights Row

Three key metrics summarizing the strength history.

```
┌──────────────┬──────────────┬──────────────┐
│  📈 +28%     │  🏆 89%      │  📉 12%      │
│  vs Month    │  Peak        │  Lowest      │
└──────────────┴──────────────┴──────────────┘
```

**Metrics:**
| Metric | Description | Icon |
|--------|-------------|------|
| Delta vs Month | Change in strength vs 30 days ago | 📈 (positive) / 📉 (negative) |
| Peak Strength | Highest recorded strength | 🏆 |
| Lowest Strength | Lowest recorded strength (excluding day 1) | 📉 |

---

## 3. Habit Strength Algorithm

### 3.1 Algorithm Overview (Loop Habit Tracker Style)

The habit strength uses **exponential smoothing** to calculate a value that:
- Grows with consistent completions
- Decays on missed days
- Reaches 100% after ~60-90 days of perfect consistency

### 3.2 Formula

```typescript
// Daily strength update
if (completed) {
  strength = strength + (1 - strength) * GROWTH_RATE;
} else {
  strength = strength * DECAY_RATE;
}

// Constants (configurable)
const GROWTH_RATE = 0.05;  // ~5% growth per completion
const DECAY_RATE = 0.95;   // ~5% decay per miss
```

### 3.3 Strength Thresholds

| Strength Range | Label | Color | Description |
|----------------|-------|-------|-------------|
| 0% - 29% | Weak | Red (`#ef4444`) | Habit not yet established |
| 30% - 69% | Developing | Amber (`#f59e0b`) | Building consistency |
| 70% - 100% | Strong | Emerald (`#10b981`) | Habit is automatic |

### 3.4 Historical Calculation

To show strength at past dates, we calculate iteratively:

```typescript
function calculateStrengthAtDate(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  targetDate: Date
): number {
  let strength = 0;
  let currentDate = habitCreatedAt;

  while (currentDate <= targetDate) {
    const dateStr = formatDate(currentDate);
    if (completedDates.has(dateStr)) {
      strength = strength + (1 - strength) * GROWTH_RATE;
    } else {
      strength = strength * DECAY_RATE;
    }
    currentDate = addDays(currentDate, 1);
  }

  return Math.round(strength * 100);
}
```

---

## 4. Technical Architecture

### 4.1 Component Structure

```
HabitStrengthHistory/
├── HabitStrengthHistory.tsx      # Main container
├── StrengthComparisonCards.tsx   # Three-card comparison
├── StrengthTimelineChart.tsx     # Area chart
├── StrengthInsightsRow.tsx       # Metrics row
├── useHabitStrength.ts           # Calculation hook
├── strengthUtils.ts              # Helper functions
└── types.ts                      # TypeScript types
```

### 4.2 Component Props

```typescript
interface HabitStrengthHistoryProps {
  habitId: string;
  completedDates: Set<string>;
  habitCreatedAt: number;
  habitColor?: string;
}

interface StrengthSnapshot {
  date: Date;
  strength: number;      // 0-100
  label: 'weak' | 'developing' | 'strong';
}

interface StrengthMetrics {
  current: number;
  thirtyDaysAgo: number;
  oneYearAgo: number | null;  // null if habit < 1 year old
  peak: number;
  peakDate: Date;
  lowest: number;
  lowestDate: Date;
  deltaVsMonth: number;
}
```

### 4.3 Data Flow

```
completedDates (Set<string>)
         │
         ▼
useHabitStrength(completedDates, habitCreatedAt)
         │
         ├─► currentStrength: number
         ├─► strengthHistory: StrengthSnapshot[]
         └─► metrics: StrengthMetrics
                │
                ▼
   ┌────────────┼────────────┐
   │            │            │
   ▼            ▼            ▼
StrengthCards  Timeline   InsightsRow
```

### 4.4 Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Iterating all dates since creation | Memoize with `useMemo`, keyed on `completedDates.size` |
| Large datasets (2+ years) | Sample data points for chart (max 100 points) |
| Re-calculations on toggle | Recalculate only affected dates forward |

---

## 5. Implementation Tasks

### Phase 1: Core Algorithm (Priority: P0)

- [ ] **Task 1.1:** Create `useHabitStrength` hook
  - Input: `completedDates`, `habitCreatedAt`
  - Output: `currentStrength`, `strengthHistory`, `metrics`
  - Implement exponential smoothing algorithm
  - Add memoization for performance

- [ ] **Task 1.2:** Create `strengthUtils.ts` helper functions
  - `calculateStrengthAtDate(dates, start, target)`
  - `getStrengthLabel(strength)` → 'weak' | 'developing' | 'strong'
  - `getStrengthColor(strength)` → color string
  - `generateStrengthTimeline(dates, start)` → StrengthSnapshot[]

- [ ] **Task 1.3:** Add TypeScript types in `types.ts`
  - `StrengthSnapshot`
  - `StrengthMetrics`
  - `StrengthLabel`

### Phase 2: UI Components (Priority: P0)

- [ ] **Task 2.1:** Create `StrengthComparisonCards` component
  - Three-card layout (Now, 30 Days, 1 Year)
  - Circular progress rings with animated fill
  - Color coding based on strength label
  - Delta badge on "Now" card
  - Handle case when habit is < 30 days or < 1 year old

- [ ] **Task 2.2:** Create `StrengthTimelineChart` component
  - SVG area chart with gradient fill
  - Bezier curve interpolation
  - X-axis with milestone labels
  - Pulsing dot at current position
  - Touch handler for date inspection (stretch goal)

- [ ] **Task 2.3:** Create `StrengthInsightsRow` component
  - Three-metric horizontal layout
  - Icons and color coding
  - Handle edge cases (new habits, no decline)

- [ ] **Task 2.4:** Create `HabitStrengthHistory` container
  - Compose all sub-components
  - Section header with "Strength History" title
  - Collapsible accordion (optional)

### Phase 3: Integration (Priority: P1)

- [ ] **Task 3.1:** Add to Progress Tab
  - Import in `HabitDetailScreen.tsx` or `ProgressTabContent.tsx`
  - Position below calendar, above Weekly Pattern Chart
  - Pass required props from habit query

- [ ] **Task 3.2:** Add animations
  - Entry animation (fade in + slide up)
  - Progress ring fill animation on mount
  - Number count-up animation for percentages

- [ ] **Task 3.3:** Accessibility
  - Screen reader labels for all metrics
  - `accessibilityRole="progressbar"` for rings
  - `accessibilityValue` with current/max

### Phase 4: Polish & Edge Cases (Priority: P2)

- [ ] **Task 4.1:** Handle edge cases
  - New habit (< 7 days): Show "Building..." placeholder
  - Habit < 30 days: Replace "30 Days Ago" with "Start"
  - Habit < 1 year: Replace "1 Year Ago" with "Start"
  - No completions ever: Show empty state

- [ ] **Task 4.2:** Add loading states
  - Skeleton loader for cards
  - Placeholder chart while calculating

- [ ] **Task 4.3:** Unit tests
  - Test strength calculation algorithm
  - Test edge cases (empty data, single day, etc.)
  - Test label thresholds

---

## 6. API Reference

### 6.1 useHabitStrength Hook

```typescript
function useHabitStrength(
  completedDates: Set<string>,
  habitCreatedAt: number
): {
  currentStrength: number;
  strengthHistory: StrengthSnapshot[];
  metrics: StrengthMetrics;
  isLoading: boolean;
}
```

### 6.2 Utility Functions

```typescript
// Calculate strength at a specific date
function calculateStrengthAtDate(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  targetDate: Date
): number;

// Get human-readable label
function getStrengthLabel(strength: number): 'weak' | 'developing' | 'strong';

// Get color for strength value
function getStrengthColor(strength: number): string;

// Generate full timeline for charting
function generateStrengthTimeline(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  sampleSize?: number  // default: 100
): StrengthSnapshot[];
```

---

## 7. Design Tokens

### 7.1 Colors

```typescript
const STRENGTH_COLORS = {
  weak: {
    primary: '#ef4444',      // Red-500
    background: '#fef2f2',   // Red-50
    ring: '#fca5a5',         // Red-300
  },
  developing: {
    primary: '#f59e0b',      // Amber-500
    background: '#fffbeb',   // Amber-50
    ring: '#fcd34d',         // Amber-300
  },
  strong: {
    primary: '#10b981',      // Emerald-500
    background: '#ecfdf5',   // Emerald-50
    ring: '#6ee7b7',         // Emerald-300
  },
};
```

### 7.2 Animation Timing

```typescript
const STRENGTH_ANIMATIONS = {
  ringFill: {
    duration: 1000,
    easing: 'easeOutCubic',
  },
  numberCountUp: {
    duration: 800,
    easing: 'linear',
  },
  sectionEntry: {
    duration: 400,
    delay: 200,
    easing: 'easeOut',
  },
};
```

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Section visibility | >80% of detail screen visits | Analytics scroll depth |
| Engagement | >20% tap on "Peak" date | Event tracking |
| Retention correlation | Users who view history have +10% 7-day retention | Cohort analysis |

---

## 9. Mockups & References

### 9.1 Design Mockup

**File:** `.superdesign/design_iterations/habit_strength_history_v1.html`

Open in browser to view side-by-side comparison of:
- Option A: Calendar First (recommended)
- Option B: Strength First

### 9.2 Inspiration

- Loop Habit Tracker: Strength algorithm
- GitHub Contributions: Heatmap visual language
- Apple Health: Metric comparison cards
- Strava: Progress timeline charts

---

## Changelog

### v1.0 (2024-12-29)
- Initial specification
- Defined algorithm based on Loop Habit Tracker
- Created task breakdown
- Added mockup reference
