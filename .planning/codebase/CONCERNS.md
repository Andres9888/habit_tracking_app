# Codebase Concerns

**Analysis Date:** 2026-03-19

## Code Size Violations

### Critical Large Files Requiring Decomposition

These files exceed 100 lines and violate the Code Readability Initiative. All require immediate decomposition:

**High Priority (900+ lines):**
- `src/components/ProgressSectionConsolidated/__tests__/ProgressSectionConsolidated.test.tsx` (1,361 lines)
- `src/components/BinaryHeatmap/__tests__/utils.test.ts` (1,089 lines)
- `src/hooks/__tests__/useAudioRecording.test.ts` (1,044 lines)
- `src/hooks/__tests__/useAudioPlayback.test.ts` (966 lines)
- `src/lib/offline/__tests__/performance.test.ts` (936 lines)
- `src/components/__tests__/FullsizeTemplatePreview.test.tsx` (890 lines)
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/HabitsEmptyStateMinimal.test.tsx` (889 lines)
- `src/hooks/__tests__/useOfflineQueue.test.ts` (868 lines)

**Data Files (Exempt but large):**
- `src/utils/emojiData/categories.ts` (1,437 lines) - Exempted in eslint.config.js (data file)

**Impact:** Large test files reduce reviewability and debugging clarity. While test files have exemptions in `eslint.config.js` lines 153-197, they should be refactored into focused test suites.

**Fix approach:** Split test files by concern (happy path, error cases, edge cases). Use `describe()` blocks to logically organize assertions.

---

## Type Safety Issues

### Untyped Parameters Using `any`

**Critical:**
- `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts:12` - `overviewStats: any`
  - Files: `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts`
  - Impact: Cannot validate analytics data structure at compile time; prone to runtime errors
  - Fix approach: Extract type from data source (Convex query), define `OverviewStatsType` interface

**Low Priority:**
- Other `any` uses are either in test files or properly scoped (e.g., `Promise<unknown>` cast checks in `src/utils/haptics/useHaptics.ts`)

---

## Exception Handling Gaps

### Silent Error Swallowing

**Pattern Issue - Catch blocks without logging:**
Multiple files catch errors then swallow them silently, preventing observability:

- `src/utils/haptics/useHaptics.ts:52` - `catch(() => {})` for haptic result
- `src/components/StreakMilestoneCelebration/useMilestoneCheck.ts:101` - `.catch(() => {})` for haptic notification
- `src/components/StreakMilestoneCelebration/useMilestoneCheck.ts:179` - `.catch(() => {})` for haptic feedback
- `src/hooks/useAudioPlayback/useAudioPlayback.ts` - Empty catch
- `src/hooks/useAudioRecording/useAudioRecording.ts` - Empty catch
- `src/lib/offline/sync/SyncOrchestrator/SyncOrchestrator.ts` - Empty catch

**Impact:** Non-critical operations (haptics, audio) failing silently is acceptable, but silent failures in sync/offline operations could mask real data synchronization bugs.

**Fix approach:**
- For non-critical operations (haptics, audio): Current pattern is acceptable with `// Silently fail - [operation] is non-critical` comment
- For data operations: All errors must log in `__DEV__` mode with context

---

## Incomplete Feature Implementations

### TODOs and Stubs

**Navigation Gaps:**
- `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts:60` - TODO: navigate to habit detail (stub handler)
- `src/components/HabitRankingsList/HabitRankingsList.tsx:23` - TODO: navigate to habit detail

**Impact:** Rankings and analytics screens can't drill down to habit details. User must navigate manually.

**Fix approach:** Route to `HabitDetailScreen` with `habitId` parameter. Define route in navigation stack.

**Animation Migration:**
- `src/features/habits/components/FloatingActionButton/useFABAnimations.ts:1` - TODO: Migrate from legacy Animated API to react-native-reanimated

**Impact:** FAB uses older animation API; inconsistent with rest of codebase that uses Reanimated v4.1.1

**Fix approach:** Replace `Animated.*` calls with Reanimated v4 equivalents (see `src/hooks/performance/useRenderCount.ts` and other animation files for patterns)

**Graph Visualization:**
- `src/components/HabitStrengthIndicator/GraphIndicator.tsx:14` - TODO: Implement graph variant with Victory Native or react-native-svg

**Impact:** Graph component not implemented; placeholder only. Affects analytics visualizations.

**Fix approach:** Use `victory-native@41.20.1` (already in dependencies) to render streak/strength graphs.

**Dark Mode Color Tokens:**
- `src/components/ErrorBoundary/errorFallbackStyles.ts:34,51` - TODO: add dark-mode error text/bg tokens

**Impact:** Error boundary uses hardcoded hex colors (`#FCA5A5`, `#B91C1C`) instead of theme tokens. May not match dark mode properly.

**Fix approach:** Add to theme tokens in `src/theme/index.ts` (603 lines), export as `errorLight` and `errorDark` tokens.

---

## Sync and Offline Data Concerns

### Orphan Operation Cleanup Edge Case

**File:** `src/lib/offline/sync/cleanupOrphans/cleanupOrphans.ts`

**Issue:** Orphaned operations (referencing deleted habits) are cleaned up, but there's no explicit user notification or recovery UI.

**Current behavior:** Operations are silently removed via `removeOrphans()` at line 78-79.

**Impact:** User deletes a habit on one device, completion events pending on another device are silently discarded. User may not realize data was lost.

**Fix approach:**
1. Emit event via `eventListener` when orphans detected (already done at line 77)
2. Add UI toast notification when sync detects cleaned orphans
3. Consider preserving count in analytics: "3 entries for deleted habit discarded"

---

### Reconciliation Race Conditions

**File:** `src/lib/offline/sync/reconcile/reconciler.ts:60-62`

**Issue:** Skip reconciliation if already in progress, but doesn't queue for later. Operations processed during reconciliation window could be lost if sync fails.

```typescript
if (this.state.isReconciling) {
  if (__DEV__) console.warn('Reconciliation already in progress, skipping');
  return createEmptyReconciliationResult();
}
```

**Impact:** Under rapid sync triggers + slow network, operations added during reconciliation don't get processed in same batch.

**Fix approach:** Add reconciliation queue - track pending operations and retry reconcile if new operations detected during active reconciliation.

---

### Queue Restoration Timing

**File:** `src/providers/OfflineProvider/Offline.provider.tsx:33-53`

**Issue:** Queue restoration happens on app mount, but there's a race condition between restoration completion and initial render.

**Current pattern:**
- `isRestoringRef` prevents concurrent calls (line 34)
- But `useAutoRestoreQueue` hook needs checking to verify dependency injection

**Impact:** If sync is triggered before queue is restored, pending operations may be duplicated or lost.

**Fix approach:** Ensure all sync operations wait for `isRestored === true` before executing. Add guard in `SyncOrchestrator.ts`.

---

## Type Safety Improvements Needed

### Missing Reminder Time Validation Types

**File:** `src/lib/offline/sync/createSyncExecutor.ts:10-57`

**Issue:** `normalizeReminderTime()` function is defined locally but same logic may exist in Convex mutations. No shared validation types.

**Impact:**
- Client-side normalization may drift from server validation
- Two sources of truth for reminder time format

**Fix approach:**
1. Extract to `src/lib/validation/reminderTime.ts` (if doesn't exist)
2. Export shared validator function
3. Document acceptable formats: `HH:MM` (24h) or `H:MM AM/PM` (12h)

---

## Security Considerations

### Environment Variable Access

**Pattern:** Convex URL checked at runtime without TypeScript guarantee.

**File:** `src/providers/ConvexClerk.provider.tsx:47,59`

**Current approach:**
```typescript
if (!EXPO_PUBLIC_CONVEX_URL) {
  return null;
}
console.warn('[ConvexClerkProvider] Missing EXPO_PUBLIC_CONVEX_URL');
```

**Impact:** If env var not set, app renders null provider. Could cause cascading null reference errors downstream.

**Fix approach:**
1. Use TypeScript const assertion for required env vars
2. Fail fast at startup (throw Error in module load time)
3. Document required env vars in README

---

### Sensitive Error Messages

**Files:** Error messages logged with `console.error()` in dev mode. Check that:
- `src/features/habits/hooks/useImagePickerHandlers.ts:58,75` - Image picker errors
- `src/hooks/useImagePicker/useImagePicker.ts:55` - Permission errors
- Others in `src/features/habits/hooks/`

**Current approach:** Only log in `__DEV__` mode. Good practice.

**Verify:** No PII (user IDs, emails, habit names) logged in error messages. Spot check for habit content in error logs.

---

## Performance Bottlenecks

### Memory Monitoring Indicators

**File:** `src/contexts/PerformanceContext/types.ts`

**Metric:** `memoryMetrics.leakIndicator` flag available. Check implementation in:
- `src/lib/performance/MemoryMonitor.ts`
- `src/hooks/performance/useMemoryMonitor.ts`

**Current concern:** No explicit threshold for triggering leak detection. Monitor with Sentry integration in production.

**Fix approach:** Document memory thresholds in `src/lib/performance/MemoryMonitor.ts` (if not present).

---

### Offline Sync Retry Exhaustion

**File:** `src/lib/offline/sync/retryStrategy.ts:31-38`

**Configuration:**
- 5 max retries
- 2x multiplier
- 2s base delay → 62s total retry window
- 30s max delay

**Impact:** After exhaustion, operations remain in queue permanently unless manually cleaned. No automatic retry-later scheduling.

**Fix approach:** Implement "dead letter" handling - move exhausted operations to separate queue for manual review/retry, emit analytics event.

---

## Fragile Areas Requiring Careful Modification

### HabitsEmptyStateMinimal Component

**Files:** `src/features/habits/components/HabitsEmptyStateMinimal/*`

**Why fragile:**
- 889 lines in test file suggests complex state machine
- Multiple animation sub-hooks: `useTapHintAnimation.ts`, `ParticleBurst.tsx`, `successAnimations.ts`
- Animation timing coupled to state transitions

**Safe modification:**
1. Never change `ANIMATION_TIMING` constants without updating all consumer hooks
2. Test all state transitions: empty → input → success → reset
3. Verify particle burst cleanup (likely animation memory leak risk)

**Test coverage:** Likely good (889 line test file), but check for animation timing edge cases.

---

### BinaryHeatmap Component

**Files:** `src/components/BinaryHeatmap/__tests__/*` (1,089 lines test utils)

**Why fragile:**
- Complex grid generation with partial weeks
- Multiple test utilities for grid validation
- Cell toggle logic tightly coupled to rendering

**Safe modification:**
1. Any change to `src/components/BinaryHeatmap/utils/grid-generation.ts` requires re-running visual tests
2. Verify partial week rendering (comment at line with "Add partial final week if it has any data")
3. Check cell toggle integration with offline sync

**Test coverage:** Very thorough (1,089 lines), but monitor for grid layout regressions on different screen sizes.

---

### Offline Queue and Sync Orchestrator

**Files:**
- `src/lib/offline/sync/SyncOrchestrator/*`
- `src/lib/offline/sync/cleanupOrphans/*`
- `src/providers/OfflineProvider/*`

**Why fragile:**
- State machine with multiple concurrent operations
- Race conditions between sync, reconciliation, cleanup
- Requires careful error handling (not all errors are retryable)

**Safe modification:**
1. Never add async operations without considering retry strategy
2. Always use operation timestamps for ordering
3. Test with slow network and frequent offline/online toggles
4. Verify no operation loss under app restart during active sync

**Test coverage:** Multiple integration tests exist (`syncOrchestrator.test.ts`, `processQueue.test.ts`), but manually test offline scenarios.

---

## Dependencies at Risk

### Convex Alpha Version

**Dependency:** `convex@1.21.1-alpha.1` (specified in package.json line 57 + overrides line 129)

**Risk:** Alpha version may have breaking changes. Not recommended for production.

**Current status:** Likely used for MCP server features or cutting-edge functionality.

**Fix approach:**
1. Document why alpha is required (check git history/issues)
2. Set up automated testing for alpha version updates
3. Plan migration path to stable release

---

### Legacy Animation API Dependency

**Issue:** FAB uses legacy Animated API while rest of codebase uses Reanimated 4.1.1

**Dependency:** `react-native-reanimated@~4.1.1` (line 83)

**Migration impact:** Need to replace Animated imports in `useFABAnimations.ts` with Reanimated equivalents.

---

## Test Coverage Gaps

### Analytics Export Functionality

**File:** `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts`

**Gap:** `handleExport()` tested? CSV/JSON export from `src/utils/exportData` should be integration tested with real data.

**Risk:** Export corruption could expose user data in wrong format.

**Recommendation:** Add tests for:
- CSV formatting (proper escaping)
- JSON structure validation
- Empty data export

---

### Error Boundary Recovery

**Files:**
- `src/components/ErrorBoundary/ErrorFallback.tsx` - MAX_RETRIES logic
- `src/lib/sentry/ErrorBoundary/ErrorFallback.tsx` - Also has MAX_RETRIES

**Issue:** Two ErrorBoundary implementations (different locations). Check if duplication is intentional.

**Risk:** Inconsistent error handling between feature code and Sentry integration.

**Recommendation:**
1. Audit both implementations
2. Consolidate if not intentional
3. Document when each is used

---

### Reminder Time Format Acceptance Testing

**Current status:** `normalizeReminderTime()` converts AM/PM and 24h formats, but no test explicitly verifies round-trip conversion.

**Formats accepted:**
- `HH:MM` (24-hour)
- `H:MM AM/PM` (12-hour)

**Gap:** Tests should verify:
- Midnight edge case (00:00 vs 12:00 AM)
- Noon edge case (12:00 vs 12:00 PM)
- Invalid times rejected (25:99, etc.)

---

## Missing Critical Features

### Habit Detail Screen Navigation

**Blocker:** `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts:60` and `src/components/HabitRankingsList/HabitRankingsList.tsx:23`

**Problem:** Stub handlers prevent drilling into habit details from analytics/rankings.

**Blocked user flows:**
- View detailed stats for specific habit
- Access habit settings from rankings view
- Compare habits side-by-side

**Priority:** High - reduces analytics screen utility.

---

## Code Quality Debt Summary

| Category | Severity | Count | Impact |
|----------|----------|-------|--------|
| Large files (>100 lines) | High | 8+ test files | Reduced reviewability |
| Type safety (untyped params) | Medium | 1 (`any` in analytics) | Runtime error risk |
| Silent error handling | Low | 6+ (non-critical ops) | Acceptable pattern |
| Incomplete TODOs | Medium | 4 | Feature gaps |
| Fragile state machines | Medium | 3 major | Modification risk |
| Test coverage gaps | Low | 3 areas | Unknown behavior |

---

*Concerns audit: 2026-03-19*
