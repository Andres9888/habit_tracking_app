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
