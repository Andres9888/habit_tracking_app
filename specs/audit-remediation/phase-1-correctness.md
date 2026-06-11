# Phase 1 — User-Visible Correctness Fixes

Priority: HIGHEST. Small diffs, user-visible wrong behavior today.

## 1.1 Strength distribution categories mislabeled (HIGH)

**File:** `convex/analyticsDistribution.ts:73-77` (+ client legend `src/components/.../StrengthDistributionChart.constants.ts`)

**Problem:** The if-chain assigns 80-100% strength to `automatic` and 60-80% to `strong`, but the file's own comments and emoji legend define the opposite (`strong` 💪 = 80-100%, `automatic` ⚡ = 60-80%). Users currently see habits bucketed under the wrong analytics category labels.

**Fix:**
1. Decide canonical semantics first (recommended: ascending = starting 0-20 🌱, building 20-40 🌿, developing 40-60 🌳, strong 60-80 💪, automatic 80-100 ⚡ — "automatic" should be the top tier; confirm against product copy in the analytics screen).
2. Make the if-chain, the comments, the returned object's emoji/label mapping, AND the client `LEVEL_COLORS`/`LEVEL_LABELS` constants all agree.
3. Add a unit test asserting each boundary value (0, 19, 20, 39, 40, 59, 60, 79, 80, 100) lands in the named category.

## 1.2 `isFutureDate()` ignores user timezone (HIGH)

**File:** `convex/habits/utils.ts:112-124`; call site `convex/habits/toggle.ts:~34`

**Problem:** Compares the submitted date against server (UTC) midnight + a 24h grace period. The toggle mutation receives the user's timezone but never passes it in. Users in timezones far behind UTC can have "today" rejected as a future date.

**Fix:**
1. Change signature to `isFutureDate(dateStr: string, timezone?: string)`.
2. When timezone is provided, compute "today" via the existing helpers (`msToDateKeyForTimezone` / `getTodayForTimezone` in the streakUtils/habitStrength date utils) and compare date-key strings lexicographically; keep current behavior + grace as fallback when timezone is absent.
3. Pass the timezone at every call site (grep for `isFutureDate(`).
4. Tests: user at UTC-10 toggling their local "today" while server is past UTC midnight → accepted; genuine tomorrow in user tz → rejected.

## 1.3 Weekly analytics mixes UTC-parsed strings with server-local Dates (MEDIUM, latent)

**Files:** `convex/analytics/weeklyHelpers.ts:18-30`, `convex/analyticsWeekly.ts:37-44`

**Problem:** `new Date(t.date)` parses the user-calendar-day string as a UTC instant and compares it to server-local Date objects. Correct only while Convex runs UTC; fragile and inconsistent with the rest of the codebase.

**Fix:** Compute week boundaries as YYYY-MM-DD date-key strings and compare lexicographically (the pattern `streakUtils/historyCalculation.ts` already uses). Remove the Date-object comparisons. Add a boundary test (entry exactly 7 days old lands in the correct week).

## Acceptance criteria

- [ ] Boundary unit tests for distribution buckets pass; client legend matches server categories.
- [ ] `isFutureDate` accepts timezone; UTC-10 "today" test passes; all call sites updated.
- [ ] weeklyHelpers uses string date-key comparisons only; no `new Date(t.date)` remains in weekly analytics.
- [ ] `npm test` and `npm run lint` clean.
