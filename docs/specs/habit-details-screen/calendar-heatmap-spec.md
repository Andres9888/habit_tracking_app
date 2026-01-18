# Calendar Heatmap Specification

## Design

### Visual Mockup

```
┌─────────────────────────────────────────────────────┐
│  📅  Activity                          ◀ Dec 2025 ▶ │
├─────────────────────────────────────────────────────┤
│     S    M    T    W    T    F    S                 │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│    │  │ │██│ │██│ │░░│ │██│ │██│ │██│  Week 1      │
│    └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘              │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│    │██│ │██│ │██│ │░░│ │██│ │░░│ │██│  Week 2      │
│    └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘              │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│    │██│ │██│ │██│ │██│ │██│ │░░│ │██│  Week 3      │
│    └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘              │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ╔══╗ ┌┄┄┐              │
│    │██│ │██│ │██│ │░░│ │██│ ║✓ ║ │  │  Week 4      │
│    └──┘ └──┘ └──┘ └──┘ └──┘ ╚══╝ └┄┄┘              │
│                              ↑     ↑                │
│                            Today  Future            │
│                                                     │
│   ░░ = Empty    ██ = Completed    ✓ = Today Done    │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  ██ 17 days  •  85% this month              │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Cell States

| State | Visual | Background | Border |
|-------|--------|------------|--------|
| Completed | Solid fill | `emerald-500` | none |
| Empty (missed) | Light fill | `stone-100` | none |
| Today (pending) | Pulse animation | `amber-50` | `amber-400` 2px |
| Today (done) | Solid + border | `emerald-500` | `amber-400` 2px |
| Future | Dashed border | `stone-50` | `stone-200` dashed |
| Before habit created | Hidden | — | — |

### Color Theming

Following the design system from `stats-components-redesign.md`:

| Element | Color |
|---------|-------|
| Primary | `emerald-500` |
| Accent | `teal-500` |
| Gradient | `from-emerald-50/30 via-white to-teal-50/30` |
| Icon container | `bg-emerald-100` |
| Icon | `text-emerald-500` |

### Component Hierarchy

```
CalendarHeatmap/
├── index.ts
├── CalendarHeatmap.tsx       # Main container
├── CalendarHeader.tsx        # Title + month navigation
├── CalendarGrid.tsx          # Week rows container
├── DayCell.tsx               # Individual day cell
├── CalendarLegend.tsx        # Stats footer
├── types.ts                  # Interfaces
└── utils.ts                  # Date helpers
```

### Placement in HabitDetailScreen

```tsx
{/* Progress (Stats) */}
<StreakChainSection ... />

{/* NEW: Calendar Heatmap */}
<CalendarHeatmap
  habitId={habit._id}
  completedDates={completedDates}
  habitCreatedAt={habitCreatedAt}
  habitColor={habit.color}
/>

{/* Habit Strength */}
<Pressable ...>
```

---

## Props Interface

```typescript
interface CalendarHeatmapProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;  // YYYY-MM-DD format
  habitCreatedAt?: number;
  habitColor?: string;          // Hex color for theming
  onDayPress?: (date: string, completed: boolean) => void;
}

interface DayCellProps {
  date: string | null;          // null = padding cell
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  isBeforeCreated: boolean;
  habitColor?: string;
  onPress?: () => void;
}
```

---

## Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Cell entry | FadeIn + scale 0→1 | 200ms | spring |
| Cell stagger | delay = index × 10ms | — | — |
| Today pulse | scale 1↔1.05 | 1400ms | ease-in-out, infinite |
| Month transition | SlideInRight/SlideOutLeft | 200ms | ease-out |
| Cell press | scale 1→0.9→1 | 150ms | spring |

All animations respect `reduceMotion` accessibility setting.

---

## Mockup File

**Location:** `.superdesign/design_iterations/calendar_heatmap_1.html`

Open with: `open .superdesign/design_iterations/calendar_heatmap_1.html`

---

## Tasks

### Phase 1: Component Scaffolding

- [ ] **T1.1** Create `src/components/CalendarHeatmap/` directory structure
  - Create folder and all files listed in Component Hierarchy
  - Set up index.ts with exports

- [ ] **T1.2** Define types in `types.ts`
  - `CalendarHeatmapProps`
  - `DayCellProps`
  - `CalendarHeaderProps`
  - `CalendarGridProps`
  - `CalendarLegendProps`

- [ ] **T1.3** Create date utility functions in `utils.ts`
  - `generateMonthGrid(year, month)` → returns 2D array of date strings
  - `getMonthStats(completedDates, year, month)` → { completedCount, totalDays, percentage }
  - `isBeforeDate(dateStr, timestamp)` → boolean

### Phase 2: Core Components

- [ ] **T2.1** Implement `DayCell.tsx`
  - All 5 cell states (completed, empty, today pending, today done, future)
  - Press feedback animation
  - Pulse animation for today (pending)
  - Accessibility labels

- [ ] **T2.2** Implement `CalendarGrid.tsx`
  - Day-of-week header row (S M T W T F S)
  - Map weeks to rows of DayCell components
  - Staggered entry animation

- [ ] **T2.3** Implement `CalendarHeader.tsx`
  - Icon container with Calendar icon
  - "Activity" title
  - Month navigation (◀ MMM YYYY ▶)
  - Disable forward nav when at current month

- [ ] **T2.4** Implement `CalendarLegend.tsx`
  - Completed count with emerald square
  - Success rate percentage
  - Horizontal layout with dot separator

### Phase 3: Main Component

- [ ] **T3.1** Implement `CalendarHeatmap.tsx`
  - Gradient background container
  - State for current displayed month
  - Month navigation handlers
  - Compose Header, Grid, Legend

- [ ] **T3.2** Add month transition animation
  - SlideInRight when navigating forward
  - SlideInLeft when navigating backward
  - Use `key={monthKey}` for AnimatedView

### Phase 4: Integration

- [ ] **T4.1** Add CalendarHeatmap to HabitDetailScreen
  - Import component
  - Place after StreakChainSection
  - Pass required props (habitId, completedDates, habitCreatedAt, habitColor)

- [ ] **T4.2** Wire up onDayPress callback (optional)
  - Show tooltip with date details
  - Future: allow editing past dates

### Phase 5: Polish & Accessibility

- [ ] **T5.1** Add accessibility labels
  - Each cell: "{Day name}, {Month} {Date}, {Year}. {Completed/Not completed}"
  - Today cell: add "Today" prefix
  - Navigation buttons: "Previous month" / "Next month"

- [ ] **T5.2** Implement reduceMotion support
  - Skip pulse animation
  - Skip staggered entry
  - Skip month transitions

- [ ] **T5.3** Add haptic feedback
  - Light impact on cell press
  - Light impact on month navigation

### Phase 6: Testing

- [ ] **T6.1** Unit tests for utils.ts
  - `generateMonthGrid` with various months (Feb leap year, 31-day, etc.)
  - `getMonthStats` with edge cases
  - `isBeforeDate` boundary conditions

- [ ] **T6.2** Component tests
  - DayCell renders correct state for each variant
  - CalendarGrid generates correct number of rows
  - CalendarHeader navigation enables/disables correctly
  - CalendarHeatmap integrates all pieces

- [ ] **T6.3** Manual device testing
  - iOS: animations smooth, VoiceOver works
  - Android: animations smooth, TalkBack works
  - Both: haptics work, colors meet WCAG AA

---

## Dependencies

All dependencies already installed:
- `react-native-reanimated` — animations
- `date-fns` — date formatting
- `lucide-react-native` — Calendar, ChevronLeft, ChevronRight icons
- `expo-haptics` — haptic feedback

---

## Success Criteria

- [ ] Calendar displays current month with correct completion data
- [ ] Month navigation works (backward unlimited, forward stops at current)
- [ ] All 5 cell states render correctly
- [ ] Today cell pulses when pending
- [ ] Staggered entry animation on mount
- [ ] Month transition animation on navigation
- [ ] Animations respect reduceMotion
- [ ] All cells have proper accessibility labels
- [ ] Stats footer shows accurate completion count and percentage
- [ ] Component integrates seamlessly after StreakChainSection

---

## References

- Mockup: `.superdesign/design_iterations/calendar_heatmap_1.html`
- Design system: `docs/specs/habit-details-screen/stats-components-redesign.md`
- Similar pattern: StreakChainSection 7-day chain
