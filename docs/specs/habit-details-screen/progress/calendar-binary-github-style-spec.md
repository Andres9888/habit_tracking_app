# Binary GitHub-Style Calendar Specification

## Overview

Replace the current calendar heatmap with a clean, binary (on/off) GitHub-style visualization that accurately represents daily habit completion data.

**Mockup Reference:** `.superdesign/design_iterations/calendar_github_style_binary_1.html`

## Design Rationale

### Why Binary Instead of Intensity Gradient?

| Aspect                | Intensity Gradient                 | Binary (On/Off)                  |
| --------------------- | ---------------------------------- | -------------------------------- |
| **Data Accuracy**     | Implies variable completion levels | Matches actual yes/no habit data |
| **Clarity**           | "What does 60% green mean?"        | "Green = done, gray = missed"    |
| **Cognitive Load**    | Must interpret 6 levels            | Instant recognition              |
| **Streak Visibility** | Gradients can obscure patterns     | Streaks are immediately obvious  |

GitHub uses intensity because commits can vary (1-10+ per day). Daily habits are binary: you did it or didn't.

---

## Layout Structure

```
┌─────────────────────────────────────────┐
│ [Icon] Morning Run              [Close] │  ← Header
│         Exercise daily                  │
├─────────────────────────────────────────┤
│ Activity                    [3m|6m|1y]  │  ← Heatmap Card
│     Jul   Aug   Sep   Oct   Nov   Dec   │
│ S   ○ ● ○ ● ● ● ○ ● ● ● ● ● ● ● ...    │
│ M   ● ○ ● ○ ● ● ● ● ● ● ○ ● ● ● ...    │
│ T   ○ ● ● ● ● ● ● ○ ● ● ● ● ● ● ...    │
│ W   ● ○ ● ○ ● ● ○ ● ● ● ● ● ● ● ...    │
│ T   ○ ● ● ● ● ● ● ● ● ● ● ● ● ● ...    │
│ F   ● ○ ● ● ● ● ● ● ● ● ● ● ● ● ...    │
│ S   ○ ● ● ● ○ ● ● ● ● ● ● ● ● ● ...    │
│ ─────────────────────────────────────── │
│ [○ Missed] [● Done]          86% compl  │  ← Legend
├─────────────────────────────────────────┤
│ [Daily] [🔥 54 day streak]      [⚙️]    │  ← Stats Row
├─────────────────────────────────────────┤
│  Mon Tue Wed Thu Fri Sat Sun            │  ← Monthly Calendar
│   25  26  27  28  29  30   1            │
│    2   3   4   5   6   7   8            │
│   ...                                   │
├─────────────────────────────────────────┤
│ [📅 Dec 2024]              [◀] [▶]     │  ← Month Navigation
└─────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Binary Heatmap Grid

**Structure:**

- 7 rows (Sunday-Saturday)
- ~26 columns (6 months of weeks)
- 10x10px cells with 2px border-radius
- 3px gap between cells

**Cell States:**

| State    | Background                    | Additional                            |
| -------- | ----------------------------- | ------------------------------------- |
| `done`   | `--habit-color-500` (dynamic) | Solid color                           |
| `missed` | `#e7e5e4` (stone-200)         | Solid gray                            |
| `today`  | `#ffffff`                     | 2px inset ring in `--habit-color-600` |
| `future` | `#f5f5f4`                     | 40% opacity                           |

**No blur effects** - all cells are crisp with solid colors.

### 2. Time Range Toggle

```tsx
type TimeRange = '3m' | '6m' | '1y';
```

**Styling:**

- Container: `bg-stone-100 rounded-lg p-0.5`
- Button: `px-2.5 py-1 text-[11px] font-medium rounded-md`
- Active: `bg-white shadow-sm text-stone-900`
- Inactive: `text-stone-500`

### 3. Legend

Simple binary legend:

```
[○ Missed] [● Done]          86% completion
```

- Missed indicator: 8x8px gray square
- Done indicator: 8x8px habit-color square
- Completion percentage: `text-xs font-semibold` in habit color

### 4. Stats Row

```tsx
interface StatsRowProps {
  frequency: 'Daily' | 'Weekly' | string;
  currentStreak: number;
  onSettingsPress?: () => void;
}
```

**Elements:**

- Frequency badge: `bg-stone-100 text-stone-900`
- Streak badge: `bg-habit-color-50 text-habit-color` with fire icon
- Settings button: 36x36px circular

### 5. Monthly Calendar Grid

**Existing component** - reuse `CalendarGrid` or similar with:

- 44x44px day cells
- 8px border radius (design system)
- Completed days: light habit color background + dot indicator

### 6. Month Navigation

**Bottom navigation bar:**

- Month selector button: Calendar icon + "Dec 2024" label
- Previous/Next: 40x40px circular buttons with chevron icons

---

## Color System

All colors use CSS custom properties for dynamic theming:

```css
:root {
  /* From design system */
  --color-background: #faf9f7;
  --color-card: #ffffff;
  --color-border: #e7e5e4;
  --color-text-primary: #1f2937;
  --color-text-secondary: #78716c;
  --color-text-tertiary: #9ca3af;

  /* Dynamic habit color (set per-habit) */
  --habit-color: #10b981; /* Default emerald */
  --habit-color-50: #ecfdf5;
  --habit-color-100: #d1fae5;
  --habit-color-500: #10b981;
  --habit-color-600: #059669;

  /* Binary cell states */
  --cell-empty: #e7e5e4;
  --cell-done: var(--habit-color-500);
}
```

---

## Animations

### Staggered Load Animation

Cells fade in with staggered delay on mount:

```css
.cell {
  opacity: 0;
  animation: fadeInCell 0.3s ease forwards;
}

@keyframes fadeInCell {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**Delay:** `index * 5ms` per cell (total ~1s for full grid)

### Hover Effect (Web/Desktop)

```css
.cell:hover {
  transform: scale(1.4);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
```

### Tap Feedback (Mobile)

```css
.cell:active {
  transform: scale(0.9);
}
```

---

## Tooltip

**On hover/long-press**, show date and status:

```
"Dec 15: Done ✓"
"Jul 7: Missed"
"Dec 30: Today"
"Jan 5: Future"
```

**Styling:**

- Background: `#1c1917`
- Text: white, 11px, font-weight 500
- Padding: 6px 10px
- Border-radius: 6px
- Arrow pointing down

---

## Accessibility

### Screen Reader Labels

Each cell must have an accessible label:

```tsx
accessibilityLabel={`${dayName}, ${formattedDate}. ${completed ? 'Completed' : 'Not completed'}`}
```

### Color Contrast

- Done cells: habit color on white card (verify WCAG AA)
- Missed cells: `#e7e5e4` provides sufficient contrast
- Text: All text meets 4.5:1 contrast ratio

### Reduced Motion

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .cell {
    animation: none;
    opacity: 1;
  }
}
```

---

## Data Requirements

### Props Interface

```tsx
interface BinaryHeatmapProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>; // YYYY-MM-DD format
  habitCreatedAt?: number; // Unix timestamp
  habitColor: string; // Hex color
  currentStreak: number;
  timeRange?: '3m' | '6m' | '1y';
  onDayPress?: (date: string, completed: boolean) => void;
  onTimeRangeChange?: (range: '3m' | '6m' | '1y') => void;
}
```

### Grid Generation

```tsx
function generateBinaryGrid(
  timeRange: '3m' | '6m' | '1y',
  completedDates: Set<string>,
  habitCreatedAt?: number
): {
  weeks: BinaryDay[][];
  monthLabels: { weekIndex: number; label: string }[];
};
```

---

## File Structure

```
src/components/BinaryHeatmap/
├── BinaryHeatmap.tsx          # Main container
├── BinaryHeatmapGrid.tsx      # 7-row grid component
├── BinaryCell.tsx             # Individual cell
├── TimeRangeToggle.tsx        # 3m/6m/1y toggle
├── HeatmapLegend.tsx          # Missed/Done legend
├── HeatmapTooltip.tsx         # Hover tooltip
├── utils.ts                   # Grid generation
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Colors, dimensions
└── index.ts                   # Barrel export
```

---

## Migration Plan

### Components to Replace

- `CalendarHeatmapWithViews` → `BinaryHeatmap`
- Remove intensity-based color logic
- Remove `ViewToggle` (week/month/3m/year) - replaced by `TimeRangeToggle`

### Components to Keep

- `MonthCalendarGrid` (or existing monthly view)
- `MonthNavigation`
- Day cell tap handling for toggling completion

---

## Visual Verification Checklist

Compare implementation against mockup:

- [ ] Binary cells: done = habit color, missed = gray
- [ ] No blur/glow effects on any cells
- [ ] Today cell has clean ring outline (no pulse)
- [ ] 7 rows labeled S/M/T/W/T/F/S
- [ ] Month labels aligned above grid
- [ ] Time range toggle (3m/6m/1y) in top-right
- [ ] Simple legend: Missed + Done + percentage
- [ ] Stats row with frequency and streak badges
- [ ] Monthly calendar below heatmap
- [ ] Month navigation at bottom
- [ ] Staggered load animation on mount
- [ ] Tooltip on hover shows date + status
- [ ] Dynamic habit color theming works

---

## Implementation Tasks

**Mockup:** `.superdesign/design_iterations/calendar_github_style_binary_1.html`

---

### Phase 1: Core Components

#### Task 1.1: Create component structure and types

- [x] Create `src/components/BinaryHeatmap/` directory
- [x] Create `types.ts` with interfaces:
  - `BinaryDay` (date, completed, isToday, isFuture, isBeforeCreation)
  - `BinaryHeatmapProps`
  - `TimeRange` type
- [x] Create `constants.ts` with:
  - Cell dimensions (10x10px)
  - Gap sizes (3px)
  - Animation timing
- [x] Create `index.ts` barrel export

**Acceptance:** TypeScript compiles with no errors

**Completed:** Created `src/components/BinaryHeatmap/` with:

- `types.ts`: 13 interfaces/types including `BinaryDay`, `BinaryHeatmapProps`, `TimeRange`, `BinaryCellState`, `BinaryGridData`, `BinaryGridStats`, and props for all sub-components
- `constants.ts`: Cell dimensions (10x10px), gaps (3px), animation timing (5ms stagger), colors, day labels, grid config, tooltip config
- `index.ts`: Barrel export with all types and constants

---

#### Task 1.2: Implement grid generation utility

- [x] Create `utils.ts` with `generateBinaryGrid()` function
- [x] Support 3m, 6m, 1y time ranges
- [x] Generate month labels with correct week indices
- [x] Handle habit creation date (cells before = disabled)
- [x] Handle future dates
- [x] Write unit tests for grid generation

**Acceptance:** Grid generates correct number of weeks for each time range

**Completed:** Created `src/components/BinaryHeatmap/utils.ts` with:

- `generateBinaryGrid()`: Main function that generates grid data for 3m (91 days), 6m (182 days), or 1y (365 days)
- `calculateBinaryGridStats()`: Calculates completions, eligible days, and completion rate
- `getCellState()`: Determines cell visual state (done/missed/today/future/beforeCreation)
- `formatDateForAccessibility()`: Formats dates for screen readers
- `getBinaryCellAccessibilityLabel()`: Generates accessibility labels for cells
- `formatTooltipText()`: Formats tooltip content
- Helper functions: `getTimeRangeDays()`, `getTotalCellCount()`, `calculateCellAnimationDelay()`, `isValidDateString()`, `formatDateString()`

Created `src/components/BinaryHeatmap/__tests__/utils.test.ts` with 89 comprehensive unit tests covering:

- Time range day counts
- Cell state determination
- Grid structure for all time ranges (3m/6m/1y)
- Day-of-week alignment (Sunday-Saturday)
- Date formatting
- Completed dates tracking
- Today detection
- Future dates handling
- habitCreatedAt handling
- Month label generation
- Statistics calculation
- Edge cases (month boundaries, leap years, year boundaries)

---

#### Task 1.3: Create BinaryCell component

- [x] Create `BinaryCell.tsx`
- [x] Implement 4 states: done, missed, today, future
- [x] Use CSS variables for dynamic habit color
- [x] Add staggered fade-in animation
- [x] Add hover scale effect (web)
- [x] Add tap feedback (mobile)
- [x] Add accessibility label

**Acceptance:** Cells render correctly with all 4 states

**Completed:** Created `src/components/BinaryHeatmap/BinaryCell.tsx` with:

- 5 visual states: done (habit color), missed (gray), today (ring outline), future (faded), beforeCreation (very faded)
- Memoized component using `React.memo()` for performance
- Dynamic habit color via props (not CSS variables - more appropriate for React Native)
- Staggered FadeIn animation using react-native-reanimated with `ANIMATION.CELL_STAGGER_DELAY` (5ms per cell)
- Web hover cursor support via Platform.OS check
- Mobile tap feedback via withSpring scale animation (0.9 scale on press)
- Full accessibility: labels, roles (button/text), hints, selected state
- 34 comprehensive unit tests covering all states, interactions, animations, and accessibility

---

#### Task 1.4: Create TimeRangeToggle component

- [x] Create `TimeRangeToggle.tsx`
- [x] Implement 3m/6m/1y buttons
- [x] Style active/inactive states per spec
- [x] Add press animation
- [x] Call `onTimeRangeChange` callback

**Acceptance:** Toggle switches between ranges with visual feedback

**Completed:** Created `src/components/BinaryHeatmap/TimeRangeToggle.tsx` with:

- Pill-style segmented control with 3m/6m/1y buttons
- Memoized component using `React.memo()` for performance
- Active state: white background with shadow, dark text (stone-900)
- Inactive state: transparent background, gray text (stone-500)
- Spring-based press animation using react-native-reanimated (0.95 scale on press)
- `useReduceMotion` hook integration to respect accessibility preferences
- Full accessibility: `tablist` role on container, `tab` role on buttons, `selected` state
- Human-readable accessibility labels ("3 months", "6 months", "1 year")
- 23 comprehensive unit tests covering rendering, interactions, value updates, accessibility, and animations

---

#### Task 1.5: Create HeatmapLegend component

- [x] Create `HeatmapLegend.tsx`
- [x] Show "Missed" indicator (gray square)
- [x] Show "Done" indicator (habit color square)
- [x] Show completion percentage
- [x] Use dynamic habit color

**Acceptance:** Legend displays correctly with dynamic color

**Completed:** Created `src/components/BinaryHeatmap/HeatmapLegend.tsx` with:

- Memoized component using `React.memo()` for performance
- Binary legend showing "Missed" (gray square) and "Done" (habit color square) indicators
- Completion percentage displayed in the habit's accent color
- 8x8px indicator squares using `LEGEND_INDICATOR_SIZE` constant
- Full accessibility: container label, indicator labels, percentage label, all with `text` role
- Dynamic habit color support via props
- `formatCompletionRate()` helper for proper percentage rounding
- 31 comprehensive unit tests covering rendering, percentage formatting, dynamic colors, accessibility, component updates, and edge cases

---

### Phase 2: Grid Assembly

#### Task 2.1: Create BinaryHeatmapGrid component

- [x] Create `BinaryHeatmapGrid.tsx`
- [x] Render 7 rows (S/M/T/W/T/F/S)
- [x] Render day labels column
- [x] Map weeks to cell columns
- [x] Apply staggered animation delays

**Acceptance:** Full 7-row grid renders with correct layout

**Completed:** Created `src/components/BinaryHeatmap/BinaryHeatmapGrid.tsx` with:

- Memoized component using `React.memo()` for performance
- 7 rows representing Sunday through Saturday with proper S/M/T/W/T/F/S labels
- Day labels column on the left side with full accessibility labels (e.g., "Sunday row")
- Horizontal `ScrollView` for grid content to handle larger time ranges (6m, 1y)
- Week-to-row transposition: transforms `weeks[weekIndex][dayIndex]` to `rows[dayIndex][weekIndex]` for proper layout
- Staggered animation delays calculated via `calculateCellAnimationDelay()` for left-to-right, top-to-bottom reveal
- Full accessibility: `grid` role on container, `row` role on each day row
- 24 comprehensive unit tests covering grid structure, cell rendering, row transposition, cell press handling, animations, empty grids, large grids (26/52 weeks), mixed cell states, accessibility, and horizontal scrolling

---

#### Task 2.2: Add month labels row

- [x] Render month labels above grid
- [x] Position labels at correct week indices
- [x] Handle edge cases (month spanning multiple weeks)

**Acceptance:** Month labels align with their starting weeks

**Completed:** Created `src/components/BinaryHeatmap/MonthLabelsRow.tsx` with:

- Memoized component using `React.memo()` for performance
- Month labels positioned absolutely based on week indices using `left` positioning
- Dynamic width calculation: each label extends to the next month's start or grid end
- Minimum width constraint (`MONTH_LABEL.MIN_WIDTH = 24px`) for narrow month spans
- Full accessibility: container has `header` role, individual labels have full month names for screen readers
- Updated `BinaryHeatmapGrid.tsx` to integrate month labels:
  - Added `MonthLabelsRow` above the grid cells inside the ScrollView
  - Added spacer in day labels column for proper vertical alignment
  - Month labels scroll horizontally with the grid
- Added `MONTH_LABEL` constants (HEIGHT: 16px, FONT_SIZE: 10px, MIN_WIDTH: 24px)
- 26 unit tests for MonthLabelsRow covering rendering, positioning, accessibility, edge cases
- 5 integration tests in BinaryHeatmapGrid for month labels functionality

---

#### Task 2.3: Create HeatmapTooltip component

- [x] Create `HeatmapTooltip.tsx`
- [x] Show on hover (web) or long-press (mobile)
- [x] Display date and status
- [x] Position above cell with arrow
- [x] Style per spec (dark background, white text)

**Acceptance:** Tooltip appears on interaction with correct content

**Completed:** Created `src/components/BinaryHeatmap/HeatmapTooltip.tsx` with:

- Memoized component using `React.memo()` for performance
- Modal-based tooltip that displays above the target cell with an arrow pointing down
- Tooltip content formatted via `formatTooltipText()` utility function showing:
  - "Dec 15: Done ✓" for completed days
  - "Jul 7: Missed" for missed days
  - "Dec 30: Today" for current day
  - "Jan 5: Future" for future days
  - "Jan 1: Before tracking" for pre-creation days
- Fade-in/out and scale animations using react-native-reanimated
- `useReduceMotion` hook integration to respect accessibility preferences
- Dark background (#1c1917 / stone-900) with white text (11px, font-weight 500)
- 6px arrow pointing down to the cell below
- Full accessibility: `tooltip` role, `accessibilityLiveRegion="polite"`, close button with proper labels
- Transparent backdrop that dismisses tooltip on tap
- Modal's `onRequestClose` handler for Android back button support
- Updated `index.ts` to export `HeatmapTooltip`
- 33 comprehensive unit tests covering rendering, positioning, interactions, accessibility, date formatting, and edge cases

---

### Phase 3: Main Container

#### Task 3.1: Create BinaryHeatmap container

- [x] Create `BinaryHeatmap.tsx`
- [x] Compose: header, grid, legend
- [x] Manage time range state
- [x] Pass habit color as CSS variable
- [x] Handle `onDayPress` callback

**Acceptance:** Full heatmap card renders with all sub-components

**Completed:** Created `src/components/BinaryHeatmap/BinaryHeatmap.tsx` with:

- Main container component wrapping all sub-components (header, grid, legend, tooltip)
- Memoized using `React.memo()` for performance optimization
- Time range state management supporting both controlled and uncontrolled modes:
  - When `timeRange` prop is provided: controlled mode (parent manages state)
  - When `timeRange` prop is undefined: uncontrolled mode (internal state, defaults to '3m')
- Grid data generation via `useMemo()` with `generateBinaryGrid()` - re-generates only when `timeRange`, `completedDates`, or `habitCreatedAt` change
- Tooltip state management: `tooltipDay`, `tooltipPosition`, `tooltipVisible`
- Cell press handling: Shows tooltip and propagates `onDayPress` callback to parent
- Header row with "Activity" title and `TimeRangeToggle` component
- Grid wrapper with `BinaryHeatmapGrid` component
- `HeatmapLegend` showing Missed/Done indicators and completion percentage
- Conditional `HeatmapTooltip` rendering when a cell is pressed
- Full accessibility: `accessibilityLabel="Habit completion heatmap"`, `accessibilityRole="summary"`, `accessible=true`
- Styling: white card background, 12px border radius, 16px padding

Updated `index.ts` to export `BinaryHeatmap` component.

Created `__tests__/BinaryHeatmap.test.tsx` with 35 comprehensive unit tests covering:

- Rendering (container, header, toggle, legend, grid)
- Time range state (uncontrolled mode, controlled mode, callbacks)
- Grid data generation and regeneration
- Day press handling
- Legend integration
- Accessibility (roles, labels)
- Component composition
- Edge cases (empty completedDates, future/past habitCreatedAt)
- Props propagation
- Memoization behavior
- Styling verification

---

#### Task 3.2: Add stats row

- [x] Create stats row below heatmap card
- [x] Show frequency badge ("Daily")
- [x] Show streak badge with fire icon
- [x] Add settings button

**Acceptance:** Stats row matches mockup layout

**Completed:** Created `src/components/BinaryHeatmap/StatsRow.tsx` with:

- Memoized component using `React.memo()` for performance optimization
- Frequency badge with stone-100 background and stone-900 text
- Streak badge with dynamic habit color theming:
  - `getHabitColor50()` utility generates light tint for badge background
  - Fire icon (🔥) from lucide-react-native with habit color
  - Streak text with singular/plural handling ("1 day streak" vs "N day streak")
  - Only displayed when `currentStreak > 0`
- Settings button (36x36px circular) with:
  - Spring-based press animation using react-native-reanimated
  - `useReducedMotion` hook integration for accessibility
  - Settings icon from lucide-react-native
  - Only rendered when `onSettingsPress` callback is provided
- Full accessibility support with proper roles, labels, and hints
- Updated `types.ts` to add `habitColor` to `StatsRowProps`
- Updated `index.ts` to export `StatsRow` component
- 35 comprehensive unit tests covering rendering, interactions, dynamic colors, accessibility, and edge cases

---

### Phase 4: Integration

#### Task 4.1: Integrate with HabitDetailScreen

- [x] Replace `CalendarHeatmapWithViews` with `BinaryHeatmap`
- [x] Pass required props (habitId, completedDates, etc.)
- [x] Connect to habit color from `habit.iconColor`
- [x] Wire up day press handler

**Acceptance:** New heatmap renders in habit detail screen

**Completed:** Integrated `BinaryHeatmap` and `StatsRow` components into `HabitDetailScreen.tsx`:

- Replaced `CollapsibleCalendar` import with `BinaryHeatmap, StatsRow` from `../components/BinaryHeatmap`
- Replaced the `CollapsibleCalendar` usage in `ProgressTabContent` with:
  - `BinaryHeatmap` component with all required props: `habitId`, `completedDates`, `habitCreatedAt`, `habitColor`, `currentStreak`, `onDayPress`
  - `StatsRow` component with `frequency="Daily"`, `currentStreak`, and `habitColor` props
- Updated `BinaryHeatmap.tsx` to properly destructure all required props (`habitId`, `currentStreak`) to satisfy TypeScript interface

---

#### Task 4.2: Connect time range to data fetching

- [x] Update data query to respect time range
- [x] Fetch appropriate date range (3m/6m/1y)
- [x] Optimize query performance

**Acceptance:** Changing time range updates displayed data

**Completed:** The architecture was designed with time range in mind:

- `useHabitsAppState.ts` fetches 12 months of tracking data upfront via `api.habits.getTracking` with `extendedDateStrings` (lines 141-153)
- The full `completedDates` Set is passed to `BinaryHeatmap` component
- Time range filtering happens client-side in `generateBinaryGrid()` utility function (utils.ts lines 66-171)
- When users toggle between 3m/6m/1y, the grid regenerates via `useMemo` dependency on `timeRange`
- Performance is optimized: single data fetch, O(n) grid generation where n = days in range
- No additional backend changes needed - all time ranges (91/182/365 days) are subsets of the pre-fetched 365-day data

---

#### Task 4.3: Wire up day toggle mutation

- [ ] Connect cell tap to toggle completion mutation
- [ ] Add optimistic update
- [ ] Handle error state
- [ ] Refresh heatmap on toggle

**Acceptance:** Tapping a cell toggles completion status

---

### Phase 5: Polish

#### Task 5.1: Implement reduced motion support

- [ ] Check `prefers-reduced-motion` media query
- [ ] Disable staggered animation if reduced motion
- [ ] Disable hover scale if reduced motion

**Acceptance:** Animations respect user preference

---

#### Task 5.2: Accessibility audit

- [ ] Verify all cells have accessibility labels
- [ ] Test with screen reader
- [ ] Verify color contrast (WCAG AA)
- [ ] Add focus indicators for keyboard navigation

**Acceptance:** Screen reader can navigate and announce all cells

---

#### Task 5.3: Performance optimization

- [ ] Memoize cell components
- [ ] Virtualize grid if needed (for 1y view)
- [ ] Profile render performance
- [ ] Optimize re-renders on time range change

**Acceptance:** Smooth 60fps scrolling and transitions

---

#### Task 5.4: Write tests

- [ ] Unit tests for grid generation
- [ ] Unit tests for cell state logic
- [ ] Component tests for BinaryHeatmap
- [ ] Integration test for day toggle

**Acceptance:** All tests pass

---

### Cleanup

#### Task 6.1: Remove deprecated components

- [ ] Remove or deprecate `CalendarHeatmapWithViews`
- [ ] Remove intensity-based color utilities
- [ ] Remove `ViewToggle` component
- [ ] Update imports throughout codebase

**Acceptance:** No unused heatmap code remains

---

## Implementation Summary

| Phase   | Tasks | Complexity |
| ------- | ----- | ---------- |
| Phase 1 | 5     | Medium     |
| Phase 2 | 3     | Medium     |
| Phase 3 | 2     | Low        |
| Phase 4 | 3     | Medium     |
| Phase 5 | 4     | Low-Medium |
| Cleanup | 1     | Low        |

**Total:** 18 tasks

### Dependencies

- `date-fns` for date calculations
- Existing `colors.ts` theme
- Existing habit tracking mutations

---

## CodeRabbit Review Checklist

### Pre-Implementation Review (Spec)

- [ ] Data model matches existing `completions` table structure
- [ ] Props interface covers all required use cases
- [ ] Edge cases documented (empty data, habit created today, future dates)
- [ ] Accessibility requirements are WCAG AA compliant
- [ ] Animation specs include reduced motion fallbacks
- [ ] Color system uses existing design tokens

### Post-Implementation Review (Code)

#### Architecture

- [ ] Components follow single responsibility principle
- [ ] Proper separation of concerns (utils vs components)
- [ ] Barrel exports configured correctly
- [ ] No circular dependencies

#### TypeScript

- [ ] All props have proper types (no `any`)
- [ ] Interfaces exported for external use
- [ ] Strict null checks handled

#### Performance

- [ ] `React.memo()` on cell components
- [ ] `useMemo()` for grid generation
- [ ] `useCallback()` for event handlers
- [ ] No unnecessary re-renders on parent updates

#### Accessibility

- [ ] All cells have `accessibilityLabel`
- [ ] Color contrast verified (WCAG AA 4.5:1)
- [ ] Focus indicators visible
- [ ] Screen reader tested

#### Testing

- [ ] Unit tests for `generateBinaryGrid()`
- [ ] Unit tests for cell state logic
- [ ] Component render tests
- [ ] Integration test for day toggle

#### Code Quality

- [ ] No hardcoded colors (use CSS variables)
- [ ] No magic numbers (use constants)
- [ ] Consistent naming conventions
- [ ] No dead code or commented-out code

### Review Request Template

```markdown
@coderabbitai please review focusing on:

1. TypeScript type safety
2. React performance patterns (memo, useMemo, useCallback)
3. Accessibility compliance
4. Edge case handling
5. Test coverage
```
