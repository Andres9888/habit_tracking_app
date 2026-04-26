# Plan — Library page: post-import "Add another" toast + daily rotation of "Today's pick"

## Context
Two small UX upgrades for the Habit Library page, sequenced in the order Andres approved from the `library_improvements_1.html` mock:

**Phase 1 — Post-import "Add another" toast.**
After importing a habit, the user already sees `TemplateAddedToast` (cued by `useImportFeedback.showSuccess`). Today the toast renders just the habit icon + name with no action button (its action prop `onViewHabits` is never wired by any caller). We want a primary pill labeled **"Add another"** that dismisses the toast and keeps the user on the library, nudging multi-habit imports per visit. This is a retention play — the toast already exists, we're activating its dormant action slot.

**Phase 2 — "Today's pick" rotates daily, not hourly.**
The featured goal currently rotates every 4–7 hours via `getFeaturedGoalId()` (5–12=energy, 12–17=productive, 17–22=stress, else=sleep). The badge says "Today's pick" but it changes mid-day, so the copy over-promises. Change the rotation to a once-per-day deterministic seed so the badge is honest.

Both phases ship independently; Phase 1 is the higher-impact retention change.

---

## Phase 1 — "Add another" pill on TemplateAddedToast

### Verifiable criteria
- ✅ After import, toast still appears with habit name + icon (existing behavior)
- ✅ Toast now shows an "Add another" pill on the right side
- ✅ Tapping "Add another" dismisses the toast and leaves the user on the library page
- ✅ The toast still auto-dismisses after `DEFAULT_DURATION` if untouched
- ✅ First-import flow (`CelebrationOverlay`) is unchanged — it already has its own `onAddAnother`
- ❌ Anti-criterion: do NOT delete or repurpose existing `onViewHabits` prop (out of scope)
- ❌ Anti-criterion: no changes to `useImportFeedback`, `useTemplateImportHandlers`, or any state machinery — purely UI wiring

### Files touched
1. **`src/components/TemplateAddedToast/types.ts`** — add `onAddAnother?: () => void` to `TemplateAddedToastProps`.
2. **`src/components/TemplateAddedToast/TemplateAddedToast.tsx`** — accept `onAddAnother`; render a second pill with label "Add another" when provided. Pill styling reuses `styles.actionPill` (already exists in `styles.ts`). Tap calls `handleDismiss()` then `onAddAnother()`. If both `onViewHabits` and `onAddAnother` are provided, render both (Add another first, primary positioning).
3. **`src/screens/TemplatesScreen/views/FeedbackOverlays.tsx`** — pass `onAddAnother={p.onDismissToast}` to `<TemplateAddedToast>` so tapping the pill simply dismisses (which clears the toast state and lets the user keep browsing).

### Implementation notes
- The pill action is just `onDismiss` — the user is already on the browse page, so "Add another" is essentially "got it, let me keep browsing." No navigation needed.
- Pill copy: **"Add another"** (no arrow). Existing `styles.actionPill` is light-on-dark, fits the toast surface.
- If we later want a primary visual treatment, that's a styling refinement — out of scope for this pass.

### Verification (Phase 1)
1. Run the app, navigate to Habit Library.
2. Tap any habit card → preview → import.
3. Confirm: toast slides up with `[icon] {habit name} added!  [Add another]`.
4. Tap "Add another" → toast dismisses, user stays on browse page.
5. Import a second habit without dismissing → confirm toast reappears with new name (state replacement, not stacking).
6. Wait without tapping → confirm toast still auto-dismisses after `DEFAULT_DURATION`.
7. First-time user (0 habits): import → confirm `CelebrationOverlay` shows instead (existing behavior, untouched).

---

## Phase 2 — Daily rotation for "Today's pick"

### Verifiable criteria
- ✅ `getFeaturedGoalId(now?: Date)` returns the same goal id for the entire day, then changes at midnight
- ✅ Function is deterministic (same date → same goal id, every call)
- ✅ Rotation cycles through all five goal ids in `GOAL_COLLECTIONS` over a 5-day cycle
- ✅ Existing call site in `TemplatesScreen.tsx:45` works unchanged
- ❌ Anti-criterion: do NOT change the function signature or its export shape
- ❌ Anti-criterion: do NOT modify `goalCollections` data — only the rotation function

### Files touched
1. **`src/screens/TemplatesScreen/data/goalCollections.ts`** — replace the hour-based body of `getFeaturedGoalId` with a day-index seed:
   ```ts
   export function getFeaturedGoalId(now: Date = new Date()): string {
     const ids = GOAL_COLLECTIONS.map((g) => g.id);
     const dayIndex = Math.floor(now.getTime() / 86_400_000);
     return ids[dayIndex % ids.length] ?? ids[0];
   }
   ```
   - Uses UTC day index; users in different time zones may flip a few hours off local midnight — acceptable for a discovery rotation.
   - `?? ids[0]` is defensive; `ids` is non-empty by construction so it's a no-op safeguard for TS narrowing.

### Verification (Phase 2)
1. **Unit-feel test:** in a scratch console, call `getFeaturedGoalId(new Date('2026-04-25'))` and `getFeaturedGoalId(new Date('2026-04-26'))` — confirm different ids.
2. **Same-day stability:** call `getFeaturedGoalId(new Date('2026-04-25T08:00'))` and `...T20:00` — confirm same id (this was the bug — these returned different ids before).
3. **Cycle:** loop 7 dates and confirm 5 distinct ids (5-goal cycle, days 6–7 repeat days 1–2).
4. **Visual:** open the app — featured goal card matches the id returned for today.
5. **Time travel:** simulate "tomorrow" by editing the call site temporarily to `getFeaturedGoalId(new Date(Date.now() + 86_400_000))` and confirm the featured tile flips to a different goal.

---

## Sequencing & ship plan
- Implement Phase 1, verify it visually, **commit independently** (small atomic diff: 3 files, ~10 lines).
- Implement Phase 2, verify, commit independently.
- Both can land in one branch / PR — they're independent and small.

## Files explicitly preserved
- `useImportFeedback.ts` — unchanged
- `useTemplateImportHandlers.ts` — unchanged
- `CelebrationOverlay` — unchanged (has its own `onAddAnother` already)
- All other goal/library code — unchanged
