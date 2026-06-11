# Phase 4 — Scale Robustness

Priority: MEDIUM. Edge/scale failures that bite specific users (long history, bad webhooks, undo). Backend.

## 4.1 Webhook returns 500 on malformed JSON → infinite RevenueCat retries (MEDIUM)

**File:** `convex/webhooks/revenuecat.ts:62,138-147`

**Problem:** `JSON.parse(body)` failures fall through to the generic `catch` returning HTTP 500. RevenueCat retries 5xx forever, so a permanently-malformed payload retries indefinitely and floods logs.

**Fix:** Wrap `JSON.parse` (and shape validation of `payload.event`) in its own try/catch and return `400` ("Invalid JSON" / "Invalid event shape") for client-error cases. Keep 500 only for genuine internal/transient failures that *should* be retried. Log `error.stack` + `event.type` separately for debuggability.

## 4.2 Batch tracking delete risks Convex transaction document limit (MEDIUM-HIGH)

**File:** `convex/habits/batchRemove.ts:21-27`

**Problem:** Deletes every tracking record of every removed habit one-by-one inside a single mutation. A user with thousands of tracking rows can breach Convex's ~16k docs/transaction limit → the whole bulk delete hard-fails.

**Fix:** Chunk the deletion. Either (a) schedule an internal mutation per habit (or per N records) via `ctx.scheduler.runAfter(0, internal.habits.deleteTrackingChunk, ...)` that deletes a bounded batch and re-schedules until drained, or (b) cap per-transaction deletes and continue in a follow-up scheduled run. Mark the habit removed immediately; let tracking cleanup drain asynchronously.

## 4.3 Restoring a deleted paused habit loses pause state (MEDIUM)

**Files:** `convex/habits/remove.ts` (`RemovedHabitPayload` type + `restore()` insert)

**Problem:** `RemovedHabitPayload` omits `paused`, `pausedAt`, `resumedAt`, `strengthAtPause` (and `accessibilityAtPause`). Undo-delete of a paused habit silently restores it as unpaused with recomputed strength.

**Fix:** Add the pause-related fields to `RemovedHabitPayload`, capture them when building the payload in `remove()`, and include them in the `restore()` insert. Add a test: pause → delete → restore preserves paused state and `pausedAt`.

## Acceptance criteria

- [ ] Malformed JSON webhook body returns 400 (test with a non-JSON body); valid body still 200; transient internal failure still 500.
- [ ] Bulk-removing a habit with >16k tracking rows completes without transaction-limit error (seed + test or documented chunk size with reasoning).
- [ ] Pause→delete→restore round-trip preserves all pause fields (unit test).
- [ ] `npm test` and `npm run lint` clean.
