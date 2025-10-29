# Story 1.2.1: Edge Cases & Error Handling Implementation

## Overview

Implement comprehensive edge case handling and error recovery for the habit check-off feature. This ensures data reliability, prevents race conditions, and provides graceful degradation under adverse conditions.

## Implementation Tasks

### Task 1: Implement Debounce and Race Condition Prevention

**Goal:** Prevent duplicate mutations from rapid successive taps

**Requirements:**

- Add `isToggling` state flag to HabitCard component
- Implement 300ms cooldown period after each tap
- Ignore taps within cooldown window
- Ensure haptic feedback only fires once per window
- Add subtle visual feedback for ignored taps (optional bounce animation)

**Files to Modify:**

- `src/components/HabitCard.tsx`

**Acceptance Criteria:**

- Tapping 10 times rapidly only processes 3-4 times (300ms spacing)
- No duplicate mutations sent to backend
- UI remains consistent (no flickering)
- Haptic feedback fires only for accepted taps

---

### Task 2: Add Error Handling with Try-Catch

**Goal:** Handle network failures and mutation errors gracefully

**Requirements:**

- Wrap `toggleCompletionMutation` call in try/catch block
- Add error state management to track failures
- Display toast notifications for user-facing errors
- Log errors to Sentry for monitoring
- Ensure UI state consistency on errors

**Files to Modify:**

- `src/components/HabitCard.tsx`
- Create new: `src/utils/toastMessages.ts` (error message constants)

**Acceptance Criteria:**

- Network timeout shows toast: "Connection issue - will retry when online"
- Deleted habit shows toast: "This habit was deleted on another device"
- Errors logged to Sentry with context
- UI state reverts on mutation failure

---

### Task 3: Implement Retry Queue with Exponential Backoff

**Goal:** Automatically retry failed mutations with progressive delays

**Requirements:**

- Create retry queue manager utility
- Implement exponential backoff: 1s, 2s, 4s delays
- Persist queue to AsyncStorage for crash recovery
- Show sync status indicator during retries
- Maximum 3 retry attempts before permanent failure

**Files to Create:**

- `src/utils/retryQueue.ts` (queue management)
- `src/hooks/useRetryQueue.ts` (React hook)

**Files to Modify:**

- `src/components/HabitCard.tsx` (integrate retry queue)

**Acceptance Criteria:**

- Failed mutations retry automatically
- Retry delays follow exponential pattern (1s, 2s, 4s)
- After 3 failures, show permanent error toast
- Queue persists across app restarts

---

### Task 4: Add Sync Status Indicator

**Goal:** Visual feedback for pending sync operations

**Requirements:**

- Create SyncStatusIndicator component
- Show spinning icon or status bar during sync
- Display count of pending operations ("Syncing 3 habits...")
- Auto-hide when sync complete
- Integrate with retry queue for status updates

**Files to Create:**

- `src/components/SyncStatusIndicator.tsx`

**Files to Modify:**

- `src/components/HabitCard.tsx` (add indicator to card)

**Acceptance Criteria:**

- Indicator appears during pending syncs
- Shows accurate count of pending operations
- Auto-hides within 500ms of completion
- Accessible (VoiceOver announces sync status)

---

### Task 5: Implement Multi-Device Conflict Resolution

**Goal:** Handle concurrent updates from multiple devices

**Requirements:**

- Implement last-write-wins logic using timestamps
- Compare `strengthUpdatedAt` in toggleCompletion mutation
- Detect concurrent updates via Convex reactivity
- Show toast when state changed from another device
- Handle "Habit not found" error for deleted habits

**Files to Modify:**

- `convex/tracking.ts` (add timestamp comparison logic)
- `src/components/HabitCard.tsx` (handle conflict notifications)

**Acceptance Criteria:**

- Later timestamp wins in concurrent update scenarios
- Deleted habit shows toast: "Habit was deleted"
- Card removed from UI when habit deleted elsewhere
- No data loss or corruption from conflicts

---

### Task 6: Handle Animation Interruptions

**Goal:** Allow tap during animation without visual artifacts

**Requirements:**

- Cancel in-progress animation on new tap
- Use Reanimated's `cancelAnimation()` function
- Ensure atomic state transitions (no partial updates)
- Respect debounce during animation cancellation
- Fire appropriate haptic for interrupted tap

**Files to Modify:**

- `src/components/HabitCard.tsx` (animation cancellation logic)

**Acceptance Criteria:**

- Tapping during animation cancels and toggles state
- No visual stutter or artifacts
- Debounce still applies (300ms cooldown respected)
- Haptic feedback fires for second tap

---

### Task 7: Offline-to-Online Sync Flow

**Goal:** Batch sync queued completions when network reconnects

**Requirements:**

- Detect online/offline events with NetInfo
- Queue mutations to AsyncStorage when offline
- Batch sync on reconnection (background, non-blocking)
- Show progress: "Syncing X habits..."
- Handle partial sync failures gracefully

**Files to Create:**

- `src/hooks/useNetworkStatus.ts` (network detection)
- `src/utils/offlineQueue.ts` (offline persistence)

**Files to Modify:**

- `src/components/HabitCard.tsx` (integrate offline queue)

**Acceptance Criteria:**

- Mutations queued automatically when offline
- Auto-sync within 5 seconds of reconnection
- Progress indicator shows during batch sync
- Toast on completion: "All habits synced"

---

### Task 8: Strength Calculation Failure Handling

**Goal:** Persist completion even if strength calculation fails

**Requirements:**

- Separate completion tracking from strength calculation
- Make strength calculation async and non-blocking
- Add fallback UI state for missing strength ("—")
- Show "Calculating..." indicator during retries
- Implement background retry for failed calculations

**Files to Modify:**

- `convex/tracking.ts` (decouple completion from calculation)
- `src/components/HabitStrengthIndicator.tsx` (fallback states)

**Acceptance Criteria:**

- Completion saved even if calculation fails
- Strength shows fallback state ("—") during failures
- Calculation retried in background (3 attempts)
- UI updates when calculation eventually succeeds

---

### Task 9: Date Boundary Validation

**Goal:** Prevent timezone-related date errors

**Requirements:**

- Calculate date on client in local timezone
- Send date as YYYY-MM-DD string to server
- Server validates format only (no range checks)
- Handle DST transitions gracefully
- Use timestamps for conflict resolution

**Files to Modify:**

- `convex/tracking.ts` (remove server-side date validation)
- Add client-side date utility: `src/utils/dateHelpers.ts`

**Acceptance Criteria:**

- User at 11:59 PM can complete habit for "today"
- No "future date" errors from timezone mismatches
- DST transitions don't corrupt dates
- Timestamps used for all conflict resolution

---

### Task 10: Corrupted Data Detection and Repair

**Goal:** Handle missing or invalid habit data gracefully

**Requirements:**

- Add validation schema for habit documents (Zod)
- Detect schema violations on query
- Show error state in UI (red border, warning icon)
- Provide repair mutation to restore defaults
- Option to delete corrupted habit if repair fails

**Files to Create:**

- `convex/schemas/habitSchema.ts` (Zod validation)
- `convex/mutations/repairHabit.ts` (repair logic)

**Files to Modify:**

- `src/components/HabitCard.tsx` (error state UI)

**Acceptance Criteria:**

- Invalid habits detected automatically
- Error state UI shown with restore option
- Tapping restore fills missing fields with defaults
- Option to delete if repair fails

---

### Task 11: Background App Kill Recovery

**Goal:** Persist mutations across app kills

**Requirements:**

- Persist mutation queue to AsyncStorage before kill
- Check for queued mutations on app launch
- Auto-sync queued mutations on relaunch
- Show sync progress indicator during startup sync
- Prevent data loss under memory pressure

**Files to Modify:**

- `src/utils/retryQueue.ts` (AsyncStorage persistence)
- `src/hooks/useAppState.ts` (app lifecycle listeners)
- `App.tsx` (launch sync logic)

**Acceptance Criteria:**

- Mutations persist across app kills
- On relaunch, queued mutations sync automatically
- Progress shown: "Syncing 5 habits..."
- No data loss reported by users

---

### Task 12: Comprehensive Testing Suite

**Goal:** Ensure all edge cases covered by tests

**Requirements:**

- Write unit tests for debounce logic
- Integration tests for conflict resolution
- Offline queue tests (offline → online flow)
- Error handling tests for all error states
- Manual testing checklist completion

**Files to Create:**

- `src/components/__tests__/HabitCard.edgeCases.test.tsx`
- `src/utils/__tests__/retryQueue.test.ts`
- `src/utils/__tests__/offlineQueue.test.ts`
- `docs/stories/epic-1-home-screen/habit-card/bugs/manual-testing-checklist.md`

**Acceptance Criteria:**

- 20+ unit tests covering all edge cases
- Integration tests for multi-device scenarios
- Manual checklist completed on physical device
- All tests passing in CI/CD pipeline

---

## Implementation Timeline

**Phase 1 (Tasks 1-2):** 2 hours - Basic error handling
**Phase 2 (Tasks 3-4):** 2 hours - Retry queue and sync status
**Phase 3 (Tasks 5-6):** 1.5 hours - Conflict resolution
**Phase 4 (Tasks 7-9):** 1.5 hours - Offline support and date handling
**Phase 5 (Tasks 10-11):** 1 hour - Corrupted data and app kills
**Phase 6 (Task 12):** 1 hour - Testing and validation

**Total Estimated Effort:** 9 hours

---

## Success Criteria

- Zero data loss incidents in production
- <0.1% completion tracking failures
- 99.9% sync success rate within 5 minutes
- No user reports of "lost progress"
- All automated tests passing
- Manual testing checklist complete
