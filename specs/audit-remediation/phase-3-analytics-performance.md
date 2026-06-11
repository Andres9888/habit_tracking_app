# Phase 3 — Analytics Query Performance

Priority: MEDIUM-HIGH. Biggest efficiency win; scales with user history. Backend-heavy; coordinate with client analytics hook.

## 3.1 Combine 5 analytics queries into one dashboard query (HIGH)

**Files:** `src/screens/AnalyticsScreen/hooks/useAnalyticsQueries.ts:10-14` + `convex/analytics*.ts`

**Problem:** The analytics screen subscribes to 5 separate queries (`getOverviewStats`, `getStrengthDistribution`, `get30DayTrend`, `getComplianceData`, `getWeeklyInsights`). Each independently loads the user's habits + tracking server-side → ~5x the reactive compute and bandwidth on one screen.

**Fix:**
1. Add `convex/analytics.ts` `getAnalyticsDashboard` query that loads habits + (bounded) tracking ONCE, then computes all five sub-reports from the shared in-memory data (reuse the existing per-report helper functions — refactor them to take already-fetched data instead of re-querying).
2. Replace the 5 `useQuery` calls with one. Keep the return shape compatible so downstream components need minimal change.
3. Verify only one tracking subscription is active on the analytics screen afterward.

## 3.2 Bound tracking range in trend/compliance queries (MEDIUM)

**Files:** `convex/analyticsTrend.ts:32-38`, `convex/analyticsCompliance.ts:37-42`

**Problem:** Both `.collect()` the user's entire tracking history then filter to 30/90 days in JS. The `by_user_and_date` index supports a range bound that isn't used — a 2-year user loads ~10k docs for a 30-day chart.

**Fix:** Add the lower (and where applicable upper) date-key bound to the index range: `.withIndex('by_user_and_date', q => q.eq('userId', subject).gte('date', startKey))`. Compute `startKey` from the report window. Folds naturally into 3.1's single fetch (use the widest window any sub-report needs).

## 3.3 Project habit fields in overview (MEDIUM)

**File:** `convex/analyticsOverview.ts:45-58`

**Problem:** Returns full habit documents (woop/psychology/legacy fields) over a reactive subscription where the client uses ~7 fields (id, name, icon, strength, currentStreak, longestStreak, isAtRisk).

**Fix:** Map to a projected object with only the consumed fields before returning. ~60% payload reduction. (If 3.1 lands, do this inside the combined query.)

## Acceptance criteria

- [ ] Analytics screen issues one combined query; network/devtools shows a single tracking subscription.
- [ ] Trend/compliance queries use a date-range-bounded index scan (verify via Convex logs/`runOneoffQuery` doc counts on a seeded multi-year account).
- [ ] Overview returns only projected fields; client renders unchanged.
- [ ] Existing analytics values are numerically identical before/after (snapshot test on a seeded dataset).
- [ ] `npm test` and `npm run lint` clean.
