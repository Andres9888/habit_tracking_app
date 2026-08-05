# Phase 2 — Silent Failure UX

Priority: HIGH. Trust-destroying failures the user never sees. No data-model changes.

## 2.1 Onboarding template imports fail silently (HIGH)

**File:** `src/screens/onboarding-v2/useTemplateAutoImport.ts:20-26`

**Problem:** Import failures are caught with a DEV-only `console.warn`. A user can finish onboarding with zero habits and no indication anything failed.

**Fix:**
1. Track per-import results (use `Promise.allSettled`, not `Promise.all` + swallow).
2. On any rejection, expose an error/retry state to the onboarding UI (surface a retry affordance or a non-blocking banner: "Some starter habits didn't import — Retry").
3. Keep onboarding navigable (don't hard-block), but the failure must be visible and retryable.

## 2.2 Create-habit errors swallowed (MEDIUM)

**File:** `src/components/CreateHabitModal/hooks/useCreateHabitModal.ts:66` (+ `useCreateHabitHandlers.ts` fail path)

**Problem:** `void createNewHabit(data).catch(() => {})`. On failure the optimistic habit appears then vanishes (`optimisticHabitCreationStore.fail(...)`) with no message — user has no idea why.

**Fix:** Route the failure into a user-visible toast/alert (reuse the existing `showGenericError`/toast utility used elsewhere). Remove the empty `.catch(() => {})`; handle the rejection where the optimistic rollback happens so the message and the visual rollback are consistent.

## 2.3 Celebration revert-timer cleanup missing in one branch (LOW) — RESOLVED AS NON-ISSUE 2026-06-12

> Re-verified during implementation: React always runs the previous effect's cleanup before re-running the effect, so the `isAllDone=true` run's `clearTimeout` fires on every toggle. No leak exists; no change made.

**File:** `src/features/habits/components/BottomActionBar/useCelebrationAnimations.ts:~58`

**Problem:** The 3500ms revert `setTimeout` cleanup is only returned inside the `if (isAllDone)` branch. Rapid all-done → not → all-done toggling can overlap/leak timers and glitch the animation.

**Fix:** Hoist the timer + `return () => clearTimeout(timer)` out of the conditional so cleanup always runs on re-render/unmount. Branch only the animation behavior inside, not the cleanup.

## Acceptance criteria

- [ ] Forced import failure (mock a rejecting mutation) shows a retry/error affordance; onboarding still navigable.
- [ ] Forced create-habit failure shows a user-facing error; no silent vanish.
- [ ] `useCelebrationAnimations` returns cleanup on every render path; no timer leak under rapid toggle (verify with a test or manual rapid-tap).
- [ ] `npm test` and `npm run lint` clean.
