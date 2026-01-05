# Instant Toggle Calendar - Implementation Tasks

## Task Status Legend
- [x] Completed
- [ ] Pending
- [~] In Progress
- [!] Blocked

---

## Phase 1: Core Infrastructure

### 1.1 Animation System Setup
- [x] Add Reanimated imports (withSequence, withDelay, withTiming)
- [x] Create SharedValues for completion state (fillScale, checkScale, checkRotation)
- [x] Implement `playCompletionAnimation()` callback
- [x] Implement `playUncompletionAnimation()` callback
- [x] Add `useReduceMotion` hook integration

### 1.2 State Synchronization
- [x] Add `instantToggle` prop to DayCell
- [x] Implement useEffect for backend state sync
- [x] Handle animation state reconciliation after backend update
- [x] Test optimistic UI with delayed backend responses

### 1.3 Haptic Feedback
- [x] Upgrade from `selectionAsync` to `impactAsync(Medium)`
- [x] Verify haptic timing (fires before animation)
- [x] Test on physical device

---

## Phase 2: DayCell Component (Primary)

### 2.1 Visual Enhancements
- [x] Add animated fill background layer
- [x] Add animated checkmark with rotation
- [x] Layer z-ordering (fill behind, check in front)
- [x] Dynamic opacity based on animation progress

### 2.2 Today Indicator
- [x] Increase pulse scale (1.0 → 1.5)
- [x] Increase pulse opacity (0.3 → 0.8)
- [x] Add amber shadow glow effect
- [x] Make pulse interruptible on completion

### 2.3 Cell Size System
- [x] Define `CellSize` type ('compact' | 'comfortable' | 'large')
- [x] Create `CELL_SIZES` configuration object
- [x] Apply dynamic sizing to cell dimensions
- [x] Scale checkmark size proportionally

### 2.4 Accessibility
- [x] Update `accessibilityLabel` with completion state
- [x] Add `accessibilityHint` based on toggle mode
- [x] Set `accessibilityState.selected` property
- [x] Test with VoiceOver/TalkBack

---

## Phase 3: Grid Components Consistency

### 3.1 WeekGrid Updates
- [x] Add `instantToggle` prop to WeekGridProps
- [x] Add animation SharedValues to WeekDayCell
- [x] Implement completion/un-completion animations
- [x] Add useEffect for state sync
- [x] Update haptic to impactAsync
- [x] Pass instantToggle to child cells

### 3.2 MonthGrid Updates
- [x] Add `instantToggle` prop to MonthGridProps
- [x] Add animation SharedValues to MonthDayCell
- [x] Implement completion/un-completion animations
- [x] Add useEffect for state sync
- [x] Update haptic to impactAsync
- [x] Pass instantToggle to child cells

### 3.3 CalendarGrid Updates
- [x] Add `instantToggle` prop passthrough
- [x] Forward prop to DayCell components
- [x] Verify cellSize prop handling

### 3.4 YearlyCalendarGrid
- [ ] Evaluate need for instant toggle (currently read-only)
- [ ] Consider performance impact of 365 animated cells
- **Decision**: Keep year view as read-only for v2.0

---

## Phase 4: Parent Component Integration

### 4.1 CalendarHeatmapWithViews
- [x] Add `onDayToggle` prop for toggle callback
- [x] Add `instantToggle` prop (default: true)
- [x] Update `handleDayPress` to branch on toggle mode
- [x] Pass props to all grid components

### 4.2 HabitDetailScreen
- [x] Import `toggleHabit` mutation from Convex
- [x] Create `handleCalendarDayToggle` callback
- [x] Wire callback to CalendarHeatmapWithViews
- [x] Handle mutation errors gracefully

---

## Phase 5: Type Exports & Documentation

### 5.1 Module Exports
- [x] Export `CellSize` type from index.ts
- [x] Export `CELL_SIZES` constant from index.ts
- [x] Export `DayCell` component from index.ts

### 5.2 Documentation
- [x] Create feature specification document
- [x] Document API contracts for all new props
- [x] Create implementation task checklist (this file)
- [x] Write code review document

---

## Phase 6: Testing & Validation

### 6.1 Unit Testing
- [ ] Test animation callbacks fire correctly
- [ ] Test state sync useEffect triggers
- [ ] Test accessibility labels generate correctly
- [ ] Test reduceMotion disables animations

### 6.2 Integration Testing
- [ ] Test toggle persists to Convex
- [ ] Test rapid toggle stress test
- [ ] Test offline behavior
- [ ] Test view switching mid-animation

### 6.3 Device Testing
- [ ] iOS Simulator
- [ ] iOS Physical Device (haptics)
- [ ] Android Emulator
- [ ] Android Physical Device (haptics)

---

## Phase 7: Future Enhancements (Not in v2.0)

### 7.1 Streak Visualization
- [ ] Design streak chain connecting lines
- [ ] Implement gradient intensity based on streak length
- [ ] Add streak break indicators

### 7.2 Theme System
- [ ] Define theme interface (GitHub, Tiles, Dots, Pixels)
- [ ] Implement theme switching
- [ ] Persist theme preference

### 7.3 Navigation Gestures
- [ ] Swipe left/right for month navigation
- [ ] Pinch to zoom between views
- [ ] Quick jump to today

### 7.4 Undo Feature
- [ ] Design undo toast UI
- [ ] Implement 3-second undo window
- [ ] Queue undo across multiple toggles

---

## Dependencies

### Required Packages (Already Installed)
- `react-native-reanimated` ^3.x
- `expo-haptics` ^13.x
- `lucide-react-native` (Check icon)
- `date-fns` (date utilities)

### Convex Mutations (Existing)
- `api.habits.toggleHabit` - Toggle completion for a date

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation jank on low-end devices | Medium | Medium | Test on budget Android, add perf flags |
| Backend sync race conditions | Low | High | useEffect sync handles reconciliation |
| Haptic battery drain | Low | Low | Medium impact is balanced |
| Breaking change for tooltip users | Medium | Low | `instantToggle={false}` fallback |

---

## Definition of Done

### v2.0 Release Criteria
- [x] All grid components support instant toggle
- [x] Animations smooth at 60fps
- [x] Haptic feedback works on physical devices
- [x] Today indicator is prominently visible
- [x] Backend sync handles all edge cases
- [x] Accessibility labels are accurate
- [x] reduceMotion is respected
- [ ] No TypeScript errors
- [ ] Passes all manual testing scenarios
- [x] Documentation complete
