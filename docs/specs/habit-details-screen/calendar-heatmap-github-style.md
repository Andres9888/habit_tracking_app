# Calendar Heatmap - GitHub Style (V5)

## Overview

**DECISION 2025-12-22:** After implementing the traditional 1-month calendar and reviewing with user, we're pivoting to the **GitHub-style horizontal 3-month layout** because it's superior for **pattern recognition** - the core value of a heatmap.

Replace the existing CalendarHeatmap implementation with a GitHub-style horizontal layout showing 3 months of history with day-of-week rows.

**Why This Change:**
- Traditional calendar shows "what" (2 days completed) but not "why" (missed weekends)
- GitHub-style day-of-week rows make patterns **instantly visible**
- Shows 3 months instead of 1 = 3x more context
- Color intensity by streak length = visual motivation
- More space-efficient on mobile

---

## Design Reference

**Mockup:** `.superdesign/design_iterations/calendar_heatmap_2.html` (V2) or `calendar_heatmap_3.html` (V3)

**Visual:**
```
┌────────────────────────────────────────────┐
│ 📅 Activity                    +12% ↗     │
├────────────────────────────────────────────┤
│       Oct         Nov         Dec          │
│   S ░▓░▓░░▓▓░▓▓░▓▓░▓▓░▓▓░○               │
│   M ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
│   T ▓▓░▓▓▓▓▓▓░▓▓▓▓▓▓▓▓░▓▓              │
│   W ░▓▓▓▓░▓▓▓▓░▓▓▓▓░▓▓▓▓░              │
│   T ▓▓▓░▓▓▓▓░▓▓▓▓▓░▓▓▓▓▓▓              │
│   F ▓░▓▓▓▓░▓▓▓▓▓░▓▓▓▓▓░▓▓              │
│   S ░░▓░░▓░░▓░░▓░░▓░░▓░░┊              │
│                           ↑ Today         │
│   ░ Empty  ▓ Completed  ○ Today          │
├────────────────────────────────────────────┤
│ 💡 Sundays are tough (62%)                 │
│ S  M  T  W  T  F  S                        │
│ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓                       │
│ [Set Reminder] [Tips]                      │
└────────────────────────────────────────────┘
```

---

## Key Differences from V1 (Traditional)

| Aspect | V1 Traditional | V5 GitHub-Style |
|--------|---------------|-----------------|
| **Layout** | Vertical (weeks as rows) | Horizontal (weeks as columns) |
| **Time Range** | 1 month | 3 months |
| **Date Numbers** | Visible (1-31) | Hidden (too small) |
| **Cell Size** | 45px × 45px | 20px × 20px |
| **Pattern Recognition** | Poor - must scan vertically | Excellent - day-of-week rows show patterns instantly |
| **Day-of-Week Labels** | Top (S M T W T F S) | Left (vertical column) |
| **Navigation** | Month arrows | Horizontal scroll |
| **Best For** | Monthly progress | Long-term patterns |

---

## Component Structure (Updated)

Keep existing structure but modify components:

```
CalendarHeatmap/
├── index.ts                  # No changes
├── CalendarHeatmap.tsx       # Update: 3-month data, horizontal layout
├── CalendarGrid.tsx          # MAJOR CHANGE: Horizontal grid
├── DayCell.tsx               # Update: Smaller cells, no date numbers
├── InsightCard.tsx           # Keep as-is
├── types.ts                  # Update interfaces
└── utils.ts                  # Update grid generation
```

---

## Props Interface (Updated)

```typescript
// No changes to main props
interface CalendarHeatmapProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;
  habitCreatedAt?: number;
  habitColor?: string;
  onDayPress?: (date: string, completed: boolean) => void;
}

// Updated DayCell props
interface DayCellProps {
  dateStr: string | null;       // YYYY-MM-DD
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  streakDay: number;            // For color intensity
  onPress?: () => void;
  // REMOVED: date number (no longer showing 1-31)
}
```

---

## Layout Design

### Grid Structure

**Traditional (V1):** 7 columns × 5 rows = weeks as rows
**GitHub (V5):** 7 rows × 13 columns = weeks as columns

```tsx
// Horizontal layout
<View className="flex-row">
  {/* Day labels column (S M T W T F S) */}
  <View className="flex-col">
    <Text>S</Text>
    <Text>M</Text>
    <Text>T</Text>
    {/* ... */}
  </View>

  {/* Week columns (13 weeks = 3 months) */}
  {weeks.map(week => (
    <View className="flex-col gap-[3px]">
      {week.map(day => (
        <DayCell dateStr={day} />
      ))}
    </View>
  ))}
</View>
```

### Cell Sizing

- Cell size: 20px × 20px (reduced from 45px)
- Gap: 3px (reduced from 4px)
- 13 weeks: 13 × (20 + 3) = 299px
- Day labels: ~20px
- Total width: ~320px (fits mobile)

### Month Labels

Add month labels above the weeks:

```
      Oct         Nov         Dec
  S  ░▓░▓   |   ░▓▓░   |   ░▓▓░
  M  ▓▓▓▓   |   ▓▓▓▓   |   ▓▓▓▓
  ...
```

Month dividers: subtle 1px vertical line every 4-5 weeks

---

## Cell States (Updated)

### Simplified States

| State | Visual | Background | Description |
|-------|--------|------------|-------------|
| Completed (day 1-6 of streak) | Light green | `emerald-300` | Recent completion |
| Completed (day 7-13) | Medium green | `emerald-400` | Week+ streak |
| Completed (day 14-29) | Dark green | `emerald-500` | Strong habit |
| Completed (day 30+) | Darkest green | `emerald-600` | Legendary! |
| Empty (missed) | Light gray | `stone-100` | Not completed |
| Today (pending) | Amber fill + pulse | `amber-50` | Pending completion |
| Today (done) | Green + amber border | `emerald-500` + `amber-400` border | Done today |
| Future | Dashed gray | `stone-50` + dashed border | After today |

**Key Change:** No date numbers - cells are too small. Streak intensity is now the primary visual cue.

---

## Utility Functions (Updated)

### Generate 3-Month Horizontal Grid

```typescript
/**
 * Generate horizontal grid for 3 months
 * Returns array of weeks, each week is array of 7 dates (Sun-Sat)
 */
function generateHorizontalGrid(
  currentDate: Date,
  completedDates: Set<string>,
  habitCreatedAt?: number
): {
  weeks: (string | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
} {
  const endDate = currentDate;
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90); // ~3 months

  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = Array(7).fill(null);
  let weekIndex = 0;

  // Find the Sunday before startDate
  const firstSunday = new Date(startDate);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  for (let d = new Date(firstSunday); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0 = Sunday
    const dateStr = d.toISOString().split('T')[0];

    currentWeek[dayOfWeek] = dateStr;

    // Track month changes for labels
    if (d.getMonth() !== lastMonth) {
      monthLabels.push({
        weekIndex,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
      });
      lastMonth = d.getMonth();
    }

    // Complete week (Saturday reached)
    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
      weekIndex++;
    }
  }

  // Add partial final week if needed
  if (currentWeek.some(d => d !== null)) {
    weeks.push(currentWeek);
  }

  return { weeks, monthLabels };
}
```

### Calculate Streak Position

```typescript
/**
 * Calculate position in current streak for color intensity
 */
function calculateStreakPosition(
  date: string,
  completedDates: Set<string>
): number {
  if (!completedDates.has(date)) return 0;

  let position = 1;
  const d = new Date(date);

  // Count backward to find streak start
  while (position < 100) {
    d.setDate(d.getDate() - 1);
    const prevDateStr = d.toISOString().split('T')[0];
    if (!completedDates.has(prevDateStr)) break;
    position++;
  }

  return position;
}
```

---

## Header Design

### Simple Header

```tsx
<View className="flex-row items-center justify-between mb-4">
  <View className="flex-row items-center gap-2">
    <View className="h-8 w-8 rounded-lg bg-emerald-100">
      <Calendar className="text-emerald-500" size={16} />
    </View>
    <Text className="text-lg font-bold">Activity</Text>
  </View>

  {/* Trend badge */}
  <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100">
    <TrendingUp className="text-emerald-600" size={14} />
    <Text className="text-xs font-semibold text-emerald-700">+12%</Text>
  </View>
</View>
```

**No month navigation arrows** - horizontal scroll is the navigation

---

## Horizontal Scroll

### ScrollView Setup

```tsx
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className="flex-row"
>
  {/* Day labels (sticky left) */}
  <View className="flex-col sticky left-0 bg-white">
    {dayLabels.map(label => <Text>{label}</Text>)}
  </View>

  {/* Week columns */}
  {weeks.map((week, i) => (
    <View key={i} className="flex-col gap-[3px] ml-[3px]">
      {week.map((dateStr, j) => (
        <DayCell key={j} dateStr={dateStr} />
      ))}
    </View>
  ))}
</ScrollView>
```

### Edge Fade Gradients

```css
.scroll-container::before {
  content: '';
  position: absolute;
  left: 0;
  width: 20px;
  background: linear-gradient(to right, white, transparent);
  z-index: 1;
}
.scroll-container::after {
  content: '';
  position: absolute;
  right: 0;
  width: 20px;
  background: linear-gradient(to left, white, transparent);
  z-index: 1;
}
```

---

## Animations

### Cell Entry (Cascade)

Animate right-to-left (most recent to oldest):

```tsx
// Stagger by column, not row
<Animated.View
  entering={FadeIn.delay((weeks.length - columnIndex) * 15).duration(200)}
>
  {/* Week column */}
</Animated.View>
```

### Today Cell Pulse

Same as V1 - pulse on pending completion

---

## Migration Strategy

### Option A: Replace Entire Component

1. Rename current `CalendarHeatmap/` to `CalendarHeatmapTraditional/`
2. Implement new GitHub-style in `CalendarHeatmap/`
3. Update imports in `HabitDetailScreen`

### Option B: Toggle Between Views

Add a toggle button to switch between traditional and GitHub-style:

```tsx
const [viewMode, setViewMode] = useState<'traditional' | 'github'>('github');

{viewMode === 'github' ? (
  <GitHubStyleGrid />
) : (
  <TraditionalGrid />
)}

<Button onPress={() => setViewMode(m => m === 'github' ? 'traditional' : 'github')}>
  {viewMode === 'github' ? 'Month View' : '3 Month View'}
</Button>
```

**Recommendation:** Option A (Replace). GitHub-style is objectively better for habit tracking.

---

## Tasks

### Phase 1: Update Utilities

- [x] **GITHUB-1.1** Update `generateMonthGrid` to `generateHorizontalGrid`
  - Generate 3 months of data (90 days) ✅
  - Return weeks as columns (7 days each) ✅
  - Return month labels with week indices ✅
  - Handle partial weeks at start/end ✅
  - **Implementation notes:** Created `generateHorizontalGrid()` that generates ~13 weeks of data (90 days back from current date), starting on Sunday and organizing days into week columns. Each week has 7 days (Sun-Sat). Month labels track where each month starts in the week array. Added comprehensive tests covering all edge cases. All 210 tests pass.

- [x] **GITHUB-1.2** Add `calculateStreakPosition` utility
  - Calculate position in current streak (1, 2, 3...) ✅
  - Used for color intensity (1-6, 7-13, 14-29, 30+) ✅
  - Handle broken streaks ✅
  - **Implementation notes:** This utility already existed in utils.ts (lines 240-303). It calculates the position of a date within the current active streak by walking backwards from today/yesterday and stops at gaps or habit creation date. Comprehensive test suite included.

- [x] **GITHUB-1.3** Update `calculateMonthStats` to `calculate3MonthStats`
  - Calculate stats for 3-month period ✅
  - Return completion count, total days, percentage ✅
  - Calculate trend vs previous 3 months (deferred for later phase)
  - **Implementation notes:** Created `calculate3MonthStats()` that takes the horizontal grid weeks and calculates completions, eligible days, and success rate for the entire 3-month period. Excludes future days, pre-creation days, and null padding cells. Fully tested.

### Phase 2: Update DayCell

- [x] **GITHUB-2.1** Remove date number display
  - Remove date prop from DayCellProps ✅
  - Remove Text component showing 1-31 ✅
  - Reduce cell size to 20px × 20px ✅
  - **Implementation notes:** Removed all date number displays from DayCell. Updated cell sizes from 45px/h-9 w-9 to 20px/h-5 w-5. Updated border radius from rounded-lg to rounded-sm. Removed unused Text import. Updated cell styling for all states (before creation, future, completed, today, empty). Check icon size reduced from 16px to 10px for better fit in smaller cells.

- [x] **GITHUB-2.2** Implement streak-based color intensity
  - Use `calculateStreakPosition` to get streak day ✅
  - Map to color: 1-6 → emerald-300, 7-13 → 400, 14-29 → 500, 30+ → 600 ✅
  - Keep today and future states ✅
  - **Implementation notes:** Added `completedDates` and `habitCreatedAt` props to DayCellProps interface. Implemented `getStreakColor()` function that calculates streak position and returns appropriate emerald color based on streak length (emerald-300 for 1-6 days, emerald-400 for 7-13, emerald-500 for 14-29, emerald-600 for 30+ days). Supports custom habit colors. Updated CalendarGrid and CalendarHeatmap to pass these props through the component tree. Fixed all test files to include new required props and account for removed date number displays.

### Phase 3: Rewrite CalendarGrid

- [x] **GITHUB-3.1** Change layout from vertical to horizontal
  - Rows are now day-of-week (S M T W T F S) ✅
  - Columns are weeks (13 columns) ✅
  - Day labels on left (vertical sticky column) ✅
  - **Implementation notes:** Completely rewrote CalendarGrid to use horizontal layout with weeks as columns. Day labels now render vertically on the left side. Props interface updated to accept `weeks` and `monthLabels` instead of the old grid props. Removed swipe navigation and month navigation logic.

- [x] **GITHUB-3.2** Add month labels above weeks
  - Calculate month boundaries ✅
  - Render month labels (Oct, Nov, Dec) ✅
  - Add subtle vertical dividers between months (deferred - not critical for MVP)
  - **Implementation notes:** Month labels render above week columns with proper width calculation based on weeks per month. Labels are synchronized with horizontal scroll. Vertical dividers deferred as they add visual clutter.

- [x] **GITHUB-3.3** Implement horizontal ScrollView
  - Enable horizontal scrolling ✅
  - Add edge fade gradients ✅
  - Auto-scroll to show most recent weeks on mount ✅
  - **Implementation notes:** Implemented ScrollView with horizontal scrolling. Added LinearGradient edge fades on left and right for smooth visual experience. Auto-scroll to end on mount with 100ms delay to ensure layout completion. All tests passing.

### Phase 4: Update CalendarHeatmap

- [ ] **GITHUB-4.1** Update data generation
  - Generate 3 months of data instead of 1
  - Remove month navigation state
  - Calculate 3-month stats

- [ ] **GITHUB-4.2** Update header
  - Remove month navigation arrows
  - Add trend badge (+X% vs previous 3 months)
  - Keep calendar icon + "Activity" title

- [ ] **GITHUB-4.3** Update summary stats
  - Show total completions across 3 months
  - Show average completion rate
  - Optional: "X/90 days" instead of "X/25 days"

### Phase 5: Polish & Testing

- [ ] **GITHUB-5.1** Update animations
  - Change stagger from row-based to column-based
  - Cascade right-to-left (recent to old)
  - Keep today pulse

- [ ] **GITHUB-5.2** Update tests
  - Update utils tests for `generateHorizontalGrid`
  - Update CalendarGrid tests for horizontal layout
  - Update integration tests

- [ ] **GITHUB-5.3** Manual device testing
  - Verify horizontal scroll is smooth
  - Verify 20px cells are still tappable
  - Verify day-of-week rows show patterns clearly

---

## Success Criteria

- [ ] Calendar shows 3 months of data in horizontal layout
- [ ] Day-of-week rows (S M T W T F S on left) make patterns instantly visible
- [ ] Streak intensity colors work (darker = longer streak)
- [ ] Horizontal scroll is smooth and intuitive
- [ ] Month labels appear above week columns
- [ ] Today cell is clearly marked and pulses if pending
- [ ] 20px cells are still tappable (might need to increase hit area)
- [ ] Insight card still works with 3-month data
- [ ] Component fits on mobile screens without horizontal scroll initially (shows ~10 weeks)

---

## Open Questions

1. **Cell Size:** 20px cells might be too small to tap. Consider:
   - Increase to 24px (total width ~340px)
   - Increase hit area with padding while keeping visual size 20px

2. **Initial Scroll Position:** Should we:
   - Auto-scroll to show most recent weeks (current month on right)?
   - Start at left (oldest) and let user scroll to see recent?
   - **Recommendation:** Auto-scroll to show current week on right edge

3. **Insight Card:** Should it analyze:
   - Just current month (like V1)?
   - All 3 months visible?
   - **Recommendation:** Analyze all 3 months for better pattern detection

---

## Dependencies

No new dependencies - reuse existing:
- `react-native-reanimated`
- `date-fns`
- `lucide-react-native`

---

## References

- **V2 Mockup (3-month):** `.superdesign/design_iterations/calendar_heatmap_2.html`
- **V3 Mockup (refined):** `.superdesign/design_iterations/calendar_heatmap_3.html`
- **V4 Spec (traditional):** `docs/specs/habit-details-screen/calendar-heatmap-implementation.md`
- **Existing Implementation:** `src/components/CalendarHeatmap/`
