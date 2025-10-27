# Story 1.2: Daily Habit Check-Off

**Epic:** Epic 1 - MVP Foundation
**Priority:** Critical (SIMPLIFIED SCOPE)
**Status:** 🟡 IN PROGRESS
**Estimated Effort:** 4-6 hours (focused on haptics only)

---

## User Story

**As a** user with active habits
**I want to** tap to toggle habit completion with satisfying haptic feedback
**So that** checking off habits feels rewarding and unchecking feels gentle

---

## Prerequisites

- Story 1.1 complete (habits exist) ✅
- Habit strength calculation function available ✅

---

## Acceptance Criteria (SIMPLIFIED SCOPE)

### Critical (This Story)
1. [ ] Tap on habit card toggles completion state (check/uncheck)
2. [ ] Haptic feedback fires with **Medium intensity** when checking ✓
3. [ ] Haptic feedback fires with **Light intensity** when unchecking ✗
4. [x] Completed habits show visual distinction (checkmark icon, muted color) - Already done

### Deferred to Future Stories
- Home screen displays today's habits in list format → Separate story
- Swipe right on habit card to mark complete → Simplified to tap-only
- Strength recalculation on completion → Separate story (after MVP)
- Offline support → Epic 5 (Post-MVP)

---

## Technical Notes

**Libraries Required:**
- `expo-haptics` - For haptic feedback (✅ already installed)

**Implementation:**
- Toggle mutation: Create/delete tracking record for date
- Haptic patterns: `Haptics.ImpactFeedbackStyle.Medium` (check) vs `.Light` (uncheck)
- Optimistic updates: Use Convex useMutation for instant UI feedback

**Key Files to Create/Modify:**
- `convex/tracking.ts` - NEW: toggleCompletion mutation
- `src/components/HabitCard.tsx` - MODIFY: Tap handler + conditional haptics (lines 142-146)

---

## Testing Strategy

**Unit Tests:**
- Tap toggles completion state (false → true)
- Tap toggles back to uncompleted (true → false)
- Medium haptic fires when checking
- Light haptic fires when unchecking

**Integration Tests:**
- toggleCompletion mutation creates tracking record when checking
- toggleCompletion mutation deletes tracking record when unchecking
- Optimistic UI updates immediately (doesn't wait for mutation)

**Manual Testing:**
- Test haptic feedback patterns on physical device (REQUIRED)
- Verify Medium feels stronger than Light
- Test rapid toggle scenarios (no race conditions)
- Test with different device haptic settings

---

## Implementation Plan (4-6 hours)

### Task 1: Create Tracking Mutation (1-2 hours)
**File:** `convex/tracking.ts`
- Create toggleCompletion mutation
- Logic: If tracking exists for date → delete, else → create
- Args: habitId (Id<'habits'>), date (string in YYYY-MM-DD format)
- Return: boolean (true if now completed, false if now uncompleted)

### Task 2: Modify HabitCard Tap Handler (1 hour)
**File:** `src/components/HabitCard.tsx` (lines 142-146)
- Import useMutation from Convex
- Call toggleCompletion mutation on tap
- Use optimistic updates for instant feedback

### Task 3: Add Conditional Haptic Patterns (30 minutes)
**File:** `src/components/HabitCard.tsx` (line 145)
**Before:**
```typescript
runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
```
**After:**
```typescript
runOnJS(Haptics.impactAsync)(
  completed
    ? Haptics.ImpactFeedbackStyle.Light    // Unchecking (softer)
    : Haptics.ImpactFeedbackStyle.Medium   // Checking (stronger)
);
```

### Task 4: Test on Physical Device (1-2 hours)
- Test check haptic (should feel strong/satisfying)
- Test uncheck haptic (should feel light/gentle)
- Test rapid toggles (no race conditions)
- Verify optimistic UI updates

### Task 5: Update Tests (1 hour)
- Add unit tests for haptic patterns
- Add integration tests for toggle mutation
- Update existing HabitCard tests

---

## Definition of Done

- [ ] All 3 acceptance criteria met (tap toggle + 2 haptic patterns)
- [ ] toggleCompletion mutation created and tested
- [ ] HabitCard tap handler modified
- [ ] Conditional haptic patterns implemented
- [ ] Unit tests passing
- [ ] Manual haptic testing complete on physical iOS device (REQUIRED)
- [ ] Code reviewed
- [ ] Merged to main branch

---

## Sprint Planning

**Timeframe:** Half-day sprint (4-6 hours)
**Complexity:** Low (simple mutation + conditional haptics)
**Total Effort:** 4-6 hours (massively simplified scope)
**Dependencies:** None (prerequisites met)
**Scope:** ONLY tap toggle + haptic feedback. NO swipe, NO home screen, NO strength calc

---

**Created:** 2025-10-26
**Target Start:** Week 1, Day 1
**Target Complete:** Week 1, Day 5

---

## Dev Agent Record

**Context Reference:** `story-1.2-context.json`
**Approved By:** User
**Approved Date:** 2025-10-27
