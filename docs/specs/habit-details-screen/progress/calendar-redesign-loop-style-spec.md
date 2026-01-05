# Calendar Redesign - Loop Habit Tracker Style

## Document Overview

**Feature Area:** Habit Detail Screen → Calendar View
**Status:** Planned
**Version:** 1.0
**Last Updated:** 2024-12-30
**Design Reference:** `.superdesign/design_iterations/calendar_loop_style_1.html`
**Inspiration:** Loop Habit Tracker (Android open-source app)

---

## 1. Executive Summary

### Problem Statement

The current calendar implementation has multiple issues:
- View toggle (Week/Month/3M/Year) creates cognitive load
- Too many UI elements competing for attention
- Calendar doesn't feel cohesive or polished
- Stats, charts, and insights clutter the main calendar view

### Solution

Adopt a Loop Habit Tracker-inspired design that:
- Shows **both** heatmap AND traditional calendar simultaneously (no toggle)
- Uses a **compact 3-row heatmap** showing only active weekdays
- Places **month navigation at the bottom** for thumb-friendly access
- Keeps a **minimal stats row** between heatmap and calendar
- Removes unnecessary UI elements (weekly pattern chart, insight cards, view toggle)

### Key Design Principles

1. **One screen, complete picture** - User sees patterns (heatmap) and details (calendar) without switching
2. **Density over sprawl** - Compact heatmap uses 3 rows vs 7, showing more data in less space
3. **Bottom navigation** - Month picker at bottom follows iOS/Android thumb zone patterns
4. **Visual simplicity** - Red/pink color scheme, minimal chrome, clear hierarchy

---

## 2. Design Specification

### 2.1 Layout Structure (Top to Bottom)

```
┌─────────────────────────────────────┐
│ [Icon] Habit Name           [X]    │  ← Header
│         Description                 │
├─────────────────────────────────────┤
│     Jul  Aug  Sep  Oct  Nov  Dec   │  ← Heatmap
│ Tu  ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │     (6 months)
│ Th  ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │     (3 rows)
│ Sa  ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │
├─────────────────────────────────────┤
│ [Daily] [🔥 12]          [✏️] [⚙️] │  ← Stats Row
├─────────────────────────────────────┤
│ Mon Tue Wed Thu Fri Sat Sun        │  ← Calendar
│  25  26  27  28  29  30   1        │     Header
│   2   3   4   5   6   7   8        │
│   9  10  11  12  13  14  15        │  ← Calendar
│  16  17  18  19  20  21  22        │     Grid
│  23  24  25  26  27  28  29        │
│  30  31   1   2   3   4   5        │
├─────────────────────────────────────┤
│ [📅 Dec 2024]              [<] [>] │  ← Month Nav
└─────────────────────────────────────┘
```

### 2.2 Component Breakdown

#### A. Header Section
- **Left:** Habit icon (40x40, rounded-xl, colored background) + Name + Description
- **Right:** Close button (X icon, 40x40 circle)
- **Background:** Transparent, inherits screen gradient

#### B. Compact Heatmap (6 Months)
- **Container:** White card with rounded-2xl, subtle shadow, border
- **Month labels:** Jul, Aug, Sep, Oct, Nov, Dec (gray text, evenly spaced)
- **Day rows:** Only 3 rows showing Tu/Th/Sa (or configurable)
- **Cells:** 10x10px, 2px border-radius, 3px gap
- **Colors:**
  - Completed: Red gradient (red-100 → red-500 based on streak intensity)
  - Today (not done): White with stone-300 border
  - Future/no data: Transparent or very light gray

#### C. Stats Row
- **Frequency badge:** "Daily" pill (stone-100 bg, stone-700 text)
- **Streak badge:** "🔥 12" pill (red-50 bg, red-600 text) - current streak count
- **Action buttons:** Edit (pencil) + Settings (gear), 36x36 circles, stone-100 bg
- **Layout:** Flex row with space-between

#### D. Traditional Calendar Grid
- **Header:** Mon-Sun labels (stone-500, font-medium)
- **Cells:** 44x44px, 12px border-radius
- **States:**
  | State | Background | Text | Indicator |
  |-------|------------|------|-----------|
  | Completed | red-50 (fee2e2) | stone-800 | Red dot below number |
  | Today | transparent | bold, stone-900 | 2px red ring (inset) |
  | Other month | transparent | stone-300 | None |
  | Future | transparent | stone-400 | None |
  | Default | transparent | stone-700 | None |
- **Interaction:** Tap to toggle completion (with haptic + animation)

#### E. Month Navigation (Bottom)
- **Month picker:** Rounded pill button with calendar icon + "Dec 2024"
- **Navigation:** < and > circular buttons (40x40)
- **Position:** Fixed at bottom, above safe area
- **Border:** Top border (stone-200)

### 2.3 Color Palette

```typescript
const CALENDAR_COLORS = {
  // Heatmap intensity (streak-based)
  heat: {
    level0: 'transparent',      // No data
    level1: '#fee2e2',          // red-100 (1-2 days)
    level2: '#fecaca',          // red-200 (3-6 days)
    level3: '#fca5a5',          // red-300 (7-13 days)
    level4: '#f87171',          // red-400 (14-29 days)
    level5: '#ef4444',          // red-500 (30+ days)
  },

  // Calendar cells
  calendar: {
    completedBg: '#fee2e2',     // red-50
    completedDot: '#dc2626',    // red-600
    todayRing: '#dc2626',       // red-600
    otherMonth: '#d6d3d1',      // stone-300
    future: '#a8a29e',          // stone-400
    default: '#44403c',         // stone-700
  },

  // UI elements
  ui: {
    cardBg: '#ffffff',
    cardBorder: '#f5f5f4',      // stone-100
    badgeBg: '#f5f5f4',         // stone-100
    streakBadgeBg: '#fef2f2',   // red-50
    streakText: '#dc2626',      // red-600
  },
};
```

### 2.4 Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Habit name | 18px (text-lg) | Bold (700) | stone-900 |
| Description | 14px (text-sm) | Regular (400) | stone-500 |
| Month labels | 12px (text-xs) | Regular (400) | stone-400 |
| Day row labels | 12px (text-xs) | Regular (400) | stone-400 |
| Stats badges | 14px (text-sm) | Medium (500) | varies |
| Calendar header | 14px (text-sm) | Medium (500) | stone-500 |
| Calendar days | 16px (text-base) | Medium (500) | varies |
| Month picker | 16px (text-base) | Semibold (600) | stone-800 |

### 2.5 Spacing & Dimensions

```typescript
const DIMENSIONS = {
  // Header
  iconSize: 40,
  iconRadius: 12,            // rounded-xl
  closeButtonSize: 40,

  // Heatmap
  heatmapPadding: 16,        // p-4
  heatCellSize: 10,
  heatCellRadius: 2,
  heatCellGap: 3,
  dayLabelWidth: 24,         // "Tu", "Th", "Sa"

  // Stats row
  badgePaddingX: 12,         // px-3
  badgePaddingY: 6,          // py-1.5
  badgeRadius: 9999,         // rounded-full
  actionButtonSize: 36,

  // Calendar
  calendarCellSize: 44,
  calendarCellRadius: 12,    // rounded-xl
  calendarGapY: 4,           // gap-y-1
  completedDotSize: 6,
  todayRingWidth: 2,

  // Month nav
  monthPickerRadius: 9999,   // rounded-full
  navButtonSize: 40,
};
```

### 2.6 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Calendar cell tap | Scale 0.95 → 1.0 | 150ms | ease-out |
| Completion toggle | Fill scale 0 → 1 | 200ms | spring (damping: 12) |
| Dot appearance | Scale + fade in | 150ms | ease-out |
| Month transition | Fade + slide | 250ms | ease-in-out |
| Heatmap load | Stagger fade in | 50ms per column | ease-out |

### 2.7 Interactions

1. **Tap calendar cell** → Toggle completion (haptic: medium impact)
2. **Tap month picker** → Open month/year selector modal
3. **Tap < / >** → Navigate to previous/next month (haptic: light)
4. **Swipe calendar** → Navigate months (horizontal swipe gesture)
5. **Tap heatmap cell** → Show tooltip with date and streak info (optional)

---

## 3. Technical Architecture

### 3.1 New Component Structure

```
src/components/LoopCalendar/
├── LoopCalendar.tsx              # Main container
├── CompactHeatmap.tsx            # 6-month 3-row heatmap
├── CalendarStatsRow.tsx          # Frequency + streak badges
├── MonthCalendarGrid.tsx         # Traditional calendar
├── MonthNavigation.tsx           # Bottom navigation
├── CalendarDayCell.tsx           # Individual day cell
├── HeatmapCell.tsx               # Individual heatmap cell
├── utils.ts                      # Date calculations
├── types.ts                      # TypeScript interfaces
├── constants.ts                  # Colors, dimensions
└── index.ts                      # Barrel export
```

### 3.2 Props Interface

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

### 3.3 State Management

```typescript
// Internal state
const [selectedMonth, setSelectedMonth] = useState(new Date());
const [showMonthPicker, setShowMonthPicker] = useState(false);

// Derived data
const heatmapData = useMemo(() =>
  generateCompactHeatmap(completedDates, 6), // 6 months
  [completedDates]
);

const calendarDays = useMemo(() =>
  generateMonthGrid(selectedMonth, completedDates, habitCreatedAt),
  [selectedMonth, completedDates, habitCreatedAt]
);
```

### 3.4 Key Utility Functions

```typescript
// Generate 3-row heatmap data (Tu/Th/Sa or all days compressed)
function generateCompactHeatmap(
  completedDates: Set<string>,
  months: number,
  daysToShow?: ('Tu' | 'Th' | 'Sa')[]
): HeatmapRow[];

// Generate month calendar grid
function generateMonthGrid(
  month: Date,
  completedDates: Set<string>,
  habitCreatedAt?: number
): CalendarDay[][];

// Calculate heat intensity (1-5) based on streak position
function getHeatIntensity(
  date: string,
  completedDates: Set<string>
): 0 | 1 | 2 | 3 | 4 | 5;

// Navigate months
function addMonths(date: Date, amount: number): Date;
function isSameMonth(date1: Date, date2: Date): boolean;
```

---

## 4. Migration Plan

### 4.1 What to Remove

| Component | File | Reason |
|-----------|------|--------|
| `CalendarHeatmapWithViews` | `CalendarHeatmapWithViews.tsx` | Replaced by unified view |
| `ViewToggle` | `ViewToggle.tsx` | No longer needed |
| `WeekGrid` | `WeekGrid.tsx` | Consolidated into MonthCalendarGrid |
| `YearlyCalendarGrid` | `YearlyCalendarGrid.tsx` | Replaced by compact heatmap |
| `InsightCard` | `InsightCard.tsx` | Removed from calendar (can keep elsewhere) |
| `WeeklyPatternChart` | Referenced in calendar | Removed from this view |

### 4.2 What to Keep (Modified)

| Component | Changes |
|-----------|---------|
| `DayCell` | Adapt for new styling, keep animation logic |
| `CalendarGrid` | Rename to `MonthCalendarGrid`, update styling |
| `utils.ts` | Keep date functions, add new helpers |

### 4.3 Integration Point

```tsx
// In HabitDetailScreen.tsx
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

## 5. Accessibility

### 5.1 Requirements

- [ ] All interactive elements have `accessibilityRole`
- [ ] Calendar cells announce: "{Day name}, {Date}. {Completed/Not completed}"
- [ ] Heatmap cells have `accessibilityLabel` with date and streak info
- [ ] Month navigation announces current month on change
- [ ] Touch targets minimum 44x44px
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Supports screen reader navigation

### 5.2 Reduced Motion

- Skip stagger animations
- Instant state changes instead of spring animations
- No sliding month transitions

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to understand habit progress | < 2 seconds | User testing |
| Tap-to-toggle completion rate | > 90% success | Analytics |
| Month navigation usage | Track < / > vs picker | Analytics |
| User satisfaction | > 4/5 rating | Feedback |

---

## 7. Design Reference

### 7.1 Mockup File

**Path:** `.superdesign/design_iterations/calendar_loop_style_1.html`

Open in browser to view the full design:
```bash
open .superdesign/design_iterations/calendar_loop_style_1.html
```

### 7.2 Visual Checklist

When implementing, verify these match the mockup:

- [ ] Heatmap card has white bg, subtle border, rounded corners
- [ ] Month labels align above heatmap columns
- [ ] Day labels (Tu/Th/Sa) are left-aligned, gray
- [ ] Heat cells are 10x10px with 3px gap
- [ ] Stats row has two pills (Daily, streak) on left, two buttons on right
- [ ] Calendar cells are 44x44px with 12px radius
- [ ] Completed cells have pink bg + red dot
- [ ] Today has red ring (no fill if not completed)
- [ ] Month nav is at very bottom with calendar icon + date
- [ ] Overall color scheme is red/pink/white/stone

---

## Changelog

### v1.0 (2024-12-30)
- Initial specification
- Based on Loop Habit Tracker design
- Created mockup: `calendar_loop_style_1.html`
