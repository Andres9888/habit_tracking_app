# Binary GitHub-Style Calendar - Implementation Tasks

**Spec:** `docs/specs/habit-details-screen/progress/calendar-binary-github-style-spec.md`
**Mockup:** `.superdesign/design_iterations/calendar_github_style_binary_1.html`

---

## Phase 1: Core Components

### Task 1.1: Create component structure and types

- [ ] Create `src/components/BinaryHeatmap/` directory
- [ ] Create `types.ts` with interfaces:
  - `BinaryDay` (date, completed, isToday, isFuture, isBeforeCreation)
  - `BinaryHeatmapProps`
  - `TimeRange` type
- [ ] Create `constants.ts` with:
  - Cell dimensions (10x10px)
  - Gap sizes (3px)
  - Animation timing
- [ ] Create `index.ts` barrel export

**Acceptance:** TypeScript compiles with no errors

---

### Task 1.2: Implement grid generation utility

- [ ] Create `utils.ts` with `generateBinaryGrid()` function
- [ ] Support 3m, 6m, 1y time ranges
- [ ] Generate month labels with correct week indices
- [ ] Handle habit creation date (cells before = disabled)
- [ ] Handle future dates
- [ ] Write unit tests for grid generation

**Acceptance:** Grid generates correct number of weeks for each time range

---

### Task 1.3: Create BinaryCell component

- [ ] Create `BinaryCell.tsx`
- [ ] Implement 4 states: done, missed, today, future
- [ ] Use CSS variables for dynamic habit color
- [ ] Add staggered fade-in animation
- [ ] Add hover scale effect (web)
- [ ] Add tap feedback (mobile)
- [ ] Add accessibility label

**Acceptance:** Cells render correctly with all 4 states

---

### Task 1.4: Create TimeRangeToggle component

- [ ] Create `TimeRangeToggle.tsx`
- [ ] Implement 3m/6m/1y buttons
- [ ] Style active/inactive states per spec
- [ ] Add press animation
- [ ] Call `onTimeRangeChange` callback

**Acceptance:** Toggle switches between ranges with visual feedback

---

### Task 1.5: Create HeatmapLegend component

- [ ] Create `HeatmapLegend.tsx`
- [ ] Show "Missed" indicator (gray square)
- [ ] Show "Done" indicator (habit color square)
- [ ] Show completion percentage
- [ ] Use dynamic habit color

**Acceptance:** Legend displays correctly with dynamic color

---

## Phase 2: Grid Assembly

### Task 2.1: Create BinaryHeatmapGrid component

- [ ] Create `BinaryHeatmapGrid.tsx`
- [ ] Render 7 rows (S/M/T/W/T/F/S)
- [ ] Render day labels column
- [ ] Map weeks to cell columns
- [ ] Apply staggered animation delays

**Acceptance:** Full 7-row grid renders with correct layout

---

### Task 2.2: Add month labels row

- [ ] Render month labels above grid
- [ ] Position labels at correct week indices
- [ ] Handle edge cases (month spanning multiple weeks)

**Acceptance:** Month labels align with their starting weeks

---

### Task 2.3: Create HeatmapTooltip component

- [ ] Create `HeatmapTooltip.tsx`
- [ ] Show on hover (web) or long-press (mobile)
- [ ] Display date and status
- [ ] Position above cell with arrow
- [ ] Style per spec (dark background, white text)

**Acceptance:** Tooltip appears on interaction with correct content

---

## Phase 3: Main Container

### Task 3.1: Create BinaryHeatmap container

- [ ] Create `BinaryHeatmap.tsx`
- [ ] Compose: header, grid, legend
- [ ] Manage time range state
- [ ] Pass habit color as CSS variable
- [ ] Handle `onDayPress` callback

**Acceptance:** Full heatmap card renders with all sub-components

---

### Task 3.2: Add stats row

- [ ] Create stats row below heatmap card
- [ ] Show frequency badge ("Daily")
- [ ] Show streak badge with fire icon
- [ ] Add settings button

**Acceptance:** Stats row matches mockup layout

---

## Phase 4: Integration

### Task 4.1: Integrate with HabitDetailScreen

- [ ] Replace `CalendarHeatmapWithViews` with `BinaryHeatmap`
- [ ] Pass required props (habitId, completedDates, etc.)
- [ ] Connect to habit color from `habit.iconColor`
- [ ] Wire up day press handler

**Acceptance:** New heatmap renders in habit detail screen

---

### Task 4.2: Connect time range to data fetching

- [ ] Update data query to respect time range
- [ ] Fetch appropriate date range (3m/6m/1y)
- [ ] Optimize query performance

**Acceptance:** Changing time range updates displayed data

---

### Task 4.3: Wire up day toggle mutation

- [ ] Connect cell tap to toggle completion mutation
- [ ] Add optimistic update
- [ ] Handle error state
- [ ] Refresh heatmap on toggle

**Acceptance:** Tapping a cell toggles completion status

---

## Phase 5: Polish

### Task 5.1: Implement reduced motion support

- [ ] Check `prefers-reduced-motion` media query
- [ ] Disable staggered animation if reduced motion
- [ ] Disable hover scale if reduced motion

**Acceptance:** Animations respect user preference

---

### Task 5.2: Accessibility audit

- [ ] Verify all cells have accessibility labels
- [ ] Test with screen reader
- [ ] Verify color contrast (WCAG AA)
- [ ] Add focus indicators for keyboard navigation

**Acceptance:** Screen reader can navigate and announce all cells

---

### Task 5.3: Performance optimization

- [ ] Memoize cell components
- [ ] Virtualize grid if needed (for 1y view)
- [ ] Profile render performance
- [ ] Optimize re-renders on time range change

**Acceptance:** Smooth 60fps scrolling and transitions

---

### Task 5.4: Write tests

- [ ] Unit tests for grid generation
- [ ] Unit tests for cell state logic
- [ ] Component tests for BinaryHeatmap
- [ ] Integration test for day toggle

**Acceptance:** All tests pass

---

## Cleanup

### Task 6.1: Remove deprecated components

- [ ] Remove or deprecate `CalendarHeatmapWithViews`
- [ ] Remove intensity-based color utilities
- [ ] Remove `ViewToggle` component
- [ ] Update imports throughout codebase

**Acceptance:** No unused heatmap code remains

---

## Visual Verification Checklist

After implementation, verify against mockup:

- [ ] Binary cells: done = habit color, missed = gray
- [ ] No blur/glow effects
- [ ] Today cell has clean ring (no pulse)
- [ ] 7 rows with day labels
- [ ] Month labels aligned
- [ ] Time range toggle works
- [ ] Simple legend with percentage
- [ ] Stats row with badges
- [ ] Staggered load animation
- [ ] Tooltip on hover
- [ ] Dynamic habit color theming

---

## Dependencies

- `date-fns` for date calculations
- Existing `colors.ts` theme
- Existing habit tracking mutations

## Estimated Effort

| Phase   | Tasks | Complexity |
| ------- | ----- | ---------- |
| Phase 1 | 5     | Medium     |
| Phase 2 | 3     | Medium     |
| Phase 3 | 2     | Low        |
| Phase 4 | 3     | Medium     |
| Phase 5 | 4     | Low-Medium |
| Cleanup | 1     | Low        |

**Total:** 18 tasks
