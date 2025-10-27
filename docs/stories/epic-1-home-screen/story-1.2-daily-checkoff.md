# Story 1.2: Daily Habit Check-Off

**Epic:** Epic 1 - MVP Foundation
**Priority:** Critical
**Status:** 🔴 TODO
**Estimated Effort:** 30-35 hours

---

## User Story

**As a** user with active habits
**I want to** quickly check off completed habits with gestures
**So that** my daily tracking ritual takes <30 seconds

---

## Prerequisites

- Story 1.1 complete (habits exist) ✅
- Habit strength calculation function available ✅

---

## Acceptance Criteria

1. [ ] Home screen displays today's habits in list format
2. [ ] Swipe right on habit card to mark complete (animated checkmark)
3. [ ] Tap on habit card toggles completion state
4. [ ] Completed habits show visual distinction (checkmark icon, muted color)
5. [ ] Completion triggers immediate strength recalculation in background
6. [ ] Undo action available for 5 seconds after check-off (toast notification)
7. [ ] Works offline with local-first architecture
8. [ ] Haptic feedback on completion (iOS native vibration)

---

## Technical Notes

**Libraries Required:**
- `react-native-gesture-handler` - For swipe gestures
- `react-native-reanimated` - For 60fps animations
- `expo-haptics` - For haptic feedback (already installed)

**Implementation:**
- Gesture handlers: React Native Gesture Handler library
- Mutation: `updateHabitStrength` from convex/habitStrength.ts
- Animation: Reanimated for 60fps performance
- Optimistic updates: Update UI immediately, sync to backend async
- Background calculation: Use async queue to avoid UI blocking

**Key Files to Create/Modify:**
- `src/components/HabitCard/HabitCard.tsx` - Add swipe gesture
- `src/components/HabitCard/SwipeableHabitCard.tsx` - Swipeable wrapper
- `src/hooks/useHabitCompletion.ts` - Completion logic hook
- `convex/habits.ts` - Add markComplete mutation

---

## Testing Strategy

**Unit Tests:**
- Swipe gesture detection (threshold 50% card width)
- Completion state toggle
- Undo functionality within 5-second window

**Integration Tests:**
- Complete habit → strength recalculated
- Offline completion → syncs when online
- Rapid toggles handled gracefully

**Performance Tests:**
- Swipe animation maintains 60fps
- Strength calculation completes <200ms

**Manual Testing:**
- Test on iPhone SE (small screen) and iPad
- Test with VoiceOver
- Test offline → online sync
- Test haptic feedback strength

---

## Implementation Plan (Week 1)

### Day 1: Gesture Infrastructure
- Install react-native-gesture-handler if needed
- Create HabitCard component with swipeable wrapper
- Implement swipe-right detection
- Add animated checkmark reveal

### Day 2: Completion State Management
- Create `markHabitComplete` mutation
- Implement optimistic UI update
- Add completion tracking (completions array)
- Handle toggle (uncomplete if already marked)

### Day 3: Strength Recalculation
- Trigger `generateHabitStrengthSnapshot` on completion
- Update habit strength values
- Ensure non-blocking background execution
- Add loading indicator if >100ms

### Day 4: Undo & Haptics
- Implement 5-second undo toast
- Add undo action to revert completion
- Integrate haptic feedback
- Polish haptic patterns

### Day 5: Offline Support & Polish
- Test offline completion tracking
- Verify Convex sync queue
- Add offline indicator
- Polish animations

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] Performance tests passing (60fps, <200ms calc)
- [ ] Manual testing complete on iOS and Android
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Merged to main branch

---

## Sprint Planning

**Week:** Week 1 of Epic 1 Sprint
**Days:** Days 1-5 (Monday-Friday)
**Total Effort:** 30-35 hours
**Dependencies:** None (prerequisites met)

---

**Created:** 2025-10-26
**Target Start:** Week 1, Day 1
**Target Complete:** Week 1, Day 5
