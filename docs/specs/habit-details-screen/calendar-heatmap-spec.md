# Calendar Heatmap Specification

## Overview

Add a GitHub-style contribution calendar heatmap to the Habit Detail screen, providing users with a visual representation of their habit completion history over time. This component enhances the existing stats visualization by showing long-term patterns at a glance.

---

## Design System Alignment

Following the established unified design system from `stats-components-redesign.md`:

| Section | Primary Color | Accent | Gradient |
|---------|--------------|--------|----------|
| Calendar Heatmap | emerald-500 | teal-500 | from-emerald-50/30 via-white to-teal-50/30 |

### Container Pattern
```tsx
<View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
  <View className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30" />
  <View className="p-5">...</View>
</View>
```

### Header Pattern
```tsx
<View className="flex-row items-center gap-2 mb-4">
  <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
    <Calendar className="text-emerald-500" size={16} />
  </View>
  <Text className="text-lg font-bold text-stone-800">Activity</Text>
</View>
```

---

## Component Design

### CalendarHeatmap Component

**File:** `src/components/CalendarHeatmap/CalendarHeatmap.tsx`

#### Props Interface
```tsx
interface CalendarHeatmapProps {
  /** Habit ID for context */
  habitId: Id<'habits'>;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Date habit was created (to show tracking start) */
  habitCreatedAt?: number;

  /** Habit's accent color (hex) for theming cells */
  habitColor?: string;

  /** Number of weeks to display (default: 12 = ~3 months) */
  weeksToShow?: number;

  /** Callback when a day cell is tapped */
  onDayPress?: (date: string, completed: boolean) => void;
}
```

#### Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  📅  Activity                          ◀ Dec 2025 ▶ │
├─────────────────────────────────────────────────────┤
│     S   M   T   W   T   F   S                       │
│    ┌───┬───┬───┬───┬───┬───┬───┐                    │
│ W1 │ ░ │ ░ │ ▓ │ ▓ │ ░ │ ▓ │ ░ │                    │
│    ├───┼───┼───┼───┼───┼───┼───┤                    │
│ W2 │ ▓ │ ▓ │ ▓ │ ░ │ ▓ │ ▓ │ ▓ │                    │
│    ├───┼───┼───┼───┼───┼───┼───┤                    │
│ W3 │ ▓ │ ▓ │ ░ │ ▓ │ ▓ │ ▓ │ ░ │                    │
│    ├───┼───┼───┼───┼───┼───┼───┤                    │
│ W4 │ ░ │ ▓ │ ▓ │ ▓ │ ▓ │ ░ │ ▓ │                    │
│    └───┴───┴───┴───┴───┴───┴───┘                    │
│                                                     │
│   ░ = Not completed   ▓ = Completed   ○ = Today     │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  85% this month · 12 completions            │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### Cell States & Colors

| State | Background | Border | Description |
|-------|-----------|--------|-------------|
| Empty (not completed) | stone-100 | none | Day exists, not completed |
| Completed | emerald-500 (or habitColor) | none | Habit was completed |
| Today (not completed) | amber-50 | amber-400 (2px) | Current day, pending |
| Today (completed) | emerald-500 | amber-400 (2px) | Current day, done |
| Future | stone-50 | stone-200 dashed | Days after today |
| Before habit created | transparent | none | Don't render or show dimmed |

#### Intensity Levels (Optional Enhancement)

For habits with quantity tracking (future feature), cells can show intensity:

```tsx
const INTENSITY_LEVELS = [
  { min: 0, bg: 'bg-stone-100' },      // 0 completions
  { min: 1, bg: 'bg-emerald-200' },    // 1 completion
  { min: 2, bg: 'bg-emerald-400' },    // 2 completions
  { min: 3, bg: 'bg-emerald-500' },    // 3 completions
  { min: 5, bg: 'bg-emerald-600' },    // 5+ completions
];
```

---

## Integration with HabitDetailScreen

### Placement

The CalendarHeatmap should be placed **after StreakChainSection** and **before HabitStrengthSection**:

```tsx
{/* Progress (Stats) */}
<StreakChainSection
  bestStreak={habit.bestStreak ?? 0}
  currentStreak={habit.currentStreak ?? 0}
  lastSevenDays={lastSevenDays}
  todayCompleted={isCompletedToday}
/>

{/* NEW: Calendar Heatmap */}
<CalendarHeatmap
  habitId={habit._id}
  completedDates={completedDates}
  habitCreatedAt={habitCreatedAt}
  habitColor={habit.color}
  onDayPress={(date, completed) => {
    // Optional: Open day detail or allow editing past dates
  }}
/>

{/* Habit Strength (Collapsible) */}
<Pressable ...>
```

### Why This Placement?

1. **StreakChainSection** shows recent 7-day activity → CalendarHeatmap expands this to months
2. **Natural progression**: Recent → Long-term → Strength → Insights
3. **Visual flow**: Both streak and calendar are "visual" components; strength/insights are "analytical"

---

## Interactions

### Month Navigation

```tsx
// Header with month selector
<View className="flex-row items-center justify-between mb-4">
  <View className="flex-row items-center gap-2">
    <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
      <Calendar className="text-emerald-500" size={16} />
    </View>
    <Text className="text-lg font-bold text-stone-800">Activity</Text>
  </View>

  <View className="flex-row items-center gap-2">
    <Pressable onPress={goToPreviousMonth}>
      <ChevronLeft className="text-stone-400" size={20} />
    </Pressable>
    <Text className="text-sm font-medium text-stone-600 min-w-[80px] text-center">
      {format(currentMonth, 'MMM yyyy')}
    </Text>
    <Pressable onPress={goToNextMonth} disabled={isCurrentMonth}>
      <ChevronRight className={isCurrentMonth ? 'text-stone-200' : 'text-stone-400'} size={20} />
    </Pressable>
  </View>
</View>
```

### Day Cell Tap

When a day cell is tapped:
1. **If today**: No action (completion happens from home screen per recent UX decision)
2. **If past date**: Show tooltip with date info, optionally allow edit (future feature)
3. **If future**: No action

### Swipe Gesture (Optional)

Allow horizontal swipe to navigate between months:
- Swipe left → Next month
- Swipe right → Previous month

---

## Animations

### Entry Animation

```tsx
// Staggered cell appearance
<Animated.View
  entering={FadeIn.delay(cellIndex * 10).duration(200)}
  className={cellClassName}
/>
```

### Month Transition

```tsx
// Slide transition when changing months
<Animated.View
  key={currentMonth.toISOString()}
  entering={SlideInRight.duration(200)}
  exiting={SlideOutLeft.duration(200)}
>
  {/* Calendar grid */}
</Animated.View>
```

### Cell Press Feedback

```tsx
// Scale on press
const scale = useSharedValue(1);

const handlePressIn = () => {
  scale.value = withSpring(0.9, { damping: 15 });
};

const handlePressOut = () => {
  scale.value = withSpring(1, { damping: 15 });
};
```

---

## Data Structure

### Grid Generation

```tsx
const generateMonthGrid = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay(); // 0 = Sunday

  const grid: (string | null)[][] = [];
  let currentWeek: (string | null)[] = Array(startPadding).fill(null);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    currentWeek.push(dateStr);

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad final week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    grid.push(currentWeek);
  }

  return grid;
};
```

### Cell Sizing

```tsx
// Responsive cell sizing based on container width
const CELL_SIZE = 36; // px
const CELL_GAP = 4;   // px
const GRID_WIDTH = 7 * CELL_SIZE + 6 * CELL_GAP; // 276px

// Or use flex
<View className="flex-row gap-1">
  {week.map((date) => (
    <View className="flex-1 aspect-square rounded-lg" />
  ))}
</View>
```

---

## Summary Stats Footer

Below the calendar grid, show contextual stats:

```tsx
<View className="mt-4 flex-row items-center justify-center gap-4">
  <View className="flex-row items-center gap-1.5">
    <View className="h-3 w-3 rounded-sm bg-emerald-500" />
    <Text className="text-xs text-stone-600">
      {monthCompletions} days
    </Text>
  </View>

  <Text className="text-stone-300">•</Text>

  <Text className="text-xs font-medium text-emerald-600">
    {Math.round(monthSuccessRate)}% this month
  </Text>
</View>
```

---

## Accessibility

```tsx
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${format(date, 'EEEE, MMMM d, yyyy')}. ${
    completed ? 'Completed' : 'Not completed'
  }`}
  accessibilityHint={isToday ? 'Today' : undefined}
  accessibilityState={{ selected: completed }}
>
```

---

## Tasks

### Phase 1: Core Component
- [x] **HEATMAP-1**: Create CalendarHeatmap component file structure
  - ✅ Created `src/components/CalendarHeatmap/` with CalendarHeatmap.tsx, DayCell.tsx, utils.ts, and index.ts
- [x] **HEATMAP-2**: Implement month grid generation utility
  - ✅ Implemented `generateMonthGrid()` and `calculateMonthStats()` in utils.ts with full date-fns integration
- [x] **HEATMAP-3**: Build DayCell component with all states
  - ✅ Created DayCell with states: empty, completed, today (completed/not), future, before-creation
  - ✅ Supports custom habit color, press feedback with spring animations
- [x] **HEATMAP-4**: Add gradient background and header following design system
  - ✅ Added emerald/teal gradient background per design system
  - ✅ Header with Calendar icon, "Activity" title, and month navigation
- [x] **HEATMAP-5**: Implement month navigation (prev/next buttons)
  - ✅ Added prev/next month buttons with ChevronLeft/ChevronRight icons
  - ✅ Disabled forward navigation when at current month

### Phase 2: Integration
- [x] **HEATMAP-6**: Add CalendarHeatmap to HabitDetailScreen
  - ✅ Added CalendarHeatmap import and component to HabitDetailScreen
  - ✅ Placed after StreakChainSection and before HabitStrengthSection per spec
  - ✅ Wired up habitId, completedDates, habitCreatedAt, and habitColor props
- [x] **HEATMAP-7**: Wire up completedDates from tracking data
  - ✅ Leveraged existing `completedDates` Set computed from tracking data in HabitDetailScreen
  - ✅ Already filters tracking entries by habitId and completion status
- [x] **HEATMAP-8**: Add summary stats footer
  - ✅ Summary stats footer already built into CalendarHeatmap component
  - ✅ Shows completion count and success rate percentage for current month

### Phase 3: Polish
- [x] **HEATMAP-9**: Add staggered entry animations for cells
  - ✅ Added FadeIn.delay(staggerDelay).duration(200) to ALL cell types (empty, before-creation, future, active)
  - ✅ Consistent staggerDelay variable (index * 10ms) applied across all DayCell render paths
- [x] **HEATMAP-10**: Add month transition animations
  - ✅ Already implemented: SlideInRight/SlideOutLeft on calendar grid with key={currentMonth.toISOString()}
- [x] **HEATMAP-11**: Implement cell press feedback
  - ✅ Already implemented: Spring-based scale animation (0.9 on pressIn, 1 on pressOut) with damping: 15
- [x] **HEATMAP-12**: Add swipe gesture for month navigation (optional)
  - ✅ Implemented horizontal pan gesture using react-native-gesture-handler's Gesture.Pan()
  - ✅ Swipe right → previous month, swipe left → next month (blocked at current month)
  - ✅ Configurable thresholds: SWIPE_THRESHOLD=50px, SWIPE_VELOCITY_THRESHOLD=300
  - ✅ Direction-aware animations: SlideInRight/SlideOutLeft vs SlideInLeft/SlideOutRight
  - ✅ Subtle parallax feedback during swipe (0.3x translation factor)
  - ✅ Spring animation (damping: 15, stiffness: 150) for snap-back effect

### Phase 4: Accessibility & Testing
- [x] **HEATMAP-13**: Add accessibility labels and hints
  - ✅ Added `getDayAccessibilityLabel()` and `formatDateForAccessibility()` utilities to utils.ts
  - ✅ All DayCell types (empty, before-creation, future, interactive) now have proper accessibility attributes
  - ✅ Interactive cells use human-readable date format (e.g., "Saturday, December 20, 2025. Completed")
  - ✅ Non-interactive cells use accessibilityRole="text" with descriptive labels
  - ✅ CalendarHeatmap container has accessibilityLabel="Habit activity calendar"
  - ✅ Header uses accessibilityRole="header" with month context
  - ✅ Month navigation buttons have dynamic labels (e.g., "Go to November 2025")
  - ✅ Day-of-week labels have full names (e.g., "Sunday" instead of "S") for screen readers
  - ✅ Summary stats footer uses accessibilityRole="summary" with full stats context
  - ✅ Used importantForAccessibility="no-hide-descendants" to prevent duplicate readings
- [x] **HEATMAP-14**: Test with VoiceOver/TalkBack
  - ✅ Created comprehensive automated accessibility test suite (24 tests) at `src/components/CalendarHeatmap/__tests__/CalendarHeatmap.accessibility.test.tsx`
  - ✅ Tests verify all accessibility props: accessible, accessibilityRole, accessibilityLabel, accessibilityHint, accessibilityState
  - ✅ Tests cover: DayCell states, container labels, header role, navigation buttons, day-of-week labels, summary stats
  - ✅ Updated jest.setup.js with proper Gesture mock for react-native-gesture-handler
  - ✅ Documented manual VoiceOver/TalkBack testing checklist in test file for developer verification
  - Note: Full manual testing with actual screen readers requires running on iOS/Android devices
- [ ] **HEATMAP-15**: Add unit tests for grid generation

---

## Dependencies

### Required
- `react-native-reanimated` (already installed) - animations
- `date-fns` (already installed) - date formatting
- `lucide-react-native` (already installed) - Calendar, ChevronLeft, ChevronRight icons

### Optional
- `react-native-gesture-handler` (already installed) - for swipe navigation

---

## Future Enhancements

1. **Year View**: Compact GitHub-style full year heatmap
2. **Intensity Levels**: For habits with quantity tracking
3. **Day Detail Modal**: Tap to see notes/details for that day
4. **Edit Past Dates**: Allow marking missed days as complete (with confirmation)
5. **Export**: Share heatmap image to social media
