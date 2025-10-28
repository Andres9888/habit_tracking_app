# Story 1.2 Implementation Checklist

**Story:** Daily Habit Check-Off
**Status:** 🟡 IN REVIEW - Critical bugs identified during standup
**Created:** 2025-10-27
**Last Updated:** 2025-10-27

---

## 🎯 Overview

Story 1.2 was initially marked as "Ready for Review" but daily standup identified 3 critical issues that must be addressed before production merge. This checklist tracks the fixes required to complete the story properly.

---

## 🚨 Critical Fixes Required

### ✅ Phase 1: Fix Timezone Validation Bug (CRITICAL)
**Priority:** 🔴 P0 - Blocks Production
**Estimated Time:** 5 minutes
**Location:** `convex/tracking.ts:38-45`

#### Tasks:
- [ ] Remove server-side date range validation logic (lines 38-45)
- [ ] Add explanatory comment about client-side date handling
- [ ] Verify format validation (YYYY-MM-DD regex) still intact
- [ ] Test with dates across timezone boundaries
- [ ] Document timezone handling in code comments

#### Validation Steps:
```bash
# Test case 1: User in PST at 11:59pm can check off habit
date="2025-10-27"  # User's local date
# Should succeed (not reject as "future date")

# Test case 2: Format validation still works
date="invalid"  # Should fail with "Invalid date format"

# Test case 3: Habit exists validation still works
habitId="nonexistent"  # Should fail with "Habit not found"
```

#### Success Criteria:
- [ ] Users in all timezones can check off habits at 11:59pm local time
- [ ] Format validation still rejects invalid date strings
- [ ] Habit existence validation still works
- [ ] No new test failures introduced

**Files to Modify:**
- `convex/tracking.ts` (remove lines 38-45)

**Files to Test:**
- `convex/__tests__/tracking.test.ts` (verify existing tests still pass)

---

### ✅ Phase 2: Add Error Handling & Debounce (MEDIUM)
**Priority:** 🟡 P1 - Quality Improvement
**Estimated Time:** 15 minutes
**Location:** `src/components/HabitCard.tsx:158-180`

#### Tasks:
- [ ] Add `isToggling` state to prevent rapid-fire toggles
- [ ] Wrap mutation call in try/catch for error handling
- [ ] Add debounce mechanism (300ms cooldown)
- [ ] Add toast notification system for errors (or plan for future)
- [ ] Update tap handler to check `isToggling` state
- [ ] Document error handling behavior in code comments

#### Implementation Pattern:
```typescript
// Add state at component level
const [isToggling, setIsToggling] = useState(false);

// Update tap gesture handler
.onEnd(() => {
  if (!disabled && !isToggling) {
    setIsToggling(true);

    const hapticStyle = isCompleted === true
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Medium;

    runOnJS(Haptics.impactAsync)(hapticStyle);

    runOnJS(async () => {
      try {
        await toggleCompletionMutation({ habitId: id, date: today });
      } catch (error) {
        console.error('Toggle completion failed:', error);
        // TODO: Show toast notification when toast system is available
        // Toast.show({ message: "Connection issue, please try again" })
      } finally {
        setTimeout(() => setIsToggling(false), 300); // 300ms debounce
      }
    })();

    if (onPress) {
      runOnJS(onPress)();
    }
  }
});
```

#### Validation Steps:
```bash
# Test case 1: Network error handling
# Simulate network failure → verify UI doesn't break

# Test case 2: Rapid toggle debounce
# Tap habit 5 times rapidly → only first tap should execute

# Test case 3: Deleted habit handling
# Delete habit in another session → tap should fail gracefully
```

#### Success Criteria:
- [ ] Rapid toggles are debounced (300ms cooldown)
- [ ] Network errors don't crash the UI
- [ ] Console shows error messages for debugging
- [ ] UI reverts to correct state via Convex reactivity
- [ ] No double-mutations from rapid taps

**Files to Modify:**
- `src/components/HabitCard.tsx` (add state + error handling)

**Files to Test:**
- `src/components/__tests__/HabitCard.toggle.test.tsx` (add error handling tests)

---

### ✅ Phase 3: Add Error Handling Test Cases (MEDIUM)
**Priority:** 🟡 P1 - Test Coverage
**Estimated Time:** 10 minutes
**Location:** `src/components/__tests__/HabitCard.toggle.test.tsx`

#### Tasks:
- [ ] Test: Network error → mutation fails gracefully
- [ ] Test: Deleted habit → error logged, UI stable
- [ ] Test: Rapid toggles → debounced (only first executes)
- [ ] Test: isToggling state prevents concurrent mutations
- [ ] Test: Error resets isToggling flag after debounce period

#### Test Cases to Add:
```typescript
describe('HabitCard - Error Handling', () => {
  it('handles network errors gracefully', async () => {
    // Mock mutation to throw network error
    // Verify: no crash, error logged, UI stable
  });

  it('debounces rapid toggles (300ms cooldown)', async () => {
    // Tap 5 times rapidly
    // Verify: only 1 mutation called
    // Verify: subsequent taps ignored until cooldown
  });

  it('handles deleted habit gracefully', async () => {
    // Mock mutation to throw "Habit not found"
    // Verify: error logged, UI doesn't break
  });

  it('prevents concurrent mutations via isToggling flag', async () => {
    // Start first mutation
    // Attempt second mutation before first completes
    // Verify: second mutation blocked
  });

  it('resets isToggling flag after debounce period', async () => {
    // Tap once
    // Wait 300ms
    // Tap again
    // Verify: second tap executes
  });
});
```

#### Success Criteria:
- [ ] All new error handling tests pass
- [ ] Existing tests still pass (no regressions)
- [ ] Test coverage for error scenarios ≥80%

**Files to Modify:**
- `src/components/__tests__/HabitCard.toggle.test.tsx` (add 5 new tests)

**Files to Review:**
- `convex/__tests__/tracking.test.ts` (ensure mutation error handling tested)

---

## 📋 Post-Fix Checklist

### Code Quality Verification
- [ ] Run full test suite: `npm test` or `npm run test:coverage`
- [ ] Verify 100% of tests passing (or document known failures)
- [ ] Run linter: `npm run lint` (0 errors)
- [ ] Run type check: `npm run type-check` (0 errors)
- [ ] Remove any console.log statements added during debugging
- [ ] Verify no commented-out code left in files

### Documentation Updates
- [ ] Update story-1.2-daily-checkoff.md with fix completion dates
- [ ] Update Updated Definition of Done checkboxes
- [ ] Mark critical issues as "✅ RESOLVED" in story
- [ ] Update Implementation Summary with fix details
- [ ] Document timezone handling decision in technical notes

### Manual Testing Requirements
- [ ] Test on physical iOS device (haptic feedback)
- [ ] Test rapid toggles (debounce behavior)
- [ ] Test at 11:59pm local time (timezone fix)
- [ ] Test with airplane mode (network error handling)
- [ ] Test with multiple timezones (if possible)

### Pre-Merge Requirements
- [ ] Create PR: "fix(story-1.2): Fix timezone bug and add error handling"
- [ ] PR description includes:
  - Explanation of timezone bug and fix
  - Error handling improvements
  - Test results (before/after)
  - Manual testing checklist completion
- [ ] Self-review code changes (or assign reviewer)
- [ ] All CI checks passing
- [ ] No merge conflicts with main

---

## 📊 Progress Tracking

**Overall Progress:** 0/3 phases complete

### Phase Status:
- [ ] Phase 1: Fix Timezone Bug (0/5 tasks)
- [ ] Phase 2: Add Error Handling (0/6 tasks)
- [ ] Phase 3: Add Test Cases (0/5 tasks)

**Estimated Total Time:** ~30 minutes
**Started:** Not started
**Target Completion:** Same day as standup

---

## 🎯 Definition of Done (Updated)

### Implementation Complete
- [x] All 4 acceptance criteria met (from original story)
- [x] toggleCompletion mutation created (original work)
- [x] HabitCard tap handler modified (original work)
- [x] Conditional haptic patterns implemented (original work)
- [ ] **Timezone validation bug fixed (tracking.ts:38-45)** ← NEW
- [ ] **Error handling + debounce added (HabitCard.tsx:173)** ← NEW

### Testing Complete
- [x] Unit tests passing (40/40 tracking tests - original)
- [x] Integration tests created (21/28 passing - original)
- [ ] **Error handling tests added (5 new test cases)** ← NEW
- [ ] **All automated tests passing (100% pass rate)** ← UPDATED
- [ ] Manual haptic testing complete on physical iOS device
- [ ] All CI/CD pipeline checks passing

### Code Quality
- [ ] PR created with comprehensive description
- [ ] Code reviewed and approved
- [ ] No linting errors
- [ ] No TypeScript warnings
- [ ] No debug statements in production code
- [ ] Accessibility tested

### Deployment Gates
- [ ] All CI checks passing
- [ ] No merge conflicts
- [ ] Merged to main
- [ ] Deployed to dev
- [ ] Smoke tested

### Shippability
**Status:** ✅ INDEPENDENTLY SHIPPABLE (after fixes complete)
**Blockers:** 2 remaining (timezone bug, error handling)

---

## 📝 Notes

**Standup Date:** 2025-10-27
**Issues Identified By:** Winston (Architect), Murat (TEA), Sarah (PO)
**Assigned To:** Dev Agent (Amelia)
**Target Resolution:** Same day

**Key Insights:**
1. Timezone handling in distributed systems is complex - always use client-provided dates for user actions
2. Optimistic UI updates require robust error handling to maintain data consistency
3. Debouncing is critical for gesture-based interactions to prevent race conditions
4. Comprehensive DoD prevents technical debt from slipping into "done" stories

---

**Last Updated:** 2025-10-27
**Next Review:** After all phases complete
