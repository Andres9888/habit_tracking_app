# Calendar Redesign - Implementation Tasks

**Spec Reference:** `calendar-redesign-loop-style-spec.md`
**Mockup:** `.superdesign/design_iterations/calendar_loop_style_1.html`

---

## Task Overview

| Phase | Tasks | Priority | Dependencies |
|-------|-------|----------|--------------|
| Phase 1: Core Components | 5 tasks | P0 | None |
| Phase 2: Calendar Grid | 3 tasks | P0 | Phase 1 |
| Phase 3: Integration | 3 tasks | P1 | Phase 2 |
| Phase 4: Polish | 4 tasks | P2 | Phase 3 |

---

## Phase 1: Core Components

### Task 1.1: Create Component Structure & Types

**Files:**
- `src/components/LoopCalendar/types.ts`
- `src/components/LoopCalendar/constants.ts`
- `src/components/LoopCalendar/index.ts`

**Description:**
Set up the new LoopCalendar component folder with TypeScript types, design constants, and barrel exports.

**Acceptance Criteria:**
- [ ] Create `types.ts` with all interfaces:
  - `LoopCalendarProps`
  - `HeatmapRow`, `HeatmapCell`
  - `CalendarDay`, `CalendarWeek`
  - `DayState` enum (completed, today, otherMonth, future, default)
- [ ] Create `constants.ts` with:
  - `CALENDAR_COLORS` (heat levels, calendar states, UI elements)
  - `DIMENSIONS` (cell sizes, gaps, radii)
  - `ANIMATIONS` (durations, easings)
- [ ] Create `index.ts` barrel export

**Mockup Reference:** Review color palette and dimensions from spec section 2.3-2.5

---

### Task 1.2: Create Utility Functions

**File:** `src/components/LoopCalendar/utils.ts`

**Description:**
Date calculation utilities for heatmap and calendar generation.

**Functions to Implement:**
```typescript
// Generate 3-row compact heatmap
function generateCompactHeatmap(
  completedDates: Set<string>,
  months: number
): HeatmapRow[];

// Generate month calendar grid
function generateMonthGrid(
  month: Date,
  completedDates: Set<string>,
  habitCreatedAt?: number
): CalendarWeek[];

// Calculate heat intensity (0-5) based on streak
function getHeatIntensity(
  date: string,
  completedDates: Set<string>
): number;

// Month navigation helpers
function addMonths(date: Date, amount: number): Date;
function getMonthLabel(date: Date): string; // "Dec 2024"
function getMonthRange(months: number): Date[]; // Array of month start dates
```

**Acceptance Criteria:**
- [ ] `generateCompactHeatmap` returns 3 rows (Tu/Th/Sa) with 6 months of data
- [ ] `generateMonthGrid` returns 6 weeks with proper padding for other-month days
- [ ] `getHeatIntensity` maps streak position to 0-5 intensity levels
- [ ] All functions handle edge cases (empty dates, future dates)
- [ ] Unit tests for each function

---

### Task 1.3: Create HeatmapCell Component

**File:** `src/components/LoopCalendar/HeatmapCell.tsx`

**Description:**
Individual cell in the compact heatmap.

**Props:**
```typescript
interface HeatmapCellProps {
  date: string;           // YYYY-MM-DD
  intensity: 0 | 1 | 2 | 3 | 4 | 5;
  isToday?: boolean;
  onPress?: (date: string) => void;
}
```

**Visual Specs (from mockup):**
- Size: 10x10px
- Border radius: 2px
- Colors: transparent → red-100 → red-200 → red-300 → red-400 → red-500
- Today (not completed): white with stone-300 border

**Acceptance Criteria:**
- [ ] Renders correct color based on intensity
- [ ] Today cell has distinct border style
- [ ] Accessible: `accessibilityLabel` with date and status
- [ ] Optional onPress handler for tooltip trigger

---

### Task 1.4: Create CompactHeatmap Component

**File:** `src/components/LoopCalendar/CompactHeatmap.tsx`

**Description:**
6-month heatmap with 3 rows showing Tu/Th/Sa patterns.

**Props:**
```typescript
interface CompactHeatmapProps {
  completedDates: Set<string>;
  months?: number;        // Default: 6
  habitCreatedAt?: number;
}
```

**Visual Specs (from mockup):**
- Container: White card, rounded-2xl, p-4, subtle shadow + border
- Month labels: Jul, Aug, Sep, Oct, Nov, Dec (text-xs, stone-400)
- Row labels: Tu, Th, Sa (text-xs, stone-400, w-6)
- Cell grid: 3px gap between cells

**Acceptance Criteria:**
- [ ] Renders month labels aligned above columns
- [ ] Renders 3 rows with day labels (Tu/Th/Sa)
- [ ] Uses HeatmapCell for each cell
- [ ] Calculates correct dates for each cell
- [ ] Scroll horizontally if more than 6 months
- [ ] Entry animation: stagger fade-in by column

---

### Task 1.5: Create CalendarStatsRow Component

**File:** `src/components/LoopCalendar/CalendarStatsRow.tsx`

**Description:**
Horizontal row with frequency badge, streak count, and action buttons.

**Props:**
```typescript
interface CalendarStatsRowProps {
  frequency: 'daily' | 'weekly' | 'custom';
  currentStreak: number;
  onEdit?: () => void;
  onSettings?: () => void;
}
```

**Visual Specs (from mockup):**
- Left side:
  - Frequency pill: "Daily" (stone-100 bg, stone-700 text, rounded-full)
  - Streak pill: "🔥 12" (red-50 bg, red-600 text, rounded-full)
- Right side:
  - Edit button: Pencil icon (stone-100 bg, 36x36 circle)
  - Settings button: Gear icon (stone-100 bg, 36x36 circle)

**Acceptance Criteria:**
- [ ] Renders frequency badge with correct label
- [ ] Renders streak count with fire emoji
- [ ] Edit and settings buttons are pressable with haptic feedback
- [ ] Buttons hidden if no handlers provided
- [ ] Streak shows 0 gracefully (no negative numbers)

---

## Phase 2: Calendar Grid

### Task 2.1: Create CalendarDayCell Component

**File:** `src/components/LoopCalendar/CalendarDayCell.tsx`

**Description:**
Individual day cell in the month calendar with tap-to-toggle.

**Props:**
```typescript
interface CalendarDayCellProps {
  day: CalendarDay;
  onToggle?: (date: string, completed: boolean) => void;
}

interface CalendarDay {
  date: string;           // YYYY-MM-DD
  dayOfMonth: number;
  state: DayState;        // completed | today | otherMonth | future | default
  completed: boolean;
}
```

**Visual Specs (from mockup):**
- Size: 44x44px
- Border radius: 12px (rounded-xl)
- States:
  | State | Background | Text | Extra |
  |-------|------------|------|-------|
  | completed | #fee2e2 (red-50) | stone-800 | 6px red dot below |
  | today | transparent | bold stone-900 | 2px red ring inset |
  | today+completed | #fee2e2 | bold stone-900 | red dot + red ring |
  | otherMonth | transparent | stone-300 | - |
  | future | transparent | stone-400 | - |
  | default | transparent | stone-700 | - |

**Acceptance Criteria:**
- [ ] Renders correct styling for each state
- [ ] Tap triggers onToggle with date and new status
- [ ] Haptic feedback on tap (medium impact)
- [ ] Animation: scale down 0.95 on press, spring back
- [ ] Completion animation: fill scale 0→1, dot fade in
- [ ] Accessible: proper labels and roles

---

### Task 2.2: Create MonthCalendarGrid Component

**File:** `src/components/LoopCalendar/MonthCalendarGrid.tsx`

**Description:**
Traditional month calendar with day headers and 6-week grid.

**Props:**
```typescript
interface MonthCalendarGridProps {
  month: Date;
  completedDates: Set<string>;
  habitCreatedAt?: number;
  onDayToggle?: (date: string, completed: boolean) => void;
}
```

**Visual Specs (from mockup):**
- Header: Mon-Sun labels (text-sm, font-medium, stone-500)
- Grid: 7 columns, 6 rows
- Gap: gap-y-1 (4px vertical)
- Cells: Use CalendarDayCell component

**Acceptance Criteria:**
- [ ] Renders day-of-week header row
- [ ] Generates 6-week grid with proper month padding
- [ ] Marks other-month days correctly
- [ ] Marks future days correctly
- [ ] Marks today correctly
- [ ] Passes toggle handler to cells
- [ ] Memoizes grid generation

---

### Task 2.3: Create MonthNavigation Component

**File:** `src/components/LoopCalendar/MonthNavigation.tsx`

**Description:**
Bottom navigation bar with month picker and prev/next buttons.

**Props:**
```typescript
interface MonthNavigationProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  onPickerOpen?: () => void;
}
```

**Visual Specs (from mockup):**
- Position: Bottom of screen, above safe area
- Border: Top border (stone-200)
- Padding: py-4
- Left: Month picker button
  - Calendar icon + "Dec 2024"
  - Rounded-full border, white bg
- Right: < and > buttons
  - 40x40 circles
  - Rounded-full border, white bg

**Acceptance Criteria:**
- [ ] Displays formatted month label (e.g., "Dec 2024")
- [ ] Left/right buttons navigate months
- [ ] Month picker button triggers onPickerOpen
- [ ] Haptic feedback on navigation
- [ ] Buttons disabled at reasonable limits (e.g., can't go to future)
- [ ] Announces month change for screen readers

---

## Phase 3: Integration

### Task 3.1: Create LoopCalendar Container

**File:** `src/components/LoopCalendar/LoopCalendar.tsx`

**Description:**
Main container that composes all sub-components.

**Props:**
```typescript
interface LoopCalendarProps {
  habitId: string;
  habitName: string;
  habitDescription?: string;
  habitIcon?: string;
  habitColor?: string;
  completedDates: Set<string>;
  habitCreatedAt: number;
  currentStreak: number;
  frequency?: 'daily' | 'weekly' | 'custom';
  onDayToggle?: (date: string, completed: boolean) => void;
  onClose?: () => void;
  onEdit?: () => void;
  onSettings?: () => void;
}
```

**Acceptance Criteria:**
- [ ] Composes: Header, CompactHeatmap, CalendarStatsRow, MonthCalendarGrid, MonthNavigation
- [ ] Manages selectedMonth state internally
- [ ] Passes handlers to child components
- [ ] Layout matches mockup exactly
- [ ] Scroll behavior: calendar grid scrolls, nav fixed at bottom

---

### Task 3.2: Replace Calendar in HabitDetailScreen

**File:** `src/screens/HabitDetailScreen.tsx`

**Description:**
Replace `CalendarHeatmapWithViews` with new `LoopCalendar`.

**Changes:**
- [ ] Import `LoopCalendar` from new component
- [ ] Remove `CalendarHeatmapWithViews` usage
- [ ] Update props mapping
- [ ] Remove unused imports (ViewToggle, etc.)

**Integration Code:**
```tsx
<LoopCalendar
  habitId={habit._id}
  habitName={habit.name}
  habitDescription={habit.description}
  habitIcon={habit.icon}
  habitColor={habit.iconColor}
  completedDates={completedDates}
  habitCreatedAt={habitCreatedAt}
  currentStreak={habit.currentStreak ?? 0}
  onDayToggle={handleDayToggle}
  onClose={onClose}
  onEdit={handleEdit}
/>
```

---

### Task 3.3: Add Day Toggle Mutation

**File:** `src/screens/HabitDetailScreen.tsx` (or hook)

**Description:**
Wire up the day toggle to Convex mutation.

**Acceptance Criteria:**
- [ ] Create `handleDayToggle` function
- [ ] Call `toggleHabit` mutation with habitId and date
- [ ] Optimistic UI update (immediate visual feedback)
- [ ] Error handling with rollback if mutation fails
- [ ] Toast notification on error

---

## Phase 4: Polish

### Task 4.1: Add Animations

**Description:**
Implement all animations from spec.

**Animations:**
- [ ] Calendar cell tap: Scale 0.95 → 1.0 (150ms, ease-out)
- [ ] Completion toggle: Fill scale 0 → 1 (200ms, spring)
- [ ] Dot appearance: Scale + fade in (150ms, ease-out)
- [ ] Month transition: Fade + slide left/right (250ms)
- [ ] Heatmap load: Stagger fade in by column (50ms delay each)

**Acceptance Criteria:**
- [ ] All animations use react-native-reanimated
- [ ] Animations respect `useReducedMotion` preference
- [ ] 60fps performance verified

---

### Task 4.2: Add Month Picker Modal

**File:** `src/components/LoopCalendar/MonthPickerModal.tsx`

**Description:**
Modal for selecting month/year directly.

**Acceptance Criteria:**
- [ ] Shows scrollable list of months
- [ ] Highlights current selection
- [ ] Quick jump to current month
- [ ] Smooth open/close animation

---

### Task 4.3: Accessibility Audit

**Description:**
Ensure full accessibility compliance.

**Checklist:**
- [ ] All touch targets ≥ 44x44px
- [ ] Calendar cells: `accessibilityRole="button"`
- [ ] Calendar cells: Label includes day name, date, completion status
- [ ] Heatmap cells: Label includes date and streak info
- [ ] Month navigation: Announces changes
- [ ] Color contrast: All text meets WCAG AA (4.5:1)
- [ ] Screen reader testing on iOS VoiceOver and Android TalkBack

---

### Task 4.4: Unit Tests

**Files:** `src/components/LoopCalendar/__tests__/`

**Tests to Write:**
```typescript
// utils.test.ts
describe('generateCompactHeatmap', () => {
  it('generates 3 rows for Tu/Th/Sa');
  it('covers 6 months of data');
  it('calculates correct intensity levels');
});

describe('generateMonthGrid', () => {
  it('generates 6 weeks');
  it('pads with other-month days');
  it('marks today correctly');
  it('marks completed days correctly');
});

// Components tests
describe('CalendarDayCell', () => {
  it('renders correct state styling');
  it('calls onToggle on press');
  it('has correct accessibility props');
});

describe('LoopCalendar', () => {
  it('renders all sections');
  it('navigates months');
  it('toggles completions');
});
```

**Acceptance Criteria:**
- [ ] >80% code coverage
- [ ] All edge cases tested
- [ ] Accessibility props verified

---

## Definition of Done

- [ ] All Phase 1-3 tasks completed
- [ ] Visual output matches mockup exactly
- [ ] Animations smooth at 60fps
- [ ] No TypeScript errors
- [ ] Accessibility audit passed
- [ ] Unit tests pass (>80% coverage)
- [ ] Tested on iOS and Android
- [ ] Code reviewed and approved

---

## File Structure Summary

```
src/components/LoopCalendar/
├── LoopCalendar.tsx              # Main container
├── CompactHeatmap.tsx            # 6-month 3-row heatmap
├── HeatmapCell.tsx               # Individual heatmap cell
├── CalendarStatsRow.tsx          # Frequency + streak badges
├── MonthCalendarGrid.tsx         # Traditional calendar
├── CalendarDayCell.tsx           # Individual day cell
├── MonthNavigation.tsx           # Bottom navigation
├── MonthPickerModal.tsx          # Month selector modal
├── utils.ts                      # Date calculations
├── types.ts                      # TypeScript interfaces
├── constants.ts                  # Colors, dimensions
├── index.ts                      # Barrel export
└── __tests__/
    ├── utils.test.ts
    ├── CalendarDayCell.test.tsx
    ├── CompactHeatmap.test.tsx
    ├── MonthCalendarGrid.test.tsx
    └── LoopCalendar.test.tsx
```

---

## Visual Verification Checklist

Before marking complete, verify against mockup (`calendar_loop_style_1.html`):

- [ ] Heatmap card: white bg, rounded corners, shadow
- [ ] Heatmap: 3 rows, month labels, correct colors
- [ ] Stats row: Daily pill, streak pill, edit/settings buttons
- [ ] Calendar: 44px cells, pink completed bg, red dot
- [ ] Today: red ring (inset), bold text
- [ ] Month nav: bottom position, calendar icon, < > buttons
- [ ] Color scheme: red/pink/stone palette
- [ ] Typography: Inter font, correct weights and sizes
- [ ] Spacing: matches spec dimensions exactly
