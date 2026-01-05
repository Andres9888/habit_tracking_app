# Habit Strength Redesign - Implementation Tasks

## Phase 1: Component Scaffolding

### Task 1.1: Create Component Directory Structure
**Priority**: High | **Effort**: 15 min

- [ ] Create `src/components/HabitStrengthSection/` directory
- [ ] Create `index.ts` with exports
- [ ] Create `types.ts` with interfaces
- [ ] Create `constants.ts` with sizing/color/animation values

**Files**:
- `src/components/HabitStrengthSection/index.ts`
- `src/components/HabitStrengthSection/types.ts`
- `src/components/HabitStrengthSection/constants.ts`

---

### Task 1.2: Implement TimeRangeToggle Component
**Priority**: High | **Effort**: 30 min

- [ ] Create pill-style toggle with 1M/1Y/All options
- [ ] Implement selection state with visual feedback
- [ ] Add haptic feedback on selection
- [ ] Support `reduceMotion` for transitions

**Props**:
```typescript
interface TimeRangeToggleProps {
  value: '1m' | '1y' | 'all';
  onChange: (value: '1m' | '1y' | 'all') => void;
}
```

**Files**:
- `src/components/HabitStrengthSection/TimeRangeToggle.tsx`

---

### Task 1.3: Implement StrengthHero Component
**Priority**: High | **Effort**: 45 min

- [ ] Create circular progress ring with SVG
- [ ] Implement animated fill using `react-native-reanimated`
- [ ] Add count-up animation for percentage number
- [ ] Display strength label (Strong/Developing/Weak)
- [ ] Show delta badge with trend icon

**Acceptance Criteria**:
- Ring animates from 0 to current value on mount
- Number counts up synchronized with ring
- Colors match strength level (emerald/amber/red)

**Files**:
- `src/components/HabitStrengthSection/StrengthHero.tsx`

---

## Phase 2: Chart Implementation

### Task 2.1: Implement StrengthChart Component
**Priority**: High | **Effort**: 1 hour

- [ ] Create full-width SVG container
- [ ] Generate bezier curve path from data points
- [ ] Add gradient fill under the curve
- [ ] Implement horizontal grid lines
- [ ] Add X-axis labels based on time range
- [ ] Create pulsing dot at current position

**Acceptance Criteria**:
- Chart fills available width
- Path has smooth bezier curves (Catmull-Rom to Bezier)
- Gradient fades from 25% to 2% opacity
- Grid lines are dashed and subtle

**Files**:
- `src/components/HabitStrengthSection/StrengthChart.tsx`

---

### Task 2.2: Add Chart Animations
**Priority**: Medium | **Effort**: 30 min

- [ ] Implement path draw animation (stroke-dashoffset)
- [ ] Add pulsing animation for current position dot
- [ ] Respect `useReducedMotion` preference
- [ ] Add fade-in for chart container

**Files**:
- `src/components/HabitStrengthSection/StrengthChart.tsx` (update)

---

## Phase 3: Stats & Integration

### Task 3.1: Implement StrengthStatsRow Component
**Priority**: High | **Effort**: 30 min

- [ ] Create three-column layout with dividers
- [ ] Display: Since Start, Last Month, Last Week
- [ ] Highlight positive changes in emerald
- [ ] Add fade-in animation

**Files**:
- `src/components/HabitStrengthSection/StrengthStatsRow.tsx`

---

### Task 3.2: Create Main HabitStrengthSection Container
**Priority**: High | **Effort**: 45 min

- [ ] Compose all sub-components
- [ ] Manage time range state
- [ ] Connect to `useHabitStrength` hook
- [ ] Handle loading/empty states
- [ ] Implement card styling with shadow

**Files**:
- `src/components/HabitStrengthSection/HabitStrengthSection.tsx`

---

### Task 3.3: Add Time Range Filtering to useHabitStrength
**Priority**: Medium | **Effort**: 30 min

- [ ] Extend hook to accept `timeRange` parameter
- [ ] Filter `strengthHistory` based on range
- [ ] Recalculate metrics for filtered data
- [ ] Memoize filtered results

**Files**:
- `src/hooks/useHabitStrength.ts` (update)

---

## Phase 4: Integration & Testing

### Task 4.1: Integrate into HabitDetailScreen
**Priority**: High | **Effort**: 20 min

- [ ] Import `HabitStrengthSection`
- [ ] Replace `HabitStrengthHistory` usage
- [ ] Verify props are passed correctly
- [ ] Test on device

**Files**:
- `src/screens/HabitDetailScreen.tsx`

---

### Task 4.2: Write Unit Tests
**Priority**: Medium | **Effort**: 1 hour

- [ ] Test `TimeRangeToggle` selection behavior
- [ ] Test `StrengthHero` with different strength levels
- [ ] Test `StrengthChart` path generation
- [ ] Test `StrengthStatsRow` formatting
- [ ] Test main component composition

**Files**:
- `src/components/HabitStrengthSection/__tests__/HabitStrengthSection.test.tsx`
- `src/components/HabitStrengthSection/__tests__/StrengthChart.test.tsx`

---

### Task 4.3: Accessibility Audit
**Priority**: Medium | **Effort**: 30 min

- [ ] Add `accessibilityRole` to interactive elements
- [ ] Add `accessibilityLabel` to chart with trend description
- [ ] Test with VoiceOver/TalkBack
- [ ] Verify color contrast (WCAG AA)

---

### Task 4.4: Performance Optimization
**Priority**: Low | **Effort**: 30 min

- [ ] Profile component render times
- [ ] Add `React.memo` where beneficial
- [ ] Ensure `useMemo` on expensive calculations
- [ ] Test on low-end device

---

## Phase 5: Cleanup

### Task 5.1: Deprecate Old Components
**Priority**: Low | **Effort**: 15 min

- [ ] Add deprecation notice to `HabitStrengthHistory`
- [ ] Update component index exports
- [ ] Remove unused imports from HabitDetailScreen

---

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Scaffolding | 3 | 1.5 hours |
| Phase 2: Chart | 2 | 1.5 hours |
| Phase 3: Stats & Integration | 3 | 1.75 hours |
| Phase 4: Testing | 4 | 2.5 hours |
| Phase 5: Cleanup | 1 | 15 min |
| **Total** | **13** | **~7.5 hours** |

## Dependencies

- `react-native-svg` (existing)
- `react-native-reanimated` (existing)
- `useHabitStrength` hook (existing)
- `date-fns` (existing)
