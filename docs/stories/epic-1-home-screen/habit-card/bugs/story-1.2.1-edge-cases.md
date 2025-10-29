# Story 1.2.1: Check-Off Edge Cases & Error Handling

**Epic:** Epic 1 - MVP Foundation
**Parent Story:** Story 1.2 - Daily Habit Check-Off
**Priority:** High
**Status:** Pending
**Estimated Effort:** 6-8 hours

---

## User Story

**As a** user checking off habits in various edge case scenarios
**I want to** have the app handle errors, conflicts, and unusual situations gracefully
**So that** I never lose data or experience confusing behavior

---

## Prerequisites

- Story 1.2 complete (tap toggle with haptic feedback) ✅
- toggleCompletion mutation implemented ✅
- Convex backend configured ✅

---

## Edge Cases to Handle

### 1. Rapid Successive Taps (Race Conditions)

**Scenario:** User taps habit card multiple times rapidly (<300ms between taps)

**Expected Behavior:**

- First tap processes immediately
- Subsequent taps within 300ms are ignored (debounced)
- No duplicate mutations sent to backend
- Haptic feedback only fires once per 300ms window
- UI state remains consistent (no flickering)

**Implementation:**

- Add `isToggling` state flag to HabitCard
- Debounce tap handler with 300ms cooldown
- Queue ignored taps for user feedback (subtle bounce animation)

**Test Cases:**

```typescript
it('should debounce rapid taps within 300ms window', async () => {
  // Tap 5 times within 200ms
  // Verify only 1 mutation sent
  // Verify haptic fired only once
});

it('should allow tap after 300ms cooldown', async () => {
  // Tap → wait 350ms → tap again
  // Verify both mutations processed
});
```

---

### 2. Network Failures During Sync

**Scenario:** User taps to complete habit while offline or during network timeout

**Expected Behavior:**

- Optimistic UI updates immediately (checkmark appears)
- Mutation queued for retry with exponential backoff
- Subtle "syncing" indicator appears (spinning icon or status bar)
- On failure after 3 retries: Toast notification "Connection issue - will retry when online"
- On eventual success: Toast "Habit synced successfully" (optional)
- If mutation permanently fails: UI reverts to uncompleted state

**Implementation:**

- Wrap `toggleCompletionMutation` in try/catch
- Implement retry queue with exponential backoff (1s, 2s, 4s delays)
- Add sync status indicator to HabitCard
- Use Convex's built-in optimistic updates + error handling

**Test Cases:**

```typescript
it('should queue mutation when offline', async () => {
  // Simulate offline
  // Tap habit
  // Verify UI shows completed
  // Verify mutation queued
});

it('should retry with exponential backoff', async () => {
  // Mock network failure
  // Verify retry attempts at 1s, 2s, 4s intervals
});

it('should revert UI after permanent failure', async () => {
  // Mock 3 failed retries
  // Verify UI reverts to uncompleted
  // Verify toast shown
});
```

---

### 3. Concurrent Updates (Multi-Device Conflicts)

**Scenario:** User checks off same habit on two devices simultaneously, or habit deleted on another device

**Expected Behavior:**

- **Conflict resolution:** Last-write-wins based on `strengthUpdatedAt` timestamp
- **Deleted habit:** If habit deleted mid-tap, show toast "Habit was deleted" and remove from UI
- **Race condition:** If two devices toggle within 1 second, use timestamp to determine final state
- **Sync indicator:** Show subtle "syncing..." state during conflict resolution

**Implementation:**

- Compare timestamps in toggleCompletion mutation
- Handle "Habit not found" error gracefully
- Detect concurrent updates via Convex reactivity
- Show conflict resolution toast if state changed from another device

**Test Cases:**

```typescript
it('should resolve conflict with last-write-wins', async () => {
  // Simulate two devices toggling same habit
  // Device A: toggle at 10:00:00.000
  // Device B: toggle at 10:00:00.500
  // Verify Device B's state wins
});

it('should handle deleted habit gracefully', async () => {
  // Tap to complete
  // Simultaneously delete habit on another device
  // Verify toast: "Habit was deleted"
  // Verify card removed from UI
});
```

---

### 4. Gesture Conflicts with Swipe Navigation

**Scenario:** User accidentally triggers swipe navigation while tapping habit

**Expected Behavior:**

- Tap gesture takes priority over swipe when tap duration <150ms
- Swipe navigation disabled on HabitCard component area
- No interference with list scrolling (vertical swipes)
- Clear visual feedback: tap activates checkmark, swipe does nothing

**Implementation:**

- Use `simultaneousHandlers` prop in React Native Gesture Handler
- Configure tap gesture to have higher priority
- Prevent horizontal swipes from triggering navigation on HabitCard

**Test Cases:**

```typescript
it('should prioritize tap over swipe gesture', async () => {
  // Tap habit with slight horizontal movement
  // Verify toggle fires, navigation doesn't
});

it('should allow vertical scrolling during tap', async () => {
  // Scroll list while tapping habit
  // Verify both scroll and tap work independently
});
```

---

### 5. Mid-Animation Interruptions

**Scenario:** User taps habit again while checkmark animation is still playing

**Expected Behavior:**

- Animation cancels immediately on second tap
- State toggles to opposite (check → uncheck or vice versa)
- No animation stutter or visual artifacts
- Haptic feedback fires for second tap (with appropriate intensity)
- Debounce still applies (300ms cooldown)

**Implementation:**

- Cancel animation in progress when new tap detected
- Use Reanimated's `cancelAnimation()` function
- Ensure state transitions are atomic (no partial updates)

**Test Cases:**

```typescript
it('should cancel animation on rapid re-tap', async () => {
  // Tap → immediately tap again during animation
  // Verify animation cancels
  // Verify state toggles correctly
});

it('should respect debounce during animation', async () => {
  // Tap → tap 100ms later during animation
  // Verify second tap ignored (debounced)
});
```

---

### 6. Offline-to-Online Transitions

**Scenario:** User checks off habits while offline, then reconnects to network

**Expected Behavior:**

- All queued completions sync automatically when online
- Sync happens in background without blocking UI
- Progress indicator shows "Syncing X habits..." during batch sync
- Conflicts resolved server-side (last-write-wins)
- Toast notification on completion: "All habits synced"
- If any sync fails: "Some habits couldn't sync - tap to retry"

**Implementation:**

- Use Convex's offline queue (built-in)
- Detect online/offline events with `NetInfo`
- Batch sync queued mutations when online
- Show sync progress in app header or status bar

**Test Cases:**

```typescript
it('should sync queued completions when online', async () => {
  // Go offline → check off 3 habits → go online
  // Verify all 3 mutations sync
  // Verify toast shown
});

it('should handle partial sync failures', async () => {
  // Queue 3 completions offline
  // Mock 1 failure on sync
  // Verify 2 succeed, 1 queued for retry
  // Verify appropriate toast
});
```

---

### 7. Strength Calculation Failures

**Scenario:** Backend calculation fails or times out after habit completion

**Expected Behavior:**

- Habit remains completed (completion persisted)
- Strength calculation retried in background
- UI shows last known strength value (slightly grayed out)
- Subtle "Calculating..." indicator on strength badge
- After 3 failed retries: Show strength as "—" with info icon
- Tap info icon: Toast "Strength calculation temporarily unavailable"

**Implementation:**

- Separate completion tracking from strength calculation
- Make strength calculation async and non-blocking
- Add fallback UI states for missing strength data
- Implement background retry queue for failed calculations

**Test Cases:**

```typescript
it('should persist completion even if strength calculation fails', async () => {
  // Mock strength calculation error
  // Tap to complete
  // Verify completion saved
  // Verify strength shows fallback state
});

it('should retry strength calculation in background', async () => {
  // Mock initial calculation failure
  // Verify retry attempts
  // Verify UI updates when calculation succeeds
});
```

---

### 8. Date Boundary Issues (Midnight / Timezone Changes)

**Scenario:** User taps to complete habit at 11:59 PM, mutation processes at 12:01 AM

**Expected Behavior:**

- Completion counts for intended date (11:59 PM date)
- Client determines date before sending to server
- Server trusts client's date calculation
- No "future date" errors due to timezone mismatches
- Timezone changes (travel, DST) don't corrupt data

**Implementation:**

- Calculate date on client in user's local timezone
- Send date as string (YYYY-MM-DD) to server
- Server validates format only, not date range
- Use `strengthUpdatedAt` timestamp for conflict resolution

**Test Cases:**

```typescript
it('should use client date for completion tracking', async () => {
  // Set device time to 11:59 PM
  // Tap to complete
  // Mock server processing at 12:01 AM
  // Verify completion date is 11:59 PM date
});

it('should handle timezone changes gracefully', async () => {
  // Create completion in PST
  // Change device timezone to EST
  // Verify completion date unchanged
  // Verify new completions use EST dates
});
```

---

### 9. Missing or Corrupted Habit Data

**Scenario:** Habit document missing fields or corrupted in database

**Expected Behavior:**

- App detects invalid habit data on load
- Corrupted habits show error state in UI (red border, warning icon)
- Tapping corrupted habit shows: "This habit has invalid data - tap to restore defaults"
- Restore action fills missing fields with sensible defaults
- Option to delete corrupted habit if restore fails

**Implementation:**

- Add validation schema for habit documents (Zod)
- Detect schema violations on query
- Provide repair mutation to fix corrupted data
- Graceful fallback UI for invalid habits

**Test Cases:**

```typescript
it('should detect corrupted habit data', async () => {
  // Create habit with missing required field
  // Query habit
  // Verify error state detected
});

it('should restore corrupted habit to defaults', async () => {
  // Tap restore on corrupted habit
  // Verify missing fields filled
  // Verify habit functional again
});
```

---

### 10. Memory Pressure & Background Kills

**Scenario:** iOS kills app due to memory pressure during habit completion

**Expected Behavior:**

- Mutation queued locally before app killed
- On app relaunch: Queued mutations sync automatically
- No data loss for any completed habits
- Background sync indicator shows progress on relaunch
- User never sees "lost progress" state

**Implementation:**

- Persist mutation queue to AsyncStorage before network call
- On app launch: Check for queued mutations and sync
- Use Convex's built-in persistence for optimistic updates
- Implement app state listeners (foreground/background events)

**Test Cases:**

```typescript
it('should persist queued mutations across app kills', async () => {
  // Tap to complete habit
  // Kill app before mutation syncs
  // Relaunch app
  // Verify mutation syncs on launch
});

it('should show sync progress on relaunch', async () => {
  // Queue 5 mutations → kill app → relaunch
  // Verify "Syncing 5 habits..." shown
  // Verify all sync successfully
});
```

---

## Additional Error Handling

### User-Facing Errors (Toast Messages)

```typescript
// Network errors
'Connection issue - will retry when online';
"Couldn't sync habit - tap to retry";

// Data errors
'This habit was deleted on another device';
'Habit data corrupted - tap to restore';

// Success confirmations (optional, can be disabled in settings)
'All habits synced successfully';
'5 habits synced';
```

### Developer Errors (Console Logs + Sentry)

```typescript
// Log but don't show to user
'toggleCompletion failed: [error details]';
'Strength calculation timeout for habit [id]';
'Invalid date format in toggleCompletion: [date]';
'Race condition detected: concurrent toggles for habit [id]';
```

---

## Testing Strategy

### Unit Tests

- Debounce logic (300ms cooldown)
- Error handling for each edge case
- Toast message display logic
- State reversion on failure
- Retry queue management

### Integration Tests

- Multi-device conflict resolution
- Offline queue → online sync flow
- Background app kill → relaunch sync
- Strength calculation failure → retry

### Manual Testing Checklist

- [ ] Tap rapidly 10 times → only toggles twice (300ms debounce)
- [ ] Turn off WiFi → tap habit → verify queued
- [ ] Turn WiFi back on → verify auto-sync
- [ ] Check off habit on Device A → simultaneously delete habit on Device B → verify toast
- [ ] Tap at 11:59 PM → verify date is correct day
- [ ] Scroll list while tapping habit → verify no interference
- [ ] Tap during checkmark animation → verify cancels and toggles
- [ ] Kill app mid-completion → relaunch → verify syncs

---

## Implementation Plan

### Phase 1: Debounce & Basic Error Handling (2 hours)

- Add `isToggling` state flag
- Implement 300ms debounce
- Add try/catch around mutation
- Basic toast notifications

### Phase 2: Retry Queue & Offline Support (2 hours)

- Implement exponential backoff retry
- Add sync status indicator
- Test offline → online transitions
- Persist queue to AsyncStorage

### Phase 3: Conflict Resolution (1.5 hours)

- Implement last-write-wins logic
- Handle deleted habit errors
- Add concurrent update detection
- Test multi-device scenarios

### Phase 4: Edge Cases (1.5 hours)

- Animation interruption handling
- Date boundary validation
- Memory pressure recovery
- Corrupted data detection

### Phase 5: Testing & Polish (1 hour)

- Write comprehensive test suite
- Manual testing on physical device
- Performance profiling (ensure no jank)
- Documentation updates

---

## Definition of Done

### Implementation Complete

- [ ] Debounce implemented (300ms cooldown)
- [ ] Try/catch error handling around mutation
- [ ] Retry queue with exponential backoff
- [ ] Toast notifications for all error states
- [ ] Sync status indicator added
- [ ] Offline queue persistence (AsyncStorage)
- [ ] Multi-device conflict resolution (last-write-wins)
- [ ] Deleted habit error handling
- [ ] Animation interruption handling
- [ ] Date boundary validation on client
- [ ] Corrupted data detection & repair
- [ ] Background sync on app relaunch

### Testing Complete

- [ ] Unit tests for all edge cases (20+ tests)
- [ ] Integration tests for conflict resolution
- [ ] Manual testing checklist completed
- [ ] Tested on physical iOS device
- [ ] Tested in airplane mode (offline scenarios)
- [ ] Tested with poor network (timeout scenarios)
- [ ] Tested rapid taps (debounce validation)
- [ ] All automated tests passing

### Code Quality

- [ ] Error handling follows consistent pattern
- [ ] User-facing error messages are clear and actionable
- [ ] Sentry integration for error tracking
- [ ] No console.log statements in production
- [ ] TypeScript types for all error states
- [ ] Accessibility: Error states announced by VoiceOver

### Documentation

- [ ] Edge cases documented in code comments
- [ ] Toast message copy reviewed
- [ ] Error recovery flows documented
- [ ] Troubleshooting guide for support

---

## Success Metrics

**Reliability:**

- 0 data loss incidents in production
- <0.1% completion tracking failures
- 99.9% sync success rate within 5 minutes

**User Experience:**

- No user reports of "lost progress"
- <1% of users experience toast error messages
- Average error resolution time <30 seconds

**Performance:**

- Debounce prevents >95% of duplicate mutations
- Offline queue syncs in <5 seconds when online
- No UI jank during error states (maintain 60fps)

---

## Risk Assessment

**High Risk:**

- Multi-device conflicts causing data loss (Mitigation: Last-write-wins + timestamps)
- Offline queue corruption (Mitigation: AsyncStorage persistence + validation)

**Medium Risk:**

- Strength calculation failures blocking UI (Mitigation: Async calculation, fallback states)
- Network timeout causing poor UX (Mitigation: Optimistic updates, clear feedback)

**Low Risk:**

- Animation stutter during interruptions (Mitigation: Reanimated cancel functions)
- Toast message overload (Mitigation: Rate limit toasts, batch notifications)

---

**Created:** 2025-10-28
**Target Start:** After Story 1.2 merge
**Target Complete:** Week 2

---

## Related Stories

- **Story 1.2:** Daily Habit Check-Off (parent story)
- **Story 1.6:** Data Persistence (related: offline queue)
- **Story 1.3:** Strength Calculation (related: calculation failures)
- **Epic 5 Story 5.4:** Cross-Device Sync (related: conflict resolution)
